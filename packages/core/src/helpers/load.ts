
import * as glob from 'globby';
import { join } from 'path';
import type { Config } from '../types';
import { safeRequire } from '../utils';

/**
 * load entry files
 * @param entry
 * @returns
 */
export function loadEntryFiles(entry: string) {
  return glob.sync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', '*.d.ts', '*.?(ali|wechat).?(ts|tsx|js|jsx)'],
    onlyFiles: true,
  });
}

/**
 * load config
 * @param entry
 * @returns
 */
export function loadAlkaidConfig(
  cwd: string,
): Config | Config[] {
  // TODO: match all possible case
  // eslint-disable-next-line @typescript-eslint/semi
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(join(cwd, 'alkaid.config.json'));
}

/**
 * load package.json
 * @param cwd
 * @returns
 */
export function loadPkg(cwd: string) {
  return safeRequire(join(cwd, 'package.json'));
}
