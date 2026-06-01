import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { ColumnInterface } from './Column';
import type { ColumnGroupInterface } from './ColumnGroup';
import type { GlobalAttributes } from '../../../../types/globals';

export type DataTableDescription = {
        header: Array<ColumnInterface | ColumnGroupInterface>;
        columns: ColumnInterface[];
        hasGroups: boolean;
        data: unknown[] | ObservableItem<unknown[]> | null;
        total: number | ObservableItem<number> | null;
        mode: 'client' | 'server';
        loading: boolean | ObservableItem<boolean> | null;
        error: ValidChild | null;
        defaultSort: { col: string; dir: 'asc' | 'desc' } | null;
        multiSort: boolean;
        searchable: boolean;
        filterable: boolean;
        defaultFilters: Record<string, unknown> | null;
        pageSize: number | null;
        pageSizes: number[] | null;
        defaultPage: number;
        selectable: boolean;
        multiSelect: boolean;
        editable: boolean;
        expandable: ((row: unknown) => ValidChild) | null;
        masterDetail: ((row: unknown) => ValidChild) | null;
        bulkActions: Array<{ label: ValidChild; action: (rows: unknown[]) => void }> | null;
        rowProps: ((row: unknown) => GlobalAttributes) | null;
        empty: ValidChild | null;
        layout: ((desc: DataTableDescription, instance: DataTableInterface) => ValidChild) | null;
        labels: Record<string, string>;
        props: GlobalAttributes;
    };

export interface DataTableInterface extends BaseComponent {
    column(key: string, title: ValidChild, props?: Record<string, unknown>, callback?: (col: ColumnInterface) => void): this;
    group(title: ValidChild, callback: (group: ColumnGroupInterface) => void): this;
    data(data: unknown[] | ObservableItem<unknown[]>): this;
    total(total: number | ObservableItem<number>): this;
    clientSide(): this;
    serverSide(): this;
    loading(loading: boolean | ObservableItem<boolean>): this;
    error(error: ValidChild | string): this;
    defaultSort(col: string, dir?: 'asc' | 'desc'): this;
    multiSort(enabled?: boolean): this;
    onSort(handler: (col: string, dir: 'asc' | 'desc') => void): this;
    searchable(enabled?: boolean): this;
    filterable(enabled?: boolean): this;
    defaultFilters(filters: Record<string, unknown>): this;
    onSearch(handler: (query: string) => void): this;
    onFilter(handler: (filters: unknown) => void): this;
    pagination(pageSize: number): this;
    pageSizes(sizes: number[]): this;
    defaultPage(page: number): this;
    onPage(handler: (page: number, pageSize: number) => void): this;
    selectable(enabled?: boolean): this;
    multiSelect(enabled?: boolean): this;
    selectedRows(obs: ObservableItem<unknown[]>): this;
    onSelect(handler: (rows: unknown[]) => void): this;
    editable(enabled?: boolean): this;
    onEdit(handler: (row: unknown, col: string, value: unknown) => void): this;
    onEditCancel(handler: () => void): this;
    export(label: ValidChild, format: 'csv' | 'xlsx' | string, filename?: string): this;
    exportFileName(name: string): this;
    onExport(handler: (format: string) => void): this;
    expandable(renderFn: (row: unknown) => ValidChild, isExpandedIcon?: ValidChild, isNotExpandedIcon?: ValidChild): this;
    masterDetail(renderFn: (row: unknown) => ValidChild): this;
    bulkActions(actions: Array<{ label: ValidChild; action: (rows: unknown[]) => void }>): this;
    render(renderFn: (description: DataTableDescription, instance: DataTableInterface) => ValidChild): this;
    rowProps(fn: (row: unknown) => Record<string, unknown>): this;
    onRowClick(handler: (row: unknown, event: MouseEvent) => void): this;
    onRowDoubleClick(handler: (row: unknown, event: MouseEvent) => void): this;
    onRowHover(handler: (row: unknown, event: MouseEvent) => void): this;
    render(renderFn: (desc: DataTableDescription, instance: DataTableInterface) => ValidChild): this;
    layout(layoutFn: (desc: DataTableDescription, instance: DataTableInterface) => ValidChild): this;
    labels(labels: Record<string, string>): this;
    persist(key: string, options?: Record<string, unknown>): this;
    refresh(): this;
    clearSelection(): this;
    clearFilters(): this;
    goToPage(page: number): this;
    empty(content: ValidChild): this;
}


export declare function DataTable(props?: Record<string, unknown>): DataTableInterface;
export declare namespace DataTable {


    function use(template: (description: DataTableDescription, instance: DataTableInterface) => ValidChild): void;
    function create(props?: Record<string, unknown>): DataTableInterface;


}
