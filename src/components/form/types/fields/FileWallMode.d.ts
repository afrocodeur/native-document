import type { ValidChild } from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';
import type { FileItemPreviewInterface } from './FileItemPreview';

export type FileWallModeDescription = {
    cellSize: string | number;
    addLabel: ValidChild;
    addIcon: ValidChild | null;
    renderCell: ((file: File, preview: FileItemPreviewInterface) => ValidChild) | null;
    renderAdd: (() => ValidChild) | null;
    props: GlobalAttributes;
};

export interface FileWallModeInterface extends BaseComponent {
    render(renderFn: (description: FileWallModeDescription, instance: FileWallModeInterface) => ValidChild): this;
    cellSize(size: string | number): this;
    addLabel(label: ValidChild): this;
    addIcon(icon: ValidChild): this;
    renderCell(fn: (file: File, preview: FileItemPreviewInterface) => ValidChild): this;
    renderAdd(fn: () => ValidChild): this;
}


export declare function FileWallMode(props?: GlobalAttributes): FileWallModeInterface;
export declare namespace FileWallMode {


    function use(template: (description: FileWallModeDescription, instance: FileWallModeInterface) => ValidChild): void;


}
