/* @flow */

// add performance.now() so it is covered.

declare type NodeHighResTimeStamp = number;

declare module 'perf_hooks' {
  declare class Performance {
    now(): NodeHighResTimeStamp;
  }

  declare var performance: Performance;
}
