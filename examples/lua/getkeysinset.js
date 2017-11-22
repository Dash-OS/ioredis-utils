/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../../src/extras/scripts';
import { log } from '../../utils/log';

const redis = new Redis();

addDefaultScriptsToRedis(redis);

function startExample() {
  const START = log('\n-- START EXAMPLE --\n');
  return redis.getkeysinset('example:set').then(result => {
    const END = log('Result Ready!', result);
    for (const [key, value] of result) {
      console.log('Result: ', key, value);
    }
    log('Time for Execution: ', END - START);
  });
}

Promise.resolve().then(() => {
  redis.monitor((err, monitor) => {
    // log('Redis Monitor Started');
    // eslint-disable-next-line
    monitor.on('monitor', (time: number, args: Array<mixed>) => {
      // see each command execution by uncommenting this
      // log('[MONITOR] | ', time, args);
    });
    redis
      .multi()
      .del(
        'example:set',
        'example:set:one',
        'example:set:two',
        'example:set:three',
      )
      .hmset('example:set:one', { example: 'one' })
      .hmset('example:set:two', { example: 'two' })
      .hmset('example:set:three', { example: 'three' })
      .sadd(
        'example:set',
        'example:set:one',
        'example:set:two',
        'example:set:three',
      )
      .exec()
      .then(() => {
        log('Redis Example Prepared - Executing Example:');
        return startExample();
      })
      .then(() => {
        log('Example Complete');
      });
  });
});

/*
  +47.4010   1130412644.118626    Redis Example Prepared - Executing Example:
  +0.5110    1130412644.629585
  -- START EXAMPLE --

  +1.1131    1130412645.74265     Result Ready!
  Result:  example:set:one   { example: 'one' }
  Result:  example:set:three { example: 'three' }
  Result:  example:set:two   { example: 'two' }
  +1.2093    1130412646.951928    Time for Execution:  1.1130650043487549
  +0.1048    1130412647.056682    Example Complete

*/
