import type {Observable, ValidChild} from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type DrawerDescription = {
    title: ValidChild | null;
    subtitle: ValidChild | null;
    content: ValidChild;
    position: 'left' | 'right' | 'top' | 'bottom';
    size: string;
    overlay: boolean;
    closeOnOverlayClick: boolean;
    closable: boolean;
    actions: Array<{
        label: ValidChild;
        handler: ((event: Event, instance: DrawerInterface) => void) | null;
        variant: string | null;
    }>;
    contentRender: ((desc: DrawerDescription, instance: DrawerInterface) => ValidChild) | null;
    footerRender: ((desc: DrawerDescription, instance: DrawerInterface) => ValidChild) | null;
    visible: ObservableItem<boolean> | null;
    props: GlobalAttributes;
};

export interface DrawerInterface extends BaseComponent {
    position(position: 'left' | 'right' | 'top' | 'bottom'): this;
    atLeft(): this;
    atRight(): this;
    atTop(): this;
    atBottom(): this;
    size(size: string): this;
    title(title: ValidChild): this;
    subtitle(subtitle: ValidChild): this;
    content(content: ValidChild): this;
    renderContent(template: (description: DrawerDescription, instance: DrawerInterface) => ValidChild): this;
    renderFooter(template: (description: DrawerDescription, instance: DrawerInterface) => ValidChild): this;
    renderHeader(template: (description: DrawerDescription, instance: DrawerInterface) => ValidChild): this;
    overlay(overlay?: boolean): this;
    closeOnOverlayClick(closeOnOverlayClick?: boolean): this;
    closable(closable?: boolean): this;
    isOpen(closable: Observable<Boolean>): this;
    clearActions(): this;
    action(label: string, handler?: ((event: Event, instance: DrawerInterface) => void) | null, variant?: string | null): this;
    open(): void;
    close(): void;
    show(): void;
    hide(): void;
    onOpen(handler: (instance: DrawerInterface) => void): this;
    onClose(handler: (instance: DrawerInterface) => void): this;
}


export declare function Drawer(props?: Record<string, unknown>, content?: ValidChild): DrawerInterface;
export declare namespace Drawer {

    function use(template: (description: DrawerDescription, instance: DrawerInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: DrawerInterface) => DrawerInterface): void;
    function presets(presets: Record<string, (instance: DrawerInterface) => DrawerInterface>): void;

}