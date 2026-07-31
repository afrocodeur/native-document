import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { MenuItemInterface, MenuItemOptions } from './MenuItem';
import type { MenuLinkInterface, MenuLinkOptions } from './MenuLink';
import type { MenuDividerInterface } from './MenuDivider';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuGroupDescription = {
    icon: ValidChild | null;
    label: ValidChild;
    data: unknown | null;
    items: ObservableItem<Array<MenuItemInterface | MenuDividerInterface>>;
    render: ((desc: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild) | null;
    collapsable: boolean;
    /**
     * Null until .collapsable() is called — then an ObservableItem<boolean>.
     * The render uses .toggle() and .transform() on this value; it is never
     * a plain boolean at runtime.
     */
    collapsed: ObservableItem<boolean> | null;
    visibility: ObservableItem<boolean>;
    collapsableOpenedIcon: ValidChild | null;
    collapsableClosedIcon: ValidChild | null;
    props: GlobalAttributes;
};

export interface MenuGroupInterface extends BaseComponent {
    data(data: unknown): this;
    icon(icon: ValidChild): this;
    collapsable(mode?: boolean, openedIcon?: ValidChild, closedIcon?: ValidChild): this;
    collapsed(mode?: boolean): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;

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

    group(label: ValidChild, builder: (group: MenuGroupInterface) => void): this;
    separator(): this;
    divider(): this;
    add(item: MenuItemInterface | MenuGroupInterface | MenuLinkInterface | MenuDividerInterface): this;
    getDepth(): number;
    getRoot(): unknown;
    setParent(parent: unknown): this;
    onClicked(): this;
    onHovered(): this;
    render(template: (description: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild): this;
}

export declare function MenuGroup(label: ValidChild, props?: GlobalAttributes): MenuGroupInterface;
export declare namespace MenuGroup {
    function use(template: (description: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild): void;
}