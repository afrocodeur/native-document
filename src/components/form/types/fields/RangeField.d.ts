import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { NumberFieldInterface } from './NumberField';

export type RangeFieldDescription = {
    name: string;
    type: 'range';
    label: ValidChild | null;
    value: ObservableItem<number> | null;
    step: number | null;
    min: number | null;
    max: number | null;
    showValue: boolean;
    marks: number[] | Array<{ value: number; label?: ValidChild }> | null;
    showMarks: boolean;
    vertical: boolean;
    showTooltip: boolean;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface RangeFieldInterface extends Omit<NumberFieldInterface, 'render'> {
    render(renderFn: (description: RangeFieldDescription, instance: RangeFieldInterface) => ValidChild): this;
    showValue(enabled?: boolean): this;
    marks(marks: number[] | Array<{ value: number; label?: ValidChild }>): this;
    showMarks(enabled?: boolean): this;
    vertical(enabled?: boolean): this;
    showTooltip(enabled?: boolean): this;
}


export declare function RangeField(name: string, props?: GlobalAttributes): RangeFieldInterface;
export declare namespace RangeField {


    function use(template: (description: RangeFieldDescription, instance: RangeFieldInterface) => ValidChild): void;


}
