import { CreateLoggerReturns } from './helpers/logger';

type DefaultLoader = 'swc';

export interface Config {
  /**
   * name to distinguish between hooks
   */
  name: string;
  /**
   * determine how to handle source file
   * type `string` used for `swc`、`build-scripts`
   * type `Function` for custom loaders
   */
  loader?: DefaultLoader | Function;
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
  minify?: boolean;

  /**
   * Whether generate sourceMap or not
   */
  sourceMap?: boolean;
}

export interface LoaderContext extends Config {
  rootDir: string;
  logger: CreateLoggerReturns;
}
