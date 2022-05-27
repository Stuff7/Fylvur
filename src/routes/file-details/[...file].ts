import { getFileDetails, MEDIA_FOLDER } from 'utils/files';
import { resolve } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params: { file } }) => {
  try {
    return {
      body: {
        details: await getFileDetails(resolve(MEDIA_FOLDER, file)),
      },
    };
  } catch (error) {
    return { status: 404 };
  }
};
