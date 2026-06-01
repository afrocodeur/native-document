import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';

export type PopoverFooterDescription = {
        content: ValidChild | null;
        data: unknown | null;
        render: ((desc: PopoverFooterDescription, instance: PopoverFooterInterface) => ValidChild) | null;
    };

export interface PopoverFooterInterface extends BaseComponent {
    content(content: ValidChild): this;
    data(data: unknown): this;
    render(renderFn: (desc: PopoverFooterDescription, instance: PopoverFooterInterface) => ValidChild): this;
}


export declare function PopoverFooter(content?: ValidChild, config?: Record<string, unknown>): PopoverFooterInterface;
export declare namespace PopoverFooter {


    function use(template: (description: PopoverFooterDescription, instance: PopoverFooterInterface) => ValidChild): void;


}
