import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type AvatarDescription = {
        src: ObservableItem<string> | null;
        alt: string | null;
        name: string | null;
        initials: string | null;
        icon: ValidChild | null;
        size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | string | number;
        shape: 'circle' | 'square' | 'rounded';
        variant: string | null;
        color: string | null;
        textColor: string | null;
        status: ObservableItem<string> | string | null;
        render: ((desc: AvatarDescription, instance: AvatarInterface) => ValidChild) | null;
        props: GlobalAttributes;
    };

export interface AvatarInterface extends BaseComponent {
    onError(handler: (error: Error, avatar: AvatarInterface) => void): this;
    src(src: string | ObservableItem<string>): this;
    alt(alt: string): this;
    name(name: string): this;
    initials(initials: string): this;
    icon(icon: ValidChild): this;
    size(size: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | string | number): this;
    extraSmall(): this;
    small(): this;
    medium(): this;
    large(): this;
    extraLarge(): this;
    shape(shape: 'circle' | 'square' | 'rounded'): this;
    circle(): this;
    square(): this;
    rounded(): this;
    variant(variant: string): this;
    primary(): this;
    secondary(): this;
    success(): this;
    danger(): this;
    warning(): this;
    info(): this;
    color(color: string): this;
    textColor(color: string): this;
    status(status: string | ObservableItem<string>): this;
    statusPosition(position: 'top-leading' | 'top-trailing' | 'bottom-leading' | 'bottom-trailing'): this;
    statusAtTopLeading(): this;
    statusAtBottomLeading(): this;
    statusAtTopTrailing(): this;
    statusAtBottomTrailing(): this;
    showStatus(show?: boolean): this;
    badge(content: ValidChild): this;
    badgePosition(position: 'top-leading' | 'top-trailing' | 'bottom-leading' | 'bottom-trailing'): this;
    badgeAtTopLeading(): this;
    badgeAtBottomLeading(): this;
    badgeAtTopTrailing(): this;
    badgeAtBottomTrailing(): this;
    render(template: (description: AvatarDescription, instance: AvatarInterface) => ValidChild): this;
}


export declare function Avatar(source?: string | ObservableItem<string>, props?: Record<string, unknown>): AvatarInterface;
export declare namespace Avatar {


    function use(template: (description: AvatarDescription, instance: AvatarInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: AvatarInterface) => AvatarInterface): void;
    function presets(presets: Record<string, (instance: AvatarInterface) => AvatarInterface>): void;


}
