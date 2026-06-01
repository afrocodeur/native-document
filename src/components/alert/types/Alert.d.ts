import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type AlertDescription = {
        title: ValidChild | null;
        content: ValidChild;
        outline: boolean | null;
        appearance: 'filled' | 'bordered' | null;
        variant: 'info' | 'success' | 'warning' | 'error' | 'danger' | string;
        closable: boolean;
        autoDismiss: number | null;
        icon: ValidChild | null;
        showIcon: boolean;
        actions: Array<{ label: ValidChild; handler: (() => void) | null; variant: string | null }>;
        props: GlobalAttributes;
    };

export interface AlertInterface extends BaseComponent {
    variant(variant: 'info' | 'success' | 'warning' | 'error' | 'danger' | string): this;
    info(): this;
    success(): this;
    warning(): this;
    error(): this;
    danger(): this;
    appearance(appearance: 'filled' | 'bordered'): this;
    filled(): this;
    bordered(): this;
    outline(outline?: boolean): this;
    title(title: ValidChild): this;
    content(content: ValidChild): this;
    renderTitle(callback: (desc: AlertDescription, instance: AlertInterface) => ValidChild): this;
    renderContent(callback: (desc: AlertDescription, instance: AlertInterface) => ValidChild): this;
    renderFooter(callback: (desc: AlertDescription, instance: AlertInterface) => ValidChild): this;
    clearActions(): this;
    action(label: ValidChild, handler?: () => void, variant?: string | null): this;
    layout(layoutFn: (desc: AlertDescription, instance: AlertInterface) => ValidChild): this;
    icon(icon: ValidChild): this;
    showIcon(show?: boolean): this;
    closable(closable?: boolean): this;
    dismissible(dismissible?: boolean): this;
    autoDismiss(delay: number): this;
    close(): this;
    show(): this;
    hide(): this;
    onClose(handler: () => void): this;
    onShow(handler: () => void): this;
    render(template: (description: AlertDescription, instance: AlertInterface) => ValidChild): this;
}


export declare function Alert(content: ValidChild, props?: Record<string, unknown>): AlertInterface;
export declare namespace Alert {


    function use(template: (description: AlertDescription, instance: AlertInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: AlertInterface) => AlertInterface): void;
    function presets(presets: Record<string, (instance: AlertInterface) => AlertInterface>): void;


}
