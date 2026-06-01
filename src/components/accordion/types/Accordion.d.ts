import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { AccordionItemInterface, AccordionItemConstructor } from './AccordionItem';
import type { GlobalAttributes } from '../../../../types/globals';

export type AccordionDescription = {
        items: AccordionItemInterface[];
        multiple: boolean | null;
        variant: string | null;
        renderContent: ((desc: AccordionDescription, instance: AccordionInterface) => ValidChild) | null;
        renderIndicator: ((desc: AccordionDescription, instance: AccordionInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface AccordionInterface extends BaseComponent {
    item(title: ValidChild | AccordionItemInterface, content?: ValidChild, options?: Record<string, unknown> | ((item: AccordionItemInterface) => void)): this;
    items(items: AccordionItemInterface[]): this;
    addItem(title: ValidChild | AccordionItemInterface, content?: ValidChild, options?: unknown): this;
    removeItemById(id: string | number): this;
    remove(filter: (item: AccordionItemInterface) => boolean): this;
    multiple(enabled?: boolean): this;
    variant(name: string): this;
    bordered(): this;
    separated(): this;
    flush(): this;
    getByKey(key: string): AccordionItemInterface | undefined;
    expanded(key: string, state?: boolean): this;
    expandAll(): this;
    collapseAll(): this;
    isExpanded(key: string): boolean | undefined;
    onExpand(handler: (key: string, state: boolean) => void): this;
    onCollapse(handler: (key: string, state: boolean) => void): this;
    renderContent(renderFn: (desc: AccordionDescription, instance: AccordionInterface) => ValidChild): this;
    renderIndicator(renderFn: (desc: AccordionDescription, instance: AccordionInterface) => ValidChild): this;
    render(template: (description: AccordionDescription, instance: AccordionInterface) => ValidChild): this;
}


export declare function Accordion(props?: Record<string, unknown>): AccordionInterface;
export declare namespace Accordion {


    function use(template: (description: AccordionDescription, instance: AccordionInterface) => ValidChild): void;


}
