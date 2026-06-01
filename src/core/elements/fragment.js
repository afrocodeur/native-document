import HtmlElementWrapper from '../wrappers/HtmlElementWrapper';

/**
 * Creates an empty `DocumentFragment` wrapper.
 * Useful for grouping elements without adding a DOM node.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): DocumentFragment}
 */
export const Fragment = HtmlElementWrapper('');
