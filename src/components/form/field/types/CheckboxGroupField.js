import Field from "../../types/Field";

/**
 * Group of checkboxes for multi-value selection. Supports vertical/horizontal/grid layout
 * and min/max/exact count validation.
 * @example
 * const field = new CheckboxGroupField('roles')
 *     .label(Span('Roles'))
 *     .option('admin', Span('Administrator'))
 *     .option('editor', Span('Editor'))
 *     .option('viewer', Span('Viewer'))
 *     .horizontal()
 *     .minChecked(1, 'Select at least one role')
 *     .maxChecked(2);
 *
 * CheckboxGroupField.use((description, instance) => {
 *     // description.options — Array<{ value, label, props }>
 *     // description.layout — 'vertical' | 'horizontal' | 'grid'
 *     return Div({ class: \`checkbox-group checkbox-group--\${description.layout}\` },
 *         ...description.options.map(opt =>
 *             Label(Input({ type: 'checkbox', value: opt.value }), opt.label)
 *         )
 *     );
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function CheckboxGroupField(name, props) {
    if(!(this instanceof CheckboxGroupField)) {
        return new CheckboxGroupField(name, props);
    }

    Field.call(this, name, 'checkbox-group', props);

    Object.assign(this.$description, {
        options: [],
        layout: 'vertical',
        validateOn: 'change',
        defaultValue: []
    });
}

CheckboxGroupField.defaultTemplate = null;

/**
 * Registers the render template for CheckboxGroupField.
 * @param {(description: {
 *     name: string,
 *     type: 'checkbox-group',
 *     label: NdChild|null,
 *     options: Array<{ value: *, label: NdChild, props: GlobalAttributes }>,
 *     layout: 'vertical'|'horizontal'|'grid',
 *     value: Observable<*[]>|null,
 *     defaultValue: *[],
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: CheckboxGroupField) => NdChild} template
 */
CheckboxGroupField.use = function(template) {
    CheckboxGroupField.defaultTemplate = template;
};

CheckboxGroupField.prototype = Object.create(Field.prototype);
CheckboxGroupField.prototype.constructor = CheckboxGroupField;

/**
 * @param {Array<{ value: *, label: NdChild, props?: GlobalAttributes }>} opts
 * @returns {this}
 */
CheckboxGroupField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

/**
 * @param {*} value
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
CheckboxGroupField.prototype.option = function(value, label, props = {}) {
    this.$description.options.push({ value, label, props });
    return this;
};

/**
 * @param {'vertical'|'horizontal'|'grid'} value
 * @returns {this}
 */
CheckboxGroupField.prototype.layout = function(value) {
    const allowedLayouts = ['vertical', 'horizontal', 'grid'];

    if (!allowedLayouts.includes(value)) {
        throw new Error(`Invalid layout "${value}". Must be one of: ${allowedLayouts.join(', ')}`);
    }

    this.$description.layout = value;
    return this;
};

/** @returns {this} */
CheckboxGroupField.prototype.horizontal = function() {
    this.$description.layout = 'horizontal';
    return this;
};

/** @returns {this} */
CheckboxGroupField.prototype.vertical = function() {
    this.$description.layout = 'vertical';
    return this;
};

/** @returns {this} */
CheckboxGroupField.prototype.grid = function() {
    this.$description.layout = 'grid';
    return this;
};

/**
 * @param {number} min
 * @param {string} [message]
 * @returns {this}
 */
CheckboxGroupField.prototype.minChecked = function(min, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length >= min;
        },
        message: message || `At least ${min} option${min > 1 ? 's' : ''} must be selected`
    });
    return this;
};

/**
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
CheckboxGroupField.prototype.maxChecked = function(max, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length <= max;
        },
        message: message || `Maximum ${max} option${max > 1 ? 's' : ''} allowed`
    });
    return this;
};

/**
 * @param {number} count
 * @param {string} [message]
 * @returns {this}
 */
CheckboxGroupField.prototype.exactChecked = function(count, message) {
    this.$description.rules.push({
        validate: (values) => {
            if (!Array.isArray(values)) return false;
            return values.length === count;
        },
        message: message || `Exactly ${count} option${count > 1 ? 's' : ''} must be selected`
    });
    return this;
};