import HtmlElementWrapper from "../wrappers/HtmlElementWrapper"
import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";

/**
 * Creates an `<img>` element.
 * @type {function(ImgAttributes=): HTMLImageElement}
 */
export const BaseImage = HtmlElementWrapper('img');

/**
 * Creates an `<img>` element.
 * @param {Observable<string>|string} src
 * @param {Omit<ImgAttributes, 'src'>} [attributes]
 * @returns {HTMLImageElement}
 */
export const Img = function(src, attributes) {
    return BaseImage({ src, ...attributes });
};

/**
 * Creates an `<img>` that loads asynchronously, showing a placeholder until the image is ready.
 * Supports reactive `src` — automatically updates when the observable changes.
 * @param {Observable<string>|string} src                                        - Final image URL
 * @param {string|null}               defaultImage                               - Placeholder shown while loading
 * @param {Omit<ImgAttributes, 'src'>} attributes
 * @param {(error: NativeDocumentError|null, img: HTMLImageElement) => void} [callback]
 * @returns {HTMLImageElement}
 */
export const AsyncImg = function(src, defaultImage, attributes, callback) {
    const defaultSrc = Validator.isObservable(src) ? src.val() : src;
    const image = Img(defaultImage || defaultSrc, attributes);
    const img = new Image();

    img.onload = () => {
        Validator.isFunction(callback) && callback(null, image);
        image.src = Validator.isObservable(src) ? src.val() : src;
    };
    img.onerror = () => {
        Validator.isFunction(callback) && callback(new NativeDocumentError('Image not found'));
    };
    if(Validator.isObservable(src)) {
        src.subscribe(newSrc => {
            img.src = newSrc;
        });
    }
    img.src = defaultSrc;
    return image;
};

/**
 * Creates an `<img loading="lazy">` element.
 * @param {Observable<string>|string}          src
 * @param {Omit<ImgAttributes, 'src'|'loading'>} [attributes]
 * @returns {HTMLImageElement}
 */
export const LazyImg = function(src, attributes) {
    return Img(src, { ...attributes, loading: 'lazy' });
};