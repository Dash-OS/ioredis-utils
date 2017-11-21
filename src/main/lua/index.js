/* @flow */
import type Redis, { Redis$Pipeline } from 'ioredis';
// import path from 'path';

import type {
  RegExp$Interface,
  File$Data,
  File$SimpleData,
  Lua$Transforms,
  Lua$Params,
} from '../types';

import {
  getDirectoryFiles,
  getRecursiveDirectoryFiles,
  readFileDescriptors,
} from '../utils/fsys';

import reEx from '../utils/re';

const RECache: Map<string, RegExp$Interface> = new Map();

function luaExtensionFilter(descriptor) {
  return descriptor.ext === '.lua';
}

function getLuaParamRegExp(param: string): RegExp$Interface {
  const cached = RECache.get(param);
  if (cached) {
    return cached;
  }
  const re = reEx('g')`--\\s*${param}:?\\s+([^\n]+)`;
  RECache.set(param, re);
  return re;
}

function stripLuaComments(str: string) {
  const RE_LUA_ALL_COMMENTS: RegExp$Interface = reEx('')`
    (
      (?:--\[\[[\S\s]*?\]\])
      |(?:--(?!\[)[\s\S]*?\n)
    )+
  `;
  let result = RE_LUA_ALL_COMMENTS.exec(str);
  // console.error(result);
  while (result) {
    str = str.replace(result[0], '');
    result = RE_LUA_ALL_COMMENTS.exec(str);
  }
  return str.trim();
}

function parseLuaComments(descriptor): Lua$Params {
  const RE_LUA_COMMENTS: RegExp$Interface = reEx('g')`
    (?:
      --\[\[(([^\s]+)\s+=>[\S\s]*?)\]\]
    )|
    (?:
      --\s*\|\s*([^\s\n]+):\s+([^\n]+)
    )
  `;
  let str = String(descriptor.data);
  const params: Lua$Params = {
    name: descriptor.descriptor.name,
    dynamic: false,
    keys: [],
  };
  const transforms: Lua$Transforms = {};
  descriptor.params = params;
  let result = RE_LUA_COMMENTS.exec(str);
  const comments = [];
  while (result) {
    const [whole, fn, argName, key, value] = result;
    comments.push(whole);
    if (argName) {
      transforms[argName] = fn;
      descriptor.transforms = transforms;
    } else if (key) {
      switch (key) {
        case 'dynamic': {
          params[key] = value.replace(/\s+/, '') === 'true';
          break;
        }
        case 'name': {
          if (typeof value === 'string') {
            params[key] = value;
          }
          break;
        }
        case 'keys': {
          params[key] = value.split(/\s+/);
          break;
        }
        default: {
          throw new Error(`Unknown Param Received: ${key}`);
        }
      }
    } else {
      break;
    }
    result = RE_LUA_COMMENTS.exec(str);
  }
  comments.forEach(comment => {
    str = str.replace(comment, '');
  });
  str = stripLuaComments(str);
  // console.error('FINAL STRING: ', str);
  descriptor.data = str;
  return params;
}

// https://github.com/perrin4869/redis-lua2js/blob/master/src/index.js
function getParameter(lua: string | Buffer, param: string) {
  const re = getLuaParamRegExp(param);
  const match = re.exec(String(lua));
  return match && match[1].trim();
}

// https://github.com/perrin4869/redis-lua2js/blob/master/src/index.js
function getParameters(lua: string | Buffer, params: Array<$Keys<Lua$Params>>) {
  const str = String(lua);
  const m: $Shape<Lua$Params> = {};
  return params.reduce((map, param) => {
    const re = getLuaParamRegExp(param);
    const match = re.exec(str);
    if (Array.isArray(match)) {
      switch (param) {
        case 'dynamic': {
          const [, value] = match;
          map[param] = value.replace(/\s+/, '') === 'true';
          break;
        }
        case 'name': {
          const [, value] = match;
          if (typeof value === 'string') {
            map[param] = value;
          }
          break;
        }
        case 'keys': {
          const [, value] = match;
          map[param] = value.split(/\s+/);
          break;
        }
        default: {
          throw new Error(`Unknown Param Received: ${param}`);
        }
      }
    }

    return map;
  }, m);
}

function getScriptParameters(descriptors) {
  return descriptors.reduce((p, descriptor) => {
    const params = parseLuaComments(descriptor);
    const { name } = params;
    if (!name) {
      // if name not specified, use file name
      params.name = descriptor.descriptor.name;
    }
    p.push(descriptor);
    return p;
  }, []);
}

function getScripts(directory: string, recursive?: boolean) {
  if (recursive) {
    return getRecursiveDirectoryFiles(directory, luaExtensionFilter);
  }
  return getDirectoryFiles(directory, luaExtensionFilter);
}

function addTransforms(redis: Redis, script) {
  const { params, transforms } = script;
  if (!transforms) return;
  const { args: argsTransformer, result: resultTransformer } = transforms;
  if (params) {
    const { name } = params;
    if (typeof name === 'string' && redis[name]) {
      const originalCommand = redis[name];
      redis[name] = function wrapCustomCommand(..._args) {
        let args;
        if (typeof argsTransformer === 'function') {
          args = argsTransformer(_args);
        } else {
          args = _args;
        }
        const result = originalCommand.apply(this, args);
        if (typeof resultTransformer === 'function') {
          if (typeof result.then === 'function') {
            return result.then(resultTransformer);
          } else if (
            !(result instanceof Promise) &&
            Array.isArray(result._queue)
          ) {
            // we are likely in a pipeline, this requires us to do some
            // odd logic to embed ourselves into the fn's result
            const idx = result._queue.length - 2;
            // we need to wrap exec so we can transform the results
            const originalExec = result.exec;
            result.exec = function executeWrappedPipeline(): Promise<*> {
              return originalExec.call(this).then(results => {
                // $FlowIgnore
                results[idx][1] = resultTransformer(results[idx][1]);
                return results;
              });
            };
          }
        }
        return result;
      };
    }
  }
}

function addScriptsToRedis(
  redis: Redis,
  scripts: Array<File$Data | File$SimpleData>,
) {
  scripts.forEach(script => {
    const { params, data, transforms } = script;
    if (params) {
      const { name, keys, dynamic = false } = params;
      if (typeof name === 'string') {
        if (Array.isArray(keys) && !dynamic) {
          redis.defineCommand(name, {
            numberOfKeys: keys.length,
            lua: String(data),
          });
        } else {
          redis.defineCommand(name, {
            lua: String(data),
          });
        }
        if (transforms) {
          addTransforms(redis, script);
        }
      }
    }
  });
}

function loadScripts(directory: string, recursive?: boolean) {
  return getScripts(directory, recursive)
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
