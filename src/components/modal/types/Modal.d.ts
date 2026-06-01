import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ModalDescription = {
        centered: boolean;
        scrollable: boolean;
        title: ValidChild | null;
        content: ValidChild;
        footer: ValidChild | null;
        size: 'small' | 'medium' | 'large' | 'extra-large' | 'fullscreen' | null;
        closeOnBackdrop: boolean;
        closeOnEscape: boolean;
        closable: boolean;
        layout: ((desc: ModalDescription, instance: ModalInterface) => ValidChild) | null;
        fullscreen: boolean;
        draggable: boolean;
        dragByHeader: boolean;
        resizable: boolean;
        resizableOptions: { size: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number } };
        focusTrap: boolean;
        lockScroll: boolean;
        isOpen: ObservableItem<boolean>;
        variant: string | null;
        props: GlobalAttributes;
    };

export interface ModalInterface extends BaseComponent {
    trigger(trigger: HTMLElement): HTMLElement;
    open(): void;
    close(): void;
    isOpen(): boolean;
    isClose(): boolean;
    title(title: ValidChild): this;
    content(content: ValidChild): this;
    footer(footer: ValidChild): this;
    size(size: 'small' | 'medium' | 'large' | 'extra-large' | 'fullscreen' | string): this;
    small(): this;
    medium(): this;
    large(): this;
    extraLarge(): this;
    fullscreen(fullscreen?: boolean): this;
    centered(): this;
    scrollable(scrollable?: boolean): this;
    closeOnBackdrop(enabled?: boolean): this;
    closeOnEscape(enabled?: boolean): this;
    closable(enabled?: boolean): this;
    onOpen(handler: () => void): this;
    onClose(handler: () => void): this;
    onBeforeOpen(handler: () => void): this;
    onBeforeClose(handler: () => void): this;
    renderHeader(renderFn: (desc: ModalDescription, instance: ModalInterface) => ValidChild): this;
    renderContent(renderFn: (desc: ModalDescription, instance: ModalInterface) => ValidChild): this;
    renderFooter(renderFn: (desc: ModalDescription, instance: ModalInterface) => ValidChild): this;
    layout(layoutFn: (desc: ModalDescription, instance: ModalInterface) => ValidChild): this;
    draggable(): this;
    dragByHeader(): this;
    resizable(options?: {
        directions?: string[];
        size?: {
            minWidth?: number;
            maxWidth?: number;
            minHeight?: number;
            maxHeight?: number
        }
    }): this;
    render(renderFn: (description: ModalDescription, instance: ModalInterface) => ValidChild): this;
    resizeDirections(directions: string[]): this;
    minWidth(minWidth: string | number): this;
    maxWidth(maxWidth: string | number): this;
    minHeight(minHeight: string | number): this;
    maxHeight(maxHeight: string | number): this;
    focusTrap(focusTrap?: boolean): this;
    lockScroll(lockScroll?: boolean): this;
    onDragStart(handler: (event: MouseEvent, x: number, y: number) => void): this;
    onDrag(handler: (event: MouseEvent, x: number, y: number) => void): this;
    onDragEnd(handler: () => void): this;
    onResizeStart(handler: (event: MouseEvent, w: number, h: number) => void): this;
    onResize(handler: (event: MouseEvent, w: number, h: number) => void): this;
    onResizeEnd(handler: (w: number, h: number) => void): this;
}


export declare function Modal(content: ValidChild, props?: Record<string, unknown>): ModalInterface;
export declare namespace Modal {


    function use(template: (description: ModalDescription, instance: ModalInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: ModalInterface) => ModalInterface): void;
    function presets(presets: Record<string, (instance: ModalInterface) => ModalInterface>): void;


}
