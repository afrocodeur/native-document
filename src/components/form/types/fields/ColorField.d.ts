import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type ColorFieldDescription = {
    name: string;
    type: 'color';
    label: ValidChild | null;
    value: ObservableItem<string> | null;
    format: 'hex' | 'rgb' | 'hsl';
    presets: string[] | null;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface ColorFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: ColorFieldDescription, instance: ColorFieldInterface) => ValidChild): this;
    format(formatType: 'hex' | 'rgb' | 'hsl'): this;
    presets(colors: string[]): this;
    hex(message?: string): this;
    rgb(message?: string): this;
}


export declare function ColorField(name: string, props?: GlobalAttributes): ColorFieldInterface;
export declare namespace ColorField {


    function use(template: (description: ColorFieldDescription, instance: ColorFieldInterface) => ValidChild): void;


}
