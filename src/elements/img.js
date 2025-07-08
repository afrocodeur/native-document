import HtmlElementWrapper from "../wrappers/HtmlElementWrapper"
import Validator from "../utils/validator";
import NativeDocumentError from "../errors/NativeDocumentError";

export const BaseImage = HtmlElementWrapper('img');
export const Img = function(src, attributes) {
    return BaseImage({ src, ...attributes });
};

/**
 *
 * @param {string} src
 * @param {string|null} defaultImage
 * @param {Object} attributes
 * @param {?Function} callback
 * @returns {Image}
 */
export const AsyncImg = function(src, defaultImage, attributes, callback) {
    const image = Img(defaultImage || src, attributes);
    const img = new Image();
    img.onload = () => {
        Validator.isFunction(callback) && callback(null, image);
        image.src = src;
    };
    img.onerror = () => {
        Validator.isFunction(callback) && callback(new NativeDocumentError('Image not found'));
    };
    if(Validator.isObservable(src)) {
        src.subscribe(newSrc => {
            img.src = newSrc;
        });
    }
    img.src = src;
    return image;
};

/**
 *
 * @param {string} src
 * @param {Object} attributes
 * @returns {Image}
 */
export const LazyImg = function(src, attributes) {
    return Img(src, { ...attributes, loading: 'lazy' });
};