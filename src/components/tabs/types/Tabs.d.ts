import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

interface TabDefinition {
    icon?: ValidChild;
    label: ValidChild;
    content: ValidChild;
    key: string;
}

export type TabsDescription = {
        active: ObservableItem<string>;
        tabs: Record<string, { icon?: ValidChild; label: ValidChild; content: ValidChild; key: string }>;
        sortable: boolean;
        tabAppearance: 'segmented' | 'pills' | string;
        addPlusButton: boolean | null;
        stickyHeader: boolean;
        overflow: 'scroll' | 'menu';
        navigationBarPosition: 'top' | 'bottom' | 'left' | 'right' | 'dock';
        tabsAlignment: 'leading' | 'trailing' | 'center' | 'justified';
        closable: boolean | 'icon';
        focusOnNewTab: boolean;
        renderCloseButton: ((desc: unknown) => ValidChild) | null;
        renderPlusButton: ((desc: unknown) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface TabsInterface extends BaseComponent {
    emit(eventName: string, ...args: unknown[]): void;
    sortable(): this;
    pills(): this;
    segmented(): this;
    addPlusButton(callback: () => void): this;
    closable(mode?: boolean | 'icon'): this;
    renderCloseButton(renderFn: (desc: unknown) => ValidChild): this;
    renderPlusButton(renderFn: (desc: unknown) => ValidChild): this;
    overflow(overflow: 'scroll' | 'menu'): this;
    scrollOnTabOverflow(): this;
    menuOnTabOverflow(): this;
    focusOnNewTab(mode?: boolean): this;
    stickyHeader(mode?: boolean): this;
    addTab(icon: ValidChild | null, label: ValidChild, content: ValidChild, key: string): this;
    tab(label: ValidChild, content: ValidChild, key: string): this;
    tabWithIcon(icon: ValidChild, label: ValidChild, content: ValidChild, key: string): this;
    tabs(tabs: TabDefinition[]): this;
    closeTab(key: string): this;
    active(key: string): this;
    navigationBarPosition(position: 'top' | 'bottom' | 'left' | 'right' | 'dock'): this;
    navigationBarAtLeft(): this;
    navigationBarAtRight(): this;
    navigationBarAtTop(): this;
    navigationBarAsDock(): this;
    tabsAtLeading(): this;
    tabsAtTrailing(): this;
    tabsAtCenter(): this;
    tabsJustified(): this;
    onChange(handler: () => void): this;
    onBeforeTabClose(handler: (key: string) => boolean | void): this;
    onClickTab(handler: (key: string) => void): this;
    onCloseTab(handler: (key: string) => void): this;
    onAddTab(handler: (tab: TabDefinition) => void): this;
    renderTab(renderFn: (tab: TabDefinition) => ValidChild): this;
    renderNavigationBar(renderFn: (desc: TabsDescription) => ValidChild): this;

    render(renderFn: (description: TabsDescription, instance: TabsInterface) => ValidChild): this;
}


export declare function Tabs(props?: Record<string, unknown>): TabsInterface;
export declare namespace Tabs {


    function use(template: (description: TabsDescription, instance: TabsInterface) => ValidChild): void;


}
