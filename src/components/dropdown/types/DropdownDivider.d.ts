import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';

export type DropdownDividerDescription = {
    props: Record<string, unknown>;
};

export interface DropdownDividerInterface extends BaseComponent {
    render(renderFn: (desc: unknown, instance: DropdownDividerInterface) => ValidChild): this;
}


export declare function DropdownDivider(props?: Record<string, unknown>): DropdownDividerInterface;
export declare namespace DropdownDivider {


    function use(template: (description: DropdownDividerDescription, instance: DropdownDividerInterface) => ValidChild): void;


}
