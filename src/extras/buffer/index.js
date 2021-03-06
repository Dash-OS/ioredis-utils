/* @flow */
import type RedisStatic from 'ioredis';
import type { Redis$Pipeline, Redis$Commands } from 'ioredis';
import type { TaskHandler } from 'task-handler';
import createTaskHandler from 'task-handler';

// NOTE: Largely Untested at this time

export type RedisBuffer$Config = {
  // the redis instance to use for transmitting
  // to the redis cache.
  redis: RedisStatic,
  timeout?: void | number,
};

let BUFFERS = 0;

function getRedisBufferConfig(config: RedisBuffer$Config): RedisBuffer$Config {
  if (!config.redis) {
    throw new TypeError(
      '[RedisBuffer] | [CONFIG ERROR] | config expects redis key with a redis instance to transmit to',
    );
  }
  return {
    // default values for anything not provided
    timeout: undefined,
    ...config,
  };
}

type BufferPromise = {
  resolve: *,
  reject: *,
};

/*
  There are times we want to make operations that are not time sensitive.
  In these cases, if multiple commands will be called often it can make sense
  to buffer those commands and dispatch them to redis in bulk after a given timeout.

  This will create a buffer which takes in commands and flushes itself either
  when called or when the time is up.
*/
class RedisBuffer {
  config: RedisBuffer$Config;
  task: TaskHandler;
  pipeline: Redis$Pipeline<*, *, *, *, *, *, *, *, *>;
  _promise: ?Array<BufferPromise>;

  constructor(config: RedisBuffer$Config) {
    this.task = createTaskHandler(`redis:buffer:${BUFFERS}`);
    this.config = getRedisBufferConfig(config);
    BUFFERS += 1;
  }

  get length(): number {
    return this.pipeline.length;
  }

  get size(): number {
    return this.pipeline.length;
  }

  flush = async () => {
    if (this.pipeline.length) {
      const prom = this.pipeline
        .exec()
        .then(result => {
          if (this._promise) {
            this._promise.forEach(promise => {
              promise.resolve(result);
            });
            this._promise = undefined;
          }
          return result;
        })
        .catch((err: Error) => {
          if (this._promise) {
            this._promise.forEach(promise => {
              promise.reject(err);
            });
            this._promise = undefined;
          } else {
            console.error('[RedisBuffer] | [FLUSH EXEC ERROR] | ', err);
          }
          return err;
        });
      // we clear the pipeline then
      // we refresh the every when flush is called - this way if it happens manually
      // the next check will occur after the next every interval rather than sometime
      // in the nearer-future.
      this.clear();
      return prom;
    }
    return false;
  };

  add = <C: Redis$Commands>(cmd: C, ...args: Array<*>) => {
    if (!this.pipeline) {
      this.pipeline = this.config.redis.pipeline();
    }
    if (this.config.timeout && this.pipeline.length === 0) {
      // We need to schedule the buffer flush
      this.task.defer('schedule:flush', () => this.schedule());
    }
    if (cmd !== 'exec' && typeof this.pipeline[cmd] === 'function') {
      // $FlowIgnore
      this.pipeline = this.pipeline[cmd](...args);
    }
    return this;
  };

  batch = (...args: Array<Iterable<*>>) => {
    args.forEach(cmd => this.add(...cmd));
    return this;
  };

  clear = () => {
    this.task.cancel('flush');
    this.pipeline = this.config.redis.pipeline();
    return this;
  };

  schedule = (_timeout?: number) => {
    let timeout: number;
    if (typeof _timeout === 'number') {
      timeout = _timeout;
    } else if (typeof this.config.timeout === 'number') {
      // eslint-disable-next-line
      timeout = this.config.timeout;
    } else {
      throw new Error(
        '[RedisBuffer] | [SCHEDULE ERROR] | No Timeout Specified for Buffer Flush',
      );
    }
    this.task.after('flush', timeout, this.flush).while(() => this.length > 0);
    return this;
  };

  promise = (): Promise<*> =>
    new Promise((resolve, reject) => {
      if (!this._promise) {
        this._promise = [];
      }
      this._promise.push({
        resolve,
        reject,
      });
    });
}

export default RedisBuffer;
