import type { RequestHandler } from '@sveltejs/kit';
import { fileTypeFromFile } from 'file-type';
import { MEDIA_FOLDER } from 'utils/files';
import { resolve } from 'path';

export const get: RequestHandler = async ({ params }) => {
  const { file } = params;
  const fileType = await fileTypeFromFile(
    resolve(MEDIA_FOLDER, file),
  );

  return {
    body: {
      mime: fileType?.mime || '',
      name: file.split('/').pop(),
      src: `/file/${file}`,
    },
  };
};
