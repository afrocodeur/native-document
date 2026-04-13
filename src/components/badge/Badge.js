import BaseComponent from "../BaseComponent";
import DebugManager from "../../core/utils/debug-manager";


export default function Badge(content, props = {}) {
    if(!(this instanceof Badge)) {
        return new Badge(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        appearance: 'filled',
        borderRadiusType: 'pill',
        variant: 'primary',
        size: 'medium',
        onClick: null,
        content,
        props
    };
}

BaseComponent.extends(Badge);

Badge.defaultTemplate = null;

Badge.use = function(template) {
    Badge.defaultTemplate = template;
};

Badge.preset = function(name, callback) {
    if (Badge.prototype[name] || Badge[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Badge.`);
        return;
    }
    Badge[name] = (content, props) => callback(new Badge(content, props));
};

Badge.presets = function(presets) {
    for (const name in presets) {
        Badge.preset(name, presets[name]);
    }
};

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
    this.$description.borderRadiusType = shape;
    return this;
};

Badge.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};
Badge.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};
Badge.prototype.circle = function() {
    this.$description.borderRadiusType = 'circle';
    return this;
};

Badge.prototype.appearance = function(appearance) {
    this.$description.appearance = appearance;
    return this;
};
Badge.prototype.outline = function() {
    this.$description.appearance = 'outline';
    return this;
};
Badge.prototype.filled = function() {
    this.$description.appearance = 'filled';
    return this;
};
Badge.prototype.bordered = function() {
    this.$description.appearance = 'bordered';
    return this;
};

Badge.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Badge.prototype.onClick = function(handler) {
    this.$description.onClick = handler;
    return this;
};