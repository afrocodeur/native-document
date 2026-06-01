import type { ValidChild } from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';

export type FileNativeModeDescription = {
    props: GlobalAttributes;
};

export interface FileNativeModeInterface extends BaseComponent {
    render(renderFn: (description: FileNativeModeDescription, instance: FileNativeModeInterface) => ValidChild): this;
}


export declare function FileNativeMode(props?: GlobalAttributes): FileNativeModeInterface;
export declare namespace FileNativeMode {


    function use(template: (description: FileNativeModeDescription, instance: FileNativeModeInterface) => ValidChild): void;


}
