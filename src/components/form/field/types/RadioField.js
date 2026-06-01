import Field from '../../types/Field';
import Validator from '../../../../core/utils/validator';

/**
 * Radio button group for single-value selection from a list of options.
 * Supports vertical/horizontal/grid layout and reactive model binding.
 * @example
 * const field = new RadioField('gender')
 *     .label(Span('Gender'))
 *     .option('male', Span('Male'))
 *     .option('female', Span('Female'))
 *     .option('other', Span('Other'))
 *     .horizontal()
 *     .model(genderObs)
 *     .required();
 *
 * RadioField.use((description, instance) => {
 *     // description.options — Array<{ value, label, props }>
 *     // description.layout, description.checked
 *     return Div({ class: \`radio-group radio-group--\${description.layout}\` },
 *         ...description.options.map(opt =>
 *             Label(Input({ type: 'radio', value: opt.value }), opt.label)
 *         )
 *     );
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props={}]
 */
export default function RadioField(name, props = {}) {
    if(!(this instanceof RadioField)) {
        return new RadioField(name, props);
    }

    Field.call(this, name, 'radio', props);

    Object.assign(this.$description, {
        options: [],
        layout: 'vertical',
        checked: false,
    });
}

RadioField.defaultTemplate = null;

/**
 * Registers the render template for RadioField.
 * @param {(description: {
 *     name: string,
 *     type: 'radio',
 *     label: NdChild|null,
 *     options: Array<{ value: *, label: NdChild, props: GlobalAttributes }>,
 *     layout: 'vertical'|'horizontal'|'grid',
 *     checked: Observable<*>|boolean,
 *     value: Observable<*>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: RadioField) => NdChild} template
 */
RadioField.use = function(template) {
    RadioField.defaultTemplate = template;
};

RadioField.prototype = Object.create(Field.prototype);
RadioField.prototype.constructor = RadioField;

/**
 * @param {Array<{ value: *, label: NdChild, props?: GlobalAttributes }>} opts
 * @returns {this}
 */
RadioField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

/**
 * @param {*} value
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
RadioField.prototype.option = function(value, label, props = {}) {
    this.$description.options.push({ value, label, props });
    return this;
};

/**
 * Binds the selected value to an observable.
 * @param {Observable<*>} observable
 * @returns {this}
 */
RadioField.prototype.model = function(observable) {
    this.$description.checked = observable;
    return this;
};

/**
 * Returns the current checked value (resolves the observable if needed).
 * @returns {*}
 */
RadioField.prototype.checked = function() {
    const checked = this.$description.checked;
    if(Validator.isObservable(checked)) {
        return checked.val();
    }
    return checked;
};

/**
 * @param {'vertical'|'horizontal'|'grid'} value
 * @returns {this}
 */
RadioField.prototype.layout = function(value) {
    const allowedLayouts = ['vertical', 'horizontal', 'grid'];

    if (!allowedLayouts.includes(value)) {
        throw new Error(`Invalid layout "${value}". Must be one of: ${allowedLayouts.join(', ')}`);
    }

    this.$description.layout = value;
    return this;
};

/** @returns {this} */
RadioField.prototype.horizontal = function() {
    this.$description.layout = 'horizontal';
    return this;
};

/** @returns {this} */
RadioField.prototype.vertical = function() {
    this.$description.layout = 'vertical';
    return this;
};

/** @returns {this} */
RadioField.prototype.grid = function() {
    this.$description.layout = 'grid';
    return this;
};