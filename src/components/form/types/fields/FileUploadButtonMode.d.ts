import type { ValidChild } from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';
import type { FileItemPreviewInterface } from './FileItemPreview';

export type FileUploadButtonModeDescription = {
    buttonLabel: ValidChild;
    buttonIcon: ValidChild | null;
    showProgress: boolean;
    renderItem: ((file: File, preview: FileItemPreviewInterface) => ValidChild) | null;
    renderButton: ((desc: unknown, instance: FileUploadButtonModeInterface) => ValidChild) | null;
    renderList: ((files: File[]) => ValidChild) | null;
    props: GlobalAttributes;
};

export interface FileUploadButtonModeInterface extends BaseComponent {
    render(renderFn: (description: FileUploadButtonModeDescription, instance: FileUploadButtonModeInterface) => ValidChild): this;
    buttonLabel(label: ValidChild): this;
    buttonIcon(icon: ValidChild): this;
    showProgress(enabled?: boolean): this;
    renderItem(fn: (file: File, preview: FileItemPreviewInterface) => ValidChild): this;
    renderButton(fn: (desc: unknown, instance: FileUploadButtonModeInterface) => ValidChild): this;
    renderList(fn: (files: File[]) => ValidChild): this;
}


export declare function FileUploadButtonMode(props?: GlobalAttributes): FileUploadButtonModeInterface;
export declare namespace FileUploadButtonMode {


    function use(template: (description: FileUploadButtonModeDescription, instance: FileUploadButtonModeInterface) => ValidChild): void;


}
