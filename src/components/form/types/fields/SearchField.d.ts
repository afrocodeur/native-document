import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type SearchFieldDescription = {
    name: string;
    type: 'search';
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<string> | null;
    debounce: number;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface SearchFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: SearchFieldDescription, instance: SearchFieldInterface) => ValidChild): this;
    debounce(ms: number): this;
}


export declare function SearchField(name: string, props?: GlobalAttributes): SearchFieldInterface;
export declare namespace SearchField {


    function use(template: (description: SearchFieldDescription, instance: SearchFieldInterface) => ValidChild): void;


}
