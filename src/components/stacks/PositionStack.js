import BaseComponent from '../BaseComponent';

/**
 * Positioned flex container (base for AbsoluteStack, FixedStack, RelativeStack). Adds top/right/bottom/left/zIndex control.
 *
 *
 * @example
 * const overlay = new AbsoluteStack(Spinner())
 *     .fill()
 *     .center()
 *     .zIndex(10);
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
    this.aria = {};
}

BaseComponent.extends(PositionStack);

PositionStack.defaultTemplate = null;

/**
 * Registers the render template for PositionStack.
 * @param {(description: {
 *     position: 'absolute'|'fixed'|'relative',
 *     content: NdChild,
 *     top: string|number|null,
 *     right: string|number|null,
 *     bottom: string|number|null,
 *     left: string|number|null,
 *     width: string|number|null,
 *     height: string|number|null,
 *     zIndex: number|null,
 *     anchor: string|null,
 *     props: GlobalAttributes,
 * }, instance: PositionStack) => NdChild} template
 */
PositionStack.use = function(template) {
    PositionStack.defaultTemplate = template;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.top = function(value) {
    this.$description.top = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.right = function(value) {
    this.$description.right = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.bottom = function(value) {
    this.$description.bottom = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.left = function(value) {
    this.$description.left = value;
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.fill = function() {
    this.$description.anchor = 'fill';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.topLeading = function() {
    this.$description.anchor = 'top-leading';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atTopCenter = function() {
    this.$description.anchor = 'top-center';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atTopTrailing = function() {
    this.$description.anchor = 'top-trailing';
    return this;
};

PositionStack.prototype.atCenterLeading = function() {
    this.$description.anchor = 'center-leading';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atCenter = function() {
    this.$description.anchor = 'center';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atCenterTrailing = function() {
    this.$description.anchor = 'center-trailing';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atBottomLeading = function() {
    this.$description.anchor = 'bottom-leading';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atBottomCenter = function() {
    this.$description.anchor = 'bottom-center';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.atBottomTrailing = function() {
    this.$description.anchor = 'bottom-trailing';
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.width = function(value) {
    this.$description.width = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.height = function(value) {
    this.$description.height = value;
    return this;
};

/**
 * @param {number} width
 * @param {number} height
 * @returns {this}
 */
PositionStack.prototype.size = function(width, height) {
    this.$description.width  = width;
    this.$description.height = height ?? width;
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.fullWidth = function() {
    this.$description.width = '100%';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.fullHeight = function() {
    this.$description.height = '100%';
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.fullSize = function() {
    this.$description.width  = '100%';
    this.$description.height = '100%';
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
PositionStack.prototype.zIndex = function(value) {
    this.$description.zIndex = value;
    return this;
};

/**
 * @param {number} [zIndex]
 * @returns {this}
 */
PositionStack.prototype.above = function(zIndex = 100) {
    this.$description.zIndex = zIndex;
    return this;
};

/**
 * @returns {this}
 */
PositionStack.prototype.below = function() {
    this.$description.zIndex = -1;
    return this;
};