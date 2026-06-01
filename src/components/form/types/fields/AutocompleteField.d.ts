import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type AutocompleteFieldDescription = {
    name: string;
    type: 'autocomplete';
    label: ValidChild | null;
    placeholder: ValidChild | null;
    value: ObservableItem<unknown> | null;
    source: unknown[] | ((query: string) => Promise<unknown[]>) | null;
    minChars: number;
    debounce: number;
    maxResults: number;
    valueKey: string;
    labelKey: string;
    renderItem: ((item: unknown) => ValidChild) | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface AutocompleteFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: AutocompleteFieldDescription, instance: AutocompleteFieldInterface) => ValidChild): this;
    source(dataSource: unknown[] | ((query: string) => Promise<unknown[]>)): this;
    minChars(min: number): this;
    debounce(ms: number): this;
    maxResults(max: number): this;
    oneOf(allowedValues: unknown[], message?: string): this;
    valueKey(key: string): this;
    labelKey(key: string): this;
    onSelect(handler: (item: unknown) => void): this;
    renderItem(callback: (item: unknown) => ValidChild): this;
}


export declare function AutocompleteField(name: string, props?: GlobalAttributes): AutocompleteFieldInterface;
export declare namespace AutocompleteField {


    function use(template: (description: AutocompleteFieldDescription, instance: AutocompleteFieldInterface) => ValidChild): void;


}
