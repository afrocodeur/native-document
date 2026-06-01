import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type SplitterPanelDescription = {
        orientation: 'horizontal' | 'vertical';
        content: ValidChild | null;
        size: ObservableItem<string | number | null>;
        minSize: string | number | null;
        maxSize: string | number | null;
        collapsible: boolean;
        collapsed: boolean;
        resizable: boolean;
        data: unknown | null;
        render: ((desc: SplitterPanelDescription, instance: SplitterPanelInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface SplitterPanelInterface extends BaseComponent {
    content(content: ValidChild): this;
    size(size: string | number): this;
    minSize(size: string | number): this;
    maxSize(size: string | number): this;
    collapsible(collapsible?: boolean): this;
    collapsed(collapsed?: boolean): this;
    resizable(resizable?: boolean): this;
    fixed(): this;
    data(data: unknown): this;
    render(renderFn: (description: SplitterPanelDescription, instance: SplitterPanelInterface) => ValidChild): this;
}


export declare function SplitterPanel(content?: ValidChild, props?: Record<string, unknown>): SplitterPanelInterface;
export declare namespace SplitterPanel {


    function use(template: (description: SplitterPanelDescription, instance: SplitterPanelInterface) => ValidChild): void;


}
