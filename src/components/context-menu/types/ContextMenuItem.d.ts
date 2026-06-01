import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { MenuItemInterface, MenuItemDescription } from '../../menu/types/MenuItem';


export interface ContextMenuItemInterface extends MenuItemInterface {
    render(renderFn: (description: MenuItemDescription, instance: ContextMenuItemInterface) => ValidChild): this;
}


export declare function ContextMenuItem(config?: Record<string, unknown>): ContextMenuItemInterface;
export declare namespace ContextMenuItem {


    function use(template: (description: MenuItemDescription, instance: ContextMenuItemInterface) => ValidChild): void;


}
