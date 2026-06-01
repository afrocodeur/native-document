import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';

export type SwitchDescription = {
        value: ObservableItem<boolean>;
        label: ValidChild | null;
        labelPosition: ObservableItem<'left' | 'right'>;
        variant: ObservableItem<string>;
        outline: boolean;
        disabled: boolean | ObservableItem<boolean>;
        loading: boolean | ObservableItem<boolean>;
        readonly: boolean | ObservableItem<boolean>;
        onIcon: ValidChild | null;
        offIcon: ValidChild | null;
        innerOnLabel: ValidChild | null;
        innerOffLabel: ValidChild | null;
    };

export interface SwitchInterface extends BaseComponent {
    model(value: boolean | ObservableItem<boolean>): this;
    label(label: ValidChild): this;
    innerLabel(onLabel: ValidChild, offLabel: ValidChild): this;
    labelPosition(position: 'left' | 'right'): this;
    variant(name: string): this;
    primary(): this;
    secondary(): this;
    danger(): this;
    success(): this;
    warning(): this;
    ghost(): this;
    link(): this;
    outline(): this;
    disabled(condition?: boolean | ObservableItem<boolean>): this;
    loading(isLoading?: boolean | ObservableItem<boolean>): this;
    readonly(condition?: boolean | ObservableItem<boolean>): this;
    icon(onIcon: ValidChild, offIcon: ValidChild): this;
    toggle(): this;
    render(renderFn: (description: SwitchDescription, instance: SwitchInterface) => ValidChild): this;
    setOn(): this;
    setOf(): this;
    onChange(handler: (value: boolean) => void): this;
    onOn(handler: () => void): this;
    onOff(handler: () => void): this;
}


export declare function Switch(props?: Record<string, unknown>): SwitchInterface;
export declare namespace Switch {


    function use(template: (description: SwitchDescription, instance: SwitchInterface) => ValidChild): void;


}
