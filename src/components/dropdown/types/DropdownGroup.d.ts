import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';
import type { DropdownItemInterface } from './DropdownItem';

export type DropdownGroupDescription = {
    props: Record<string, unknown>;
};

export interface DropdownGroupInterface extends BaseComponent {
    add(item: DropdownItemInterface | ValidChild | unknown, props?: Record<string, unknown>): this;
    item(item: DropdownItemInterface | ValidChild | unknown, props?: Record<string, unknown>): this;
    group(groupBuilder: (group: DropdownGroupInterface) => void): this;
    divider(): this;
    render(template: (description: DropdownGroupDescription, instance: DropdownGroupInterface) => ValidChild): this;
}


export declare function DropdownGroup(props?: Record<string, unknown>): DropdownGroupInterface;
export declare namespace DropdownGroup {


    function use(template: (description: DropdownGroupDescription, instance: DropdownGroupInterface) => ValidChild): void;


}
