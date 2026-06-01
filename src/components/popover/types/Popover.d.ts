import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { PopoverHeaderInterface } from './PopoverHeader';
import type { PopoverFooterInterface } from './PopoverFooter';
import type { GlobalAttributes } from '../../../../types/globals';

export type PopoverDescription = {
        trigger: HTMLElement | null;
        interaction: 'click' | 'hover' | 'focus';
        content: ValidChild;
        header: ValidChild | PopoverHeaderInterface | null;
        footer: ValidChild | PopoverFooterInterface | null;
        isOpen: ObservableItem<boolean>;
        closeOnEscape: boolean;
        closeOnClickOutside: boolean;
        focusTrap: boolean;
        returnFocus: boolean;
        position: string;
        offset: number;
        shift: Record<string, number>;
        arrow: boolean;
        data: unknown | null;
        renderContent: ((desc: PopoverDescription, instance: PopoverInterface) => ValidChild) | null;
        renderHeader: ((desc: PopoverDescription, instance: PopoverInterface) => ValidChild) | null;
        renderFooter: ((desc: PopoverDescription, instance: PopoverInterface) => ValidChild) | null;
        render: ((desc: PopoverDescription, instance: PopoverInterface) => ValidChild) | null;
        variant: string | null;
        matchTriggerWidth: boolean | null;
        updatePositionOn: ObservableItem<unknown> | null;
        props: GlobalAttributes;
    };

export interface PopoverInterface extends BaseComponent {
    trigger(trigger: HTMLElement): this;
    interaction(interaction: 'click' | 'hover' | 'focus'): this;
    onClicked(): this;
    onHovered(): this;
    onFocused(): this;
    content(content: ValidChild): this;
    header(header: ValidChild | PopoverHeaderInterface): this;
    footer(footer: ValidChild | PopoverFooterInterface): this;
    closeOnEscape(closeOnEscape?: boolean): this;
    closeOnClickOutside(closeOnClickOutside?: boolean): this;
    focusTrap(trap?: boolean): this;
    returnFocus(returnFocus?: boolean): this;
    position(position: string): this;
    offset(offset: number): this;
    arrow(arrow?: boolean): this;
    shift(shift: Record<string, number>): this;
    bindOpen(observable: ObservableItem<boolean>): this;
    data(data: unknown): this;
    open(): this;
    close(): this;
    toggle(): this;
    onOpen(handler: () => void): this;
    onClose(handler: () => void): this;
    renderTrigger(renderFn: (desc: PopoverDescription, instance: PopoverInterface) => ValidChild): this;
    renderContent(renderFn: (desc: PopoverDescription, instance: PopoverInterface) => ValidChild): this;
    renderHeader(renderFn: (desc: PopoverDescription, instance: PopoverInterface) => ValidChild): this;
    renderFooter(renderFn: (desc: PopoverDescription, instance: PopoverInterface) => ValidChild): this;
    variant(variant: string): this;
    primary(): this;
    success(): this;
    warning(): this;
    danger(): this;
    info(): this;
    matchTriggerWidth(): this;
    updatePositionOn(obs: ObservableItem<unknown> | unknown): this;
    render(template: (description: PopoverDescription, instance: PopoverInterface) => ValidChild): this;
}


export declare function Popover(content: ValidChild, props?: Record<string, unknown>): PopoverInterface;
export declare namespace Popover {


    function use(template: (description: PopoverDescription, instance: PopoverInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: PopoverInterface) => PopoverInterface): void;
    function presets(presets: Record<string, (instance: PopoverInterface) => PopoverInterface>): void;


}
