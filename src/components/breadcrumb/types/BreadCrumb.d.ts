import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

interface BreadCrumbItem {
    label: ValidChild;
    href?: string;
    value?: unknown;
}

export type BreadCrumbDescription = {
        separator: ValidChild | null;
        items: ObservableItem<Array<{ label: ValidChild; href?: string; value?: unknown }>>;
        renderSeparator: ((separator: unknown, instance: BreadCrumbInterface) => ValidChild) | null;
        renderItem: ((item: { label: ValidChild; href?: string; value?: unknown }, instance: BreadCrumbInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface BreadCrumbInterface extends BaseComponent {
    bind(source: ObservableItem<BreadCrumbItem[]> | BreadCrumbItem[]): this;
    item(label: ValidChild, href?: string, value?: unknown): this;
    items(items: BreadCrumbItem[]): this;
    removeItem(index: number): this;
    separator(separator: ValidChild): this;
    onItemClick(handler: (item: BreadCrumbItem, event: MouseEvent) => void): this;
    renderSeparator(renderFn: (separator: unknown, instance: BreadCrumbInterface) => ValidChild): this;
    renderItem(renderFn: (item: BreadCrumbItem, instance: BreadCrumbInterface) => ValidChild): this;
    render(template: (description: BreadCrumbDescription, instance: BreadCrumbInterface) => ValidChild): this;
}


export declare function BreadCrumb(props?: Record<string, unknown>): BreadCrumbInterface;
export declare namespace BreadCrumb {


    function use(template: (description: BreadCrumbDescription, instance: BreadCrumbInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: BreadCrumbInterface) => BreadCrumbInterface): void;
    function presets(presets: Record<string, (instance: BreadCrumbInterface) => BreadCrumbInterface>): void;


}
