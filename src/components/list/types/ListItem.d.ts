import type { ValidChild }      from '../../../../types/elements';
import type { ObservableItem }  from '../../../../types/observable';
import type { GlobalAttributes } from '../../../../types/globals';

export type ListItemDescription = {
    label:          ValidChild | null;
    subtitle:       ValidChild | null;
    icon:           ValidChild | null;
    trailing:       ValidChild | null;
    value:          unknown;
    data:           unknown | null;
    key:            string | null;
    disabled:       ObservableItem<boolean> | null;
    selected:       ObservableItem<boolean> | null;
    visibility:     ObservableItem<boolean> | null;
    isSelectedIcon: ValidChild | null;
    swipeLeading:   ValidChild[];
    swipeTrailing:  ValidChild[];
    render:         ((desc: ListItemDescription, instance: ListItemInterface) => ValidChild) | null;
    props:          GlobalAttributes;
};

export interface ListItemInterface {
    $description: ListItemDescription;
    $parent:      unknown;

    label(label: ValidChild): this;
    subtitle(subtitle: ValidChild): this;
    icon(icon: ValidChild): this;
    trailing(trailing: ValidChild): this;
    value(value: unknown): this;
    data(data: unknown): this;
    key(key: string): this;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    selected(selected?: boolean | ObservableItem<boolean>): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;
    isSelectedIcon(icon: ValidChild): this;
    swipeLeading(actions: ValidChild | ValidChild[]): this;
    swipeTrailing(actions: ValidChild | ValidChild[]): this;
    onClick(handler: (item: ListItemInterface, event: MouseEvent) => void): this;

    // HasEventEmitter
    on(event: string, handler: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): void;
    hasListeners(event: string): boolean;
}

export declare function ListItem(props?: GlobalAttributes): ListItemInterface;
export declare namespace ListItem {
    function use(template: (description: ListItemDescription, instance: ListItemInterface) => ValidChild): void;
    let defaultTemplate: ((description: ListItemDescription, instance: ListItemInterface) => ValidChild) | null;
}