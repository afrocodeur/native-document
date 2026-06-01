import Column from './types/Column';
import { THeadCell } from '../../../elements';

/**
 * Groups multiple columns under a shared header in SimpleTable/DataTable.
 *
 *
 * @example
 * const group = new ColumnGroup('Personal info')
 *     .column('firstName', 'First name')
 *     .column('lastName', 'Last name')
 *     .align('center');
 *
 * @constructor
 * @param {NdChild} title
 * @param {GlobalAttributes} [props={}]
 */
export default function ColumnGroup(title, props = {}) {
    this.$description = {
        header: title,
        columns: [],
        align: null,
        props,
    };
};

ColumnGroup.defaultTemplate = null;

/**
 * Registers the render template for ColumnGroup.
 * @param {(description: {
 *     header: NdChild,
 *     columns: Column[],
 *     align: 'left'|'center'|'right'|null,
 *     props: GlobalAttributes,
 * }, instance: ColumnGroup) => NdChild} template
 */
ColumnGroup.use = function(template) {
    ColumnGroup.defaultTemplate = template;
};

ColumnGroup.prototype.isGroup = true;

/**
 * @param {string} key
 * @param {NdChild} title
 * @param {((col: Column) => void)} [callback]
 * @returns {this}
 */
ColumnGroup.prototype.column = function(key, title, callback) {
    const column = new Column(key);
    column.title(title);
    callback && callback(column);
    this.$description.columns.push(column);
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
ColumnGroup.prototype.title = function(title) {
    this.$description.header = title;
    return this;
};

/**
 * @returns {Column[]}
 */
ColumnGroup.prototype.columns = function() {
    return this.$description.columns;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
ColumnGroup.prototype.header = function(title) {
    this.$description.header = title;
    return this;
};

/**
 * @param {string} align
 * @returns {this}
 */
ColumnGroup.prototype.align = function(align) {
    this.$description.align = align;
    return this;
};
