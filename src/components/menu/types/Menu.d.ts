import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { MenuItemInterface, MenuItemOptions } from './MenuItem';
import type { MenuGroupInterface } from './MenuGroup';
import type { MenuLinkInterface, MenuLinkOptions } from './MenuLink';
import type { MenuDividerInterface } from './MenuDivider';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuDescription = {
    items: ObservableItem<Array<MenuItemInterface | MenuGroupInterface | MenuDividerInterface>>;
    render: ((desc: MenuDescription, instance: MenuInterface) => ValidChild) | null;
    orientation: 'horizontal' | 'vertical' | 'inline';
    closeOnSelect: boolean;
    keyboardLoop: boolean;
    activeItem: ObservableItem<MenuItemInterface | null>;
    /** Observable tracking which item currently has an open submenu. */
    menuActive: ObservableItem<MenuItemInterface | null>;
    /** True once the user has clicked to activate hover-open behaviour. */
    isMenuActivated: ObservableItem<boolean>;
    /** Null until ResizeObserver fires; then true when below compactThreshold. */
    compact: ObservableItem<boolean | null>;
    active: ((item: MenuItemInterface) => boolean) | null;
    compactThreshold: number;
    clickFirst: boolean;
    props: GlobalAttributes;
};

export interface MenuInterface extends BaseComponent {
    dataResolver(resolver: (data: unknown) => unknown): this;
    title(title: ValidChild): this;
    orientation(orientation: 'horizontal' | 'vertical' | 'inline'): this;
    horizontal(): this;
    vertical(): this;
    inline(): this;
    closeOnSelect(close?: boolean): this;
    keyboardLoop(keyboardLoop?: boolean): this;
    data(data: unknown): this;
    active(callback: (item: MenuItemInterface) => boolean): this;
    onItemClick(handler: (item: MenuItemInterface, event: MouseEvent) => void): this;
    onItemSelect(handler: (item: MenuItemInterface) => void): this;
    group(label: ValidChild, icon: ValidChild, builder: (group: MenuGroupInterface) => void, props?: GlobalAttributes): this;
    getItem(key: string): MenuItemInterface | undefined;
    compactThreshold(width?: number): this;
    clickFirst(mode?: boolean): this;

    item(label: ValidChild): this;
    item(label: ValidChild, configBuilder: (item: MenuItemInterface) => void): this;
    item(label: ValidChild, options: MenuItemOptions): this;
    item(label: ValidChild, options: MenuItemOptions, configBuilder: (item: MenuItemInterface) => void): this;
    item(label: ValidChild, options: MenuItemOptions, configBuilder: (item: MenuItemInterface) => void, props: GlobalAttributes): this;

    link(label: ValidChild): this;
    link(label: ValidChild, configBuilder: (item: MenuLinkInterface) => void): this;
    link(label: ValidChild, options: MenuLinkOptions): this;
    link(label: ValidChild, options: MenuLinkOptions, configBuilder: (item: MenuLinkInterface) => void): this;
    link(label: ValidChild, options: MenuLinkOptions, configBuilder: (item: MenuLinkInterface) => void, props: GlobalAttributes): this;

    linkTo(label: ValidChild): this;
    linkTo(label: ValidChild, configBuilder: (item: MenuLinkInterface) => void): this;
    linkTo(label: ValidChild, options: MenuLinkOptions): this;
    linkTo(label: ValidChild, options: MenuLinkOptions, configBuilder: (item: MenuLinkInterface) => void): this;
    linkTo(label: ValidChild, options: MenuLinkOptions, configBuilder: (item: MenuLinkInterface) => void, props: GlobalAttributes): this;

    separator(): this;
    divider(): this;
    add(item: MenuItemInterface | MenuGroupInterface | MenuLinkInterface | MenuDividerInterface): this;
    getDepth(): number;
    getRoot(): MenuInterface;
    setParent(parent: MenuInterface | MenuGroupInterface): this;
    onClicked(): this;
    onHovered(): this;
}

export declare function Menu(props?: GlobalAttributes): MenuInterface;
export declare namespace Menu {
    function use(template: (description: MenuDescription, instance: MenuInterface) => ValidChild): void;
}