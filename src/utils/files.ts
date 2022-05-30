import { readdir, stat } from 'fs/promises';
import { fileTypeFromFile } from 'file-type';
import { relative, resolve } from 'path';
import { PassThrough } from 'stream';
import FFMPEG from 'fluent-ffmpeg';
import { clamp } from 'utils/math';

export const MEDIA_FOLDER = import.meta.env.FYLVUR_MEDIA_FOLDER;

export async function getFiles(dir: string) {
  const files = await readdir(dir, { withFileTypes: true });
  const fileList = await Promise.all(files.map(async (file) => {
    const absFile = resolve(dir, file.name);

    return {
      href: relative(MEDIA_FOLDER, absFile).replace(/\\/g, '/'),
      isFolder: file.isDirectory(),
      name: file.name,
    } as FileInfo;
  }));
  return fileList.sort((a, b) => (b.isFolder ? 1 : 0) - (a.isFolder ? 1 : 0));
}

export async function getFileDetails(dir: string) {
  const absFile = resolve(dir);
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

  return info;
}

export async function* getNestedFiles(dir: string): AsyncGenerator<string, void> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
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

export async function screenshotVideo(
  videoPath: string,
  progress = '50%',
  width = 100,
  isGif = false,
) {
  return new Promise<Buffer>(resolve => {
    const buff: Uint8Array[] = [];
    const pass = new PassThrough();
    const video = FFMPEG(videoPath).output(pass, { end: true });

    pass.on('data', chunk => {
      buff.push(chunk);
    });

    video.on('end', () => {
      const buffer = Buffer.concat(buff);
      resolve(buffer);
    });
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
