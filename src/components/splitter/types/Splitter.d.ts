import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { SplitterPanelInterface } from './SplitterPanel';
import type { GlobalAttributes } from '../../../../types/globals';

export type SplitterDescription = {
        orientation: 'horizontal' | 'vertical';
        panels: SplitterPanelInterface[] | ObservableItem<SplitterPanelInterface[]>;
        gutterSize: number;
        render: ((desc: SplitterDescription, instance: SplitterInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface SplitterInterface extends BaseComponent {
    dynamic(): this;
    orientation(orientation: 'horizontal' | 'vertical'): this;
    horizontal(): this;
    vertical(): this;
    gutterSize(gutterSize: number): this;
    panel(content: SplitterPanelInterface | ValidChild, options?: Record<string, unknown>, props?: Record<string, unknown>): this;
    panels(panels: SplitterPanelInterface[]): this;
    removePanel(panel: SplitterPanelInterface): this;
    onResize(handler: (sizes: number[]) => void): this;
    onPanelAdd(handler: (panel: SplitterPanelInterface) => void): this;
    onPanelRemove(handler: (panel: SplitterPanelInterface) => void): this;
    render(renderFn: (desc: SplitterDescription, instance: SplitterInterface) => ValidChild): this;
}


export declare function Splitter(props?: Record<string, unknown>): SplitterInterface;
export declare namespace Splitter {


    function use(template: (description: SplitterDescription, instance: SplitterInterface) => ValidChild): void;


}
