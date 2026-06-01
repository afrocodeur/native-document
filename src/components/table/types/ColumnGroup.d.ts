import type { ValidChild } from '../../../../types/elements';
import type { ColumnInterface } from './Column';
import type { GlobalAttributes } from '../../../../types/globals';

export type ColumnGroupDescription = {
        header: ValidChild;
        columns: ColumnInterface[];
        align: 'left' | 'center' | 'right' | null;
        props: GlobalAttributes;
    };

export interface ColumnGroupInterface {
    column(key: string, title: ValidChild, callback?: (col: ColumnInterface) => void): this;
    title(title: ValidChild): this;
    header(title: ValidChild): this;
    columns(): ColumnInterface[];
    align(align: 'left' | 'center' | 'right'): this;
}


export declare function ColumnGroup(title: ValidChild, props?: Record<string, unknown>): ColumnGroupInterface;
export declare namespace ColumnGroup {


    function use(template: (description: ColumnGroupDescription, instance: ColumnGroupInterface) => ValidChild): void;


}
