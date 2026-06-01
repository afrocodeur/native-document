import Field from '../form/types/Field';

/**
 * Range input slider. Supports single value, range mode (two handles), marks, tooltip, vertical orientation, and reactive binding.
 *
 *
 * @example
 * const slider = new Slider('volume')
 *     .min(0)
 *     .max(100)
 *     .step(5)
 *     .model(volumeObs)
 *     .showTooltip(true)
 *     .tooltipFormat((v) => \`\${v}%\`)
 *     .marks([0, 25, 50, 75, 100])
 *     .onChange((value) => console.log(value));
 *
 * Slider.use((description, instance) => {
 *     return Div({ class: 'slider' });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
export default function Slider(name, props = {}) {
    if(!(this instanceof Slider)) {
        return new Slider(props);
    }

    Field.call(this, props);

    this.$description = {
        name,
        id: name || null,
        value:         null,
        defaultValue:  null,
        valueStart:    null,
        valueEnd:      null,
        range:         false,
        min:           0,
        max:           100,
        step:          1,
        showValue:     null,
        showTooltip:   null,
        tooltipFormat: null,
        renderTooltip: null,
        marks:         null,
        showMarks:     null,
        variant:       null,
        color:         null,
        trackColor:    null,
        fillColor:    null,
        vertical:      false,
        height:        null,
        disabled:      null,
        readonly:      null,
        reverse:       false,
        snapToMarks:   false,
        renderCursor:  null,
        renderThumb:   null,
        props,
    };
}

Slider.prototype = Object.create(Field.prototype);
Slider.prototype.constructor = Slider;


Slider.defaultTemplate = null;

/**
 * Registers the render template for Slider.
 * @param {(description: {
 *     name: string,
 *     id: string|null,
 *     value: Observable<number>|null,
 *     defaultValue: number|null,
 *     valueStart: Observable<number>|null,
 *     valueEnd: Observable<number>|null,
 *     range: boolean,
 *     min: number,
 *     max: number,
 *     step: number,
 *     showValue: boolean|null,
 *     showTooltip: boolean|null,
 *     tooltipFormat: ((value: number) => string)|null,
 *     renderTooltip: ((value: number) => NdChild)|null,
 *     marks: number[]|Array<{ value: number, label?: NdChild }>|null,
 *     showMarks: boolean|null,
 *     variant: string|null,
 *     color: string|null,
 *     trackColor: string|null,
 *     fillColor: string|null,
 *     vertical: boolean,
 *     height: string|number|null,
 *     disabled: Observable<boolean>|boolean|null,
 *     readonly: Observable<boolean>|boolean|null,
 *     reverse: boolean,
 *     snapToMarks: boolean,
 *     renderCursor: ((value: number) => NdChild)|null,
 *     renderThumb: ((value: number) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Slider) => NdChild} template
 */
Slider.use = function(template) {
    Slider.defaultTemplate = template;
};

/**
 * @param {Observable<number>} observable
 * @returns {this}
 */
Slider.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

/**
 * @param {Observable<number>} observable
 * @returns {this}
 */
Slider.prototype.modelStart = function(observable) {
    this.$description.valueStart = observable;
    return this;
};

/**
 * @param {Observable<number>} observable
 * @returns {this}
 */
Slider.prototype.modelEnd = function(observable) {
    this.$description.valueEnd = observable;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
Slider.prototype.defaultValue = function(value) {
    this.$description.defaultValue = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
Slider.prototype.setCurrentStep = function(value) {
    this.$description.value?.set(value);
    this.emit('change', value);
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.range = function(enabled = true) {
    this.$description.range = enabled;
    return this;
};

/**
 * @param {number} min
 * @returns {this}
 */
Slider.prototype.min = function(min) {
    this.$description.min = min;
    return this;
};

/**
 * @param {number} max
 * @returns {this}
 */
Slider.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

/**
 * @param {number} step
 * @returns {this}
 */
Slider.prototype.step = function(step) {
    this.$description.step = step;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.showTooltip = function(enabled = true) {
    this.$description.showTooltip = enabled;
    return this;
};

/**
 * @param {(value: number) => string} formatFn
 * @returns {this}
 */
Slider.prototype.tooltipFormat = function(formatFn) {
    this.$description.tooltipFormat = formatFn;
    return this;
};

/**
 * @param {(value: number) => NdChild} renderFn
 * @returns {this}
 */
Slider.prototype.renderTooltip = function(renderFn) {
    this.$description.renderTooltip = renderFn;
    return this;
};

/**
 * @param {number[]|{ value: number, label?: NdChild }[]} marks
 * @returns {this}
 */
Slider.prototype.marks = function(marks) {
    this.$description.marks = marks;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.showMarks = function(enabled = true) {
    this.$description.showMarks = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.snapToMarks = function(enabled = true) {
    this.$description.snapToMarks = enabled;
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
Slider.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

Slider.prototype.primary   = function() {
    return this.variant('primary');
};

/**
 * @returns {this}
 */
Slider.prototype.secondary = function() {
    return this.variant('secondary');
};

Slider.prototype.success   = function() {
    return this.variant('success');
};

Slider.prototype.warning   = function() {
    return this.variant('warning');
};

Slider.prototype.danger    = function() {
    return this.variant('danger');
};

Slider.prototype.info      = function() {
    return this.variant('info');
};

/**
 * @param {string} color
 * @returns {this}
 */
Slider.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};

/**
 * @param {string} color
 * @returns {this}
 */
Slider.prototype.trackColor = function(color) {
    this.$description.trackColor = color;
    return this;
};

/**
 * @param {string} color
 * @returns {this}
 */
Slider.prototype.fillColor = function(color) {
    this.$description.fillColor = color;
    return this;
};

/**
 * @param {string} color
 * @returns {this}
 */
Slider.prototype.fullColor = function(color) {
    this.color(color).fillColor(color);
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.vertical = function(enabled = true) {
    this.$description.vertical = enabled;
    return this;
};

/**
 * @param {number} height
 * @returns {this}
 */
Slider.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [condition=true]
 * @returns {this}
 */
Slider.prototype.disabled = function(condition = true) {
    this.$description.disabled = condition;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [condition=true]
 * @returns {this}
 */
Slider.prototype.readonly = function(condition = true) {
    this.$description.readonly = condition;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Slider.prototype.reverse = function(enabled = true) {
    this.$description.reverse = enabled;
    return this;
};

/**
 * @param {(value: number) => NdChild} renderFn
 * @returns {this}
 */
Slider.prototype.renderThumb = function(renderFn) {
    this.$description.renderThumb = renderFn;
    return this;
};

/**
 * @param {(value: number) => NdChild} renderFn
 * @returns {this}
 */
Slider.prototype.renderCursor = function(renderFn) {
    this.$description.renderCursor = renderFn;
    return this;
};

/**
 * @param {(value: number) => void} handler
 * @returns {this}
 */
Slider.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Slider.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};