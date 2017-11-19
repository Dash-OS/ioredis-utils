// /* @flow */
//
// declare module 'util' {
//   // declare function debuglog(section: string): (data: any, ...args: any) => void;
//   // declare function format(format: string, ...placeholders: any): string;
//   // declare function log(string: string): void;
//   // declare function inspect(object: any, options?: util$InspectOptions): string;
//   // declare function isArray(object: any): boolean;
//   // declare function isRegExp(object: any): boolean;
//   // declare function isDate(object: any): boolean;
//   // declare function isError(object: any): boolean;
//   // declare function inherits(
//   //   constructor: Function,
//   //   superConstructor: Function,
//   // ): void;
//   // // declare function deprecate(f: Function, string: string): Function;
//   // // declare function promisify(f: Function): Function;
//   //
//   // declare function promisify<+A, +B, +R>(
//   //   fn: (a: A, b: B, cb: (err: *, result: R) => void) => void,
//   // ): (a: A, b: B) => Promise<R>;
//   //
//   // declare function promisify<+A, +R>(
//   //   fn: (a: A, cb: (err: *, result: R) => void) => void,
//   // ): (a: A) => Promise<R>;
//   declare class Util {
//     debuglog(section: string): (data: any, ...args: any) => void;
//     format(format: string, ...placeholders: any): string;
//     log(string: string): void;
//     inspect(object: any, options?: util$InspectOptions): string;
//
//     promisify<+A, +R>(
//       fn: (a: A, cb: (err: *, result: R) => void) => void,
//     ): (a: A) => Promise<R>;
//
//     promisify<+A, +B, +R>(
//       fn: (a: A, b: B, cb: (err: *, result: R) => void) => void,
//     ): (a: A, b: B) => Promise<R>;
//   }
//
//   declare var exports: Util;
// }
