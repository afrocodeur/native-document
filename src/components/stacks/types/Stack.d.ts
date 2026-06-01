import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type StackDescription = {
        orientation: 'horizontal' | 'vertical';
        content: ValidChild;
        spacing: string | number | null;
        alignment: string;
        justifyContent: string;
        wrap: boolean;
        grow: boolean;
        shrink: boolean;
        reverse: boolean;
        props: GlobalAttributes;
    };

export interface StackInterface extends BaseComponent {
    wrap(enabled?: boolean): this;
    grow(enabled?: boolean): this;
    reverse(enabled?: boolean): this;
    shrink(enabled?: boolean): this;
    spacing(value: string | number): this;
    alignLeading(): this;
    alignCenter(): this;
    alignTrailing(): this;
    alignStretch(): this;
    justifyStart(): this;
    justifyCenter(): this;
    justifyEnd(): this;
    justifyBetween(): this;
    justifyAround(): this;
    center(): this;

    render(renderFn: (description: StackDescription, instance: StackInterface) => ValidChild): this;
}


export declare function Stack(content: ValidChild, props?: Record<string, unknown>): StackInterface;
