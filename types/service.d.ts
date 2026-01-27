type ServiceFactory<T> = () => T;
type MemoizedFactory<T, Args extends any[]> = (...args: Args) => T;

type OnceProxy<T> = {
    [K in keyof T]: T[K];
};

type MemoizeProxy<T> = {
    [key: string]: T;
    [key: symbol]: T;
};

interface ServiceStatic {
    once<T extends object>(fn: ServiceFactory<T>): OnceProxy<T>;

    memoize<T>(fn: () => T): MemoizeProxy<T>;

    memoize<T, Args extends any[]>(
        fn: (...args: Args) => T
    ): MemoizeProxy<(...args: Args) => T>;
}

export const Service: ServiceStatic;