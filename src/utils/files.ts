import { readdir } from 'fs/promises';
import { fileTypeFromFile } from 'file-type';
import { relative, resolve } from 'path';

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
