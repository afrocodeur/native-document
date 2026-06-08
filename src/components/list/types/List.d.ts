import type { ValidChild }      from '../../../../types/elements';
import type { ObservableItem, ObservableArray } from '../../../../types/observable';
import type { GlobalAttributes } from '../../../../types/globals';
import type { ListItemInterface } from './ListItem';
import type { ListGroupInterface } from './ListGroup';
import type { ListDividerInterface } from './ListDivider';

export type ListDescription = {
    selectable:       ObservableItem<boolean>;
    multiSelect:      ObservableItem<boolean>;
    selectedValues:   ObservableArray<unknown>;
    inset:            ObservableItem<number>;
    divider:          boolean;
    items:            ObservableArray<unknown>;
    render:           ((desc: ListDescription, instance: ListInterface) => ValidChild) | null;
    selectByCheckbox: ObservableItem<boolean>;
    selectByClick:    ObservableItem<boolean>;
    loopOnKeyboard:   ObservableItem<boolean>;
    props:            GlobalAttributes;
};

export interface ListInterface {
    $description: ListDescription;

    // HasListItem
    selectable(selectable?: boolean | ObservableItem<boolean>): this;
    selectByClick(): this;
    selectByCheckbox(): this;
    multiSelect(multi?: boolean | ObservableItem<boolean>): this;
    selectInto(list: ObservableArray<unknown> | unknown[]): this;
    selectedValuesModel(observable: ObservableArray<unknown> | ObservableItem<unknown[]>): this;
    loopOnKeyboard(loopOnKeyboard: boolean): this;
    add(item: ListItemInterface | ListGroupInterface | ListDividerInterface): this;
    item(label: ValidChild, iconOrBuilder?: ValidChild | ((item: ListItemInterface) => void), builder?: (item: ListItemInterface) => void): this;
    group(label: ValidChild, iconOrBuilder?: ValidChild | ((group: ListGroupInterface) => void), builder?: (group: ListGroupInterface) => void): this;
    divider(): this;
    from(source: ObservableArray<unknown> | unknown[], builder: (item: unknown) => ListItemInterface | ListGroupInterface): this;

    // Own methods
    inset(inset?: number): this;
    withDivider(divider?: boolean): this;
    data(data: unknown): this;
    onItemClick(handler: (item: ListItemInterface, event: MouseEvent) => void): this;
    onItemSelect(handler: (item: ListItemInterface) => void): this;

    // HasEventEmitter
    on(event: string, handler: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): void;
    hasListeners(event: string): boolean;
}

export declare function List(props?: GlobalAttributes): ListInterface;
export declare namespace List {
    function use(template: (description: ListDescription, instance: ListInterface) => ValidChild): void;
    let defaultTemplate: ((description: ListDescription, instance: ListInterface) => ValidChild) | null;
}