import swc from '@swc/core';
import { copySync, ensureDirSync, writeFileSync } from 'fs-extra';
import { resolve, extname } from 'path';
import { loadEntryFiles } from '../helpers/load';
import type { LoaderContext } from '../types';

interface File {
  // globby parsed path, which is relative
  path: string;
  // absolute path
  absolutePath: string;
  // extension
  // ext: 'jsx' | 'js' | 'ts' | 'tsx' | 'mjs' | 'png' | 'scss' | 'less' | 'css' | 'png' | 'jpg';
  ext: string;
  // parsed code
  code?: string;
  // source map
  map?: string;
}

export async function runSwc(ctx: LoaderContext) {
  const { entryDir, rootDir, outputDir, logger } = ctx;
  const files: File[] =
    loadEntryFiles(
      resolve(rootDir, entryDir),
    )
      .map((path) => ({
        path,
        absolutePath: resolve(rootDir, path),
        ext: extname(path),
      }));

  logger.info('SWC', 'start to build...');

  ensureDirSync(outputDir);

  for (let i = 0; i < files.length; ++i) {
    const isDeclaration = files[i].path.includes('.d.ts');
    const isTypeScript = ['ts', 'tsx'].includes(files[i].ext) && !isDeclaration;
    const isEcmaScript = ['mjs', 'js', 'jsx'].includes(extname(files[i].ext));

    const dest = resolve(outputDir, files[i].path);

    if (isTypeScript || isEcmaScript) {
      const { code, map } = swc.transformFileSync(
        files[i].path,
        {
          jsc: {
            parser: {
              syntax: isTypeScript ? 'typescript' : 'ecmascript',
            },
          },
        },
      );

      files[i].code = code;
      files[i].map = map;

      writeFileSync(dest, code, 'utf-8');
    } else {
      // Just copy other files to dest
      copySync(files[i].absolutePath, dest);
      logger.info('SWC', `file ${files[i].absolutePath} copied to ${dest}`);
    }

    // todos: gen dts
  }

  return files;
}
