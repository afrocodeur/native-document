import { once as _once, autoMemoize, autoOnce } from "./memoize.js";

export const once = fn => autoOnce(fn);
export const singleton = fn => _once(fn);
export const memoize = fn => autoMemoize(fn);