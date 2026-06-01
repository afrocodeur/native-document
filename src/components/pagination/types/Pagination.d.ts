import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type PaginationDescription = {
        currentPage: ObservableItem<number>;
        pages: ObservableItem<number[]>;
        totalPages: ObservableItem<number>;
        pageSize: ObservableItem<number>;
        totalItems: ObservableItem<number>;
        siblingCount: number;
        boundaryCount: number;
        showFirstLast: boolean;
        showPreviousNext: boolean;
        disabled: boolean;
        data: unknown | null;
        renderPage: ((page: number, isActive: boolean) => ValidChild) | null;
        renderEllipsis: (() => ValidChild) | null;
        renderPrevious: (() => ValidChild) | null;
        renderNext: (() => ValidChild) | null;
        renderFirst: (() => ValidChild) | null;
        renderLast: (() => ValidChild) | null;
        render: ((desc: PaginationDescription, instance: PaginationInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface PaginationInterface extends BaseComponent {
    currentPage(page: number | ObservableItem<number>): this;
    totalPages(total: number): this;
    pageSize(size: number | ObservableItem<number>): this;
    totalItems(total: number | ObservableItem<number>): this;
    siblingCount(count: number): this;
    boundaryCount(count: number): this;
    showFirstLast(show?: boolean): this;
    showPreviousNext(show?: boolean): this;
    disabled(disabled?: boolean): this;
    data(data: unknown): this;
    goToPage(page: number): this;
    next(): this;
    previous(): this;
    first(): this;
    last(): this;
    hasNext(): boolean;
    hasPrevious(): boolean;
    getPageNumbers(): number[];
    onPageChange(handler: (page: number) => void): this;
    onChange(handler: (page: number) => void): this;
    renderPage(renderFn: (page: number, isActive: boolean) => ValidChild): this;
    renderEllipsis(renderFn: () => ValidChild): this;
    renderPrevious(renderFn: () => ValidChild): this;
    renderNext(renderFn: () => ValidChild): this;
    renderFirst(renderFn: () => ValidChild): this;
    renderLast(renderFn: () => ValidChild): this;
    render(template: (description: PaginationDescription, instance: PaginationInterface) => ValidChild): this;
}


export declare function Pagination(props?: Record<string, unknown>): PaginationInterface;
export declare namespace Pagination {


    function use(template: (description: PaginationDescription, instance: PaginationInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: PaginationInterface) => PaginationInterface): void;
    function presets(presets: Record<string, (instance: PaginationInterface) => PaginationInterface>): void;


}
