import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type DropdownItemDescription = {
        icon: ValidChild | null;
        content: ValidChild | null;
        shortcut: ValidChild | null;
        value: unknown;
        disabled: boolean | ObservableItem<boolean>;
        selected: boolean | ObservableItem<boolean>;
        data: unknown;
        render: ((desc: DropdownItemDescription, instance: DropdownItemInterface) => ValidChild) | null;
        renderContent: ((item: DropdownItemInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface DropdownItemInterface extends BaseComponent {
    value(value: unknown): this;
    getValue(): unknown;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    selected(selected?: boolean | ObservableItem<boolean>): this;
    icon(icon: ValidChild): this;
    content(content: ValidChild): this;
    data(data: unknown): this;
    getData(): unknown;
    shortcut(shortcut: ValidChild): this;
    render(template: (description: DropdownItemDescription, instance: DropdownItemInterface) => ValidChild): this;
    renderContent(callback: (item: DropdownItemInterface) => ValidChild): this;
}


export declare function DropdownItem(props?: Record<string, unknown>): DropdownItemInterface;
export declare namespace DropdownItem {


    function use(template: (description: DropdownItemDescription, instance: DropdownItemInterface) => ValidChild): void;


}
