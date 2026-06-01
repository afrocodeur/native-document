import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ListItemDescription = {
        content: ValidChild | null;
        icon: ValidChild | null;
        trailing: ValidChild | null;
        leading: ValidChild | null;
        disabled: boolean;
        selectable: boolean;
        selected: boolean | ObservableItem<boolean>;
        divider: boolean;
        data: unknown | null;
        render: ((desc: ListItemDescription, instance: ListItemInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface ListItemInterface extends BaseComponent {
    content(content: ValidChild): this;
    label(label: ValidChild): this;
    icon(icon: ValidChild): this;
    leading(leading: ValidChild): this;
    trailing(trailing: ValidChild): this;
    disabled(disabled?: boolean): this;
    selectable(): this;
    selected(selected?: boolean | ObservableItem<boolean>): this;
    divider(show?: boolean): this;
    data(data: unknown): this;
    render(renderFn: (desc: ListItemDescription, instance: ListItemInterface) => ValidChild): this;
}


export declare function ListItem(content?: ValidChild, config?: Record<string, unknown>): ListItemInterface;
export declare namespace ListItem {


    function use(template: (description: ListItemDescription, instance: ListItemInterface) => ValidChild): void;


}
