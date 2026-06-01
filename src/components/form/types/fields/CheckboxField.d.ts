import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type CheckboxFieldDescription = {
    name: string;
    type: 'checkbox';
    label: ValidChild | null;
    checked: ObservableItem<boolean> | boolean;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface CheckboxFieldInterface extends Omit<FieldInterface, 'render' | 'model'> {
    render(renderFn: (description: CheckboxFieldDescription, instance: CheckboxFieldInterface) => ValidChild): this;
    model(observable: ObservableItem<boolean>): this;
    checked(): boolean;
}


export declare function CheckboxField(name: string, props?: GlobalAttributes): CheckboxFieldInterface;
export declare namespace CheckboxField {


    function use(template: (description: CheckboxFieldDescription, instance: CheckboxFieldInterface) => ValidChild): void;


}
