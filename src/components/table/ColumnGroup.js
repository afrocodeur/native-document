import Column from "./Column";
import { THeadCell } from "../../../elements";

export default function ColumnGroup(title, configs = {}) {
    this.$description = {
        header: title,
        columns: [],
        align: null,
        ...configs
    };
};

ColumnGroup.defaultHeader = null;
ColumnGroup.use = function(template) {
    ColumnGroup.defaultHeader = template.header || ColumnGroup.defaultHeader;
};

ColumnGroup.prototype.isGroup = true;

ColumnGroup.prototype.column = function(key, title, callback) {
    const column = new Column(key);
    column.title(title);
    callback && callback(column);
    this.$description.columns.push(column);
    return this;
};

ColumnGroup.prototype.title = function(title) {
    this.$description.header = title;
    return this;
};

ColumnGroup.prototype.columns = function() {
    return this.$description.columns;
};

ColumnGroup.prototype.header = function(title) {
    this.$description.header = title;
    return this;
};

ColumnGroup.prototype.align = function(align) {
    this.$description.align = align;
    return this;
};


ColumnGroup.prototype.buildHeader = function() {
    const header = this.$description.header || ColumnGroup.defaultHeader;
    if(typeof header === 'function') {
        return header(this);
    }
    return THeadCell({ colspan: this.$description.columns.length }, header);
};