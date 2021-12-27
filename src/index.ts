import { resolve } from 'path';
import { toArray } from './utils';
import { runSwc } from './loaders/swc';
import { runRollup } from './loaders/rollup';
import type { Config } from './types';
import { createHook } from './helpers/hookable';
import { loadAlkaidConfig } from './helpers/load';
import { createLogger } from './helpers/logger';
import { validateOptions } from './helpers/validate';
import type { LoaderContext } from './loaders/index';

const hook = createHook();

export async function build(_rootDir?: string, _configs?: Config | Config[]) {
  const rootDir = resolve(process.cwd(), _rootDir || '.');

  const configs = _configs ?? await loadAlkaidConfig(rootDir);

  // TODO: here is to check configs and how to check outer configs

  return Promise.all(
    toArray(configs).map((cfg) => {
      const logger = createLogger(cfg?.name);
      const _cfg = validateOptions(cfg, logger);

      const ctx: LoaderContext = {
        rootDir,
        logger,
        hook,
        ..._cfg,
      };

      // run swc
      if (cfg.loader === 'swc') {
        runSwc(ctx);
      }

      // use rollup to bundle your app
      if (cfg.loader === 'rollup') {
        runRollup(ctx);
      }

      if (typeof cfg.loader === 'function') {
        cfg.loader(ctx);
      }
      return true;
    }),
  );
}
