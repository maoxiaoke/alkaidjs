
import { globbySync } from 'globby';
import { join } from 'path';

/**
 * load entry files
 * @param entry
 * @returns
 */
export function loadEntryFiles(entry: string) {
  return globbySync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', '*.d.ts', '*.?(ali|wechat).?(ts|tsx|js|jsx)'],
    onlyFiles: true,
  });
}

export function loadAlkaidConfig(
  cwd: string,
) {
  // TODO: match all possible case
  // eslint-disable-next-line @typescript-eslint/semi
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(join(cwd, 'alkaid.config.json'));
}
