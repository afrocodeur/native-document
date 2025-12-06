// Image components type definitions
import {Attributes, ElementFunction, NDElement} from './elements';
import {ObservableItem} from "./observable";


export declare const BaseImage: ElementFunction;

// Image Elements
export declare const Img: (src: string | ObservableItem<string>, attributes?: Attributes) => HTMLImageElement & { nd: NDElement };
export declare const AsyncImg: (
    src: string | ObservableItem<string>,
    defaultImage?: string,
    attributes?: Attributes,
    callback?: (error: Error | null, img?: HTMLImageElement) => void
) => HTMLImageElement & { nd: NDElement };
export declare const LazyImg: (src: string | ObservableItem<string>, attributes?: Attributes) => HTMLImageElement & { nd: NDElement };