import { autoMemoize, autoOnce } from "./memoize.js";

export const Service = {
    once: fn => autoOnce(fn),
    memoize: fn => autoMemoize(fn)
};