import type { ValidChild } from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';

export type FileDropzoneModeDescription = {
    icon: ValidChild | null;
    text: ValidChild;
    hint: ValidChild | null;
    height: string | number | null;
    renderZone: ((desc: FileDropzoneModeDescription, instance: FileDropzoneModeInterface) => ValidChild) | null;
    removeIcon: ValidChild | null;
    props: GlobalAttributes;
};

export interface FileDropzoneModeInterface extends BaseComponent {
    render(renderFn: (description: FileDropzoneModeDescription, instance: FileDropzoneModeInterface) => ValidChild): this;
    icon(icon: ValidChild): this;
    text(text: ValidChild): this;
    hint(hint: ValidChild): this;
    height(value: string | number): this;
    renderZone(fn: (desc: FileDropzoneModeDescription, instance: FileDropzoneModeInterface) => ValidChild): this;
    removeIcon(icon: ValidChild): this;
}

export declare function FileDropzoneMode(props?: GlobalAttributes): FileDropzoneModeInterface;
export declare namespace FileDropzoneMode {
    function use(template: (description: FileDropzoneModeDescription, instance: FileDropzoneModeInterface) => ValidChild): void;
}