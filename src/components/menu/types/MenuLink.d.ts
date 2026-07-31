import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { MenuItemInterface, MenuItemDescription } from './MenuItem';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuLinkOptions = {
    icon?: ValidChild;
    /** URL string or named route name. Used as-is for link(), wrapped in { isRoute: true } for linkTo(). */
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top' | string;
    shortcut?: ValidChild;
    disabled?: boolean | ObservableItem<boolean>;
};

export type MenuLinkDescription = MenuItemDescription & {
    target: '_blank' | '_self' | '_parent' | '_top' | string | null;
};

export interface MenuLinkInterface extends MenuItemInterface {
    target(target: '_blank' | '_self' | '_parent' | '_top' | string): this;
}

export declare function MenuLink(props?: GlobalAttributes): MenuLinkInterface;
export declare namespace MenuLink {
    function use(template: (description: MenuLinkDescription, instance: MenuLinkInterface) => ValidChild): void;
}