import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

interface SelectOption {
    value: unknown;
    label: ValidChild;
    props: GlobalAttributes;
}

interface SelectGroup {
    label: ValidChild;
    options: SelectOption[];
}

export type SelectFieldDescription = {
    name: string;
    type: 'select';
    label: ValidChild | null;
    options: SelectOption[];
    multiple: boolean;
    searchable: boolean;
    searchPlaceholder: string | null;
    clearable: boolean;
    groups: SelectGroup[] | null;
    multipleDisplay: 'text' | 'tags' | 'count' | 'truncate';
    truncateMax: number | null;
    removeSelected: boolean;
    renderItem: ((item: unknown, isSelected: boolean) => ValidChild) | null;
    truncateRender: ((count: number) => ValidChild) | false;
    countRender: ((count: number) => ValidChild) | false;
    selectedLabelRender: ((selected: unknown[]) => ValidChild) | false;
    value: ObservableItem<unknown> | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface SelectFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: SelectFieldDescription, instance: SelectFieldInterface) => ValidChild): this;
    options(opts: SelectOption[]): this;
    option(value: unknown, label: ValidChild, props?: GlobalAttributes): this;
    multiple(enabled?: boolean): this;
    searchable(enabled?: boolean, placeholder?: string | null): this;
    groups(groupsConfig: SelectGroup[]): this;
    multipleDisplay(mode: 'text' | 'tags' | 'count' | 'truncate'): this;
    multipleDisplayAsTags(): this;
    multipleDisplayAsText(): this;
    multipleDisplayAsCount(): this;
    multipleDisplayAsTruncate(max?: number): this;
    removeSelected(enabled?: boolean): this;
    truncateRender(callback: (count: number) => ValidChild): this;
    countRender(callback: (count: number) => ValidChild): this;
    selectedLabelRender(callback: (selected: unknown[]) => ValidChild): this;
    renderItem(callback: (item: unknown, isSelected: boolean) => ValidChild): this;
    onChange(handler: (value: unknown) => void): this;
}


export declare function SelectField(name: string, props?: GlobalAttributes): SelectFieldInterface;
export declare namespace SelectField {


    function use(template: (description: SelectFieldDescription, instance: SelectFieldInterface) => ValidChild): void;


}
