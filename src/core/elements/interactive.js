import HtmlElementWrapper from '../wrappers/HtmlElementWrapper';

/**
 * Creates a `<details>` element.
 * @type {function(DetailsAttributes=, NdChild|NdChild[]=): HTMLDetailsElement}
 */
export const Details = HtmlElementWrapper('details');

/**
 * Creates a `<summary>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Summary = HtmlElementWrapper('summary');

/**
 * Creates a `<dialog>` element.
 * @type {function(DialogAttributes=, NdChild|NdChild[]=): HTMLDialogElement}
 */
export const Dialog = HtmlElementWrapper('dialog');

/**
 * Creates a `<menu>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLMenuElement}
 */
export const Menu = HtmlElementWrapper('menu');