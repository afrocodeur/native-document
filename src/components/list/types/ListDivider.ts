import type { ValidChild }      from '../../../../types/elements';
import type { GlobalAttributes } from '../../../../types/globals';

export type ListDividerDescription = {
    props: GlobalAttributes;
};

export interface ListDividerInterface {
    $description: ListDividerDescription;
}

export declare function ListDivider(props?: GlobalAttributes): ListDividerInterface;
export declare namespace ListDivider {
    function use(template: (description: ListDividerDescription, instance: ListDividerInterface) => ValidChild): void;
    let defaultTemplate: ((description: ListDividerDescription, instance: ListDividerInterface) => ValidChild) | null;
}