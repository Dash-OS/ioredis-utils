/* @flow */
/*
  getNativeAsyncCost() is used on any example which utilizes node.js's
  timers.  This is done to "fire up" the node.js timers which have a
  delay on their first execution.

  This gives us a more realistic look at the performance when utilizing
  the performance.now() testing that our log() command provides.
*/
import { log } from '../utils/log';

import {
  getDirectoryFiles,
  getRecursiveDirectoryFiles,
} from '../src/utils/fsys';

log('Directory: ', __dirname);

getDirectoryFiles(__dirname).then(descriptors => {
  log('\n\n------- | Get Directory Files | -------\n');
  descriptors.forEach(log);
});

getDirectoryFiles(__dirname, d => d.name !== 'get-directory').then(
  descriptors => {
    log('\n\n------- | Get Filtered Directory Files | -------\n');
    descriptors.forEach(log);
  },
);

getRecursiveDirectoryFiles(__dirname).then(descriptors => {
  log('\n\n------- | Get Recursive Directory Files | -------\n');
  descriptors.forEach(log);
});
