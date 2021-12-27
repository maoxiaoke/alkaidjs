import type { LoaderContext } from './index';
import { isTypescriptOnly, isJsx } from '../helpers/suffix';
import type { File } from './swc';
import type { Options as swcCompileOptions, JsMinifyOptions } from '@swc/core';
import deepmerge from 'deepmerge';

export function normalizeSwcConfig(
  ctx: LoaderContext,
  file: File,
  mergeOptions?: swcCompileOptions,
): swcCompileOptions {
  const { filePath, ext } = file;
  const isTypeScript = isTypescriptOnly(ext, filePath);

  return deepmerge({
    jsc: {
      parser: {
        syntax: isTypeScript ? 'typescript' : 'ecmascript',
        jsx: isJsx(ext),
        tsx: isJsx(ext),
      },
      minify: ctx.minify as JsMinifyOptions ?? undefined,
      loose: true,
    },
    sourceMaps: ctx.sourceMap,
  }, mergeOptions);
}
