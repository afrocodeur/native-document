import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

interface RadioOption {
    value: unknown;
    label: ValidChild;
    props: GlobalAttributes;
}

export type RadioFieldDescription = {
    name: string;
    type: 'radio';
    label: ValidChild | null;
    options: RadioOption[];
    layout: 'vertical' | 'horizontal' | 'grid';
    checked: ObservableItem<unknown> | boolean;
    value: ObservableItem<unknown> | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface RadioFieldInterface extends Omit<FieldInterface, 'render' | 'model'> {
    render(renderFn: (description: RadioFieldDescription, instance: RadioFieldInterface) => ValidChild): this;
    options(opts: RadioOption[]): this;
    option(value: unknown, label: ValidChild, props?: GlobalAttributes): this;
    model(observable: ObservableItem<unknown>): this;
    checked(): unknown;
    layout(value: 'vertical' | 'horizontal' | 'grid'): this;
    horizontal(): this;
    vertical(): this;
    grid(): this;
}


export declare function RadioField(name: string, props?: GlobalAttributes): RadioFieldInterface;
export declare namespace RadioField {


    function use(template: (description: RadioFieldDescription, instance: RadioFieldInterface) => ValidChild): void;


}
