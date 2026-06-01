import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type NumberFieldDescription = {
    name: string;
    type: string;
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<number> | null;
    step: number | null;
    decimals: number | null;
    prefix: ValidChild | null;
    suffix: ValidChild | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface NumberFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: NumberFieldDescription, instance: NumberFieldInterface) => ValidChild): this;
    min(min: number, message?: string): this;
    max(max: number, message?: string): this;
    between(min: number, max: number, message?: string): this;
    integer(message?: string): this;
    positive(message?: string): this;
    unsigned(): this;
    negative(message?: string): this;
    multipleOf(n: number, message?: string): this;
    step(value: number): this;
    decimals(value?: number): this;
    prefix(text: ValidChild): this;
    suffix(text: ValidChild): this;
}


export declare function NumberField(name: string, type?: string, props?: GlobalAttributes): NumberFieldInterface;
export declare namespace NumberField {


    function use(template: (description: NumberFieldDescription, instance: NumberFieldInterface) => ValidChild): void;


}
