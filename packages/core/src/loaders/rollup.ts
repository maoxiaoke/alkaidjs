import { resolve } from 'path';
import type { LoaderContext } from './index';
import { rollup } from 'rollup';
import type { InputOptions, OutputOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import swcPlugin from '../plugins/swc';
import { loadPkg } from '../helpers/load';

function normalizeInputOptions(ctx: LoaderContext): InputOptions {
  const { entry, rootDir, outputDir } = ctx;

  return {
    input: entry,
    plugins: [
      postcss({
        plugins: [autoprefixer()],
        extract: resolve(rootDir, outputDir, 'index.css'),
        autoModules: true,
        minimize: !!ctx.minify,
        sourceMap: ctx.sourceMap,
      }),
      nodeResolve(),
      commonjs(), // to convert commonjs to import, make it capabile for rollup to bundle
      swcPlugin(ctx),
      // FIXME: some plugins should appear advance
      ...ctx.loaderPlugins,
    ],
  };
}

function normalizeOutputOptions(ctx: LoaderContext): OutputOptions {
  const { rootDir, outputDir, sourceMap } = ctx;
  return {
    file: resolve(rootDir, outputDir, 'index.js'),
    // Add __esmobule property
    esModule: true,
    format: 'iife',
    name: ctx.name || loadPkg(rootDir).name,
    sourcemap: sourceMap,
  };
}

export async function runRollup(ctx: LoaderContext) {
  const { logger, hook } = ctx;

  await hook.callHooks('rollup.start.compile', ctx);
  logger.info('ROLLUP', 'start to compile files...');

  const bundle = await rollup(normalizeInputOptions(ctx));
  await bundle.write(normalizeOutputOptions(ctx));
  await bundle.close();

  // TODO: how to generate declartion file with rollup
  await hook.callHooks('rollup.end.compile', ctx);
}
