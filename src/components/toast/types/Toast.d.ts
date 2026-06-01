import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ToastDescription = {
        visibility: ObservableItem<boolean>;
        type: 'info' | 'success' | 'warning' | 'error' | string | null;
        title: ValidChild | null;
        content: ValidChild;
        icon: ValidChild | null;
        showIcon: boolean;
        duration: number;
        closable: boolean;
        pauseOnHover: boolean;
        position: 'top-leading' | 'top-trailing' | 'top-center' | 'bottom-leading' | 'bottom-trailing' | 'bottom-center';
        actions: Array<{ label: ValidChild; handler: (() => void) | null; variant: string | null }>;
        render: ((desc: ToastDescription, instance: ToastInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface ToastInterface extends BaseComponent {
    type(type: 'info' | 'success' | 'warning' | 'error' | string): this;
    info(): this;
    success(): this;
    warning(): this;
    error(): this;
    title(title: ValidChild): this;
    content(content: ValidChild): this;
    icon(icon: ValidChild): this;
    showIcon(show?: boolean): this;
    duration(ms: number): this;
    closable(closable?: boolean): this;
    pauseOnHover(pauseOnHover?: boolean): this;
    position(position: 'top-leading' | 'top-trailing' | 'top-center' | 'bottom-leading' | 'bottom-trailing' | 'bottom-center'): this;
    atTopLeading(): this;
    atTopTrailing(): this;
    atTopCenter(): this;
    atBottomLeading(): this;
    atBottomTrailing(): this;
    atBottomCenter(): this;
    render(renderFn: (desc: ToastDescription, instance: ToastInterface) => ValidChild): this;
    action(label: ValidChild, handler?: () => void, variant?: string | null): this;
    close(): void;
    show(): void;
    onClose(handler: () => void): this;
}


export declare function Toast(content: ValidChild, props?: Record<string, unknown>): ToastInterface;
export declare namespace Toast {


    function use(template: (description: ToastDescription, instance: ToastInterface) => ValidChild): void;


}
