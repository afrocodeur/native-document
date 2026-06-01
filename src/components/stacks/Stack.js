

import BaseComponent from "../BaseComponent";

/**
 * Flex container (base for HStack/VStack). Controls wrap, grow, spacing, alignment and justify.
 *
 *
 * @example
 * const stack = new Stack(VStack(item1, item2, item3))
 *     .spacing(16)
 *     .alignCenter()
 *     .justifyBetween()
 *     .wrap(true);
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Stack.prototype.wrap = function(enabled = true) {
    this.$description.wrap = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Stack.prototype.grow = function(enabled = true) {
    this.$description.grow = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Stack.prototype.reverse = function(enabled = true) {
    this.$description.reverse = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Stack.prototype.shrink = function(enabled = true) {
    this.$description.shrink = enabled;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
Stack.prototype.spacing = function(value) {
    this.$description.spacing = value;
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.alignLeading = function() {
    this.$description.alignment = 'leading';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.alignCenter = function() {
    this.$description.alignment = 'center';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.alignTrailing = function() {
    this.$description.alignment = 'trailing';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.alignStretch = function() {
    this.$description.alignment = 'stretch';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.justifyStart = function() {
    this.$description.justifyContent = 'start';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.justifyCenter = function() {
    this.$description.justifyContent = 'center';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.justifyEnd = function() {
    this.$description.justifyContent = 'end';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.justifyBetween = function() {
    this.$description.justifyContent = 'between';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.justifyAround = function() {
    this.$description.justifyContent = 'around';
    return this;
};

/**
 * @returns {this}
 */
Stack.prototype.center = function() {
    this.alignCenter().justifyCenter();
    return this;
};