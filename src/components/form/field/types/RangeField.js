import NumberField from '../../field/types/NumberField';

/**
 * Numeric range/slider field. Extends NumberField with visual slider controls,
 * marks, tooltip display, and vertical orientation.
 * @example
 * const field = new RangeField('volume')
 *     .label(Span('Volume'))
 *     .min(0).max(100).step(5)
 *     .showTooltip(true)
 *     .marks([0, 25, 50, 75, 100])
 *     .showMarks(true)
 *     .model(volumeObs);
 *
 * RangeField.use((description, instance) => {
 *     // description.showValue, description.marks, description.showMarks,
 *     // description.vertical, description.showTooltip, description.step,
 *     // description.min, description.max, description.value...
 *     return Input({ type: 'range', min: description.min, max: description.max });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function RangeField(name, props) {
    if(!(this instanceof RangeField)) {
        return new RangeField(name, props);
    }

    NumberField.call(this, name, 'range', props);

    Object.assign(this.$description, {
        showValue:   true,
        marks:       null,
        showMarks:   false,
        vertical:    false,
        showTooltip: false,
    });
}

RangeField.defaultTemplate = null;

/**
 * Registers the render template for RangeField.
 * @param {(description: {
 *     name: string,
 *     type: 'range',
 *     label: NdChild|null,
 *     value: Observable<number>|null,
 *     step: number|null,
 *     min: number|null,
 *     max: number|null,
 *     showValue: boolean,
 *     marks: number[]|Array<{ value: number, label?: NdChild }>|null,
 *     showMarks: boolean,
 *     vertical: boolean,
 *     showTooltip: boolean,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: RangeField) => NdChild} template
 */
RangeField.use = function(template) {
    RangeField.defaultTemplate = template;
};

RangeField.prototype = Object.create(NumberField.prototype);
RangeField.prototype.constructor = RangeField;

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
RangeField.prototype.showValue = function(enabled = true) {
    this.$description.showValue = enabled;
    return this;
};

/**
 * @param {number[]|Array<{ value: number, label?: NdChild }>} marks
 * @returns {this}
 */
RangeField.prototype.marks = function(marks) {
    this.$description.marks = marks;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
RangeField.prototype.showMarks = function(enabled = true) {
    this.$description.showMarks = enabled;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
RangeField.prototype.vertical = function(enabled = true) {
    this.$description.vertical = enabled;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
RangeField.prototype.showTooltip = function(enabled = true) {
    this.$description.showTooltip = enabled;
    return this;
};