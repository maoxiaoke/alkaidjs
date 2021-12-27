import type { CreateLoggerReturns } from './logger';
import type { Config } from '../types';

const defaultMinifyOption = {
  compress: {
    unused: false,
  },
  mangle: true,
};

export function validateOptions(
  cfg: Config,
  logger: CreateLoggerReturns,
): Config {
  const _cfg = cfg;


  if (_cfg.minify === true) {
    _cfg.minify = defaultMinifyOption;
  }

  if (typeof _cfg.minify === 'object') {
    _cfg.minify = {
      ...defaultMinifyOption,
      ...cfg.minify as object,
    };
  }

  return _cfg;
}
