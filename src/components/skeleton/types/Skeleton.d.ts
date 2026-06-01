import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type SkeletonDescription = {
        type: 'rect' | 'circle' | 'text' | 'avatar' | 'image';
        variant: 'pulse' | 'wave';
        borderRadiusType: 'rounded' | 'pill' | 'smooth' | null;
        lines: number | null;
        width: string | number | null;
        height: string | number | null;
        loading: ObservableItem<boolean> | boolean | null;
        repeat: number | null;
        props: GlobalAttributes;
    };

export interface SkeletonInterface extends BaseComponent {
    type(type: 'rect' | 'circle' | 'text' | 'avatar' | 'image'): this;
    text(lines?: number): this;
    circle(): this;
    rect(): this;
    avatar(): this;
    image(): this;
    rounded(): this;
    pill(): this;
    smooth(): this;
    width(width: string | number): this;
    height(height: string | number): this;
    size(width: string | number, height: string | number): this;
    variant(name: 'pulse' | 'wave'): this;
    wave(): this;
    pulse(): this;
    loading(isLoading: boolean | ObservableItem<boolean>): this;
    show(): this;
    hide(): this;
    repeat(times: number): this;
    render(renderFn: (description: SkeletonDescription, instance: SkeletonInterface) => ValidChild): this;
}


export declare function Skeleton(props?: Record<string, unknown>): SkeletonInterface;
export declare namespace Skeleton {


    function use(template: (description: SkeletonDescription, instance: SkeletonInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: SkeletonInterface) => SkeletonInterface): void;
    function presets(presets: Record<string, (instance: SkeletonInterface) => SkeletonInterface>): void;
    function card(type?: string): SkeletonInterface;
    function list(items?: number): SkeletonInterface;
    function table(rows?: number, cols?: number): SkeletonInterface;
    function paragraph(lines?: number): SkeletonInterface;


}
