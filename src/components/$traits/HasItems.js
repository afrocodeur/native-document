import {$} from "../../../index";

export default function HasItems() {}

HasItems.prototype.dynamic = function(observableArray = null) {
    this.$description.items = observableArray || $.array([]);
    return this;
};

HasItems.prototype.items = function(items) {
    this.$description.items.splice(0, this.$description.items.length, ...items);
    return this;
};

HasItems.prototype.item = function(item) {
    this.$description.items.push(item);
    return this;
};

HasItems.prototype.clear = function() {
    const items = this.$description.items;
    if(Array.isArray(items)) {
        items.splice(0, items.length);
        return this;
    }
    items.clear();
    return this;
};

HasItems.prototype.removeItem = function(item) {
    // TODO: implement this method
    return this;
};

HasItems.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};