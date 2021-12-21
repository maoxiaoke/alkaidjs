
import { globbySync } from 'globby';

/**
 * load entry files
 * @param entry
 * @returns
 */
export function loadEntryFiles (entry: string) {
  return globbySync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', '*.d.ts', '*.?(ali|wechat).?(ts|tsx|js|jsx)'],
    onlyFiles: true,
  });
}
