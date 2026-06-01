import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type ButtonDescription = {
        label: ValidChild;
        type: 'button' | 'submit' | 'reset' | null;
        variant: string | null;
        size: 'small' | 'medium' | 'large' | string | null;
        icon: ValidChild | null;
        iconPosition: 'leading' | 'trailing' | 'top' | 'bottom';
        loading: ObservableItem<boolean> | null;
        disabled: ObservableItem<boolean> | null;
        block: boolean | null;
        borderRadiusType: 'rounded' | 'pill' | 'circle' | 'smooth' | null;
        outline: boolean | null;
        props: GlobalAttributes;
    };

export interface ButtonInterface extends BaseComponent {
    type(type: 'button' | 'submit' | 'reset'): this;
    variant(variant: string): this;
    primary(): this;
    secondary(): this;
    danger(): this;
    success(): this;
    warning(): this;
    ghost(): this;
    link(): this;
    outline(): this;
    size(size: 'small' | 'medium' | 'large' | string): this;
    small(): this;
    medium(): this;
    large(): this;
    icon(icon: ValidChild, iconPosition?: 'leading' | 'trailing' | 'top' | 'bottom'): this;
    iconAtLeading(): this;
    iconAtTrailing(): this;
    iconAtTop(): this;
    iconAtBottom(): this;
    iconOnly(): this;
    loading(loading?: boolean | ObservableItem<boolean>): this;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    render(renderFunction: (description: ButtonDescription, component: ButtonInterface) => ValidChild): this;
    rounded(): this;
    pill(): this;
    circle(): this;
    smooth(): this;
    block(): this;
}


export declare function Button(label: ValidChild, props?: Record<string, unknown>): ButtonInterface;
export declare namespace Button {


    function use(template: (description: ButtonDescription, instance: ButtonInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: ButtonInterface) => ButtonInterface): void;
    function presets(presets: Record<string, (instance: ButtonInterface) => ButtonInterface>): void;


}
