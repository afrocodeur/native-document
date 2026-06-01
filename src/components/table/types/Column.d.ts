import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { GlobalAttributes } from '../../../../types/globals';

export type ColumnDescription = {
        key: string;
        align: 'left' | 'center' | 'right' | null;
        searchable: boolean | null;
        visible: ObservableItem<boolean> | boolean | null;
        header: ValidChild | null;
        render: ((value: unknown, row: unknown, index: number) => ValidChild) | null;
        colspan: number | null;
        pinned: 'left' | 'right' | null;
        rowspan: number | null;
        sortable: boolean | ((a: unknown, b: unknown) => number) | null;
        onClick: ((value: unknown, row: unknown, event: MouseEvent) => void) | null;
        props: GlobalAttributes;
    };

export interface ColumnInterface {
    sortable(customSortFn?: ((a: unknown, b: unknown) => number) | null): this;
    searchable(): this;
    hidden(): this;
    props(props?: Record<string, unknown>): this;
    pinned(orientation: 'left' | 'right'): this;
    pinnedAtLeft(): this;
    pinnedAtRight(): this;
    visible(condition?: boolean | ObservableItem<boolean>): this;
    align(align: 'left' | 'center' | 'right'): this;
    center(): this;
    right(): this;
    header(template: ValidChild): this;
    title(title: ValidChild): this;
    colspan(count: number): this;
    rowspan(count: number): this;
    render(fn: (value: unknown, row: unknown, index: number) => ValidChild): this;
    value(fn: (row: unknown) => unknown): this;
    onClick(handler: (value: unknown, row: unknown, event: MouseEvent) => void): this;
}


export declare function Column(key: string, props?: Record<string, unknown>): ColumnInterface;
export declare namespace Column {


    function use(template: (description: ColumnDescription, instance: ColumnInterface) => ValidChild): void;


}
