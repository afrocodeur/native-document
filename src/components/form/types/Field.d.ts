import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { HasValidation } from '../../$traits/has-validation/HasValidation';

export type FieldDescription = {
        name: string;
        type: string;
        key: string;
        label: ValidChild | null;
        placeholder: ValidChild | null;
        help: ValidChild | null;
        defaultValue: unknown;
        disabled: boolean | ObservableItem<boolean>;
        readonly: boolean | ObservableItem<boolean>;
        rules: Array<{ fn: Function; params: unknown; message: string }>;
        clearErrorOn: string;
        validateOn: string;
        value: ObservableItem | null;
        clearable: boolean | ObservableItem<boolean> | null;
        hasErrors: ObservableItem<boolean>;
        errors: ObservableItem<string[]>;
        showErrors: ObservableItem<boolean>;
        render: ((desc: FieldDescription, instance: FieldInterface) => ValidChild) | null;
        clearButtonIcon: ValidChild | null;
        focus: ObservableItem<boolean>;
        isDirty: ObservableItem<boolean>;
    };

export interface FieldInterface extends BaseComponent, HasValidation {
    forceShowErrors(forceValue: boolean): void;
    key(key: string): this;
    suffix(suffix: string): this;
    field(): HTMLElement | DocumentFragment;
    input(callback: (input: HTMLElement) => void): this;
    model(observable: ObservableItem): this;
    bind(observable: ObservableItem): this;
    errors(errors: ObservableItem<string[]>): this;
    type(type: string): this;
    default(defaultValue: unknown): this;
    label(text: ValidChild): this;
    help(text: ValidChild): this;
    hint(text: ValidChild): this;
    placeholder(text: ValidChild): this;
    disabled(disabled?: boolean | ObservableItem<boolean>): this;
    readonly(readonly?: boolean | ObservableItem<boolean>): this;
    value(): any;
    setValue(newValue: unknown): this;
    wrapperProps(wrapperProps: Record<string, string|number|ObservableItem>): this;
    inputProps(inputProps: Record<string, string|number|ObservableItem>): this;
    labelProps(labelProps: Record<string, string|number|ObservableItem>): this;
    errorProps(errorProps: Record<string, string|number|ObservableItem>): this;
    hintProps(hintProps: Record<string, string|number|ObservableItem>): this;
    focus(): this;
    blur(): this;
    leading(content: ValidChild): this;
    trailing(content: ValidChild): this;
    bottom(content: ValidChild): this;
    clearable(mode?: boolean | ObservableItem<boolean>): this;
    clearButtonIcon(clearButtonIcon: ValidChild): this;
    reset(): this;
    render(template: (description: FieldDescription, instance: FieldInterface) => ValidChild): this;
}


export declare function Field(name: string, type?: string, props?: Record<string, string|number|ObservableItem>): FieldInterface;
export declare namespace Field {


    function use(template: (description: FieldDescription, instance: FieldInterface) => ValidChild): void;


}
