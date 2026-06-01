import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type BadgeDescription = {
        appearance: 'filled' | 'outline' | 'bordered';
        borderRadiusType: 'pill' | 'rounded' | 'circle' | null;
        variant: string;
        size: 'small' | 'medium' | 'large' | string;
        onClick: ((event: MouseEvent) => void) | null;
        content: ValidChild;
        props: GlobalAttributes;
    };

export interface BadgeInterface extends BaseComponent {
    variant(variant: string): this;
    primary(): this;
    secondary(): this;
    success(): this;
    danger(): this;
    warning(): this;
    info(): this;
    size(size: 'small' | 'medium' | 'large' | string): this;
    small(): this;
    medium(): this;
    large(): this;
    shape(shape: 'rounded' | 'pill' | 'circle'): this;
    rounded(): this;
    pill(): this;
    circle(): this;
    appearance(appearance: 'filled' | 'outline' | 'bordered'): this;
    outline(): this;
    filled(): this;
    bordered(): this;
    content(content: ValidChild): this;
    onClick(handler: (event: MouseEvent) => void): this;
    render(template: (description: BadgeDescription, instance: BadgeInterface) => ValidChild): this;
}


export declare function Badge(content: ValidChild, props?: Record<string, unknown>): BadgeInterface;
export declare namespace Badge {


    function use(template: (description: BadgeDescription, instance: BadgeInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: BadgeInterface) => BadgeInterface): void;
    function presets(presets: Record<string, (instance: BadgeInterface) => BadgeInterface>): void;


}
