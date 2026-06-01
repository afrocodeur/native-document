import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { MenuInterface } from '../../menu/types/Menu';
import type { GlobalAttributes } from '../../../../types/globals';

export type ContextMenuDescription = { props: GlobalAttributes; };

export interface ContextMenuInterface extends BaseComponent {
    position(x: number, y: number): this;
    trigger(trigger: HTMLElement): this;
    menu(callback: (menu: MenuInterface) => void, props?: Record<string, unknown>): this;
    hide(): this;
    show(): this;

    render(renderFn: (description: ContextMenuDescription, instance: ContextMenuInterface) => ValidChild): this;
}


export declare function ContextMenu(props?: Record<string, unknown>): ContextMenuInterface;
export declare namespace ContextMenu {


    function use(
    function template: (description: ContextMenuDescription, instance: ContextMenuInterface) => ValidChild,
    handler: Function
    ): void;


}
