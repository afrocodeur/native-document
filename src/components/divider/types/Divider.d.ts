import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type DividerDescription = {
        orientation: 'horizontal' | 'vertical';
        variant: 'solid' | 'dashed' | 'dotted';
        thickness: number;
        spacing: number;
        label: ValidChild | null;
        labelPosition: 'leading' | 'center' | 'trailing';
        color: string | null;
        render: ((desc: DividerDescription, instance: DividerInterface) => ValidChild) | null;
        inset: number | null;
        indent: number | null;
        leading: number | null;
        trailing: number | null;
        props: GlobalAttributes;
    };

export interface DividerInterface extends BaseComponent {
    orientation(orientation: 'horizontal' | 'vertical'): this;
    horizontal(): this;
    vertical(): this;
    variant(variant: 'solid' | 'dashed' | 'dotted'): this;
    solid(): this;
    dashed(): this;
    dotted(): this;
    thickness(thickness: number): this;
    spacing(spacing: number): this;
    inset(inset: number): this;
    leading(leading: number): this;
    trailing(trailing: number): this;
    indent(leading: number, trailing: number): this;
    label(label: ValidChild): this;
    labelPosition(position: 'leading' | 'center' | 'trailing'): this;
    labelAtLeading(): this;
    labelAtCenter(): this;
    labelAtTrailing(): this;
    color(color: string): this;
    render(template: (description: DividerDescription, instance: DividerInterface) => ValidChild): this;
}


export declare function Divider(label?: ValidChild, props?: Record<string, unknown>): DividerInterface;
export declare namespace Divider {


    function use(template: (description: DividerDescription, instance: DividerInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: DividerInterface) => DividerInterface): void;
    function presets(presets: Record<string, (instance: DividerInterface) => DividerInterface>): void;


}
