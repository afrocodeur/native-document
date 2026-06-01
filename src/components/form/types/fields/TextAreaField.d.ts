import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type TextAreaFieldDescription = {
    name: string;
    type: 'textarea';
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<string> | null;
    rows: number;
    cols: number | null;
    resize: 'none' | 'horizontal' | 'vertical' | 'both';
    autoGrow: boolean;
    characterCounter: boolean;
    wordCount: boolean;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface TextAreaFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: TextAreaFieldDescription, instance: TextAreaFieldInterface) => ValidChild): this;
    rows(value: number): this;
    cols(value: number): this;
    resize(value: 'none' | 'horizontal' | 'vertical' | 'both'): this;
    autoGrow(enabled?: boolean): this;
    characterCounter(enabled?: boolean): this;
    wordCount(min: number, max: number, message?: string): this;
}


export declare function TextAreaField(name: string, props?: GlobalAttributes): TextAreaFieldInterface;
export declare namespace TextAreaField {


    function use(template: (description: TextAreaFieldDescription, instance: TextAreaFieldInterface) => ValidChild): void;


}
