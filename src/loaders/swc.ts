import * as swc from '@swc/core';
import type { JsMinifyOptions } from '@swc/core';
import { copySync, ensureDirSync, writeFileSync } from 'fs-extra';
import { resolve, extname } from 'path';
import { loadEntryFiles } from '../helpers/load';
import { isEcmascriptOnly, isTypescriptOnly, isJsx } from '../helpers/suffix';
import dtsCompile from '../helpers/dts';
import type { LoaderContext } from './index';

export interface File {
  // globby parsed path, which is relative
  filePath: string;
  // absolute path
  absolutePath: string;
  // extension
  // ext: 'jsx' | 'js' | 'ts' | 'tsx' | 'mjs' | 'png' | 'scss' | 'less' | 'css' | 'png' | 'jpg';
  ext: string;
  // where to store target files
  dest?: string;
  // parsed code
  code?: string;
  // source map
  map?: string;
}

export async function runSwc(ctx: LoaderContext) {
  const { hook, logger } = ctx;

  await hook.callHooks('swc.start.compile', ctx);
  logger.info('SWC', 'start to compile files...');

  // start.compile hook may change context
  const { entryDir, rootDir, outputDir } = ctx;

  const files: File[] =
    loadEntryFiles(
      resolve(rootDir, entryDir),
    )
      .map((filePath) => ({
        filePath,
        absolutePath: resolve(rootDir, entryDir, filePath),
        ext: extname(filePath).slice(1),
      }));

  ensureDirSync(outputDir);

  for (let i = 0; i < files.length; ++i) {
    const isTypeScript = isTypescriptOnly(files[i].ext, files[i].filePath);
    const isEcmaScript = isEcmascriptOnly(files[i].ext, files[i].filePath);

    const dest = resolve(outputDir, files[i].filePath);
    files[i].dest = dest;

    if (isTypeScript || isEcmaScript) {
      const { code, map } = swc.transformFileSync(
        files[i].absolutePath,
        {
          jsc: {
            parser: {
              syntax: isTypeScript ? 'typescript' : 'ecmascript',
              jsx: isJsx(files[i].ext),
            },
            minify: ctx.minify as JsMinifyOptions ?? undefined,
            loose: true,
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
  }

  if (
    ctx.declation ||
    (typeof ctx.declation === 'object' && ctx.declation?.js)) {
    hook.callHooks('swc.start.dts.compile', ctx);

    const generateDtsForEcmascript = typeof ctx.declation === 'object' && ctx.declation?.js;
    const compileFiles = files
      .filter(
        ({ ext, filePath }) =>
          isTypescriptOnly(ext, filePath)
        || (generateDtsForEcmascript && isEcmascriptOnly(ext, filePath)),
      );

    dtsCompile(compileFiles, logger);
  }


  return files;
}
