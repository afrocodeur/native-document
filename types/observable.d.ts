// Observable system type definitions
export interface ObservableItem<T = any> {
    readonly $currentValue: T;
    readonly $previousValue: T;
    readonly $isCleanedUp: boolean;

    val(): T;
    set(value: T | ((prev: T) => T)): void;
    trigger(operations?: ObservableOperation): void;
    cleanup(): void;

    subscribe(callback: (current: T, previous: T, operations?: ObservableOperation) => void): () => void;
    unsubscribe(callback: Function): void;
    on(value: T, callback: ObservableItem<boolean> | ((isActive: boolean) => void)): () => void;

    check<U>(callback: (value: T) => U): ObservableChecker<U>;
    get<U>(callback: (value: T) => U): ObservableChecker<U>;
    when(value: T): { $target: T; $observer: ObservableItem<T> };

    toString(): string;
}

export interface ObservableOperation {
    action?: string;
    args?: any[];
    result?: any;
}

export interface ObservableChecker<T = any> {
    readonly __$isObservableChecker: true;

    subscribe(callback: (value: T) => void): () => void;
    check<U>(callback: (value: T) => U): ObservableChecker<U>;
    val(): T;

    set(value: any): void;
    trigger(): void;
    cleanup(): void;
}

export interface ObservableArray<T> extends ObservableItem<T[]> {
    push(...items: T[]): number;
    pop(): T | undefined;
    shift(): T | undefined;
    unshift(...items: T[]): number;
    reverse(): T[];
    sort(compareFn?: (a: T, b: T) => number): T[];
    splice(start: number, deleteCount?: number, ...items: T[]): T[];

    clear(): boolean;
    merge(values: T[]): void;
    remove(index: number): T[];
    swap(indexA: number, indexB: number): boolean;
    length(): number;
    populateAndRender(iteration: number, callback: (index: number) => T): void;

    map<U>(callback: (value: T, index: number, array: T[]) => U): U[];
    filter(callback: (value: T, index: number, array: T[]) => boolean): T[];
    reduce<U>(callback: (acc: U, value: T, index: number, array: T[]) => U, initial: U): U;
    some(callback: (value: T, index: number, array: T[]) => boolean): boolean;
    every(callback: (value: T, index: number, array: T[]) => boolean): boolean;
    find(callback: (value: T, index: number, array: T[]) => boolean): T | undefined;
    findIndex(callback: (value: T, index: number, array: T[]) => boolean): number;
    concat(...items: (T | T[])[]): T[];
}

export type ObservableProxy<T extends Record<string, any>> = {
    readonly __isProxy__: true;
    readonly $value: T;
    $clone(): ObservableProxy<T>;
} & {
    [K in keyof T]: T[K] extends (infer U)[]
        ? ObservableArray<U>
        : T[K] extends Record<string, any>
            ? ObservableProxy<T[K]>
            : ObservableItem<T[K]>;
};

export interface BatchFunction<TArgs extends any[] = any[], TReturn = any> {
    (...args: TArgs): TReturn;
    readonly $observer: ObservableItem<number>;
}

export type ValidComputedDependencies = Array<ObservableItem | ObservableArray<any> | ObservableChecker | ObservableProxy<any>>;
export interface ObservableStatic {
    <T>(value: T): ObservableItem<T>;
    array<T>(target: T[]): ObservableArray<T>;
    init<T extends Record<string, any>>(value: T): ObservableProxy<T>;
    object<T extends Record<string, any>>(value: T): ObservableProxy<T>;
    json<T extends Record<string, any>>(value: T): ObservableProxy<T>;

    computed<T>(callback: () => T, dependencies?: ValidComputedDependencies): ObservableItem<T>;
    computed<T>(callback: () => T, batchFunction?: BatchFunction): ObservableItem<T>;

    batch(callback: Function): BatchFunction;
    value(data: any): any;
    update(target: any, data: any): void;

    getById(id: number): ObservableItem | null;
    cleanup(observable: ObservableItem): void;
    autoCleanup(enable?: boolean, options?: { interval?: number; threshold?: number }): void;
}

export interface AutoCleanupOptions {
    interval?: number;
    threshold?: number;
}

export interface ObservableStatic {
    <T>(value: T): ObservableItem<T>;
    array<T>(target: T[]): ObservableArray<T>;

    init<T extends Record<string, any>>(value: T): ObservableProxy<T>;
    object<T extends Record<string, any>>(value: T): ObservableProxy<T>;
    json<T extends Record<string, any>>(value: T): ObservableProxy<T>;

    computed<T>(callback: () => T, dependencies?: ObservableItem[]): ObservableItem<T>;
    computed<T>(callback: () => T, batchFunction?: BatchFunction): ObservableItem<T>;

    batch<TArgs extends any[], TReturn>(
        callback: (...args: TArgs) => TReturn
    ): BatchFunction<TArgs, TReturn>;

    value(data: any): any;
    update(target: any, data: any): void;

    getById(id: number): ObservableItem | null;
    cleanup(observable: ObservableItem): void;
    autoCleanup(enable?: boolean, options?: AutoCleanupOptions): void;
}