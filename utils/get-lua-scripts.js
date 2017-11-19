/* @flow */

// Pre-Compile provided lua scripts
import path from 'path';
import { lua } from '../src/main';

const scriptsDir = path.resolve(__dirname, '../lua');

function loadScripts() {
  return lua.loadScripts(scriptsDir, true).then(scripts => {
    const formattedScripts = scripts.map(s => ({
      descriptor: {
        name: s.descriptor.name,
        file: s.descriptor.file,
        ext: s.descriptor.ext,
      },
      data: String(s.data),
      params: s.params,
    }));
    console.log(JSON.stringify(formattedScripts));
  });
}

loadScripts();
