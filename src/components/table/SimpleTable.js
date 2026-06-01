import Column from "./types/Column";
import ColumnGroup from "./types/ColumnGroup";
import BaseComponent from "../BaseComponent";

/**
 *
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function SimpleTable(props = {}) {
    if(!(this instanceof SimpleTable)) {
        return new SimpleTable(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        header:      [],
        columns:     [],
        hasGroups:   false,
        data:        null,
        empty:       null,
        onRowClick:  null,
        rowProps:    null,
        noHeader:    null,
        cellProps:   null,
        headerProps: null,
        props
    };
}

BaseComponent.extends(SimpleTable);

SimpleTable.defaultTemplate = null;

/**
 * Registers the render template for SimpleTable.
 * @param {(description: {
 *     header: Array<Column|ColumnGroup>,
 *     columns: Column[],
 *     data: *[]|Observable<*[]>|null,
 *     empty: NdChild|null,
 *     onRowClick: ((row: *, event: MouseEvent) => void)|null,
 *     rowProps: ((row: *) => GlobalAttributes)|null,
 *     noHeader: boolean|null,
 *     props: GlobalAttributes,
 * }, instance: SimpleTable) => NdChild} template
 */
SimpleTable.use = function(template) {
    SimpleTable.defaultTemplate = template;
};

/**
 * @param {GlobalAttributes} [props]
 * @returns {SimpleTable}
 */
SimpleTable.create = function(props) {
    return new SimpleTable(props);
};

/**
 * @param {string} key
 * @param {NdChild} title
 * @param {GlobalAttributes} [props]
 * @param {((col: Column) => void)} [callback]
 * @returns {this}
 */
SimpleTable.prototype.column = function(key, title, props, callback) {
    if(typeof props === 'function') {
        callback = props;
        props = {};
    }
    const column = new Column(key);
    column.title(title);
    column.props(props);
    callback && callback(column);
    this.$description.columns.push(column);
    this.$description.header.push(column);
    return this;
};

/**
 * @param {NdChild} title
 * @param {(group: ColumnGroup) => void} callback
 * @returns {this}
 */
SimpleTable.prototype.group = function(title, callback) {
    const group = new ColumnGroup(title);
    callback && callback(group);
    this.$description.columns.push(...group.columns());
    this.$description.header.push(group);
    this.$description.hasGroups = true;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
SimpleTable.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
SimpleTable.prototype.empty = function(content) {
    this.$description.empty = content;
    return this;
};

/**
 * @returns {this}
 */
SimpleTable.prototype.noHeader = function() {
    this.$description.noHeader = true;
    return this;
};

/**
 * @param {(row: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
SimpleTable.prototype.onRowClick = function(handler) {
    this.$description.onRowClick = handler;
    return this;
};

/**
 * @param {(row: *) => GlobalAttributes} fn
 * @returns {this}
 */
SimpleTable.prototype.rowProps = function(fn) {
    this.$description.rowProps = fn;
    return this;
};