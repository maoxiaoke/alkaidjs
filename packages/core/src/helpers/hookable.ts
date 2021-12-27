
export type PromiseLike<T> = T | Promise<T>;

export type HookCallback = (args: any) => PromiseLike<void>;

export interface Hooks {
  [index: string]: HookCallback[];
}

export interface Hookable {
  /** where to store all hooks */
  hooks: Hooks;

  /** add hooks */
  addHook: (name: string, callback: HookCallback) => void;

  /** remove hooks */
  removeHook: (name: string, callback: HookCallback) => void;

  /** call hooks */
  callHooks: (name: string, ...arg: any) => PromiseLike<Boolean>;
}

export default class Hook implements Hookable {
  hooks: Hooks;

  constructor() {
    this.hooks = {};
  }

  addHook = (name: string, callback: HookCallback) => {
    if (!name || typeof callback !== 'function') {
      return () => {};
    }
    this.hooks[name] = this.hooks[name] || [];
    this.hooks[name].push(callback);
  };

  removeHook = (name: string, callback: HookCallback) => {
    if (this.hooks[name]) {
      const idx = this.hooks[name].findIndex((fn) => fn === callback);

      if (idx > -1) {
        this.hooks[name].splice(idx, 1);
      }

      if (this.hooks[name].length === 0) {
        delete this.hooks[name];
      }
    }
  };

  callHooks = async (name: string, ...args: any) => {
    if (this.hooks[name]) {
      this.hooks[name]
        .reduce(
          (pre, next) => pre.then(() => next(args)),
          Promise.resolve(true),
        );
    }
    return true;
  };
}

export const createHook = (): Hook => {
  return new Hook();
};
