import { ObservableItem } from './observable';
import { Set } from "./polyfill";

export type StoreGroupInstance = StoreStatic & {
    readonly $name: string;
};

export type StoreReadonlyInstance = Omit<StoreStatic,
    | 'use'
    | 'get'
    | 'create'
    | 'createResettable'
    | 'createComposed'
    | 'createPersistent'
    | 'createPersistentResettable'
    | 'delete'
    | 'reset'
> & {
    use(name: string): never;
    get(name: string): never;
    create(name: string, value: unknown): never;
    createResettable(name: string, value: unknown): never;
    createComposed(name: string, computation: () => unknown, dependencies: unknown[]): never;
    createPersistent(name: string, value: unknown, localStorageKey?: string): never;
    createPersistentResettable(name: string, value: unknown, localStorageKey?: string): never;
    delete(name: string): never;
    reset(name: string): never;
};

export interface StoreStatic {
    create<T>(name: string, value: T): ObservableItem<T>;
    createResettable<T>(name: string, value: T): ObservableItem<T>;
    createComposed<T>(
        name: string,
        computation: () => T,
        dependencies: (string | ObservableItem<unknown>)[]
    ): ObservableItem<T>;
    createPersistent<T>(name: string, value: T, localStorageKey?: string): ObservableItem<T>;
    createPersistentResettable<T>(name: string, value: T, localStorageKey?: string): ObservableItem<T>;

    has(name: string): boolean;
    get<T>(name: string): ObservableItem<T> | null;
    getWithSubscribers<T>(name: string): {
        observer: ObservableItem<T>;
        subscribers: Set<ObservableItem<T>>;
    } | null;

    use<T>(name: string): ObservableItem<T>;
    follow<T>(name: string): Readonly<ObservableItem<T>>;

    reset(name: string): void;
    delete(name: string): void;

    group(callback: (group: StoreGroupInstance) => void): StoreGroupInstance;
    group(name: string, callback: (group: StoreGroupInstance) => void): StoreGroupInstance;

    protected(): StoreReadonlyInstance;

    readonly [key: string]: ObservableItem<unknown> | unknown;
}

export declare const StoreFactory: () => StoreStatic;
export declare const Store: StoreStatic;