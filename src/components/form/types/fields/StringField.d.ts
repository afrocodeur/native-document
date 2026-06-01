import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type StringFieldDescription = {
    name: string;
    type: string;
    label: ValidChild | null;
    placeholder: ValidChild | null;
    help: ValidChild | null;
    defaultValue: unknown;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    value: ObservableItem<string> | null;
    clearable: boolean | ObservableItem<boolean> | null;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    clearButtonIcon: ValidChild | null;
    focus: ObservableItem<boolean>;
    isDirty: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface StringFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: StringFieldDescription, instance: StringFieldInterface) => ValidChild): this;
    minLength(min: number, message?: string): this;
    maxLength(max: number, message?: string): this;
    length(length: number, message?: string): this;
    pattern(regex: RegExp, message?: string): this;
    alphaOnly(message?: string): this;
    numericOnly(message?: string): this;
    alphaNumeric(message?: string): this;
    noSpaces(message?: string): this;
    lowercase(message?: string): this;
    uppercase(message?: string): this;
}


export declare function StringField(name: string, type?: string, props?: GlobalAttributes): StringFieldInterface;
export declare namespace StringField {


    function use(template: (description: StringFieldDescription, instance: StringFieldInterface) => ValidChild): void;


}
