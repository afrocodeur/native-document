import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';

export type HiddenFieldDescription = {
    name: string;
    type: 'hidden';
    value: ObservableItem<unknown> | null;
    defaultValue: unknown;
    props: GlobalAttributes;
};

export interface HiddenFieldInterface extends Omit<FieldInterface, 'render'> {
    render(renderFn: (description: HiddenFieldDescription, instance: HiddenFieldInterface) => ValidChild): this;
}


export declare function HiddenField(name: string, props?: GlobalAttributes): HiddenFieldInterface;
export declare namespace HiddenField {


    function use(template: (description: HiddenFieldDescription, instance: HiddenFieldInterface) => ValidChild): void;


}
