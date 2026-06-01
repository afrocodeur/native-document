import type { ObservableItem } from '../../../../types/observable';

export interface HasValidation {
    required(message?: string): this;
    custom(validatorFn: (value: unknown, allValues?: Record<string, unknown>) => boolean, message?: string): this;
    addRule(validationFn: Function, params?: unknown[], message?: string): this;
    requiredIf(
        condition: ObservableItem<boolean> | boolean | string | ((v: Record<string, unknown>) => boolean),
        message?: string
    ): this;
    clearErrorOn(event: string): this;
    validateOn(event: string): this;
    showErrors(show?: boolean | ObservableItem<boolean>): this;
    hideErrors(): this;
    setError(error: string | string[]): this;
    validate(allValues?: Record<string, unknown>): { key: string; errors: string[] };
}
