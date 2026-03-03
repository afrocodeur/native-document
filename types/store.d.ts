import { ObservableItem } from './observable';
import { Set } from "./polyfill";

export type StoreGroupInstance = StoreStatic & {
    readonly $name: string;
};

export interface StoreStatic {
    create<T>(name: string, value: T): ObservableItem<T>;
    createResettable<T>(name: string, value: T): ObservableItem<T>;
    createComposed<T>(
        name: string,
        computation: () => T,
        dependencies: (string | ObservableItem<any>)[]
    ): ObservableItem<T>;

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

    readonly [key: string]: ObservableItem<any> | unknown;
}

export declare const StoreFactory: () => StoreStatic;
export declare const Store: StoreStatic;