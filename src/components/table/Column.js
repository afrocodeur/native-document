
/**
 * Column definition for SimpleTable and DataTable. Configures key, header, alignment, sorting, rendering, pinning, and click handlers.
 *
 *
 * @example
 * const col = new Column('name')
 *     .title('Full name')
 *     .sortable()
 *     .align('left')
 *     .render((value, row, index) => Span(String(value)))
 *     .onClick((value, row, e) => console.log(row));
 *
 * @constructor
 * @param {string} key
 * @param {GlobalAttributes} [props={}]
 */
export default function Column(key, props = {}) {
    this.$description = {
        key,
        align: null,
        searchable: null,
        visible: null,
        header: null,
        render: null,
        colspan: null,
        pinned: null,
        rowspan: null,
        sortable: null,
        onClick: null,
        props
    };
}

Column.defaultTemplate = null;

/**
 * Registers the render template for Column.
 * @param {(description: {
 *     key: string,
 *     align: 'left'|'center'|'right'|null,
 *     searchable: boolean|null,
 *     visible: Observable<boolean>|boolean|null,
 *     header: NdChild|null,
 *     render: ((value: *, row: *, index: number) => NdChild)|null,
 *     colspan: number|null,
 *     pinned: 'left'|'right'|null,
 *     rowspan: number|null,
 *     sortable: boolean|((a: *, b: *) => number)|null,
 *     onClick: ((value: *, row: *, event: MouseEvent) => void)|null,
 *     props: GlobalAttributes,
 * }, instance: Column) => NdChild} template
 */
Column.use = function(template) {
    Column.defaultTemplate = template;
};

Column.prototype.isColumn = true;

/**
 * @param {((a: *, b: *) => number)|null} [customSortFn=null]
 * @returns {this}
 */
Column.prototype.sortable = function(customSortFn = null) {
    this.$description.sortable = customSortFn;
    return this;
};

/**
 * @returns {this}
 */
Column.prototype.searchable = function() {
    this.$description.searchable = true;
    return this;
};

/**
 * @returns {this}
 */
Column.prototype.hidden = function() {
    this.$description.visible = false;
    return this;
};

/**
 * @param {GlobalAttributes} [props]
 * @returns {this}
 */
Column.prototype.props = function(props = {}) {
    this.$description.props = props;
    return this;
};

/**
 * @param {string} orientation
 * @returns {this}
 */
Column.prototype.pinned = function(orientation) {
    this.$description.pinned = orientation;
    return this;
};

/**
 * @returns {this}
 */
Column.prototype.pinnedAtLeft = function() {
    this.$description.pinned = 'left';
    return this;
};

/**
 * @returns {this}
 */
Column.prototype.pinnedAtRight = function() {
    this.$description.pinned = 'right';
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [condition=true]
 * @returns {this}
 */
Column.prototype.visible = function(condition = true) {
    this.$description.visible = condition;
    return this;
};

/**
 * @param {string} align
 * @returns {this}
 */
Column.prototype.align = function(align) {
    this.$description.align = align;
    return this;
};

/**
 * @returns {this}
 */
Column.prototype.center = function() {
    return this.align('center');
};

/**
 * @returns {this}
 */
Column.prototype.right = function() {
    return this.align('right');
};

/**
 * @param {NdChild} template
 * @returns {this}
 */
Column.prototype.header = function(template) {
    this.$description.header = template;
    return this;
};

/**
 * @param {number} count
 * @returns {this}
 */
Column.prototype.colspan = function(count) {
    this.$description.colspan = count;
    return this;
};

/**
 * @param {number} count
 * @returns {this}
 */
Column.prototype.rowspan = function(count) {
    this.$description.rowspan = count;
    return this;
};

/**
 * @param {NdChild} title
 * @returns {this}
 */
Column.prototype.title = function(title) {
    this.$description.header = title;
    return this;
};

/**
 * @param {(row: *) => *} value
 * @returns {this}
 */
Column.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};

/**
 * @param {(value: *, row: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
Column.prototype.onClick = function(handler) {
    this.$description.onClick = handler;
    return this;
};