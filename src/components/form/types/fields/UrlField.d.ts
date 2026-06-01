import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type UrlFieldDescription = {
    name: string;
    type: 'url';
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

export interface UrlFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: UrlFieldDescription, instance: UrlFieldInterface) => ValidChild): this;
    url(message?: string): this;
    protocol(allowedProtocols: string[], message?: string): this;
    domain(allowedDomains: string[], message?: string): this;
}


export declare function UrlField(name: string, props?: GlobalAttributes): UrlFieldInterface;
export declare namespace UrlField {


    function use(template: (description: UrlFieldDescription, instance: UrlFieldInterface) => ValidChild): void;


}
