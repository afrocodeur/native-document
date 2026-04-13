

import BaseComponent from "../BaseComponent";

export default function Stack(content, props = {}) {
    if (!(this instanceof Stack)) {
        return new Stack(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        orientation: 'horizontal',
        content: content,
        spacing: null,
        alignment: 'center',
        justifyContent: 'between',
        wrap: false,
        grow: false,
        shrink: false,
        reverse: false,
        props,
    };
}

BaseComponent.extends(Stack);


Stack.prototype.wrap = function(enabled = true) {
    this.$description.wrap = enabled;
    return this;
};

Stack.prototype.grow = function(enabled = true) {
    this.$description.grow = enabled;
    return this;
};

Stack.prototype.reverse = function(enabled = true) {
    this.$description.reverse = enabled;
    return this;
};

Stack.prototype.shrink = function(enabled = true) {
    this.$description.shrink = enabled;
    return this;
};

Stack.prototype.spacing = function(value) {
    this.$description.spacing = value;
    return this;
};

Stack.prototype.alignLeading = function() {
    this.$description.alignment = 'leading';
    return this;
};
Stack.prototype.alignCenter = function() {
    this.$description.alignment = 'center';
    return this;
};
Stack.prototype.alignTrailing = function() {
    this.$description.alignment = 'trailing';
    return this;
};
Stack.prototype.alignStretch = function() {
    this.$description.alignment = 'stretch';
    return this;
};

Stack.prototype.justifyStart = function() {
    this.$description.justifyContent = 'start';
    return this;
};
Stack.prototype.justifyCenter = function() {
    this.$description.justifyContent = 'center';
    return this;
};
Stack.prototype.justifyEnd = function() {
    this.$description.justifyContent = 'end';
    return this;
};
Stack.prototype.justifyBetween = function() {
    this.$description.justifyContent = 'between';
    return this;
};
Stack.prototype.justifyAround = function() {
    this.$description.justifyContent = 'around';
    return this;
};

Stack.prototype.center = function() {
    this.alignCenter().justifyCenter();
    return this;
};