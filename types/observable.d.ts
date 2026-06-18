import { FilterResult, PredicateMap } from './filters';

export type Unsubscribe = () => void;

export type FormatType = 'currency' | 'number' | 'percent' | 'date' | 'time' | 'datetime' | 'relative' | 'plural';

export interface FormatOptions {
    // currency
    currency?: string;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    // percent
    decimals?: number;
    // date / datetime
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    format?: string;
    // time / datetime
    hour?: '2-digit' | 'numeric';
    minute?: '2-digit' | 'numeric';
    second?: '2-digit' | 'numeric';
    // relative
    unit?: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second';
    numeric?: 'always' | 'auto';
    // plural
    singular?: string;
    plural?: string;
}

export interface FormattersStatic {
    currency(value: number, locale: string, options?: FormatOptions): string;
    number(value: number, locale: string, options?: FormatOptions): string;
    percent(value: number, locale: string, options?: FormatOptions): string;
    date(value: Date | number, locale: string, options?: FormatOptions): string;
    time(value: Date | number, locale: string, options?: FormatOptions): string;
    datetime(value: Date | number, locale: string, options?: FormatOptions): string;
    relative(value: Date | number, locale: string, options?: FormatOptions): string;
    plural(value: number, locale: string, options?: FormatOptions): string;
    [key: string]: (value: any, locale: string, options?: FormatOptions) => string;
}

export declare const Formatters: FormattersStatic;

// -- Observable system type definitions ---------------------------------------

export interface ObservableItem<T = any> {
    readonly $currentValue: T;
    readonly $previousValue: T;
    readonly $initialValue: T | null;
    readonly $isCleanedUp: boolean;
    readonly $memoryId: number | null;
    readonly __$Observable: true;
    readonly __$isObservable: true;

    $value: T;

    val(): T;
    set(value: T | ((prev: T) => T)): void;
    trigger(operations?: ObservableOperation): void;
    cleanup(): void;
    clone(): ObservableItem<T>;
    disconnectAll(): void;

    /**
     * Registers a subscriber. Does NOT return an unsubscribe function —
     * call .unsubscribe(callback) with the same reference to remove it.
     */
    subscribe(callback: (current: T, previous: T, operations?: ObservableOperation) => void): void;
    unsubscribe(callback: Function): void;

    /**
     * Registers a watcher for a specific value. Does NOT return an unsubscribe
     * function — call .off(value, callback) to remove it.
     */
    on(value: T, callback: ObservableItem<boolean> | ((isActive: boolean) => void)): void;
    off(value: T, callback?: Function): void;
    once(predicate: T | ((value: T) => boolean), callback: (value: T) => void): void;
    onCleanup(callback: () => void): void;

    intercept(callback: (newValue: T, currentValue: T) => T | undefined): this;
    interceptMutations(callback: (operation: ObservableOperation) => void): this;

    check<U>(callback: (value: T) => U): ObservableChecker<U>;
    transform<U>(callback: (value: T) => U): ObservableChecker<U>;
    is<U>(callback: (value: T) => U): ObservableChecker<U>;
    select<U>(callback: (value: T) => U): ObservableChecker<U>;
    pluck<U>(key: string): ObservableChecker<U>;
    format(type: FormatType | ((value: T) => string), options?: FormatOptions): ObservableItem<string>;
    get(key: string | number): any;
    when(value: T): ObservableWhen<T>;

    persist(key: string, options?: {
        get?: (value: any) => T;
        set?: (value: T) => any;
    }): this;

    // -- comparison helpers (is*) -----------------------------------------------

    isEqualTo(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isNotEqualTo(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isGreaterThan(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isGreaterThanOrEqualTo(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isLessThan(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isLessThanOrEqualTo(value: T | ObservableItem<T>): ObservableChecker<boolean>;
    isBetween(min: T | ObservableItem<T>, max: T | ObservableItem<T>): ObservableChecker<boolean>;
    isNull(): ObservableChecker<boolean>;
    isTruthy(): ObservableChecker<boolean>;
    isFalsy(): ObservableChecker<boolean>;
    isStartingWith(value: string | ObservableItem<string>): ObservableChecker<boolean>;
    isEndingWith(value: string | ObservableItem<string>): ObservableChecker<boolean>;
    isMatchingPattern(pattern: RegExp | ObservableItem<RegExp>): ObservableChecker<boolean>;
    isEmpty(): ObservableChecker<boolean>;
    isNotEmpty(): ObservableChecker<boolean>;
    isIncludes(value: any | ObservableItem<any>): ObservableChecker<boolean>;
    isIncludedIn(collection: any[] | ObservableItem<any[]>): ObservableChecker<boolean>;
    isOneOf(collection: any[] | ObservableItem<any[]>): ObservableChecker<boolean>;
    isHaving(key: string | ObservableItem<string>): ObservableChecker<boolean>;

    // -- transform helpers (to*) -------------------------------------------------

    toUpperCase(): ObservableChecker<string>;
    toLowerCase(): ObservableChecker<string>;
    toTrimmed(): ObservableChecker<string>;
    toBoolean(): ObservableChecker<boolean>;
    toLiteral(template: string, placeholder?: string): ObservableChecker<string>;
    toFormatted(template: string, placeholder?: string): ObservableChecker<string>;
    toProperty<U = any>(path: string): ObservableChecker<U>;
    toLength(): ObservableChecker<number>;
    toClamped(min: number | ObservableItem<number>, max: number | ObservableItem<number>): ObservableChecker<number>;
    toPercent(total: number | ObservableItem<number>): ObservableChecker<number>;

    toString(): string;
    valueOf(): T;
    equals(value: any): boolean;
    toBool(): boolean;
    toggle(): void;
    reset(): void;
}

export class ObservableWhen<T = any> {
    readonly __$isObservableWhen: true;
    private $target: T;
    private $observer: ObservableItem<T>;

    constructor(observer: ObservableItem<T>, value: T);

    /** Does NOT return an unsubscribe function — use .off() on the underlying observer. */
    subscribe(callback: (value: boolean) => void): void;
    val(): boolean;
    isMatch(): boolean;
    isActive(): boolean;
}

export interface ObservableOperation {
    action?: string;
    args?: any[];
    result?: any;
}

export interface ObservableChecker<T = any> {
    readonly __$Observable: true;
    readonly __$isObservableChecker: true;

    /** Does NOT return an unsubscribe function. */
    subscribe(callback: (value: T) => void): void;
    check<U>(callback: (value: T) => U): ObservableChecker<U>;
    val(): T;
    toNdElement(): Text;

    set(value: any): void;
    trigger(): void;
    cleanup(): void;
}

export interface ObservableArray<T> extends ObservableItem<T[]> {
    readonly length: number;
    readonly __$isObservableArray: true;

    push(...items: T[]): number;
    pop(): T | undefined;
    shift(): T | undefined;
    unshift(...items: T[]): number;
    reverse(): T[];
    sort(compareFn?: (a: T, b: T) => number): T[];
    splice(start: number, deleteCount?: number, ...items: T[]): T[];

    empty(): boolean;
    clear(): boolean;
    merge(values: T[]): void;
    removeItem(item: T): T[];
    remove(index: number): T[];
    swap(indexA: number, indexB: number): boolean;
    swapItems(itemA: T, itemB: T): boolean;
    insertAfter(item: T, afterItem: T): T[];
    count(condition: (item: T, index?: number) => boolean): number;
    populateAndRender(items: T[], factory: any, options: any): void;

    map<U>(callback: (value: T, index: number, array: T[]) => U): U[];
    forEach(callback: (value: T, index: number, array: T[]) => void): void;
    filter(callback: (value: T, index: number, array: T[]) => boolean): T[];
    reduce<U>(callback: (acc: U, value: T, index: number, array: T[]) => U, initial: U): U;
    some(callback: (value: T, index: number, array: T[]) => boolean): boolean;
    every(callback: (value: T, index: number, array: T[]) => boolean): boolean;
    find(callback: (value: T, index: number, array: T[]) => boolean): T | undefined;
    at(index: number): T | undefined;
    findIndex(callback: (value: T, index: number, array: T[]) => boolean): number;
    concat(...items: (T | T[])[]): T[];
    indexOf(item: T): number;
    includes(item: T): boolean;

    where(predicates: PredicateMap<T> | ((item: T) => boolean)): ObservableArray<T>;
    whereSome<K extends keyof T>(fields: K[], filter: FilterResult<T[K]>): ObservableArray<T>;
    whereEvery<K extends keyof T>(fields: K[], filter: FilterResult<T[K]>): ObservableArray<T>;

    /** Returns an unsubscribe function that stops all deep observation. */
    deepSubscribe(callback: (value: T[]) => void): Unsubscribe;

    /** One-way sync — pushes mutations from this array to the target. Returns unsubscribe. */
    sync(target: ObservableArray<T>): Unsubscribe;

    clone(): ObservableArray<T>;
    isNotEmpty(): ObservableChecker<boolean>;
}

export type ObservableObject<T extends Record<string, any>> = ObservableItem<T> & {
    readonly __$isObservableObject: true;
    readonly __isProxy__: true;
    readonly $observables: { [K in keyof T]: ObservableItem<T[K]> };
    readonly configs: ObservableConfig | null;

    $load(initialValue: Partial<T>): void;
    $val(): T;
    val(): T;
    get(key: string): any;
    $get(key: string): any;
    set(values: Partial<T>): void;
    $set(values: Partial<T>): void;
    $updateWith(values: Partial<T>): void;
    update(values: Partial<T>): void;
    reset(): void;
    clone(): ObservableObject<T>;
    $clone(): ObservableObject<T>;
    keys(): string[];
    $keys(): string[];
    observables(): ObservableItem<any>[];

    /**
     * Subscribing to an ObservableObject also deep-subscribes to all nested
     * observables and observable arrays — triggers on any nested change.
     */
    subscribe(callback: (current: T, previous: T, operations?: ObservableOperation) => void): void;
} & {
    [K in keyof T]: T[K] extends (infer U)[]
        ? ObservableArray<U>
        : T[K] extends Record<string, any>
            ? ObservableObject<T[K]>
            : ObservableItem<T[K]>;
};

// -- ObservableResource ---------------------------------------------------------

export type ResourceState = 'unresolved' | 'pending' | 'ready' | 'refreshing' | 'errored';

export interface ObservableResourceConfig<T = any> {
    auto?: boolean;
    lazy?: boolean;
    debounce?: number;
    into?: ObservableItem<T>;
    apply?: (result: any, data: ObservableItem<T>) => void;
}

export interface ObservableResource<T = any> {
    readonly data: ObservableItem<T>;
    readonly error: ObservableItem<Error | null>;
    readonly state: ObservableItem<ResourceState>;
    readonly loading: ObservableItem<boolean>;

    fetch(): this;
    refetch(): this;
    mutate(value: T): this;
    into(target: ObservableItem<T>): this;
    apply(callback: (result: any, data: ObservableItem<T>) => void): this;
    destroy(): void;

    isReady(): ObservableChecker<boolean>;
    isPending(): ObservableChecker<boolean>;
    isRefreshing(): ObservableChecker<boolean>;
    isErrored(): ObservableChecker<boolean>;
    isUnresolved(): ObservableChecker<boolean>;

    onSuccess(callback: (data: T) => void): this;
    onError(callback: (error: Error) => void): this;
}

export interface BatchFunction<TArgs extends any[] = any[], TReturn = any> {
    (...args: TArgs): TReturn;
    readonly $observer: ObservableItem<number>;
}

export type ValidComputedDependencies = Array<ObservableItem | ObservableArray<any> | ObservableChecker | ObservableObject<any>>;

export interface AutoCleanupOptions {
    interval?: number;
    threshold?: number;
}

export interface ObservableConfig {
    deep?: boolean;
    reset?: boolean;
    propagation?: boolean;
}

export interface ObservableStatic {
    <T>(value: T, configs?: ObservableConfig | null): ObservableItem<T>;
    array<T>(target: T[] | null, configs?: ObservableConfig | null): ObservableArray<T>;

    init<T extends Record<string, any>>(value: T, configs?: ObservableConfig | null): ObservableObject<T>;
    object<T extends Record<string, any>>(value: T, configs?: ObservableConfig | null): ObservableObject<T>;
    json<T extends Record<string, any>>(value: T, configs?: ObservableConfig | null): ObservableObject<T>;

    resource<T = any>(
        fn: (...args: any[]) => Promise<T>,
        dependencies?: ValidComputedDependencies,
        config?: ObservableResourceConfig<T> | boolean,
    ): ObservableResource<T>;

    computed<T>(callback: (...values: any[]) => T, dependencies?: ValidComputedDependencies | BatchFunction): ObservableItem<T>;
    computed<T>(callback: (...values: any[]) => T, batchFunction?: BatchFunction): ObservableItem<T>;

    batch<TArgs extends any[], TReturn>(
        callback: (...args: TArgs) => TReturn
    ): BatchFunction<TArgs, TReturn>;

    value(data: any): any;
    update(target: any, data: any): void;
    setLocale(locale: string | ObservableItem<string>): void;
    useValueProperty(propertyName?: string): void;

    getById(id: number): ObservableItem | null;
    cleanup(observable: ObservableItem): void;
    autoCleanup(enable?: boolean, options?: AutoCleanupOptions): void;
    arrayOfObject<T extends Record<string, any>>(data: T[]): ObservableObject<T>[];
}