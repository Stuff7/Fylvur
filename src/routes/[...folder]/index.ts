import { getFiles, MEDIA_FOLDER } from 'utils/files';
import { resolve } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params: { folder } }) => {
  const files = await getFiles(resolve(MEDIA_FOLDER, folder));

  return {
    body: {
      files,
      folder,
    },
  };
};
