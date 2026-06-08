import type { ValidChild }      from '../../../../types/elements';
import type { ObservableItem, ObservableArray } from '../../../../types/observable';
import type { GlobalAttributes } from '../../../../types/globals';
import type { ListItemInterface } from './ListItem';
import type { ListDividerInterface } from './ListDivider';

export type ListGroupDescription = {
    label:                  ValidChild;
    icon:                   ValidChild | null;
    items:                  ObservableArray<unknown>;
    render:                 ((desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild) | null;
    collapsable:            boolean;
    collapsed:              ObservableItem<boolean> | null;
    collapsableOpenedIcon:  ValidChild | null;
    collapsableClosedIcon:  ValidChild | null;
    visibility:             ObservableItem<boolean>;
    selectable:             ObservableItem<boolean>;
    multiSelect:            ObservableItem<boolean>;
    selectedValues:         ObservableArray<unknown>;
    selectByCheckbox:       ObservableItem<boolean>;
    selectByClick:          ObservableItem<boolean>;
    loopOnKeyboard:         ObservableItem<boolean>;
    props:                  GlobalAttributes;
};

export interface ListGroupInterface {
    $description: ListGroupDescription;

    // Own methods
    icon(icon: ValidChild): this;
    collapsable(mode?: boolean, openedIcon?: ValidChild, closedIcon?: ValidChild): this;
    collapsed(mode?: boolean): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;
    data(data: unknown): this;

    // HasListItem
    selectable(selectable?: boolean | ObservableItem<boolean>): this;
    selectByClick(): this;
    selectByCheckbox(): this;
    multiSelect(multi?: boolean | ObservableItem<boolean>): this;
    selectInto(list: ObservableArray<unknown> | unknown[]): this;
    loopOnKeyboard(loopOnKeyboard: boolean): this;
    add(item: ListItemInterface | ListGroupInterface | ListDividerInterface): this;
    item(label: ValidChild, iconOrBuilder?: ValidChild | ((item: ListItemInterface) => void), builder?: (item: ListItemInterface) => void): this;
    group(label: ValidChild, iconOrBuilder?: ValidChild | ((group: ListGroupInterface) => void), builder?: (group: ListGroupInterface) => void): this;
    divider(): this;
    from(source: ObservableArray<unknown> | unknown[], builder: (item: unknown) => ListItemInterface | ListGroupInterface): this;

    // HasEventEmitter
    on(event: string, handler: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): void;
    hasListeners(event: string): boolean;
}

export declare function ListGroup(label: ValidChild, props?: GlobalAttributes): ListGroupInterface;
export declare namespace ListGroup {
    function use(template: (description: ListGroupDescription, instance: ListGroupInterface) => ValidChild): void;
    let defaultTemplate: ((description: ListGroupDescription, instance: ListGroupInterface) => ValidChild) | null;
}