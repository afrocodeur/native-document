import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type TooltipDescription = {
        trigger: HTMLElement | null;
        interaction: 'hover' | 'click' | 'focus';
        content: ValidChild;
        position: 'top' | 'bottom' | 'left' | 'right';
        title: ValidChild | null;
        isOpen: ObservableItem<boolean>;
        offset: number;
        shift: Record<string, number>;
        hideDelay: number;
        arrow: boolean;
        interactive: boolean;
        variant: string | null;
        updatePositionOn: ObservableItem<unknown> | null;
        props: GlobalAttributes;
    };

export interface TooltipInterface extends BaseComponent {
    trigger(trigger: HTMLElement): this;
    title(title: ValidChild): this;
    content(content: ValidChild): this;
    variant(variant: string): this;
    primary(): this;
    success(): this;
    warning(): this;
    danger(): this;
    info(): this;
    position(position: 'top' | 'bottom' | 'left' | 'right'): this;
    atTop(): this;
    atBottom(): this;
    atLeft(): this;
    atRight(): this;
    onClicked(): this;
    onHovered(): this;
    onFocused(): this;
    hideDelay(ms: number): this;
    arrow(enabled?: boolean): this;
    interactive(isInteractive?: boolean): this;
    open(): this;
    close(): this;
    toggle(): this;
    onOpen(handler: () => void): this;
    onClose(handler: () => void): this;
    render(renderFn: (desc: TooltipDescription, instance: TooltipInterface) => ValidChild): this;
    offset(offset: number): this;
    shift(shift: Record<string, number>): this;
    updatePositionOn(obs: ObservableItem<unknown> | unknown): this;
}


export declare function Tooltip(content: ValidChild, props?: Record<string, unknown>): TooltipInterface;
export declare namespace Tooltip {


    function use(template: (description: TooltipDescription, instance: TooltipInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: TooltipInterface) => TooltipInterface): void;
    function presets(presets: Record<string, (instance: TooltipInterface) => TooltipInterface>): void;


}
