import BaseComponent from '../BaseComponent';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Small label for status, count, or category. Supports variants, shapes (rounded/pill/circle), and appearance (filled/outline/bordered).
 *
 *
 * @example
 * const badge = new Badge(Span('New'))
 *     .variant('primary')
 *     .pill()
 *     .filled()
 *     .onClick((e) => console.log('clicked'));
 *
 * Badge.use((description, instance) => {
 *     return Span({ class: \`badge badge--\${description.variant}\` }, description.content);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
    this.aria = {};
}

BaseComponent.extends(Badge);

Badge.defaultTemplate = null;

/**
 * Registers the render template for Badge.
 * @param {(description: {
 *     appearance: 'filled'|'outline'|'bordered',
 *     borderRadiusType: 'pill'|'rounded'|'circle'|null,
 *     variant: string,
 *     size: 'small'|'medium'|'large'|string,
 *     onClick: ((event: MouseEvent) => void)|null,
 *     content: NdChild,
 *     props: GlobalAttributes,
 * }, instance: Badge) => NdChild} template
 */
Badge.use = function(template) {
    Badge.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(b: Badge) => Badge} callback
 */
Badge.preset = function(name, callback) {
    if (Badge.prototype[name] || Badge[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Badge.`);
        return;
    }
    Badge[name] = (content, props) => callback(new Badge(content, props));
};

/**
 * @param {Record<string, (b: Badge) => Badge>} presets
 */
Badge.presets = function(presets) {
    for (const name in presets) {
        Badge.preset(name, presets[name]);
    }
};

/**
 * @param {string} variant
 * @returns {this}
 */
Badge.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Badge.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * @returns {this}
 */
Badge.prototype.success = function() {
    return this.variant('success');
};

/**
 * @returns {this}
 */
Badge.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * @returns {this}
 */
Badge.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * @returns {this}
 */
Badge.prototype.info = function() {
    return this.variant('info');
};

/**
 * @param {number} size
 * @returns {this}
 */
Badge.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.small = function() {
    return this.size('small');
};

/**
 * @returns {this}
 */
Badge.prototype.medium = function() {
    return this.size('medium');
};

/**
 * @returns {this}
 */
Badge.prototype.large = function() {
    return this.size('large');
};

/**
 * @param {string} shape
 * @returns {this}
 */
Badge.prototype.shape = function(shape) {
    this.$description.borderRadiusType = shape;
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.circle = function() {
    this.$description.borderRadiusType = 'circle';
    return this;
};

/**
 * @param {string} appearance
 * @returns {this}
 */
Badge.prototype.appearance = function(appearance) {
    this.$description.appearance = appearance;
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.outline = function() {
    this.$description.appearance = 'outline';
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.filled = function() {
    this.$description.appearance = 'filled';
    return this;
};

/**
 * @returns {this}
 */
Badge.prototype.bordered = function() {
    this.$description.appearance = 'bordered';
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Badge.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Badge.prototype.onClick = function(handler) {
    this.$description.onClick = handler;
    return this;
};