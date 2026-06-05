import { GlobalAttributes, Observable } from '../../../../types/globals';
import { ValidChild } from '../../../../types/elements';
import { ObservableArray } from '../../../../types/observable';

export interface ListItemDescription {
    label:          ValidChild | null;
    subtitle:       ValidChild | null;
    icon:           ValidChild | null;
    trailing:       ValidChild | null;
    value:          unknown;
    data:           unknown | null;
    key:            string | null;
    disabled:       Observable<boolean> | null;
    selected:       Observable<boolean> | null;
    visibility:     Observable<boolean> | null;
    isSelectedIcon: ValidChild | null;
    swipeLeading:   ValidChild[];
    swipeTrailing:  ValidChild[];
    render:         ((desc: ListItemDescription, instance: ListItem) => ValidChild) | null;
    props:          GlobalAttributes;
}

export declare class ListItem {
    $description: ListItemDescription;
    $parent: unknown;

    constructor(props?: GlobalAttributes);

    static use(template: (description: ListItemDescription, instance: ListItem) => ValidChild): void;
    static defaultTemplate: ((description: ListItemDescription, instance: ListItem) => ValidChild) | null;

    label(label: ValidChild): this;
    subtitle(subtitle: ValidChild): this;
    icon(icon: ValidChild): this;
    trailing(trailing: ValidChild): this;
    value(value: unknown): this;
    data(data: unknown): this;
    key(key: string): this;
    disabled(disabled?: boolean | Observable<boolean>): this;
    selected(selected?: boolean | Observable<boolean>): this;
    visibility(mode: boolean | Observable<boolean>): this;
    isSelectedIcon(icon: ValidChild): this;
    swipeLeading(actions: ValidChild | ValidChild[]): this;
    swipeTrailing(actions: ValidChild | ValidChild[]): this;
    onClick(handler: (item: ListItem, event: MouseEvent) => void): this;

    // HasEventEmitter
    on(event: string, handler: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): void;
    hasListeners(event: string): boolean;
}

export declare function ListItem(props?: GlobalAttributes): ListItem;
