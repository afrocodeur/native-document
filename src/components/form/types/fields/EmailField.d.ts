import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type EmailFieldDescription = {
    name: string;
    type: 'email';
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<string> | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface EmailFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: EmailFieldDescription, instance: EmailFieldInterface) => ValidChild): this;
    email(message?: string): this;
    allowedDomain(allowedDomains: string[], message?: string): this;
    notAllowedDomain(blockedDomains: string[], message?: string): this;
}


export declare function EmailField(name: string, defaultConfig?: GlobalAttributes): EmailFieldInterface;
export declare namespace EmailField {


    function use(template: (description: EmailFieldDescription, instance: EmailFieldInterface) => ValidChild): void;


}
