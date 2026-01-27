
export default function Column(key, configs = {}) {
    this.$description = {
        key,
        align: null,
        searchable: null,
        visible: null,
        header: null,
        render: null,
        colspan: null,
        rowspan: null,
        ...configs
    };
}

Column.defaultRender = null;
Column.defaultHeader = null;

Column.use = function(template) {
    Column.defaultRender = template.render || Column.defaultRender;
    Column.defaultHeader = template.header || Column.defaultHeader;
};

Column.prototype.isColumn = true;

Column.prototype.sortable = function(customSortFn = null) {
    this.$description.sortable = customSortFn;
};

Column.prototype.searchable = function() {
    this.$description.searchable = true;
    return this;
};

Column.prototype.hidden = function() {
    this.$description.visible = false;
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


Column.prototype.buildHeader = function(rowSpan = null) {
    const header = this.$description.header;
    if(typeof header === 'function') {
        return header(this);
    }
    return THeadCell({ rowspan: rowSpan  }, header);
};

Column.prototype.buildCell = function(rowData) {
    const render = this.$description.render || Column.defaultRender;
    if(typeof render === 'string' && rowData[render] !== undefined) {
        return rowData[render];
    }
    if(typeof render === 'function') {
        return render(rowData, this);
    }
    return rowData[this.$description.key] ?? null;
};