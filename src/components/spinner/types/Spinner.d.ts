import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type SpinnerDescription = {
        type: 'circle' | 'dots' | 'bars' | 'pulse' | 'ring' | string;
        variant: string;
        color: string | null;
        size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | string | number;
        label: ValidChild | null;
        labelPosition: 'top' | 'bottom' | 'left' | 'right' | null;
        overlay: boolean | null;
        backdrop: boolean | null;
        render: ((desc: SpinnerDescription, instance: SpinnerInterface) => ValidChild) | null;
        speed: 'slow' | 'normal' | 'fast' | string;
        fullScreenOverlay: boolean | null;
        props: GlobalAttributes;
    };

export interface SpinnerInterface extends BaseComponent {
    type(type: 'circle' | 'dots' | 'bars' | 'pulse' | 'ring' | string): this;
    circle(): this;
    dots(): this;
    bars(): this;
    pulse(): this;
    ring(): this;
    size(size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | string | number): this;
    extraSmall(): this;
    small(): this;
    medium(): this;
    large(): this;
    extraLarge(): this;
    variant(name: string): this;
    primary(): this;
    secondary(): this;
    success(): this;
    danger(): this;
    warning(): this;
    color(color: string): this;
    label(label: ValidChild): this;
    labelPosition(position: 'top' | 'bottom' | 'left' | 'right'): this;
    labelAtTop(): this;
    labelAtBottom(): this;
    labelAtLeft(): this;
    labelAtRight(): this;
    overlay(enabled?: boolean): this;
    fullscreen(): this;
    backdrop(enabled?: boolean): this;
    speed(speed: 'slow' | 'normal' | 'fast' | string | number): this;
    slow(): this;
    normal(): this;
    fast(): this;
    loading(isLoading: boolean | ObservableItem<boolean>): this;
    bind(isLoading: boolean | ObservableItem<boolean>): this;
    render(renderFn: (description: SpinnerDescription, instance: SpinnerInterface) => ValidChild): this;
    show(): this;
    hide(): this;
}


export declare function Spinner(props?: Record<string, unknown>): SpinnerInterface;
export declare namespace Spinner {


    function use(template: (description: SpinnerDescription, instance: SpinnerInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: SpinnerInterface) => SpinnerInterface): void;
    function presets(presets: Record<string, (instance: SpinnerInterface) => SpinnerInterface>): void;


}
