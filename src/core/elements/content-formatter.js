import HtmlElementWrapper from '../wrappers/HtmlElementWrapper';

/**
 * Creates a `<div>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDivElement}
 */
export const Div = HtmlElementWrapper('div');

/**
 * Creates a `<span>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLSpanElement}
 */
export const Span = HtmlElementWrapper('span');

/**
 * Creates a `<label>` element.
 * @type {function(LabelAttributes=, NdChild|NdChild[]=): HTMLLabelElement}
 */
export const Label = HtmlElementWrapper('label');

/**
 * Creates a `<p>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLParagraphElement}
 */
export const P = HtmlElementWrapper('p');

/**
 * Alias for {@link P}.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLParagraphElement}
 */
export const Paragraph = P;

/**
 * Creates a `<i>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const I = HtmlElementWrapper('i');
export const Italic = I;

/**
 * Creates a `<strong>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Strong = HtmlElementWrapper('strong');

/**
 * Creates a `<strong>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const B = HtmlElementWrapper('b');
export const Bold = B;

/**
 * Creates a `<h1>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H1 = HtmlElementWrapper('h1');

/**
 * Creates a `<h2>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H2 = HtmlElementWrapper('h2');

/**
 * Creates a `<h3>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H3 = HtmlElementWrapper('h3');

/**
 * Creates a `<h4>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H4 = HtmlElementWrapper('h4');

/**
 * Creates a `<h5>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H5 = HtmlElementWrapper('h5');

/**
 * Creates a `<h6>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
 */
export const H6 = HtmlElementWrapper('h6');

/**
 * Creates a `<br>` element.
 * @type {function(GlobalAttributes=): HTMLBRElement}
 */
export const Br = HtmlElementWrapper('br', null, true);

/**
 * Creates an `<a>` element.
 * @type {function(AnchorAttributes=, NdChild|NdChild[]=): HTMLAnchorElement}
 */
export const Link = HtmlElementWrapper('a');

/**
 * Creates a `<pre>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLPreElement}
 */
export const Pre = HtmlElementWrapper('pre');

/**
 * Creates a `<code>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Code = HtmlElementWrapper('code');

/**
 * Creates a `<blockquote>` element.
 * @type {function(GlobalAttributes & { cite?: string }=, NdChild|NdChild[]=): HTMLQuoteElement}
 */
export const Blockquote = HtmlElementWrapper('blockquote');

/**
 * Creates an `<hr>` element.
 * @type {function(GlobalAttributes=): HTMLHRElement}
 */
export const Hr = HtmlElementWrapper('hr', null, true);

/**
 * Creates an `<em>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Em = HtmlElementWrapper('em');

/**
 * Creates a `<small>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Small = HtmlElementWrapper('small');

/**
 * Creates a `<mark>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Mark = HtmlElementWrapper('mark');

/**
 * Creates a `<del>` element.
 * @type {function(ModAttributes=, NdChild|NdChild[]=): HTMLModElement}
 */
export const Del = HtmlElementWrapper('del');

/**
 * Creates an `<ins>` element.
 * @type {function(ModAttributes=, NdChild|NdChild[]=): HTMLModElement}
 */
export const Ins = HtmlElementWrapper('ins');

/**
 * Creates a `<sub>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Sub = HtmlElementWrapper('sub');

/**
 * Creates a `<sup>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Sup = HtmlElementWrapper('sup');

/**
 * Creates an `<abbr>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Abbr = HtmlElementWrapper('abbr');

/**
 * Creates a `<cite>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
 */
export const Cite = HtmlElementWrapper('cite');

/**
 * Creates a `<q>` element.
 * @type {function(GlobalAttributes & { cite?: string }=, NdChild|NdChild[]=): HTMLQuoteElement}
 */
export const Quote = HtmlElementWrapper('q');
