import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type DropdownTriggerDescription = {
        icon: ValidChild | null;
        content: ValidChild | null;
        stateOpenIcon: ValidChild | null;
        render: ((desc: DropdownTriggerDescription, instance: DropdownTriggerInterface) => ValidChild) | null;
        isOpen: ObservableItem<boolean> | null;
        props: GlobalAttributes;
    };

export interface DropdownTriggerInterface extends BaseComponent {
    setIsOpen(isOpenObservable: ObservableItem<boolean>): this;
    content(content: ValidChild): this;
    icon(icon: ValidChild): this;
    stateOpenIcon(openIcon: ValidChild): this;
    stateClosedIcon(closedIcon: ValidChild): this;
    render(renderFn: (desc: DropdownTriggerDescription, instance: DropdownTriggerInterface) => ValidChild): this;
}


export declare function DropdownTrigger(config?: Record<string, unknown>): DropdownTriggerInterface;
export declare namespace DropdownTrigger {


    function use(template: (description: DropdownTriggerDescription, instance: DropdownTriggerInterface) => ValidChild): void;


}
