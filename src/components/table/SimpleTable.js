import Column from "./Column";
import ColumnGroup from "./ColumnGroup";
import BaseComponent from "../BaseComponent";
import {call} from "@babel/traverse/lib/path/context";

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

SimpleTable.use = function(template) {
    SimpleTable.defaultTemplate = template;
};

SimpleTable.create = function(props) {
    return new SimpleTable(props);
};

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

SimpleTable.prototype.group = function(title, callback) {
    const group = new ColumnGroup(title);
    callback && callback(group);
    this.$description.columns.push(...group.columns());
    this.$description.header.push(group);
    this.$description.hasGroups = true;
    return this;
};

SimpleTable.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

SimpleTable.prototype.empty = function(content) {
    this.$description.empty = content;
    return this;
};

SimpleTable.prototype.noHeader = function() {
    this.$description.noHeader = true;
    return this;
};

SimpleTable.prototype.onRowClick = function(handler) {
    this.$description.onRowClick = handler;
    return this;
};

SimpleTable.prototype.rowProps = function(fn) {
    this.$description.rowProps = fn;
    return this;
};