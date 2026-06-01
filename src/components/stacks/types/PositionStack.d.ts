import type { ValidChild } from '../../../../types/elements';
import type { StackInterface } from './Stack';
import type { GlobalAttributes } from '../../../../types/globals';

export type PositionStackDescription = {
        position: 'absolute' | 'fixed' | 'relative';
        content: ValidChild;
        top: string | number | null;
        right: string | number | null;
        bottom: string | number | null;
        left: string | number | null;
        width: string | number | null;
        height: string | number | null;
        zIndex: number | null;
        anchor: string | null;
        props: GlobalAttributes;
    };

export interface PositionStackInterface extends Omit<StackInterface, 'render'> {
    top(value: string | number): this;
    right(value: string | number): this;
    bottom(value: string | number): this;
    left(value: string | number): this;
    fill(): this;
    topLeading(): this;
    atTopCenter(): this;
    atTopTrailing(): this;
    atCenterLeading(): this;
    atCenter(): this;
    atCenterTrailing(): this;
    atBottomLeading(): this;
    atBottomCenter(): this;
    atBottomTrailing(): this;
    width(value: string | number): this;
    height(value: string | number): this;
    size(width: string | number, height?: string | number): this;
    fullWidth(): this;
    fullHeight(): this;
    fullSize(): this;
    zIndex(value: number): this;
    above(zIndex?: number): this;
    below(): this;
    render(renderFn: (description: PositionStackDescription, instance: PositionStackInterface) => ValidChild): this;
}


export declare function PositionStack(content: ValidChild, props?: Record<string, unknown>): PositionStackInterface;
export declare namespace PositionStack {


    function use(template: (description: PositionStackDescription, instance: PositionStackInterface) => ValidChild): void;


}
