import type { ValidChild } from '../../../../../types/elements';
import type { ObservableItem } from '../../../../../types/observable';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';

export type FileItemPreviewDescription = {
    file: File | null;
    status: ObservableItem<'idle' | 'uploading' | 'done' | 'error'>;
    progress: ObservableItem<number>;
    error: ObservableItem<string | null>;
    props: GlobalAttributes;
};

export interface FileItemPreviewInterface extends BaseComponent {
    render(renderFn: (description: FileItemPreviewDescription, instance: FileItemPreviewInterface) => ValidChild): this;
    file(): File;
    status(status: 'idle' | 'uploading' | 'done' | 'error'): this;
    progress(value: number): this;
    error(message: string): this;
    done(): this;
    uploading(): this;
    onClick(handler: (file: File, event: MouseEvent) => void): this;
    onRemove(handler: (file: File) => void): this;
    onReplace(handler: (file: File) => void): this;
}


export declare function FileItemPreview(file: File, props?: GlobalAttributes): FileItemPreviewInterface;
export declare namespace FileItemPreview {


    function use(template: (description: FileItemPreviewDescription, instance: FileItemPreviewInterface) => ValidChild): void;


}
