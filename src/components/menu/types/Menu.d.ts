import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { MenuItemInterface } from './MenuItem';
import type { MenuGroupInterface } from './MenuGroup';
import type { MenuLinkInterface } from './MenuLink';
import type { MenuDividerInterface } from './MenuDivider';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuDescription = {
        items: ObservableItem<Array<MenuItemInterface | MenuGroupInterface | MenuDividerInterface>>;
        render: ((desc: MenuDescription, instance: MenuInterface) => ValidChild) | null;
        orientation: 'horizontal' | 'vertical' | 'inline';
        closeOnSelect: boolean;
        keyboardLoop: boolean;
        activeItem: ObservableItem<MenuItemInterface | null>;
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
    group(label: ValidChild, icon: ValidChild, builder: (group: MenuGroupInterface) => void, props?: Record<string, unknown>): this;
    getItem(key: string): MenuItemInterface | undefined;
    compactThreshold(width?: number): this;
    clickFirst(mode?: boolean): this;
    item(label: ValidChild, ...args: unknown[]): this;
    link(label: ValidChild, ...args: unknown[]): this;
    separator(): this;
    divider(): this;
    add(item: MenuItemInterface | MenuGroupInterface | MenuLinkInterface | MenuDividerInterface): this;
    getDepth(): number;
    getRoot(): unknown;
    onClicked(): this;
    onHovered(): this;
    render(template: (description: MenuDescription, instance: MenuInterface) => ValidChild): this;
}


export declare function Menu(props?: Record<string, unknown>): MenuInterface;
export declare namespace Menu {


    function use(template: (description: MenuDescription, instance: MenuInterface) => ValidChild): void;


}
