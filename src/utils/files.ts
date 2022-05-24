import { readdir } from 'fs/promises';
import { fileTypeFromFile } from 'file-type';
import { relative, resolve } from 'path';
import { PassThrough } from 'stream';
import FFMPEG from 'fluent-ffmpeg';
import { clamp } from 'utils/math';

export const MEDIA_FOLDER = import.meta.env.FYLVUR_MEDIA_FOLDER;

export async function getFiles(dir: string) {
  const files = await readdir(dir, { withFileTypes: true });
  return await Promise.all(files.map(async (file) => {
    const absFile = resolve(dir, file.name);

    const fileInfo: FileInfo = {
      href: relative(MEDIA_FOLDER, absFile).replace(/\\/g, '/'),
      isFolder: file.isDirectory(),
      name: file.name,
    };

    if (!file.isDirectory()) {
      const fileType = await fileTypeFromFile(absFile);
      fileInfo.mime = fileType?.mime;
      fileInfo.type = fileType?.mime.split('/')[0];
      if (fileInfo.type === 'video') {
        const { duration = 0 } = (await getVideoMetadata(absFile)).format;
        fileInfo.video = { duration };
      }
    }

    return fileInfo;
  }));
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
  progress = 0.5,
  width = 100,
}) {
  const videoMeta = await getVideoMetadata(videoPath);
  const thumbnailTime = (videoMeta.format.duration || 0) * progress;

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
  progress = 50,
  width = 100,
  isGif = false,
) {
  return new Promise<Buffer>(resolve => {
    const buff: Uint8Array[] = [];
    const pass = new PassThrough();
    const video = FFMPEG(videoPath).output(pass, { end: true });

    videoThumbnailPreset(videoPath, {
      isGif,
      progress: clamp(progress, 99) / 100,
      width,
    }).then(preset => video.preset(preset).run());

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
  });
}
