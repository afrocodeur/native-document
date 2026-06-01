import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type TelFieldDescription = {
    name: string;
    type: 'tel';
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<string> | null;
    countryCode: boolean;
    mask: string | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface TelFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: TelFieldDescription, instance: TelFieldInterface) => ValidChild): this;
    phone(message?: string): this;
    countryCode(enabled?: boolean): this;
    mask(pattern: string): this;
}


export declare function TelField(name: string, props?: GlobalAttributes): TelFieldInterface;
export declare namespace TelField {


    function use(template: (description: TelFieldDescription, instance: TelFieldInterface) => ValidChild): void;


}
