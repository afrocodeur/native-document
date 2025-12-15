
type OnceProxy<T> = {
    [K in keyof T]: T[K];
};

type MemoizeProxy<T> = {
    [key: string]: T;
    [key: symbol]: T;
};

export function once<T extends (...args: any[]) => any>(
    fn: T
): (...args: Parameters<T>) => ReturnType<T>;


export function autoOnce<T extends object>(fn: () => T): OnceProxy<T>;

export function memoize<T extends (...args: any[]) => any>(
    fn: T
): (key: any, ...args: Parameters<T>) => ReturnType<T>;

export function autoMemoize<T>(fn: () => T): MemoizeProxy<T>;

export function autoMemoize<T, Args extends any[]>(
    fn: (...args: Args) => T
): MemoizeProxy<(...args: Args) => T>;