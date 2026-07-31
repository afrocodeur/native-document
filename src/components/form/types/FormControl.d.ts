import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { FieldInterface } from './Field';
import type { GlobalAttributes } from '../../../../types/globals';

export type FormControlDescription = {
        data: unknown | null;
        fieldBuilder: ((form: FormControlInterface) => void) | null;
        layout: ((fields: Record<string, FieldInterface>) => ValidChild) | null;
        errorsMode: 'dispatch' | 'inline' | 'summary' | 'none';
        errorsPosition: 'top' | 'bottom';
        errorsMapper: Record<string, string> | null;
        renderErrors: ((errors: Record<string, string[]>) => ValidChild) | null;
        submitting: ObservableItem<boolean>;
        errors: ObservableItem<Record<string, string[]> | null>;
        isDirty: ObservableItem<boolean>;
        isValid: ObservableItem<boolean>;
        props: GlobalAttributes;
    };

export interface FormControlInterface extends BaseComponent {
    fields(fieldBuilder: (form: FormControlInterface) => void): this;
    get(fieldName: string): FieldInterface | null;
    layout(layoutCallback: (fields: Record<string, FieldInterface>) => ValidChild): this;
    errorsMode(mode: 'inline' | 'summary' | 'none'): this;
    dispatchErrors(mapper?: Record<string, string> | null): this;
    summarizeErrors(): Record<string, string[]>;
    dispatchAndSummarize(mapper?: Record<string, string> | null): this;
    errorsPosition(position: 'top' | 'bottom'): this;
    errorsAtTop(): this;
    errorsAtBottom(): this;
    renderErrors(renderFn: (errors: Record<string, string[]>) => ValidChild): this;
    reset(): this;
    resetField(name: string): this;
    submit(event?: Event): this;
    trigger(...fieldNames: string[]): this;
    disable(fieldName?: string | null): this;
    enable(fieldName?: string | null): this;
    values(): Record<string, unknown>;
    watch(fieldName: string, handler: (value: unknown, field: FieldInterface) => void): this;
    onSubmit(callback: (values: Record<string, unknown>, form: FormControlInterface) => void | Promise<void>): this;
    onPreventSubmit(callback: (event: Event) => void): this;
    onDebouncedSubmit(callback: (values: Record<string, unknown>) => void, delay?: number): this;
    onSuccess(callback: (values: Record<string, unknown>) => void): this;
    onError(callback: (errors: Record<string, string[]>) => void): this;
    onChange(callback: () => void): this;
    onReset(callback: () => void): this;
    onBeforeSubmit(callback: () => void): this;
    onAfterSubmit(callback: () => void): this;
    onValidationError(callback: (errors: Record<string, string[]>) => void): this;
    render(template: (description: FormControlDescription, instance: FormControlInterface) => ValidChild): this;
}


export declare function FormControl(props?: Record<string, unknown>): FormControlInterface;
export declare namespace FormControl {

    function setDefaultErrorsMapper(mapper: (error: Error) => Record<string, string|[]>): void;
    function use(template: (description: FormControlDescription, instance: FormControlInterface) => ValidChild): void;
    function create(props?: Record<string, unknown>): FormControlInterface;


}
