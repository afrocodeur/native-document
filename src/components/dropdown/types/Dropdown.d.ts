import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { DropdownItemInterface } from './DropdownItem';
import type { DropdownGroupInterface } from './DropdownGroup';
import type { GlobalAttributes } from '../../../../types/globals';

export type DropdownDescription = {
        trigger: HTMLElement | null;
        items: ObservableItem<DropdownItemInterface[]>;
        interaction: 'click' | 'hover' | 'focus';
        disabled: ObservableItem<boolean>;
        isOpen: ObservableItem<boolean>;
        maxHeight: string | number | null;
        searchable: boolean;
        searchValue: ObservableItem<string> | null;
        searchPlaceholder: string;
        loopOnKeyboard: boolean;
        renderItem: ((item: DropdownItemInterface, instance: DropdownInterface) => ValidChild) | null;
        renderHeader: ((desc: DropdownDescription, instance: DropdownInterface) => ValidChild) | null;
        renderFooter: ((desc: DropdownDescription, instance: DropdownInterface) => ValidChild) | null;
        render: ((desc: DropdownDescription, instance: DropdownInterface) => ValidChild) | null;
        filter: ((item: DropdownItemInterface, query: string) => boolean) | null;
        mapper: ((item: unknown) => DropdownItemInterface) | null;
        matchTriggerWidth: boolean | null;
        updatePositionOn: ObservableItem<unknown> | null;
        includeTriggerIntoGhost: boolean;
        props: GlobalAttributes;
    };

export interface DropdownInterface extends BaseComponent {
    open(): this;
    close(): this;
    toggle(): this;
    bind(source: ObservableItem<unknown[]> | unknown[], mapper?: ((item: unknown) => DropdownItemInterface) | null): this;
    source(source: ObservableItem<unknown[]> | unknown[], mapper?: ((item: unknown) => DropdownItemInterface) | null): this;
    from(items: unknown[], mapper?: ((item: unknown) => DropdownItemInterface) | null): this;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    enable(): this;
    disable(): this;
    value(value: unknown): this;
    placeholder(placeholder: ValidChild): this;
    searchable(searchable?: boolean, placeholder?: string | null): this;
    searchPlaceholder(placeholder: string): this;
    closeOnClickOutside(v: boolean): this;
    closeOnEscape(v: boolean): this;
    closeOnSelect(v: boolean): this;
    maxHeight(maxHeight: string | number): this;
    trigger(trigger: HTMLElement, includeTriggerIntoGhost?: boolean): this;
    add(item: DropdownItemInterface | ValidChild | unknown, props?: Record<string, unknown>): this;
    item(item: DropdownItemInterface | ValidChild | unknown, props?: Record<string, unknown>): this;
    from(items: unknown[], mapper?: ((item: unknown) => DropdownItemInterface) | null): this;
    group(groupBuilder: (group: DropdownGroupInterface) => void): this;
    divider(): this;
    select(value: unknown): this;
    next(): this;
    preview(): this;
    loopOnKeyboard(v: boolean): this;
    onChange(handler: (value: unknown, item: DropdownItemInterface) => void): this;
    onOpen(handler: () => void): this;
    onClose(handler: () => void): this;
    renderSearch(renderFn: (desc: DropdownDescription, instance: DropdownInterface) => ValidChild): this;
    interaction(interaction: 'click' | 'hover' | 'focus'): this;
    filter(filter: (item: DropdownItemInterface, query: string) => boolean, dependencies?: ObservableItem<unknown>[]): this;
    onClicked(): this;
    onHovered(): this;
    onFocused(): this;
    renderHeader(renderFn: (desc: DropdownDescription, instance: DropdownInterface) => ValidChild): this;
    renderFooter(renderFn: (desc: DropdownDescription, instance: DropdownInterface) => ValidChild): this;
    renderContent(renderFn: (desc: DropdownDescription, instance: DropdownInterface) => ValidChild): this;
    matchTriggerWidth(): this;
    matchTargetWidth(target: HTMLElement): this;
    renderItem(callback: (item: DropdownItemInterface, instance: DropdownInterface) => ValidChild): this;
    updatePositionOn(obs: ObservableItem<unknown> | unknown): this;
    render(template: (description: DropdownDescription, instance: DropdownInterface) => ValidChild): this;
}


export declare function Dropdown(props?: Record<string, unknown>): DropdownInterface;
export declare namespace Dropdown {


    function use(template: (description: DropdownDescription, instance: DropdownInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: DropdownInterface) => DropdownInterface): void;
    function presets(presets: Record<string, (instance: DropdownInterface) => DropdownInterface>): void;


}
