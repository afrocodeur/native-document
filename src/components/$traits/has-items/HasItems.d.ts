import type { ObservableItem } from '../../../types/observable';

export interface HasItems {
    dynamic(observableArray?: ObservableItem<unknown[]> | null): this;
    bind(observableArray?: ObservableItem<unknown[]> | null): this;
    items(items: unknown[]): this;
    clear(): this;
    removeItem(item: unknown): this;
}
