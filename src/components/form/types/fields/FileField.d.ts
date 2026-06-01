import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { FieldInterface } from '../Field';
import type { FileItemPreviewInterface } from './FileItemPreview';

export type FileFieldDescription = {
    name: string;
    type: 'file';
    label: ValidChild | null;
    accept: string | null;
    multiple: boolean;
    mode: 'native' | 'dropzone' | 'button' | 'wall' | 'avatar' | null;
    files: ObservableItem<FileItemPreviewInterface[]>;
    fileIcons: Array<(file: File) => ValidChild>;
    disabled: boolean | ObservableItem<boolean>;
    readonly: boolean | ObservableItem<boolean>;
    hasErrors: ObservableItem<boolean>;
    errors: ObservableItem<string[]>;
    showErrors: ObservableItem<boolean>;
    props: GlobalAttributes;
};

export interface FileFieldInterface extends Omit<FieldInterface, 'render' | 'reset'> {
    accept(mimeTypes: string | string[]): this;
    multiple(enabled?: boolean): this;
    mode(mode: 'native' | 'dropzone' | 'button' | 'wall' | 'avatar'): this;
    maxSize(bytes: number, message?: string): this;
    minSize(bytes: number, message?: string): this;
    mimeTypes(types: string[], message?: string): this;
    extensions(extensions: string[], message?: string): this;
    maxFiles(max: number, message?: string): this;
    minFiles(min: number, message?: string): this;
    onFileAdd(handler: (file: File) => void): this;
    onReset(handler: () => void): this;
    onFileRemove(handler: (file: File) => void): this;
    addFile(file: File, update?: boolean): this;
    setFiles(files: File[]): this;
    addFiles(files: File[]): this;
    removeFile(file: File): this;
    getFiles(): File[];
    reset(): this;
    fileIcon(desc: (file: File) => ValidChild): this;
    fileIcons(icons: Record<string, ValidChild>): this;
    render(renderFn: (description: FileFieldDescription, instance: FileFieldInterface) => ValidChild): this;
}


export declare function FileField(name: string, props?: GlobalAttributes): FileFieldInterface;
export declare namespace FileField {


    function use(template: (description: FileFieldDescription, instance: FileFieldInterface) => ValidChild): void;


}
