export const toArray = <T>(any: T | T[]): T[] => {
  return Array.isArray(any) ? any : [any];
};

export const safeRequire = (path: string) => {
  try {
    // FIXME: how to require file without require
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path);
  } catch (e) {
    return {};
  }
};
