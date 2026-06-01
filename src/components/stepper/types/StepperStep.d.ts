import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type StepperStepDescription = {
        icon: ValidChild | null;
        label: ValidChild;
        description: ValidChild | null;
        content: ValidChild | null;
        status: ObservableItem<'pending' | 'completed' | 'error'>;
        optional: ObservableItem<boolean>;
        disabled: ObservableItem<boolean>;
        completed: ObservableItem<boolean>;
        error: ObservableItem<boolean>;
        data: unknown | null;
        render: ((desc: StepperStepDescription, instance: StepperStepInterface) => ValidChild) | null;
        key: string | null;
        index: ObservableItem<number>;
        isVisible: ObservableItem<boolean>;
        props: GlobalAttributes;
    };

export interface StepperStepInterface extends BaseComponent {
    icon(icon: ValidChild): this;
    label(label: ValidChild): this;
    description(description: ValidChild): this;
    content(content: ValidChild): this;
    status(status: 'pending' | 'completed' | 'error'): this;
    optional(optional?: boolean): this;
    disabled(disabled?: boolean): this;
    updateStatus(status: 'pending' | 'completed' | 'error'): void;
    completed(completed?: boolean): this;
    error(error?: boolean): this;
    reset(): this;
    data(data: unknown): this;
    key(key: string): this;
    getKey(): string;
    visibility(condition: ObservableItem<boolean> | boolean | (() => ObservableItem<boolean>)): this;
    validator(validatorFn: (step: StepperStepInterface) => boolean | Promise<boolean>): this;
    validate(): boolean | Promise<boolean>;

    render(renderFn: (description: StepperStepDescription, instance: StepperStepInterface) => ValidChild): this;
}


export declare function StepperStep(label: ValidChild, props?: Record<string, unknown>): StepperStepInterface;
export declare namespace StepperStep {


    function use(template: (description: StepperStepDescription, instance: StepperStepInterface) => ValidChild): void;


}
