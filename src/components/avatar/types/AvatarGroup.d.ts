import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { AvatarInterface } from './Avatar';
import type { GlobalAttributes } from '../../../../types/globals';

export type AvatarGroupDescription = {
        items: AvatarInterface[];
        overlap: number;
        max: number;
        onMoreClick: ((count: number) => void) | null;
        props: GlobalAttributes;
    };

export interface AvatarGroupInterface extends BaseComponent {
    items(items: AvatarInterface[]): this;
    item(item: AvatarInterface): this;
    overlap(value: number): this;
    max(max: number): this;
    onMoreClick(handler: (count: number) => void): this;
    render(template: (description: AvatarGroupDescription, instance: AvatarGroupInterface) => ValidChild): this;
}


export declare function AvatarGroup(props?: Record<string, unknown>): AvatarGroupInterface;
export declare namespace AvatarGroup {


    function use(template: (description: AvatarGroupDescription, instance: AvatarGroupInterface) => ValidChild): void;


}
