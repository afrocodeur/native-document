import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";

export default function Breadcrumb(config = {}) {
    if (!(this instanceof Breadcrumb)) {
        return new Breadcrumb(config);
    }

    this.$description = {
        separator: null,
        items: [],
        renderSeparator: null,
        renderItem: null,
        ...config,
    };
}

BaseComponent.extends(Breadcrumb, EventEmitter);

Breadcrumb.use = function(template) {};
Breadcrumb.defaultTemplate = null;

Breadcrumb.prototype.item = function(label, href) {
    this.$description.items.push({ label, href });
    return this;
};
Breadcrumb.prototype.items = function(items) {
    this.$description.items = [];
    for(const item of items) {
        this.addItem(item.label, item.href);
    }
    return this;
};
Breadcrumb.prototype.addItem = function(label, href) {
    this.$description.items.push({ label, href });
    return this;
};
Breadcrumb.prototype.removeItem = function(index) {
    this.$description.items.splice(index, 1);
};

Breadcrumb.prototype.separator = function(separator) {
    this.$description.separator = separator;
    return this;
};


Breadcrumb.prototype.onItemClick = function(handler) {
    this.on('clickItem', handler);
    return this;
};

// Render
Breadcrumb.prototype.renderSeparator = function(renderFn) {
    this.$description.renderSeparator = renderFn;
    return this;
};
Breadcrumb.prototype.renderItem = function(renderFn) {
    this.$description.renderItem = renderFn;
    return this;
};
Breadcrumb.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Breadcrumb.prototype.$build = function() {

};
Breadcrumb.prototype.toNdElement = function() {};