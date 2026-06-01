import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type AccordionItemDescription = {
        id: string | number | null;
        title: ValidChild | null;
        icon: ValidChild | null;
        collapsible: boolean;
        content: ValidChild | null;
        renderHeader: ((desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild) | null;
        renderIndicator: ((desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild) | null;
        renderContent: ((desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild) | null;
        render: ((desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild) | null;
        expanded: ObservableItem<boolean>;
        disabled: ObservableItem<boolean>;
        props: GlobalAttributes;
    };

export interface AccordionItemInterface extends BaseComponent {
    identifyBy(id: string | number): this;
    content(content: ValidChild): this;
    title(title: ValidChild): this;
    icon(icon: ValidChild): this;
    showIndicator(show?: boolean): this;
    collapsible(collapsible?: boolean): this;
    expanded(expanded?: boolean): this;
    toggle(): this;
    disabled(disabled?: boolean): this;
    isExpanded(): boolean;
    onExpand(handler: () => void): this;
    onCollapse(handler: () => void): this;
    renderHeader(renderFn: (desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild): this;
    renderContent(renderFn: (desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild): this;
    renderIndicator(renderFn: (desc: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild): this;
    render(template: (description: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild): this;
}


export declare function AccordionItem(props?: Record<string, unknown>): AccordionItemInterface;
export declare namespace AccordionItem {


    function use(template: (description: AccordionItemDescription, instance: AccordionItemInterface) => ValidChild): void;


}
