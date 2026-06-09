import BaseComponent from '../BaseComponent';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Loading placeholder skeleton. Supports text, circle, rect, avatar, and image types, plus pulse/wave animations.
 *
 *
 * @example
 * // Single skeleton
 * const skel = new Skeleton()
 *     .text(3)
 *     .wave()
 *     .width('100%');
 *
 * // Static factories
 * const cardSkel = Skeleton.card('horizontal');
 * const listSkel = Skeleton.list(5);
 * const tableSkel = Skeleton.table(10, 4);
 *
 * Skeleton.use((description, instance) => {
 *     return Div({ class: \`skeleton skeleton--\${description.type}\` });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Skeleton(props = {}) {
    if (!(this instanceof Skeleton)) {
        return new Skeleton(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        type: 'rect',
        variant: 'pulse',
        borderRadiusType: 'rounded',
        lines: null,
        width: null,
        height: null,
        loading: null,
        repeat: null,
        props,
    };
    this.aria = {
        'aria-busy': 'true',
        'aria-live': 'polite'
    };
}

BaseComponent.extends(Skeleton);

Skeleton.defaultTemplate = null;

/**
 * Registers the render template for Skeleton.
 * @param {(description: {
 *     type: 'rect'|'circle'|'text'|'avatar'|'image',
 *     variant: 'pulse'|'wave',
 *     borderRadiusType: 'rounded'|'pill'|'smooth'|null,
 *     lines: number|null,
 *     width: string|number|null,
 *     height: string|number|null,
 *     loading: Observable<boolean>|boolean|null,
 *     repeat: number|null,
 *     props: GlobalAttributes,
 * }, instance: Skeleton) => NdChild} template
 */
Skeleton.use = function(template) {
    Skeleton.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: Skeleton) => Skeleton} callback
 */
Skeleton.preset = function(name, callback) {
    if (Skeleton.prototype[name] || Skeleton[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Skeleton.`);
        return;
    }
    Skeleton[name] = (props) => callback(new Skeleton(props));
};

/**
 * @param {Record<string, (s: Skeleton) => Skeleton>} presets
 */
Skeleton.presets = function(presets) {
    for (const name in presets) {
        Skeleton.preset(name, presets[name]);
    }
};

/**
 * @param {string} type
 * @returns {this}
 */
Skeleton.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @param {number} [lines]
 * @returns {this}
 */
Skeleton.prototype.text = function(lines = 1) {
    this.$description.lines = lines;
    return this.type('text');
};

/**
 * @returns {this}
 */
Skeleton.prototype.circle = function() {
    return this.type('circle');
};

/**
 * @returns {this}
 */
Skeleton.prototype.rect = function() {
    return this.type('rect');
};

/**
 * @returns {this}
 */
Skeleton.prototype.avatar = function() {
    return this.type('avatar');
};

/**
 * @returns {this}
 */
Skeleton.prototype.image = function() {
    return this.type('image');
};

/**
 * @returns {this}
 */
Skeleton.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};

/**
 * @returns {this}
 */
Skeleton.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

/**
 * @returns {this}
 */
Skeleton.prototype.smooth = function() {
    this.$description.borderRadiusType = 'smooth';
    return this;
};

/**
 * @param {number} width
 * @returns {this}
 */
Skeleton.prototype.width = function(width) {
    this.$description.width = width;
    return this;
};

/**
 * @param {number} height
 * @returns {this}
 */
Skeleton.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};

/**
 * @param {number} width
 * @param {number} height
 * @returns {this}
 */
Skeleton.prototype.size = function(width, height) {
    this.width(width);
    this.height(height);
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
Skeleton.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

/**
 * @returns {this}
 */
Skeleton.prototype.wave = function() {
    return this.variant('wave');
};

/**
 * @returns {this}
 */
Skeleton.prototype.pulse = function() {
    return this.variant('pulse');
};

/**
 * @param {boolean|Observable<boolean>} isLoading
 * @returns {this}
 */
Skeleton.prototype.loading = function(isLoading) {
    this.$description.loading = isLoading;
    return this;
};

/**
 * @param {number} times
 * @returns {this}
 */
Skeleton.prototype.repeat = function(times) {
    this.$description.repeat = times;
    return this;
};
