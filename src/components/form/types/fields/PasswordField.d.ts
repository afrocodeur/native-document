import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type PasswordFieldDescription = {
    name: string;
    type: 'password';
    label: ValidChild | null;
    value: ObservableItem<string> | null;
    visibilityToggle: boolean;
    visibilityIcons: { show: ValidChild; hide: ValidChild };
    showStrengthMeter: boolean;
    strengthLabels: Record<number, string> | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface PasswordFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: PasswordFieldDescription, instance: PasswordFieldInterface) => ValidChild): this;
    strong(message?: string): this;
    containsNumber(message?: string): this;
    containsUppercase(message?: string): this;
    containsLowercase(message?: string): this;
    containsSpecialChar(message?: string): this;
    visibilityToggle(enabled?: boolean, icons?: { show?: ValidChild; hide?: ValidChild }): this;
    visibilityIcons(show: ValidChild, hide: ValidChild): this;
    showStrengthMeter(enabled?: boolean): this;
    strengthLabels(labels?: { weak?: string; fair?: string; good?: string; strong?: string; veryStrong?: string }): this;
    same(fieldName: string, message?: string): this;
    different(fieldName: string, message?: string): this;
}


export declare function PasswordField(name: string, props?: GlobalAttributes): PasswordFieldInterface;
export declare namespace PasswordField {


    function use(template: (description: PasswordFieldDescription, instance: PasswordFieldInterface) => ValidChild): void;


}
