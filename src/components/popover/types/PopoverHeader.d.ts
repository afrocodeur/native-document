import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';

export type PopoverHeaderDescription = {
        content: ValidChild | null;
        showClose: boolean;
        data: unknown | null;
        render: ((desc: PopoverHeaderDescription, instance: PopoverHeaderInterface) => ValidChild) | null;
    };

export interface PopoverHeaderInterface extends BaseComponent {
    content(content: ValidChild): this;
    showClose(show?: boolean): this;
    data(data: unknown): this;
    render(renderFn: (desc: PopoverHeaderDescription, instance: PopoverHeaderInterface) => ValidChild): this;
}


export declare function PopoverHeader(content?: ValidChild, config?: Record<string, unknown>): PopoverHeaderInterface;
export declare namespace PopoverHeader {


    function use(template: (description: PopoverHeaderDescription, instance: PopoverHeaderInterface) => ValidChild): void;


}
