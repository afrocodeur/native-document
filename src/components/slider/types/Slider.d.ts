import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type SliderDescription = {
        name: string;
        id: string | null;
        value: ObservableItem<number> | null;
        defaultValue: number | null;
        valueStart: ObservableItem<number> | null;
        valueEnd: ObservableItem<number> | null;
        range: boolean;
        min: number;
        max: number;
        step: number;
        showValue: boolean | null;
        showTooltip: boolean | null;
        tooltipFormat: ((value: number) => string) | null;
        renderTooltip: ((value: number) => ValidChild) | null;
        marks: number[] | Array<{ value: number; label?: ValidChild }> | null;
        showMarks: boolean | null;
        variant: string | null;
        color: string | null;
        trackColor: string | null;
        fillColor: string | null;
        vertical: boolean;
        height: string | number | null;
        disabled: ObservableItem<boolean> | boolean | null;
        readonly: ObservableItem<boolean> | boolean | null;
        reverse: boolean;
        snapToMarks: boolean;
        renderCursor: ((value: number) => ValidChild) | null;
        renderThumb: ((value: number) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface SliderInterface extends BaseComponent {
    model(observable: ObservableItem<number>): this;
    modelStart(observable: ObservableItem<number>): this;
    modelEnd(observable: ObservableItem<number>): this;
    defaultValue(value: number): this;
    setCurrentStep(value: number): this;
    range(enabled?: boolean): this;
    min(min: number): this;
    max(max: number): this;
    step(step: number): this;
    showValue(enabled?: boolean): this;
    showTooltip(enabled?: boolean): this;
    tooltipFormat(formatFn: (value: number) => string): this;
    renderTooltip(renderFn: (value: number) => ValidChild): this;
    marks(marks: number[] | Array<{ value: number; label?: ValidChild }>): this;
    render(renderFn: (description: SliderDescription, instance: SliderInterface) => ValidChild): this;
    showMarks(enabled?: boolean): this;
    snapToMarks(enabled?: boolean): this;
    variant(name: string): this;
    secondary(): this;
    color(color: string): this;
    trackColor(color: string): this;
    fillColor(color: string): this;
    fullColor(color: string): this;
    vertical(enabled?: boolean): this;
    height(height: string | number): this;
    disabled(condition?: boolean | ObservableItem<boolean>): this;
    readonly(condition?: boolean | ObservableItem<boolean>): this;
    reverse(enabled?: boolean): this;
    renderThumb(renderFn: (value: number) => ValidChild): this;
    renderCursor(renderFn: (value: number) => ValidChild): this;
    onChange(handler: (value: number) => void): this;
    onComplete(handler: () => void): this;
    render(renderFn: (description: SliderDescription, instance: SliderInterface) => ValidChild): this;
}


export declare function Slider(name: string, props?: Record<string, unknown>): SliderInterface;
export declare namespace Slider {


    function use(template: (description: SliderDescription, instance: SliderInterface) => ValidChild): void;


}
