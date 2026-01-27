import BaseComponent from "@components/BaseComponent";
import {Validator} from "@core";

export default function ListItem(content, config = {}) {
    if(!(this instanceof ListItem)) {
        return new ListItem(content, config);
    }

    this.$description = {
        content: content || null,
        icon: null,
        trailing: null,
        leading: null,
        disabled: false,
        selectable: false,
        selected: false,
        divider: false,
        data: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(ListItem);

ListItem.defaultTemplate = null;

ListItem.use = function(template) {
    ListItem.defaultTemplate = template.listItem;
};

ListItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

ListItem.prototype.label = function(label) {
    this.$description.content = label;
    return this;
};

ListItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

ListItem.prototype.leading = function(leading) {
    this.$description.leading = leading;
    return this;
};

ListItem.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
};

ListItem.prototype.leading = function(leading) {
    this.$description.leading = leading;
    return this;
};

ListItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

ListItem.prototype.selectable = function() {
    this.$description.selectable = true;
    if(Validator.isObservable(this.$description.selected)) {
        return this;
    }
    this.$description.selected = $(false);
    return this;
};

ListItem.prototype.selected = function(selected = true) {
    if(Validator.isObservable(this.$description.selected)) {
        this.$description.selected.set(selected);
        return this;
    }
    this.$description.selected = selected;
    return this;
};

ListItem.prototype.divider = function(show = true) {
    this.$description.divider = show;
    return this;
};

ListItem.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

ListItem.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};


ListItem.prototype.$build = function() {

};