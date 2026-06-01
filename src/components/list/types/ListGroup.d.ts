import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ListGroupDescription = {
        header: ValidChild | null;
        footer: ValidChild | null;
        items: unknown[];
        inset: boolean;
        data: unknown | null;
        renderHeader: ((desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild) | null;
        renderFooter: ((desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild) | null;
        render: ((desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface ListGroupInterface extends BaseComponent {
    header(header: ValidChild): this;
    title(title: ValidChild): this;
    footer(footer: ValidChild): this;
    inset(inset?: boolean): this;
    data(data: unknown): this;
    renderHeader(renderFn: (desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild): this;
    renderFooter(renderFn: (desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild): this;
    render(renderFn: (desc: ListGroupDescription, instance: ListGroupInterface) => ValidChild): this;
}


export declare function ListGroup(label?: ValidChild, config?: Record<string, unknown>): ListGroupInterface;
export declare namespace ListGroup {


    function use(template: (description: ListGroupDescription, instance: ListGroupInterface) => ValidChild): void;


}
