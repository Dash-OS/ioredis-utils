// /* @flow */
//

interface FS$Stats {
  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;

  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;
}

export interface RegExp$Interface {
  static (pattern: string | RegExp, flags?: RegExp$flags): RegExp;
  compile(): RegExp;
  constructor(pattern: string | RegExp, flags?: RegExp$flags): RegExp;
  exec(string: string): null | Array<string>;
  flags: string;
  global: boolean;
  ignoreCase: boolean;
  lastIndex: number;
  multiline: boolean;
  source: string;
  sticky: boolean;
  unicode: boolean;
  test(string: string): boolean;
  toString(): string;
}

export type FS$ReadDirPromised = ((path: string) => Promise<Array<string>>) &
  ((
    path: string,
    options: string | { encoding: string },
  ) => Promise<Array<string>>);

export type File$Descriptor = {|
  file: string,
  name: string,
  path: string,
  ext: string,
  stats: FS$Stats,
|};

export type File$Data = {|
  +descriptor: File$Descriptor,
  +data: string | Buffer,
  params?: Map<string, Array<string> | string>,
|};

// reduced size descriptor for pre-compiled scripts
export type File$SimpleData = {|
  +descriptor: {
    name: string,
    ext: string,
    file: string,
  },
  +data: string | Buffer,
  params?: Map<string, Array<string> | string>,
|};

export type FS$LStatPromised = (path: string) => Promise<FS$Stats>;

export type File$FilterDescriptors = (descriptor: File$Descriptor) => boolean;

export type FS$ExistsPromised = (path: string) => Promise<boolean>;

export type FS$ReadFileOptions = { encoding: string, flag?: string };

export type FS$ReadFilePromised = ((
  path: string | Buffer | URL | number,
) => Promise<Buffer | string>) &
  ((
    path: string | Buffer | URL | number,
    options: void | FS$ReadFileOptions,
  ) => Promise<Buffer | string>);
