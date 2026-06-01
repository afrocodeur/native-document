import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type TimeFieldDescription = {
    name: string;
    type: 'time';
    label: ValidChild | null;
    format: string;
    step: number | null;
    clearable: ObservableItem<boolean>;
    range: ObservableItem<boolean>;
    valueStart: ObservableItem<unknown> | null;
    valueEnd: ObservableItem<unknown> | null;
    rangeSeparator: string | null;
    value: ObservableItem<unknown> | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface TimeFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: TimeFieldDescription, instance: TimeFieldInterface) => ValidChild): this;
    format(formatString: string): this;
    step(seconds: number): this;
    range(enabled?: boolean): this;
    modelStart(observable: ObservableItem<unknown>): this;
    modelEnd(observable: ObservableItem<unknown>): this;
    rangeSeparator(sep: string): this;
    onChange(handler: (value: unknown) => void): this;
    onClear(handler: () => void): this;
    min(time: string, message?: string): this;
    max(time: string, message?: string): this;
    between(startTime: string, endTime: string, message?: string): this;
    after(time: string, message?: string): this;
    before(time: string, message?: string): this;
}


export declare function TimeField(name: string, props?: GlobalAttributes): TimeFieldInterface;
export declare namespace TimeField {


    function use(template: (description: TimeFieldDescription, instance: TimeFieldInterface) => ValidChild): void;


}
