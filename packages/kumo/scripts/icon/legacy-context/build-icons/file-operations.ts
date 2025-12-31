import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as https from 'https';
import * as path from 'path';
import { ImagesType } from './schema.js';

export async function downloadSVG(url: string, filePath: string) {
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
      } else {
        file.close();
        fs.unlink(filePath, () => {});
        reject(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`,
        );
      }
    });

    file.on('finish', () => resolve(filePath));

    file.on('error', (err) => {
      file.close();
      fs.unlink(filePath, () => {});
      reject(err.message);
    });
  });
}

export async function downloadAndWriteSVGs(
  svgs: ImagesType,
  directory: string,
) {
  await fsPromises.mkdir(directory, { recursive: true });

  const downloadPromises = Object.entries(svgs).map(async ([id, url]) => {
    const filePath = path.join(directory, `${id}.svg`);
    return downloadSVG(url, filePath);
  });

  return Promise.all(downloadPromises);
}

export async function writeJsonFile(
  data: Record<string, unknown> | string,
  filePath: string,
) {
  await ensureDirectoryExists(path.dirname(filePath));

  let dataString;

  if (typeof data === 'object' && data !== null) {
    dataString = JSON.stringify(data, null, 2);
  } else if (typeof data === 'string') {
    dataString = data;
  } else {
    throw new Error('Invalid data provided to writeFile function.');
  }

  await fsPromises.writeFile(filePath, dataString, 'utf8');
}

interface ErrnoException extends Error {
  code?: string;
  errno?: number;
  path?: string;
  syscall?: string;
}

function isErrorWithCode(error: unknown): error is ErrnoException {
  return error instanceof Error && 'code' in error;
}

export async function ensureDirectoryExists(dir: string) {
  try {
    const stats = await fsPromises.stat(dir);
    if (stats.isDirectory()) {
      console.log(
        `The directory "${dir}" already exists. Any existing files may be overwritten.`,
      );
      return;
    }
  } catch (error) {
    if (isErrorWithCode(error) && error.code === 'ENOENT') {
      console.log(`Creating directory "${dir}".`);
      await fsPromises.mkdir(dir, { recursive: true });
    } else {
      throw error;
    }
  }
}
