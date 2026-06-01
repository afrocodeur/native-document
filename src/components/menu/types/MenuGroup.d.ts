import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { MenuItemInterface } from './MenuItem';
import type { MenuDividerInterface } from './MenuDivider';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuGroupDescription = {
        icon: ValidChild | null;
        label: ValidChild;
        data: unknown | null;
        items: ObservableItem<Array<MenuItemInterface | MenuDividerInterface>>;
        render: ((desc: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild) | null;
        collapsable: boolean;
        collapsed: boolean | null;
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
    divider(): this;
    visibility(mode: boolean | ObservableItem<boolean>): this;
    item(label: ValidChild, ...args: unknown[]): this;
    link(label: ValidChild, ...args: unknown[]): this;
    separator(): this;
    add(item: MenuItemInterface | MenuDividerInterface): this;
    render(template: (description: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild): this;
}


export declare function MenuGroup(label: ValidChild, props?: Record<string, unknown>): MenuGroupInterface;
export declare namespace MenuGroup {


    function use(template: (description: MenuGroupDescription, instance: MenuGroupInterface) => ValidChild): void;


}
