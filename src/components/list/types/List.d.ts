import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { ListItemInterface } from './ListItem';
import type { GlobalAttributes } from '../../../../types/globals';

export type ListDescription = {
        selectable: boolean;
        multiSelect: boolean;
        selectedValues: ObservableItem<unknown[]> | null;
        inset: boolean;
        divider: boolean;
        data: unknown | null;
        render: ((desc: ListDescription, instance: ListInterface) => ValidChild) | null;
        selectByCheckbox: boolean;
        selectByClick: boolean;
        loopOnKeyboard: boolean;
        props: GlobalAttributes;
    };

export interface ListInterface extends BaseComponent {
    selectable(selectable?: boolean): this;
    selectByClick(): void;
    selectByCheckbox(): void;
    multiSelect(multi?: boolean): this;
    selectedValuesModel(observable: ObservableItem<unknown[]>): this;
    inset(inset?: boolean): this;
    withDivider(divider?: boolean): this;
    data(data: unknown): this;
    onItemClick(handler: (item: ListItemInterface, event: MouseEvent) => void): this;
    onItemSelect(handler: (item: ListItemInterface) => void): this;
    render(template: (description: ListDescription, instance: ListInterface) => ValidChild): this;
}


export declare function List(config?: Record<string, unknown>): ListInterface;
export declare namespace List {


    function use(template: (description: ListDescription, instance: ListInterface) => ValidChild): void;


}
