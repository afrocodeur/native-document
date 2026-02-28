// Store system type definitions
import { ObservableItem } from './observable';
import {Set} from "./polyfill";

export interface StoreStatic {
    create<T>(name: string, value: T): ObservableItem<T>;
    createResettable<T>(name: string, value: T): ObservableItem<T>;
    createComposed<T>(name: string, computation: () => T, dependencies: string[]): ObservableItem<T>;
    has(name: string): boolean;
    reset(name: string): void;
    use<T>(name: string): ObservableItem<T>;
    follow<T>(name: string): Readonly<ObservableItem<T>>;
    get<T>(name: string): ObservableItem<T> | null;
    getWithSubscribers<T>(name: string): { observer: ObservableItem<T>; subscribers: Set<ObservableItem<T>> } | null;
    delete(name: string): void;
}
