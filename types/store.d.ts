// Store system type definitions
import { ObservableItem } from './observable';
import {Set} from "./polyfill";

export interface StoreStatic {
    create<T>(name: string, value: T): ObservableItem<T>;
    use<T>(name: string): ObservableItem<T>;
    follow<T>(name: string): ObservableItem<T>;
    get<T>(name: string): ObservableItem<T> | null;
    getWithSubscribers<T>(name: string): { observer: ObservableItem<T>; subscribers: Set<ObservableItem<T>> } | undefined;
    delete(name: string): void;
}