import HtmlElementWrapper from "../wrappers/HtmlElementWrapper";

/**
 * Creates a `<dl>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDListElement}
 */
export const Dl = HtmlElementWrapper('dl');

/**
 * Creates a `<dt>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Dt = HtmlElementWrapper('dt');

/**
 * Creates a `<dd>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Dd = HtmlElementWrapper('dd');