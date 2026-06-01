import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type MenuDividerDescription = { props: GlobalAttributes; };

export interface MenuDividerInterface extends BaseComponent {
    render(template: (description: MenuDividerDescription, instance: MenuDividerInterface) => ValidChild): this;
}


export declare function MenuDivider(props?: Record<string, unknown>): MenuDividerInterface;
export declare namespace MenuDivider {


    function use(template: (description: MenuDividerDescription, instance: MenuDividerInterface) => ValidChild): void;


}
