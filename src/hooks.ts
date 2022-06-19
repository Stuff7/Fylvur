import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { fileTypeFromFile, type FileTypeResult } from 'file-type';
import { CACHE_FOLDER, MEDIA_FOLDER, screenshotVideo } from 'utils/files';
import { createReadStream, existsSync, statSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/file/')) {
    const { request } = event;
    const file = event.url.pathname.replace('/file/', '');
    const filePath = decodeURIComponent(path.resolve(MEDIA_FOLDER, file));
    const media = await getMedia(request, filePath, file, getSearchParams(event));
    const res = new Response(media.body, {
      headers: media.headers,
      status: media.status,
    });
    return res;
  }

  const response = await resolve(event);
  return response;
};

function getSearchParams(event: RequestEvent) {
  if (event.url.search) {
    return event.url.searchParams;
  }
  const referer = event.request.headers.get('referer');
  return referer ?
    new URL(referer).searchParams :
    event.url.searchParams;
}

async function scaleImage(file: string, w: number, mime: string) {
  const image = await sharp(file);
  const scaledImage = await (
    w ? image.resize(w) : image
  ).rotate().toBuffer().catch(() => (
    createReadStream(file) as unknown as ReadableStream
  ));

  return {
    body: scaledImage,
    headers: { 'Content-Type': mime },
    status: 200,
  };
}

async function getMedia(req: Request, file: string, relFile: string, searchParams: URLSearchParams) {
  const range = req.headers.get('range');
  const fileType = await fileTypeFromFile(
    file,
  ) || {} as FileTypeResult;
  const headers = {
    'Content-Type': fileType.mime,
  };
  const thumbnailImg = searchParams.has('tn-img') || '';
  const imgWidth = Number(searchParams.get('img-width'));

  if (thumbnailImg) {
    const cacheFile = path.resolve(CACHE_FOLDER, `${relFile}.webp`);
    const cacheExists = existsSync(cacheFile);
    if (cacheExists) {
      return await scaleImage(cacheFile, imgWidth, 'image/webp');
    }
  }

  const thumbnailProgress = searchParams.get('tn-progress') || '';
  const thumbnailGif = searchParams.has('tn-gif');
  if (thumbnailProgress || thumbnailGif) {
    const width = imgWidth || 500;
    const thumbnail = await screenshotVideo(
      file,
      relFile,
      thumbnailProgress,
      width,
      thumbnailGif,
    );

    return typeof thumbnail === 'string' ?
      await scaleImage(thumbnail, imgWidth, 'image/webp') : {
      body: thumbnail,
      headers: {
        'Content-Type': 'image/webp',
      },
      status: 200,
    };
  }

  // Video
  if (range) {
    const videoStat = statSync(file);
    const videoSize = videoStat.size;
    const parts = range.trim().replace(/bytes=/, '').split('-');
    const partialstart = parts[0];
    const partialend = parts[1];
    const start = parseInt(partialstart, 10);
    const end = Math.min(
      videoSize - 1,
      partialend ? parseInt(partialend, 10) : videoSize - 1,
    );
    const chunksize = (end - start) + 1;
    const videoStream = createReadStream(file, { start, end });
    return {
      body: videoStream as unknown as ReadableStream,
      headers: {
        ...headers,
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
      },
      status: 206,
    };
  }

  // Image
  if (fileType.mime.includes('image')) {
    return await scaleImage(file, imgWidth, fileType.mime);
  }

  const readable = createReadStream(file) as unknown as ReadableStream;
  return {
    body: readable,
    headers,
    status: 200,
  };
}
