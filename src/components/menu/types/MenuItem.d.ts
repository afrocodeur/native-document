import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuItemDescription = {
        key: string | null;
        action: string | Record<string, unknown> | null;
        label: ValidChild | null;
        icon: ValidChild | null;
        shortcut: ValidChild | null;
        disabled: ObservableItem<boolean> | boolean | null;
        selected: ObservableItem<boolean> | boolean | null;
        value: unknown;
        data: unknown | null;
        render: ((desc: MenuItemDescription, instance: MenuItemInterface) => ValidChild) | null;
        trailing: ValidChild | null;
        visibility: ObservableItem<boolean> | null;
        props: GlobalAttributes;
    };

export interface MenuItemInterface extends BaseComponent {
    label(label: ValidChild): this;
    icon(icon: ValidChild): this;
    trailing(trailing: ValidChild): this;
    shortcut(shortcut: ValidChild): this;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    selected(selected?: boolean | ObservableItem<boolean>): this;
    value(value: unknown): this;
    action(action: string | Record<string, unknown>): this;
    data(data: unknown): this;
    divider(): this;
    key(key: string): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;
    render(template: (description: MenuItemDescription, instance: MenuItemInterface) => ValidChild): this;
}


export declare function MenuItem(props?: Record<string, unknown>): MenuItemInterface;
export declare namespace MenuItem {


    function use(template: (description: MenuItemDescription, instance: MenuItemInterface) => ValidChild): void;


}
