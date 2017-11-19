'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _taskHandler = require('task-handler');

var _taskHandler2 = _interopRequireDefault(_taskHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: Largely Untested at this time

let BUFFERS = 0;

function getRedisBufferConfig(config) {
  if (!config.redis) {
    throw new TypeError('[RedisBuffer] | [CONFIG ERROR] | config expects redis key with a redis instance to transmit to');
  }
  return _extends({
    // default values for anything not provided
    timeout: undefined
  }, config);
}

/*
  There are times we want to make operations that are not time sensitive.
  In these cases, if multiple commands will be called often it can make sense
  to buffer those commands and dispatch them to redis in bulk after a given timeout.

  This will create a buffer which takes in commands and flushes itself either
  when called or when the time is up.
*/
class RedisBuffer {

  constructor(config) {
    this.task = (0, _taskHandler2.default)(`redis:buffer:${BUFFERS}`);
    this.config = getRedisBufferConfig(config);
    BUFFERS += 1;
  }

  get length() {
    return this.pipeline.length;
  }

  get size() {
    return this.pipeline.length;
  }

  async flush() {
    if (this.pipeline.length) {
      const prom = this.pipeline.exec().catch(err => console.error('[RedisBuffer] | [FLUSH EXEC ERROR] | ', err));
      // we clear the pipeline then
      // we refresh the every when flush is called - this way if it happens manually
      // the next check will occur after the next every interval rather than sometime
      // in the nearer-future.
      this.clear();
      return prom;
    }
    return false;
  }

  add(cmd, ...args) {
    if (this.pipeline == null) {
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
  }

  batch(...args) {
    args.forEach(cmd => this.add(...cmd));
    return this;
  }

  clear() {
    this.task.cancel('flush');
    this.pipeline = this.config.redis.pipeline();
    return this;
  }

  schedule(_timeout) {
    let timeout;
    if (typeof _timeout === 'number') {
      timeout = _timeout;
    } else if (typeof this.config.timeout === 'number') {
      // eslint-disable-next-line
      timeout = this.config.timeout;
    } else {
      throw new Error('[RedisBuffer] | [SCHEDULE ERROR] | No Timeout Specified for Buffer Flush');
    }
    this.task.after('flush', timeout, this.flush).while(() => this.length > 0);
    return this;
  }
}

exports.default = RedisBuffer;