import Column from "./Column";
import { THeadCell } from "../../../elements";

export default function ColumnGroup(title, props = {}) {
    this.$description = {
        header: title,
        columns: [],
        align: null,
        props
    };
};

ColumnGroup.defaultTemplate = null;
ColumnGroup.use = function(template) {
    ColumnGroup.defaultTemplate = template;
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
