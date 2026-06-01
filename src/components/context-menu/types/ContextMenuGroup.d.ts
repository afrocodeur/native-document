import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { MenuGroupInterface, MenuGroupDescription } from '../../menu/types/MenuGroup';


export interface ContextMenuGroupInterface extends MenuGroupInterface {
    render(renderFn: (description: MenuGroupDescription, instance: ContextMenuGroupInterface) => ValidChild): this;
}


export declare function ContextMenuGroup(label: ValidChild, config?: Record<string, unknown>): ContextMenuGroupInterface;
export declare namespace ContextMenuGroup {


    function use(template: (description: MenuGroupDescription, instance: ContextMenuGroupInterface) => ValidChild): void;


}
