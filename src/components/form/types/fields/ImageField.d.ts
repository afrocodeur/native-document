import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FileFieldInterface } from './FileField';
import type { FileItemPreviewInterface } from './FileItemPreview';

export type ImageFieldDescription = {
    name: string;
    type: 'image';
    label: ValidChild | null;
    accept: string;
    multiple: boolean;
    mode: string | null;
    files: ObservableItem<FileItemPreviewInterface[]>;
    maxWidth: number | null;
    maxHeight: number | null;
    crop: boolean;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface ImageFieldInterface extends Omit<FileFieldInterface, 'render'> {
    render(renderFn: (description: ImageFieldDescription, instance: ImageFieldInterface) => ValidChild): this;
    maxWidth(width: number): this;
    maxHeight(height: number): this;
    crop(enabled?: boolean): this;
    dimensions(width: number, height: number, message?: string): this;
    maxDimensions(width: number, height: number, message?: string): this;
    minDimensions(width: number, height: number, message?: string): this;
    aspectRatio(ratio: number, message?: string): this;
}


export declare function ImageField(name: string, props?: GlobalAttributes): ImageFieldInterface;
export declare namespace ImageField {


    function use(template: (description: ImageFieldDescription, instance: ImageFieldInterface) => ValidChild): void;


}
