import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ProgressDescription = {
        value: number | ObservableItem<number> | null;
        type: 'bar' | 'circle' | 'line' | string | null;
        variant: string | null;
        max: number;
        size: string | number | null;
        stroke: number | null;
        height: string | number | null;
        showValue: boolean | null;
        showPercentage: boolean | null;
        label: ValidChild | null;
        format: ((value: number) => string) | null;
        indeterminate: boolean | null;
        striped: boolean | null;
        animated: boolean | null;
        borderRadiusType: string | null;
        props: GlobalAttributes;
    };

export interface ProgressInterface extends BaseComponent {
    model(observable: ObservableItem<number>): this;
    bind(observable: ObservableItem<number>): this;
    setCurrentStep(step: number): void;
    value(value: number | ObservableItem<number>): this;
    setValue(newValue: number): this;
    getCurrentValue(): number;
    max(max: number): this;
    type(type: 'bar' | 'circle' | 'line' | string): this;
    bar(): this;
    circle(): this;
    line(): this;
    pill(): this;
    variant(name: string): this;
    primary(): this;
    secondary(): this;
    success(): this;
    warning(): this;
    danger(): this;
    info(): this;
    size(size: string | number): this;
    stroke(stroke: number): this;
    small(): this;
    medium(): this;
    large(): this;
    height(height: string | number): this;
    showValue(enabled?: boolean): this;
    label(text: ValidChild): this;
    format(formatFn: (value: number) => string): this;
    indeterminate(enabled?: boolean): this;
    striped(enabled?: boolean): this;
    animated(enabled?: boolean): this;
    start(): this;
    complete(): void;
    increment(step: number): this;
    reset(): this;
    onChange(handler: (value: number) => void): this;
    onComplete(handler: () => void): this;
    onReset(handler: () => void): this;
    render(renderFn: (description: ProgressDescription, instance: ProgressInterface) => ValidChild): this;
}


export declare function Progress(props?: Record<string, unknown>): ProgressInterface;
export declare namespace Progress {


    function use(template: (description: ProgressDescription, instance: ProgressInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: ProgressInterface) => ProgressInterface): void;
    function presets(presets: Record<string, (instance: ProgressInterface) => ProgressInterface>): void;


}
