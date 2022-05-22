import { getFiles, MEDIA_FOLDER } from 'utils/files';
import { resolve } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params: { folder } }) => {
  try {
    return {
      body: {
        files: await getFiles(resolve(MEDIA_FOLDER, folder)),
        folder,
      },
    };
  } catch (error) {
    return { status: 404 };
  }
};
