// Image components type definitions
import { Attributes, NDElement } from './elements';

// Image Elements
export declare const Img: (src: string, attributes?: Attributes) => HTMLImageElement & { nd: NDElement };
export declare const AsyncImg: (
    src: string,
    defaultImage?: string,
    attributes?: Attributes,
    callback?: (error: Error | null, img?: HTMLImageElement) => void
) => HTMLImageElement & { nd: NDElement };
export declare const LazyImg: (src: string, attributes?: Attributes) => HTMLImageElement & { nd: NDElement };