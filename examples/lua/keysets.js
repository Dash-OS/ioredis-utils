/* @flow */
import Redis from 'ioredis';
import addDefaultScriptsToRedis from '../../src/extras/scripts';
import { log } from '../../utils/log';

const redis = new Redis();
addDefaultScriptsToRedis(redis);

/*
  KeySets are a property type we use which reference other keys in the database.
  These are grouped and can be important for referencing data types that are linked
  to a given value.

  Set<key1, key2, key3>

  Where the keys may be a group of hashes or similar relating to a property.

  These can then be retrieved as a group, deleted, or iterated.

*/

function setKeySet() {
  // Sets a value on the keyset and on its given destination
  const START = log('\n-- START EXAMPLE (SetKeySet) --\n');
  const KeySetMap = new Map([
    ['example:set:one', { example: 'one' }],
    ['example:set:two', { example: 'two' }],
    ['example:set:three', { example: 'three' }],
  ]);
  return redis.msetkeyset('example:set', KeySetMap).then(result => {
    const END = log('Result Ready!', result);
    log('Time for Execution: ', END - START);
  });
}

function getKeySet() {
  // Removes the KeySet (and all keys included within it)
  const START = log('\n-- START EXAMPLE (GetKeySet) --\n');
  return redis.getkeyset('example:set').then(result => {
    const END = log('Result Ready!', result);
    log('Time for Execution: ', END - START);
  });
}

function removeKeySet() {
  // Removes the KeySet (and all keys included within it)
  const START = log('\n-- START EXAMPLE --\n');
  return redis.delkeyset('example:set').then(result => {
    const END = log('Result Ready!', result);
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
    setKeySet()
      .then(() => {
        log('Getting KeySet');
        return getKeySet();
      })
      .then(() => {
        log('Removing KeySet');
        return removeKeySet();
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
