import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { HasValidation } from '../../$traits/has-validation/HasValidation';
import type { FieldInterface } from './Field';
import type { GlobalAttributes } from '../../../../types/globals';

export type FieldCollectionDescription = {
        name: string;
        value: ObservableItem<unknown[]>;
        rules: Array<{ fn: Function; params: unknown; message: string }>;
        hasErrors: ObservableItem<boolean>;
        errors: ObservableItem<string[]>;
        showErrors: ObservableItem<boolean>;
        defaultItem: unknown;
        fieldBuilder: ((fields: FieldCollectionInterface, index: number) => ValidChild) | null;
        renderItem: ((item: unknown, index: number) => ValidChild) | null;
        renderAdd: (() => ValidChild) | null;
        transition: string | null;
        props: GlobalAttributes;
    };

export interface FieldCollectionInterface extends BaseComponent, HasValidation {
    fields(fieldBuilder: (fields: FieldCollectionInterface, index: number) => ValidChild): this;
    data(defaultItem: unknown): this;
    renderItem(fn: (item: unknown, index: number) => ValidChild): this;
    renderAdd(fn: () => ValidChild): this;
    transition(transitionName: string): this;
    model(observable: ObservableItem<unknown[]>): this;
    add(): void;
    remove(item: unknown): this;
    clear(): this;
    reset(): this;
    value(): unknown[];
    count(): number;
    isEmpty(): boolean;
    onChange(handler: () => void): this;
    onAdd(handler: () => void): this;
    onRemove(handler: (item: unknown) => void): this;
    min(minCount: number, message?: string): this;
    max(maxCount: number, message?: string): this;
    render(template: (description: FieldCollectionDescription, instance: FieldCollectionInterface) => ValidChild): this;
}


export declare function FieldCollection(name?: string, props?: Record<string, unknown>): FieldCollectionInterface;
export declare namespace FieldCollection {


    function use(template: (description: FieldCollectionDescription, instance: FieldCollectionInterface) => ValidChild): void;


}
