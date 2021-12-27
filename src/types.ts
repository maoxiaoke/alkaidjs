import type { DefaultLoader, Loader } from './loaders';
import type { JsMinifyOptions } from '@swc/core';

interface Declation {
  js?: boolean;
}

export interface Config {
  /**
   * name to distinguish between hooks
   */
  name?: string;
  /**
   * determine how to handle source file
   * type `string` used for `swc`、`rollup`
   * type `Function` for custom loaders
   */
  loader?: DefaultLoader | Loader;
  /**
   * plugins passed to loader
   * @default []
   */
  loaderPlugins?: any;
  /**
   * bundle supports
   * @default src/index.[j|t]s[x]
   */
  entry?: string;
  /**
   * esm supports
   * @default resolve(process.cwd(), 'src')
   */
  entryDir?: string;
  /**
   * output directory
   * @default dist
   */
  outputDir?: string;

  /**
   * minize output
   * @default false
   */
  minify?: boolean | JsMinifyOptions;

  /**
  * - true to generate a sourcemap for the code and include it in the result object.
  * - "inline" to generate a sourcemap and append it as a data URL to the end of the code,
  * but not include it in the result object.
   */
  sourceMap?: boolean | 'inline';

  /**
  * Whether generate declation for Ecmascript & Typescript
  * @default true for typescript
  */
  declation?: boolean | Declation;
}

