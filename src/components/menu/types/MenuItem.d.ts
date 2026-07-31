import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuItemOptions = {
    icon?: ValidChild;
    action?: string | Record<string, unknown> | ((data?: unknown) => void);
    shortcut?: ValidChild;
    disabled?: boolean | ObservableItem<boolean>;
};

export type MenuItemDescription = {
    key: string | null;
    action: string | Record<string, unknown> | ((data?: unknown) => void) | null;
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
    dataResolver: (() => unknown) | null;
    interaction: 'click' | 'hover' | null;
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
    action(action: string | Record<string, unknown> | ((data?: unknown) => void)): this;
    data(data: unknown): this;
    key(key: string): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;

    item(label: ValidChild): this;
    item(label: ValidChild, configBuilder: (item: MenuItemInterface) => void): this;
    item(label: ValidChild, options: MenuItemOptions): this;
    item(label: ValidChild, options: MenuItemOptions, configBuilder: (item: MenuItemInterface) => void): this;
    item(label: ValidChild, options: MenuItemOptions, configBuilder: (item: MenuItemInterface) => void, props: GlobalAttributes): this;

    link(label: ValidChild): this;
    link(label: ValidChild, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void): this;
    link(label: ValidChild, options: import('./MenuLink').MenuLinkOptions): this;
    link(label: ValidChild, options: import('./MenuLink').MenuLinkOptions, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void): this;
    link(label: ValidChild, options: import('./MenuLink').MenuLinkOptions, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void, props: GlobalAttributes): this;

    linkTo(label: ValidChild): this;
    linkTo(label: ValidChild, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void): this;
    linkTo(label: ValidChild, options: import('./MenuLink').MenuLinkOptions): this;
    linkTo(label: ValidChild, options: import('./MenuLink').MenuLinkOptions, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void): this;
    linkTo(label: ValidChild, options: import('./MenuLink').MenuLinkOptions, configBuilder: (item: import('./MenuLink').MenuLinkInterface) => void, props: GlobalAttributes): this;

    group(label: ValidChild, builder: (group: unknown) => void): this;
    separator(): this;
    divider(): this;
    add(item: unknown): this;
    getDepth(): number;
    getRoot(): unknown;
    setParent(parent: unknown): this;
    onClicked(): this;
    onHovered(): this;
    emit(eventName: string, ...args: unknown[]): void;
    render(template: (description: MenuItemDescription, instance: MenuItemInterface) => ValidChild): this;
}

export declare function MenuItem(props?: GlobalAttributes): MenuItemInterface;
export declare namespace MenuItem {
    function use(template: (description: MenuItemDescription, instance: MenuItemInterface) => ValidChild): void;
}