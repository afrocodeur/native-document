import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { ColumnInterface } from './Column';
import type { ColumnGroupInterface } from './ColumnGroup';
import type { GlobalAttributes } from '../../../../types/globals';

export type SimpleTableDescription = {
        header: Array<ColumnInterface | ColumnGroupInterface>;
        columns: ColumnInterface[];
        hasGroups: boolean;
        data: unknown[] | ObservableItem<unknown[]> | null;
        empty: ValidChild | null;
        onRowClick: ((row: unknown, event: MouseEvent) => void) | null;
        rowProps: ((row: unknown) => GlobalAttributes) | null;
        noHeader: boolean | null;
        props: GlobalAttributes;
    };

export interface SimpleTableInterface extends BaseComponent {
    column(key: string, title: ValidChild, props?: Record<string, unknown>, callback?: (col: ColumnInterface) => void): this;
    group(title: ValidChild, callback: (group: ColumnGroupInterface) => void): this;
    data(data: unknown[] | ObservableItem<unknown[]>): this;
    empty(content: ValidChild): this;
    noHeader(): this;
    render(renderFn: (description: SimpleTableDescription, instance: SimpleTableInterface) => ValidChild): this;
    onRowClick(handler: (row: unknown, event: MouseEvent) => void): this;
    rowProps(fn: (row: unknown) => Record<string, unknown>): this;
}


export declare function SimpleTable(props?: Record<string, unknown>): SimpleTableInterface;
export declare namespace SimpleTable {


    function use(template: (description: SimpleTableDescription, instance: SimpleTableInterface) => ValidChild): void;
    function create(props?: Record<string, unknown>): SimpleTableInterface;


}
