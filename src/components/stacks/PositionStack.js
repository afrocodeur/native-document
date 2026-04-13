import BaseComponent from "../BaseComponent";

export default function PositionStack(content, props = {}) {
    if(!(this instanceof PositionStack)) {
        return new PositionStack(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        position: 'absolute',
        content:  content,
        top: null,
        right: null,
        bottom: null,
        left: null,
        width: null,
        height: null,
        zIndex: null,
        anchor: null,
        props
    };
}

BaseComponent.extends(PositionStack);

PositionStack.defaultTemplate = null;
PositionStack.use = function(template) {
    PositionStack.defaultTemplate = template;
};

PositionStack.prototype.top = function(value) {
    this.$description.top = value;
    return this;
};

PositionStack.prototype.right = function(value) {
    this.$description.right = value;
    return this;
};

PositionStack.prototype.bottom = function(value) {
    this.$description.bottom = value;
    return this;
};

PositionStack.prototype.left = function(value) {
    this.$description.left = value;
    return this;
};

PositionStack.prototype.fill = function() {
    this.$description.anchor = 'fill';
    return this;
};
PositionStack.prototype.topLeading = function() {
    this.$description.anchor = 'top-leading';
    return this;
};

PositionStack.prototype.atTopCenter = function() {
    this.$description.anchor = 'top-center';
    return this;
};

PositionStack.prototype.atTopTrailing = function() {
    this.$description.anchor = 'top-trailing';
    return this;
};

PositionStack.prototype.atCenterLeading = function() {
    this.$description.anchor = 'center-leading';
    return this;
};

PositionStack.prototype.atCenter = function() {
    this.$description.anchor = 'center';
    return this;
};

PositionStack.prototype.atCenterTrailing = function() {
    this.$description.anchor = 'center-trailing';
    return this;
};

PositionStack.prototype.atBottomLeading = function() {
    this.$description.anchor = 'bottom-leading';
    return this;
};

PositionStack.prototype.atBottomCenter = function() {
    this.$description.anchor = 'bottom-center';
    return this;
};

PositionStack.prototype.atBottomTrailing = function() {
    this.$description.anchor = 'bottom-trailing';
    return this;
};

PositionStack.prototype.width = function(value) {
    this.$description.width = value;
    return this;
};

PositionStack.prototype.height = function(value) {
    this.$description.height = value;
    return this;
};

PositionStack.prototype.size = function(width, height) {
    this.$description.width  = width;
    this.$description.height = height ?? width;
    return this;
};

PositionStack.prototype.fullWidth = function() {
    this.$description.width = '100%';
    return this;
};

PositionStack.prototype.fullHeight = function() {
    this.$description.height = '100%';
    return this;
};

PositionStack.prototype.fullSize = function() {
    this.$description.width  = '100%';
    this.$description.height = '100%';
    return this;
};

PositionStack.prototype.zIndex = function(value) {
    this.$description.zIndex = value;
    return this;
};

PositionStack.prototype.above = function(zIndex = 100) {
    this.$description.zIndex = zIndex;
    return this;
};

PositionStack.prototype.below = function() {
    this.$description.zIndex = -1;
    return this;
};