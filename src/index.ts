import { resolve } from 'path';
import { toArray } from './utils';
import { runSwc } from './loaders/swc';
import type { Config } from './types';
import { createHook } from './helpers/hookable';
import { loadAlkaidConfig } from './helpers/load';
import { createLogger } from './helpers/logger';

const onHook = createHook();
const logger = createLogger('ALKAID');

export async function build(_rootDir?: string, _configs?: Config | Config[]) {
  const rootDir = resolve(process.cwd(), _rootDir || '.');

  const configs = _configs ?? await loadAlkaidConfig(rootDir);

  // TODO: here is to check configs and how to check outer configs

  return Promise.all(
    toArray(configs).map((cfg) => {
      const ctx = {
        rootDir,
        logger,
        ...configs,
      };
      if (cfg.loader === 'swc') {
        runSwc(ctx);
      }

      // if ()
    }),
  );
}
