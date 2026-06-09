import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Progress indicator supporting bar, circle, and line types. Supports indeterminate, striped/animated variants, and value formatting.
 *
 *
 * @example
 * const progress = new Progress()
 *     .type('bar')
 *     .value(progressObs)
 *     .max(100)
 *     .variant('primary')
 *     .showValue(true)
 *     .format((v) => \`\${v}%\`)
 *     .striped(true)
 *     .animated(true)
 *     .onComplete(() => console.log('done!'));
 *
 * Progress.use((description, instance) => {
 *     return Div({ class: 'progress' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Progress(props = {}) {
    if (!(this instanceof Progress)) {
        return new Progress(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        value: null,
        type: null,
        variant: null,
        max: 100,
        size: null,
        stroke: null,
        height: null,
        showValue: null,
        showPercentage: null,
        label: null,
        format: null,
        indeterminate: null,
        striped: null,
        animated: null,
        borderRadiusType: null,
        props,
    };
    this.aria = {
        'role': 'progressbar',
        'aria-valuemin': '0',
        'aria-valuemax': '100'
    };
}

BaseComponent.extends(Progress);
BaseComponent.use(Progress, HasEventEmitter);

Progress.defaultTemplate = null;

/**
 * Registers the render template for Progress.
 * @param {(description: {
 *     value: number|Observable<number>|null,
 *     type: 'bar'|'circle'|'line'|string|null,
 *     variant: string|null,
 *     max: number,
 *     size: string|number|null,
 *     stroke: number|null,
 *     height: string|number|null,
 *     showValue: boolean|null,
 *     label: NdChild|null,
 *     format: ((value: number) => string)|null,
 *     indeterminate: boolean|null,
 *     striped: boolean|null,
 *     animated: boolean|null,
 *     borderRadiusType: string|null,
 *     props: GlobalAttributes,
 * }, instance: Progress) => NdChild} template
 */
Progress.use = function(template) {
    Progress.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(p: Progress) => Progress} callback
 */
Progress.preset = function(name, callback) {
    if (Progress.prototype[name] || Progress[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Progress.`);
        return;
    }
    Progress[name] = (props) => callback(new Progress(props));
};

/**
 * @param {Record<string, (p: Progress) => Progress>} presets
 */
Progress.presets = function(presets) {
    for (const name in presets) {
        Progress.preset(name, presets[name]);
    }
};

/**
 * @param {Observable<number>} observable
 * @returns {this}
 */
Progress.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

Progress.prototype.bind = Progress.prototype.model;

/**
 * @param {number} step
 */
Progress.prototype.setCurrentStep = function(step) {
    this.$description.value?.set(step);
    this.emit('change', step);
};

/**
 * @param {number|Observable<number>} value
 * @returns {this}
 */
Progress.prototype.value = function(value) {
    this.$description.value = BaseComponent.obs(value);
    return this;
};

/**
 * @param {*} newValue
 * @returns {this}
 */
Progress.prototype.setValue = function(newValue) {
    this.setCurrentStep(newValue);
    return this;
};

/**
 * @returns {number}
 */
Progress.prototype.getCurrentValue = function() {
    return this.$description.value?.get();
};

/**
 * @param {number} max
 * @returns {this}
 */
Progress.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

/**
 * @param {'bar'|'circle'|'line'|string} type
 * @returns {this}
 */
Progress.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @returns {this}
 */
Progress.prototype.bar = function() {
    return this.type('bar');
};

/**
 * @returns {this}
 */
Progress.prototype.circle = function() {
    return this.type('circle');
};

/**
 * @returns {this}
 */
Progress.prototype.line = function() {
    return this.type('line');
};

/**
 * @returns {this}
 */
Progress.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

// Variant
Progress.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
Progress.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Progress.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * @returns {this}
 */
Progress.prototype.success = function() {
    return this.variant('success');
};

/**
 * @returns {this}
 */
Progress.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * @returns {this}
 */
Progress.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * @returns {this}
 */
Progress.prototype.info = function() {
    return this.variant('info');
};

/**
 * @returns {this}
 */
Progress.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @returns {this}
 */
Progress.prototype.stroke = function(stroke) {
    this.$description.stroke = stroke;
    return this;
};

/**
 * @returns {this}
 */
Progress.prototype.small = function() {
    return this.size('small');
};

/**
 * @returns {this}
 */
Progress.prototype.medium = function() {
    return this.size('medium');
};

/**
 * @returns {this}
 */
Progress.prototype.large = function() {
    return this.size('large');
};

/**
 * @param {number} height
 * @returns {this}
 */
Progress.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Progress.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
Progress.prototype.label = function(text) {
    this.$description.label = text;
    return this;
};

/**
 * @param {(value: number) => string} formatFn
 * @returns {this}
 */
Progress.prototype.format = function(formatFn) {
    this.$description.format = formatFn;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Progress.prototype.indeterminate = function(enabled = true) {
    this.$description.indeterminate = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Progress.prototype.striped = function(enabled = true) {
    this.$description.striped = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Progress.prototype.animated = function(enabled = true) {
    this.$description.animated = enabled;
    return this;
};

/**
 *
 * @returns {this}
 */
Progress.prototype.complete = function() {
    this.setCurrentStep(100);
    this.emit('complete');
    return this;
};

/**
 * @param {number} step
 * @returns {this}
 */
Progress.prototype.increment = function(step) {
    const current = this.value() || 0;
    this.setCurrentStep(Math.min(this.$description.max, current + step));
    return this;
};

/**
 * @returns {this}
 */
Progress.prototype.reset = function() {
    this.setCurrentStep(0);
    this.emit('reset');
    return this;
};

// Events

/**
 * @param {Function} handler
 * @returns {this}
 */
Progress.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Progress.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Progress.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};
