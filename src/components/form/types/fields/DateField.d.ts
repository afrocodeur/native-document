import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type DateFieldDescription = {
    name: string;
    type: 'date';
    label: ValidChild | null;
    format: string;
    minDate: ObservableItem<string | Date> | null;
    maxDate: ObservableItem<string | Date> | null;
    disabledDates: ObservableItem<(string | Date)[]> | null;
    clearable: boolean;
    withTime: ObservableItem<boolean>;
    range: ObservableItem<boolean>;
    firstDayOfWeek: 'monday' | 'sunday';
    locale: string | null;
    timeStep: number | null;
    timezone: string | null;
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

export interface DateFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: DateFieldDescription, instance: DateFieldInterface) => ValidChild): this;
    rangeSeparator(rangeSeparator: string): this;
    format(formatString: string): this;
    minDate(date: Date | string): this;
    maxDate(date: Date | string): this;
    disabledDates(dates: (Date | string)[]): this;
    withTime(enabled?: boolean): this;
    range(enabled?: boolean): this;
    mondayAsFirstDay(): this;
    sundayAsFirstDay(): this;
    locale(locale: string): this;
    timeStep(secondes: number): this;
    fromToday(): this;
    untilToday(): this;
    timezone(tz: string): this;
    useLocalTimezone(): this;
    modelStart(observable: ObservableItem<unknown>): this;
    modelEnd(observable: ObservableItem<unknown>): this;
    onChange(handler: (date: unknown) => void): this;
    onClear(handler: () => void): this;
    min(date: Date | string, message?: string): this;
    max(date: Date | string, message?: string): this;
    between(startDate: Date | string, endDate: Date | string, message?: string): this;
    before(date: Date | string, message?: string): this;
    weekday(message?: string): this;
    after(date: Date | string, message?: string): this;
}


export declare function DateField(name: string, props?: GlobalAttributes): DateFieldInterface;
export declare namespace DateField {


    function use(template: (description: DateFieldDescription, instance: DateFieldInterface) => ValidChild): void;


}
