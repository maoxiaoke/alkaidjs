import { Config } from '../types';
import { CreateLoggerReturns } from '../helpers/logger';
import Hook from '../helpers/hookable';

export interface LoaderContext extends Config {
  rootDir: string;
  logger: CreateLoggerReturns;
  hook: Hook;
}

export type Loader = (ctx: LoaderContext) => void | Promise<void>;

export type DefaultLoader = 'swc' | 'rollup';
