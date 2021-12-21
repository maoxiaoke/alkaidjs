import { resolve } from 'path';
import { toArray } from './utils';
import { runSwc } from './loaders/swc';
import type { Config } from './types';

export function build (_rootDir?: string, _config?: Config | Config[]) {
  const rootDir = resolve(process.cwd(), _rootDir || '.');

  return Promise.all(
    toArray(_config).map(cfg => {
      if (cfg.loader === 'swc') {
        runSwc(cfg);
      }

      // if ()
    })
  )
}