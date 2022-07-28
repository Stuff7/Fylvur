import path from 'path';
import FFMPEG from 'fluent-ffmpeg';
import fs from 'fs';
import { PassThrough, Readable } from 'stream';
import { readdir, stat } from 'fs/promises';
import { fileTypeFromFile } from 'file-type';
import { clamp } from 'utils/math';

export const MEDIA_FOLDER = import.meta.env.FYLVUR_MEDIA_FOLDER;
export const CACHE_FOLDER = path.resolve(MEDIA_FOLDER, '.fylvur-cache');
export const FILE_CACHE_PATH = path.resolve(createNestedFolder(CACHE_FOLDER), 'file-details.json');

const FILE_CACHE = readJSON(FILE_CACHE_PATH, {} as Record<string, FileDetails>);

export function readJSON<T>(file: string, fallback?: T) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch(err) {
    if (fallback) {
      writeJSON(file, fallback);
      return fallback;
    }
    throw err;
  }
}

export function writeJSON<T>(file: string, obj: T) {
  fs.writeFileSync(file, JSON.stringify(obj), 'utf8');
}

export function createNestedFolder(folder: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  return folder;
}

export async function getFiles(dir: string) {
  const files = await readdir(dir, { withFileTypes: true });
  const fileList = await Promise.all(files.map(async (file) => {
    const absFile = path.resolve(dir, file.name);

    return {
      href: path.relative(MEDIA_FOLDER, absFile).replace(/\\/g, '/'),
      isFolder: file.isDirectory(),
      name: file.name,
    } as FileInfo;
  }));
  return fileList.sort((a, b) => (b.isFolder ? 1 : 0) - (a.isFolder ? 1 : 0));
}

export async function getFileDetails(dir: string) {
  const cachedFile = FILE_CACHE[dir];
  if (cachedFile) {
    return cachedFile;
  }
  const absFile = path.resolve(dir);
  const file = await stat(absFile);
  const info = {} as FileDetails;

  if (file.isDirectory()) {
    return info;
  }

  const fileType = await fileTypeFromFile(absFile);
  info.mime = fileType?.mime;
  info.type = fileType?.mime.split('/')[0];
  if (info.type === 'video') {
    const { duration = 0 } = (await getVideoMetadata(absFile)).format;
    info.video = { duration };
  }

  FILE_CACHE[dir] = info;
  writeJSON(FILE_CACHE_PATH, FILE_CACHE);
  return info;
}

export async function* getNestedFiles(dir: string): AsyncGenerator<string, void> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getNestedFiles(res);
    } else {
      yield res;
    }
  }
}

export async function getVideoMetadata(videoPath: string) {
  return new Promise<FFMPEG.FfprobeData>((resolve, reject) => {
    FFMPEG.ffprobe(videoPath, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

async function videoThumbnailPreset(videoPath: string, {
  isGif = false,
  progress = '50%',
  width = 100,
}) {
  const videoMeta = await getVideoMetadata(videoPath);
  const duration = (videoMeta.format.duration || 0);
  const thumbnailTime = progress.endsWith('%') ?
    duration * clamp(parseFloat(progress), 99) / 100 :
    clamp(parseFloat(progress), duration);

  return (command: FFMPEG.FfmpegCommand) => {
    let newCommand = command
      .seekInput(thumbnailTime) // Start video at this time
      .outputOptions('-frames:v 1') // Take this many screenshots
      .outputOptions('-f image2pipe') // Stream data instead of saving to disk
      .outputOptions('-vcodec webp') // Output type
      .videoFilters(`scale=${width}:-1`); // Resize image, calculate height from width
    if (isGif) {
      newCommand = newCommand
        .outputOptions('-frames:v 11')
        .videoFilters('fps=5'); // Fps to play the gif at
    }
    return newCommand;
  };
}

export async function videoToMP4(file: Readable) {
  return new Promise<Buffer>((resolve, reject) => {
    const video = FFMPEG(file);
    const output = new PassThrough();
    const buff: Uint8Array[] = [];

    output.on('data', chunk => {
      buff.push(chunk);
    });

    video.on('end', () => {
      const buffer = Buffer.concat(buff);
      resolve(buffer);
    });

    video.on('error', (err) => {
      console.error(`Error transforming video to MP4 "${file}"\nDetails:\n`, err);
      reject(err);
    });

    video
      .outputOptions('-q:v 0')
      .outputOptions('-f image2pipe')
      .output(output, { end: true })
      .run();
  });
}

export async function screenshotVideo(
  videoPath: string,
  relativeVideoPath: string,
  progress = '50%',
  width = 100,
  isGif = false,
) {
  return new Promise<Buffer | string>(resolve => {
    const buff: Uint8Array[] = [];
    const video = FFMPEG(videoPath);

    let output: PassThrough | string; // Stream if gif, save to disk if image
    let resolver: () => void;
    if (isGif) {
      output = new PassThrough();
      output.on('data', chunk => {
        buff.push(chunk);
      });
      resolver = () => {
        const buffer = Buffer.concat(buff);
        resolve(buffer);
      };
    } else {
      const thumbnailFolder = path.resolve(CACHE_FOLDER, relativeVideoPath, '..');
      output = path.resolve(CACHE_FOLDER, `${relativeVideoPath}.webp`);
      createNestedFolder(thumbnailFolder);
      resolver = () => {
        resolve(output as string);
      };
    }

    video.output(output, { end: true });

    video.on('end', resolver);
    video.on('error', (err) => {
      console.error(`Error getting thumbnail for "${videoPath}"\nDetails:\n`, err);
    });

    videoThumbnailPreset(videoPath, {
      isGif,
      progress,
      width,
    }).then(preset => video.preset(preset).run());
  });
}
