// Image components type definitions
import { ElementFunctionNoChildren, NdHTMLElement } from './elements';
import { ImgAttributes } from './elements';
import { ObservableItem } from "./observable";

export declare const BaseImage: ElementFunctionNoChildren<ImgAttributes, HTMLImageElement>;

export declare const Img: (
    src: string | ObservableItem<string>,
    attributes?: Omit<ImgAttributes, 'src'>
) => NdHTMLElement<HTMLImageElement>;

export declare const AsyncImg: (
    src: string | ObservableItem<string>,
    defaultImage?: string | null,
    attributes?: Omit<ImgAttributes, 'src'>,
    callback?: (error: Error | null, img?: HTMLImageElement) => void
) => NdHTMLElement<HTMLImageElement>;

export declare const LazyImg: (
    src: string | ObservableItem<string>,
    attributes?: Omit<ImgAttributes, 'src' | 'loading'>
) => NdHTMLElement<HTMLImageElement>;