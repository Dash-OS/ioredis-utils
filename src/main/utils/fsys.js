/* @flow */
import fs from 'fs';
import path from 'path';
import util from 'util';

import type {
  FS$ReadDirPromised,
  File$Descriptor,
  File$FilterDescriptors,
  FS$LStatPromised,
  FS$ExistsPromised,
  FS$ReadFilePromised,
  FS$ReadFileOptions,
  File$Data,
} from '../types';

const readDirPromised: FS$ReadDirPromised = util.promisify(fs.readdir);
const lstatPromised: FS$LStatPromised = util.promisify(fs.lstat);
const fsExistsPromised: FS$ExistsPromised = util.promisify(fs.exists);
const fsReadFilePromised: FS$ReadFilePromised = util.promisify(fs.readFile);

async function getDirectoryFiles(
  dir: string,
  filter?: File$FilterDescriptors,
): Promise<Array<File$Descriptor>> {
  if (!await fsExistsPromised(dir)) {
    throw new Error(`Directory Does Not Exist: ${dir}`);
  }

  const files = await readDirPromised(dir);

  const descriptors: Array<File$Descriptor> = [];

  const promises = [];

  for (const file of files) {
    const fext = path.extname(file);
    const fname = path.basename(file, fext);
    const fpath = path.join(dir, file);
    if (fname !== 'index') {
      promises.push(
        lstatPromised(fpath).then(stats => {
          if (!stats.isDirectory()) {
            descriptors.push({
              file,
              name: fname,
              ext: fext,
              path: fpath,
              stats,
            });
          }
        }),
      );
    }
  }

  await Promise.all(promises);

  if (filter) {
    return descriptors.filter(filter);
  }
  return descriptors;
}

async function getRecursiveDirectoryFiles(
  dir: string,
  filter?: File$FilterDescriptors,
  _buffer?: Array<File$Descriptor>,
): Promise<Array<File$Descriptor>> {
  if (!await fsExistsPromised(dir)) {
    throw new Error(`Directory Does Not Exist: ${dir}`);
  }

  const buffer: Array<File$Descriptor> = _buffer || [];
  const files = await readDirPromised(dir);
  const promises = [];

  for (const file of files) {
    const fext = path.extname(file);
    const fname = path.basename(file, fext);
    const fpath = path.join(dir, file);
    if (fname !== 'index') {
      promises.push(
        lstatPromised(fpath).then(stats => {
          if (stats.isDirectory()) {
            return getRecursiveDirectoryFiles(fpath, filter, buffer);
          }
          buffer.push({
            file,
            name: fname,
            ext: fext,
            path: fpath,
            stats,
          });
        }),
      );
    }
  }

  await Promise.all(promises);

  if (filter) {
    return buffer.filter(filter);
  }
  return buffer;
}

function readFileDescriptors(
  descriptors: Array<File$Descriptor>,
  options?: FS$ReadFileOptions,
): Promise<Array<File$Data>> {
  return Promise.all(
    descriptors.map(descriptor =>
      fsReadFilePromised(descriptor.path, options).then(
        data =>
          ({
            descriptor,
            data,
          }: File$Data),
      )),
  );
}

export {
  getDirectoryFiles,
  getRecursiveDirectoryFiles,
  lstatPromised,
  readDirPromised,
  readFileDescriptors,
};
