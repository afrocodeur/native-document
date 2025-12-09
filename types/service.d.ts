type ServiceFactory<T> = () => T;
type MemoizedFactory<T, Args extends any[]> = (...args: Args) => T;

interface ServiceStatic {

    once<T>(fn: ServiceFactory<T>): ServiceFactory<T>;

    memoize<T, Args extends any[]>(
        fn: MemoizedFactory<T, Args>
    ): MemoizedFactory<T, Args>;
}

export const Service: ServiceStatic;