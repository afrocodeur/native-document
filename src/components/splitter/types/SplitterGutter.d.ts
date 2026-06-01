import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';
import type { SplitterPanelInterface } from './SplitterPanel';
import type { GlobalAttributes } from '../../../../types/globals';
import {ObservableItem} from "../../../../types/observable";

export type SplitterGutterDescription = {
        leftPanel: SplitterPanelInterface | null;
        rightPanel: SplitterPanelInterface | null;
        orientation: 'horizontal' | 'vertical';
        cursor: string;
        size: number;
        isDragging: ObservableItem<boolean>;
        props: GlobalAttributes;
    };

export interface SplitterGutterInterface extends BaseComponent {
    vertical(): this;
    horizontal(): this;
    panels(leftPanel: SplitterPanelInterface, rightPanel: SplitterPanelInterface): this;
    leftPanel(leftPanel: SplitterPanelInterface): this;
    rightPanel(rightPanel: SplitterPanelInterface): this;
    size(size: number): this;
    onDragStart(handler: (event: MouseEvent) => void): this;
    onDrag(handler: (event: MouseEvent) => void): this;
    onDragEnd(handler: () => void): this;
    render(renderFn: (description: SplitterGutterDescription, instance: SplitterGutterInterface) => ValidChild): this;
}


export declare function SplitterGutter(leftPanel?: SplitterPanelInterface, rightPanel?: SplitterPanelInterface, props?: Record<string, unknown>): SplitterGutterInterface;
export declare namespace SplitterGutter {


    function use(template: (description: SplitterGutterDescription, instance: SplitterGutterInterface) => ValidChild): void;


}
