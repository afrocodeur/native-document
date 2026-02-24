import HtmlElementWrapper from "../wrappers/HtmlElementWrapper";

/**
 * Creates a `<time>` element.
 * @type {function(TimeAttributes=, NdChild|NdChild[]=): HTMLTimeElement}
 */
export const Time = HtmlElementWrapper('time');

/**
 * Creates a `<data>` element.
 * @type {function(GlobalAttributes & { value?: Observable<string>|string }=, NdChild|NdChild[]=): HTMLDataElement}
 */
export const Data = HtmlElementWrapper('data');

/**
 * Creates an `<address>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Address = HtmlElementWrapper('address');

/**
 * Creates a `<kbd>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Kbd = HtmlElementWrapper('kbd');

/**
 * Creates a `<samp>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Samp = HtmlElementWrapper('samp');

/**
 * Creates a `<var>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Var = HtmlElementWrapper('var');

/**
 * Creates a `<wbr>` element.
 * @type {function(GlobalAttributes=): HTMLElement}
 */
export const Wbr = HtmlElementWrapper('wbr');