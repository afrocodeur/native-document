import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

interface CheckboxGroupOption {
    value: unknown;
    label: ValidChild;
    props: GlobalAttributes;
}

export type CheckboxGroupFieldDescription = {
    name: string;
    type: 'checkbox-group';
    label: ValidChild | null;
    options: CheckboxGroupOption[];
    layout: 'vertical' | 'horizontal' | 'grid';
    value: ObservableItem<unknown[]> | null;
    defaultValue: unknown[];
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface CheckboxGroupFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: CheckboxGroupFieldDescription, instance: CheckboxGroupFieldInterface) => ValidChild): this;
    options(opts: CheckboxGroupOption[]): this;
    option(value: unknown, label: ValidChild, props?: GlobalAttributes): this;
    layout(value: 'vertical' | 'horizontal' | 'grid'): this;
    horizontal(): this;
    vertical(): this;
    grid(): this;
    minChecked(min: number, message?: string): this;
    maxChecked(max: number, message?: string): this;
    exactChecked(count: number, message?: string): this;
}


export declare function CheckboxGroupField(name: string, props?: GlobalAttributes): CheckboxGroupFieldInterface;
export declare namespace CheckboxGroupField {


    function use(template: (description: CheckboxGroupFieldDescription, instance: CheckboxGroupFieldInterface) => ValidChild): void;


}
