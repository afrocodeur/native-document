
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
        props
    };
}

Column.defaultTemplate = null;

Column.use = function(template) {
    Column.defaultTemplate = template;
};

Column.prototype.isColumn = true;

Column.prototype.sortable = function(customSortFn = null) {
    this.$description.sortable = customSortFn;
    return this;
};

Column.prototype.searchable = function() {
    this.$description.searchable = true;
    return this;
};

Column.prototype.hidden = function() {
    this.$description.visible = false;
    return this;
};

Column.prototype.pinned = function(orientation) {
    this.$description.pinned = orientation;
    return this;
};

Column.prototype.pinnedAtLeft = function() {
    this.$description.pinned = 'left';
    return this;
};

Column.prototype.pinnedAtRight = function() {
    this.$description.pinned = 'right';
    return this;
};

Column.prototype.visible = function(condition = true) {
    this.$description.visible = condition;
    return this;
};

Column.prototype.align = function(align) {
    this.$description.align = align;
    return this;
};

Column.prototype.center = function() {
    return this.align('center');
};

Column.prototype.right = function() {
    return this.align('right');
};

Column.prototype.header = function(template) {
    this.$description.header = template;
    return this;
};

Column.prototype.colspan = function(count) {
    this.$description.colspan = count;
    return this;
};

Column.prototype.rowspan = function(count) {
    this.$description.rowspan = count;
    return this;
};

Column.prototype.title = function(title) {
    this.$description.header = title;
    return this;
};

Column.prototype.render = function(render) {
    this.$description.render = render;
    return this;
};

Column.prototype.value = function(value) {
    this.$description.value = value;
    return this;
};
