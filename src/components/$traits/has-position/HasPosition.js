/**
 *
 * @class
 */
export default function HasPosition() {}

/**
 * @returns {this}
 */
HasPosition.prototype.atTop = function() {
    this.$description.position = 'top';
    return this;
};

/**
 * @returns {this}
 */
HasPosition.prototype.atBottom = function() {
    this.$description.position = 'bottom';
    return this;
};

/**
 * @returns {this}
 */
HasPosition.prototype.atLeft = function() {
    this.$description.position = 'left';
    return this;
};

/**
 * @returns {this}
 */
HasPosition.prototype.atRight = function() {
    this.$description.position = 'right';
    return this;
};

/**
 * @returns {this}
 */
HasPosition.prototype.atCenter = function() {
    this.$description.position = 'center';
    return this;
};