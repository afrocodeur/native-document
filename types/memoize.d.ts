
export function once<T extends (...args: any[]) => any>(
    fn: T
): (...args: Parameters<T>) => ReturnType<T>;

export function autoOnce<T extends object>(
    fn: () => T
): T;

export function memoize<T extends (...args: any[]) => any>(
    fn: T
): (key: any, ...args: Parameters<T>) => ReturnType<T>;

export function autoMemoize<T extends (...args: any[]) => any>(
    fn: T
): Record<PropertyKey, Parameters<T>['length'] extends 0 ? ReturnType<T> : T>;