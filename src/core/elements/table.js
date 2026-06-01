import HtmlElementWrapper from '../wrappers/HtmlElementWrapper';

/**
 * Creates a `<caption>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableCaptionElement}
 */
export const Caption = HtmlElementWrapper('caption');

/**
 * Creates a `<table>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableElement}
 */
export const Table = HtmlElementWrapper('table');

/**
 * Creates a `<thead>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
 */
export const THead = HtmlElementWrapper('thead');

/**
 * Creates a `<tfoot>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
 */
export const TFoot = HtmlElementWrapper('tfoot');

/**
 * Creates a `<tbody>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
 */
export const TBody = HtmlElementWrapper('tbody');

/**
 * Creates a `<tr>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableRowElement}
 */
export const Tr = HtmlElementWrapper('tr');

/**
 * Alias for {@link Tr}.
 * @type {typeof Tr}
 */
export const TRow = Tr;

/**
 * Creates a `<th>` element.
 * @type {function(ThAttributes=, NdChild|NdChild[]=): HTMLTableCellElement}
 */
export const Th = HtmlElementWrapper('th');

/**
 * Alias for {@link Th}.
 * @type {typeof Th}
 */
export const THeadCell = Th;

/**
 * Alias for {@link Th}.
 * @type {typeof Th}
 */
export const TFootCell = Th;

/**
 * Creates a `<td>` element.
 * @type {function(TdAttributes=, NdChild|NdChild[]=): HTMLTableCellElement}
 */
export const Td = HtmlElementWrapper('td');

/**
 * Alias for {@link Td}.
 * @type {typeof Td}
 */
export const TBodyCell = Td;