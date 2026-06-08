import BaseComponent from '../BaseComponent';

/**
 * @constructor
 * @param {string} name
 * @param {object} [props={}]
 */
export function Icon(name, props = {}) {
    if(!(this instanceof Icon)) {
        return new Icon(name, props);
    }

    BaseComponent.call(this, {});

    this.$description = {
        name,
        variant: null,
        color:   null,
        weight:  null,
        size:    null,
        ...props,
    };
}

BaseComponent.extends(Icon);

Icon.defaultTemplate = null;
Icon.defaultConfigs  = null;

/**
 * @param {(description, instance: Icon) => NdChild} template
 * @param {{ variant?: string, size?: string, color?: string, weight?: string }} [defaultConfigs={}]
 */
Icon.use = function(template, defaultConfigs = {}) {
    Icon.defaultTemplate = template;
    Icon.defaultConfigs  = defaultConfigs;
};

Icon.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Icon.prototype.thin = function() {
    this.$description.variant = 'thin';
    return this;
};

Icon.prototype.light = function() {
    this.$description.variant = 'light';
    return this;
};

Icon.prototype.regular = function() {
    this.$description.variant = 'regular';
    return this;
};

Icon.prototype.bold = function() {
    this.$description.variant = 'bold';
    return this;
};

Icon.prototype.fill = function() {
    this.$description.variant = 'fill';
    return this;
};

Icon.prototype.duotone = function() {
    this.$description.variant = 'duotone';
    return this;
};

Icon.prototype.weight = function(weight) {
    this.$description.weight = weight;
    return this;
};

Icon.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

Icon.prototype.small = function() {
    this.$description.size = 'small';
    return this;
};

Icon.prototype.medium = function() {
    this.$description.size = 'medium';
    return this;
};

Icon.prototype.large = function() {
    this.$description.size = 'large';
    return this;
};

Icon.prototype.extraLarge = function() {
    this.$description.size = 'extraLarge';
    return this;
};

Icon.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};
