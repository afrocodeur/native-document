import { ObservableItem } from '../observable';

export interface FilterResult<T = any> {
    dependencies: ObservableItem | ObservableItem[] | null;
    callback: (value: T) => boolean;
}

export type ObservableOrValue<T> = T | ObservableItem<T>;

export type Predicate<T = any> =
    | T
    | ((value: T) => boolean)
    | FilterResult<T>
    | ObservableItem<T>;

export type PredicateMap<T> = {
    [K in keyof T]?: Predicate<T[K]>;
} & {
    _?: FilterResult<T>;
};