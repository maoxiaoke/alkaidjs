import * as swc from '@swc/core';
import { extname } from 'path';
import { createFilter } from '@rollup/pluginutils';
import type { Plugin } from 'rollup';
import { normalizeSwcConfig } from '../loaders/normalize';
import { LoaderContext } from '../loaders';
import type { JsMinifyOptions } from '@swc/core';

const swcFilter = createFilter(
  /\.m?[jt]sx?$/,
  /node_modules/,
);

function swcPlugin(ctx: LoaderContext): Plugin {
  return {
    name: 'alkaid:swc',

    transform(_, id) {
      if (!swcFilter) {
        return null;
      }

      const file = {
        filePath: id,
        absolutePath: id,
        ext: extname(id),
      };

      const { code, map } = swc.transformSync(
        _,
        normalizeSwcConfig(ctx, file, {
          // Disable minimize on every file transform
          minify: false,
        }),
      );

      return {
        code,
        map,
      };
    },

    renderChunk(_) {
      if (ctx.minify) {
        return swc.minifySync(_, {
          ...(ctx.minify as JsMinifyOptions),
          sourceMap: !!ctx.sourceMap,
        });
      }
      return null;
    },
  };
}

export default swcPlugin;
