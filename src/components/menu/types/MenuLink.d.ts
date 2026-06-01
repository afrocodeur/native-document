import type { ValidChild } from '../../../../types/elements';
import type { MenuItemInterface, MenuItemDescription } from './MenuItem';

export interface MenuLinkInterface extends MenuItemInterface {
    target(target: '_blank' | '_self' | '_parent' | '_top' | string): this;
}


export declare function MenuLink(props?: Record<string, unknown>): MenuLinkInterface;
export declare namespace MenuLink {


    function use(template: (description: MenuItemDescription, instance: MenuLinkInterface) => ValidChild): void;


}
