import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";


export default function Badge(config = {}) {
    if(!(this instanceof Badge)) {
        return new Badge(config);
    }

    this.$description = {
        style: null,
        shape: null,
        variant,
        ...config
    };
}

BaseComponent.extends(Badge);

Badge.defaultTemplate = null;

Badge.use = function(template) {};

Badge.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};
Badge.prototype.primary = function() {
    return this.variant('primary');
};
Badge.prototype.secondary = function() {
    return this.variant('secondary');
};
Badge.prototype.success = function() {
    return this.variant('success');
};
Badge.prototype.danger = function() {
    return this.variant('danger');
};
Badge.prototype.warning = function() {
    return this.variant('warning');
};
Badge.prototype.info = function() {
    return this.variant('info');
};

Badge.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Badge.prototype.small = function() {
    return this.size('small');
};
Badge.prototype.medium = function() {
    return this.size('medium');
};
Badge.prototype.large = function() {
    return this.size('large');
};

Badge.prototype.shape = function(shape) {
    this.$description.shape = shape;
    return this;
};

Badge.prototype.rounded = function() {
    return this.shape('rounded');
};
Badge.prototype.pill = function() {
    return this.shape('pill');
};

Badge.prototype.style = function(style) {
    this.$description.style = style;
    return this;
};
Badge.prototype.outline = function() {
    return this.style('outline');
};
Badge.prototype.filled = function() {
    return this.style('filled');
};
Badge.prototype.bordered = function() {
    return this.style('bordered');
};

Badge.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Badge.prototype.clickable = function(handler) {};


Badge.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Badge.prototype.$build = function() {

};
Badge.prototype.toNdElement = function() {};