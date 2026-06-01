import StringField from "../../types/fields/StringField";

/**
 * Text field with asynchronous autocomplete suggestions. Supports static arrays
 * and async data sources, configurable debounce, min chars, and item rendering.
 * @example
 * const field = new AutocompleteField('city')
 *     .label(Span('City'))
 *     .source((query) => fetch(\`/api/cities?q=\${query}\`).then(r => r.json()))
 *     .minChars(2)
 *     .debounce(300)
 *     .valueKey('id')
 *     .labelKey('name')
 *     .renderItem((item) => Div(Span(item.name), Span({ class: 'hint' }, item.country)))
 *     .onSelect((item) => console.log('selected', item));
 *
 * AutocompleteField.use((description, instance) => {
 *     // description.source, description.minChars, description.debounce,
 *     // description.valueKey, description.labelKey, description.renderItem...
 *     return Input({ type: 'text', placeholder: description.placeholder });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function AutocompleteField(name, props) {
    if(!(this instanceof AutocompleteField)) {
        return new AutocompleteField(name, props);
    }

    StringField.call(this, name, 'autocomplete', props);

    Object.assign(this.$description, {
        source: null,
        minChars: 2,
        debounce: 300,
        maxResults: 10,
        valueKey: 'id',
        labelKey: 'label',
        renderItem: null,
    });
}

AutocompleteField.defaultTemplate = null;

/**
 * Registers the render template for AutocompleteField.
 * @param {(description: {
 *     name: string,
 *     type: 'autocomplete',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<*>|null,
 *     source: *[]|((query: string) => Promise<*[]>)|null,
 *     minChars: number,
 *     debounce: number,
 *     maxResults: number,
 *     valueKey: string,
 *     labelKey: string,
 *     renderItem: ((item: *) => NdChild)|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: AutocompleteField) => NdChild} template
 */
AutocompleteField.use = function(template) {
    AutocompleteField.defaultTemplate = template;
};


AutocompleteField.prototype = Object.create(StringField.prototype);
AutocompleteField.prototype.constructor = AutocompleteField;

/**
 * @param {*[]|((query: string) => Promise<*[]>)} dataSource
 * @returns {this}
 */
AutocompleteField.prototype.source = function(dataSource) {
    this.$description.source = dataSource;
    return this;
};

/**
 * @param {number} min - Minimum characters before triggering the source
 * @returns {this}
 */
AutocompleteField.prototype.minChars = function(min) {
    this.$description.minChars = min;
    return this;
};

/**
 * @param {number} ms
 * @returns {this}
 */
AutocompleteField.prototype.debounce = function(ms) {
    this.$description.debounce = ms;
    return this;
};

/**
 * @param {number} max
 * @returns {this}
 */
AutocompleteField.prototype.maxResults = function(max) {
    this.$description.maxResults = max;
    return this;
};

/**
 * Validates that the entered value exists in the allowed list.
 * @param {*[]} allowedValues
 * @param {string} [message]
 * @returns {this}
 */
AutocompleteField.prototype.oneOf = function(allowedValues, message) {
    this.$description.rules.push({
        validate: (value) => {
            if (!value) return true;
            return allowedValues.includes(value);
        },
        message: message || `Must be one of: ${allowedValues.join(', ')}`
    });
    return this;
};

/**
 * Key in the data object used as the field value.
 * @param {string} key
 * @returns {this}
 */
AutocompleteField.prototype.valueKey = function(key) {
    this.$description.valueKey = key;
    return this;
};

/**
 * Key in the data object used as the display label.
 * @param {string} key
 * @returns {this}
 */
AutocompleteField.prototype.labelKey = function(key) {
    this.$description.labelKey = key;
    return this;
};

/**
 * @param {(item: *) => void} handler
 * @returns {this}
 */
AutocompleteField.prototype.onSelect = function(handler) {
    this.on('select', handler);
    return this;
};

/**
 * Custom render for each suggestion item in the dropdown.
 * @param {(item: *) => NdChild} callback
 * @returns {this}
 */
AutocompleteField.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};