import BaseComponent from '../BaseComponent';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Loading spinner with multiple types (circle, dots, bars, ring, pulse), sizes, variants, label, and overlay mode.
 *
 *
 * @example
 * const spinner = new Spinner()
 *     .circle()
 *     .large()
 *     .primary()
 *     .label(Span('Loading…'))
 *     .labelAtBottom()
 *     .overlay(true)
 *     .backdrop(true)
 *     .loading(isLoadingObs);
 *
 * Spinner.use((description, instance) => {
 *     return Div({ class: \`spinner spinner--\${description.type}\` });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Spinner(props = {}) {
    if (!(this instanceof Spinner)) {
        return new Spinner(props);
    }

    this.$description = {
        type: 'circle',
        variant: 'primary',
        color: null,
        size: 'small',
        label: null,
        labelPosition: null,
        overlay: null,
        backdrop: null,
        render: null,
        speed: 'normal',
        fullScreenOverlay: null,
        props,
    };
    this.aria = { 'role': 'status', 'aria-label': 'Loading' };
}

Spinner.defaultTemplate = null;

/**
 * Registers the render template for Spinner.
 * @param {(description: {
 *     type: 'circle'|'dots'|'bars'|'pulse'|'ring'|string,
 *     variant: string,
 *     color: string|null,
 *     size: 'extra-small'|'small'|'medium'|'large'|'extra-large'|string|number,
 *     label: NdChild|null,
 *     labelPosition: 'top'|'bottom'|'left'|'right'|null,
 *     overlay: boolean|null,
 *     backdrop: boolean|null,
 *     render: ((desc: *, instance: Spinner) => NdChild)|null,
 *     speed: 'slow'|'normal'|'fast'|string,
 *     fullScreenOverlay: boolean|null,
 *     props: GlobalAttributes,
 * }, instance: Spinner) => NdChild} template
 */
Spinner.use = function(template) {
    Spinner.defaultTemplate = template;
};

BaseComponent.extends(Spinner);

/**
 * @param {string} name
 * @param {(s: Spinner) => Spinner} callback
 */
Spinner.preset = function(name, callback) {
    if (Spinner.prototype[name] || Spinner[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Spinner.`);
        return;
    }
    Spinner[name] = (props) => callback(new Spinner(props));
};

/**
 * @param {Record<string, (s: Spinner) => Spinner>} presets
 */
Spinner.presets = function(presets) {
    for (const name in presets) {
        Spinner.preset(name, presets[name]);
    }
};

/**
 * @param {string} type
 * @returns {this}
 */
Spinner.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @returns {this}
 */
Spinner.prototype.circle = function() {
    return this.type('circle');
};

/**
 * @returns {this}
 */
Spinner.prototype.dots = function() {
    return this.type('dots');
};

/**
 * @returns {this}
 */
Spinner.prototype.bars = function() {
    return this.type('bars');
};

/**
 * @returns {this}
 */
Spinner.prototype.pulse = function() {
    return this.type('pulse');
};

/**
 * @returns {this}
 */
Spinner.prototype.ring = function() {
    return this.type('ring');
};


/**
 * @param {number} size
 * @returns {this}
 */
Spinner.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @returns {this}
 */
Spinner.prototype.extraSmall = function() {
    return this.size('extra-small');
};

/**
 * @returns {this}
 */
Spinner.prototype.small = function() {
    return this.size('small');
};

/**
 * @returns {this}
 */
Spinner.prototype.medium = function() {
    return this.size('medium');
};

/**
 * @returns {this}
 */
Spinner.prototype.large = function() {
    return this.size('large');
};

/**
 * @returns {this}
 */
Spinner.prototype.extraLarge = function() {
    return this.size('extra-large');
};

/**
 * @param {string} name
 * @returns {this}
 */
Spinner.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};
Spinner.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Spinner.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * @returns {this}
 */
Spinner.prototype.success = function() {
    return this.variant('success');
};

/**
 * @returns {this}
 */
Spinner.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * @returns {this}
 */
Spinner.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * @param {string} color
 * @returns {this}
 */
Spinner.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
Spinner.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {string} position
 * @returns {this}
 */
Spinner.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};

/**
 * @returns {this}
 */
Spinner.prototype.labelAtTop = function() {
    return this.labelPosition('top');
};

/**
 * @returns {this}
 */
Spinner.prototype.labelAtBottom = function() {
    return this.labelPosition('bottom');
};

/**
 * @returns {this}
 */
Spinner.prototype.labelAtLeft = function() {
    return this.labelPosition('left');
};

/**
 * @returns {this}
 */
Spinner.prototype.labelAtRight = function() {
    return this.labelPosition('right');
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Spinner.prototype.overlay = function(enabled = true) {
    this.$description.overlay = enabled;
    return this;
};

/**
 * @returns {this}
 */
Spinner.prototype.fullscreen = function() {
    this.$description.fullScreenOverlay = true;
    return this.overlay(true);
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Spinner.prototype.backdrop = function(enabled = true) {
    this.$description.overlay = true;
    this.$description.backdrop = enabled;
    return this;
};

/**
 * @param {*} speed
 * @returns {this}
 */
Spinner.prototype.speed = function(speed) {
    this.$description.speed = speed;
    return this;
};

/**
 * @returns {this}
 */
Spinner.prototype.slow = function() {
    return this.speed('slow');
};

/**
 * @returns {this}
 */
Spinner.prototype.normal = function() {
    return this.speed('normal');
};

/**
 * @returns {this}
 */
Spinner.prototype.fast = function() {
    return this.speed('fast');
};

/**
 * @param {boolean|Observable<boolean>} isLoading
 * @returns {this}
 */
Spinner.prototype.loading = function(isLoading) {
    this.showIf(isLoading);
    return this;
};
Spinner.prototype.bind = Spinner.prototype.loading;

Spinner.prototype.show = function() {
    this.$description.loading?.set(true);
};

Spinner.prototype.hide = function() {
    this.$description.loading?.set(false);
};