/* @flow */
import type Redis from 'ioredis';

import type { RegExp$Interface, File$Data } from '../types';

import {
  getDirectoryFiles,
  getRecursiveDirectoryFiles,
  readFileDescriptors,
} from '../utils/fsys';

const RECache: Map<string, RegExp$Interface> = new Map();

function luaExtensionFilter(descriptor) {
  return descriptor.ext === '.lua';
}

function getLuaParamRegExp(param: string): RegExp$Interface {
  const cached = RECache.get(param);
  if (cached) {
    return cached;
  }
  const re: RegExp$Interface = new RegExp(`--\\s*${param}:?\\s+([^\n]+)`);
  RECache.set(param, re);
  return re;
}

// https://github.com/perrin4869/redis-lua2js/blob/master/src/index.js
function getParameter(lua: string | Buffer, param: string) {
  const re = getLuaParamRegExp(param);
  const match = re.exec(String(lua));
  return match && match[1].trim();
}

// https://github.com/perrin4869/redis-lua2js/blob/master/src/index.js
function getParameters(lua: string | Buffer, params: Array<string>) {
  const str = String(lua);
  const m: Map<string, Array<string> | string> = new Map();
  return params.reduce((map, param) => {
    const re = getLuaParamRegExp(param);
    const match = re.exec(str);
    if (match) {
      map.set(param, match[1]);
    }
    return map;
  }, m);
}

function getScriptParameters(descriptors) {
  // if (!Array.isArray(descriptors)) return [];
  return descriptors.reduce((p, descriptor) => {
    const params = getParameters(descriptor.data, ['name', 'keys']);
    descriptor.params = params;
    if (!params.has('name')) {
      // if name not specified, use file name
      params.set('name', descriptor.descriptor.name);
    }
    const keys = params.get('keys');
    if (typeof keys === 'string') {
      params.set('keys', keys.split(/\s+/));
    }
    p.push(descriptor);
    return p;
  }, []);
}

function getScripts(path: string, recursive?: boolean) {
  if (recursive) {
    return getRecursiveDirectoryFiles(path, luaExtensionFilter);
  }
  return getDirectoryFiles(path, luaExtensionFilter);
}

function addScriptsToRedis(redis: Redis, scripts: Array<File$Data>) {
  scripts.forEach(script => {
    const { params, data } = script;
    if (params) {
      const name = params.get('name');
      const keys = params.get('keys');
      if (typeof name === 'string') {
        if (Array.isArray(keys)) {
          redis.defineCommand(name, {
            numberOfKeys: keys.length,
            lua: String(data),
          });
        } else {
          redis.defineCommand(name, {
            lua: String(data),
          });
        }
      }
    }
  });
}

function loadScripts(path: string, recursive?: boolean) {
  return getScripts(path, recursive)
    .then(readFileDescriptors)
    .then(getScriptParameters);
}

export {
  getScripts,
  loadScripts,
  getParameter,
  getParameters,
  addScriptsToRedis,
};
