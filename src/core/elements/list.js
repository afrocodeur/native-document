import HtmlElementWrapper from "../wrappers/HtmlElementWrapper";

/**
 * Creates an `<ol>` element.
 * @type {function(OlAttributes=, NdChild|NdChild[]=): HTMLOListElement}
 */
export const OrderedList = HtmlElementWrapper('ol');

/**
 * Creates a `<ul>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLUListElement}
 */
export const UnorderedList = HtmlElementWrapper('ul');

/**
 * Creates a `<li>` element.
 * @type {function(GlobalAttributes & { value?: number }=, NdChild|NdChild[]=): HTMLLIElement}
 */
export const ListItem = HtmlElementWrapper('li');

/**
 * Alias for {@link ListItem}.
 * @type {typeof ListItem}
 */
export const Li = ListItem;

/**
 * Alias for {@link OrderedList}.
 * @type {typeof OrderedList}
 */
export const Ol = OrderedList;

/**
 * Alias for {@link UnorderedList}.
 * @type {typeof UnorderedList}
 */
export const Ul = UnorderedList;
