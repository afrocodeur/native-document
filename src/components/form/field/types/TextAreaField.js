import StringField from "../../types/fields/StringField";

/**
 * Multi-line text input field. Supports rows/cols, resize mode, auto-grow,
 * character counter, and word count validation.
 * @example
 * const field = new TextAreaField('bio')
 *     .label(Span('Biography'))
 *     .rows(6)
 *     .autoGrow(true)
 *     .characterCounter(true)
 *     .wordCount(10, 500, 'Between 10 and 500 words')
 *     .maxLength(2000)
 *     .required();
 *
 * TextAreaField.use((description, instance) => {
 *     // description.rows, description.cols, description.resize,
 *     // description.autoGrow, description.characterCounter, description.wordCount...
 *     return Textarea({
 *         rows: description.rows,
 *         resize: description.resize
 *     });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function TextAreaField(name, props) {
    if(!(this instanceof TextAreaField)) {
        return new TextAreaField(name, props);
    }

    StringField.call(this, name, 'textarea', props);

    Object.assign(this.$description, {
        ...this.$description,
        rows: 4,
        cols: null,
        resize: 'vertical',
        autoGrow: false,
        wordCount: false,
        characterCounter: false,
    });
}

TextAreaField.defaultTemplate = null;

/**
 * Registers the render template for TextAreaField.
 * @param {(description: {
 *     name: string,
 *     type: 'textarea',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<string>|null,
 *     rows: number,
 *     cols: number|null,
 *     resize: 'none'|'horizontal'|'vertical'|'both',
 *     autoGrow: boolean,
 *     characterCounter: boolean,
 *     wordCount: boolean,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: TextAreaField) => NdChild} template
 */
TextAreaField.use = function(template) {
    TextAreaField.defaultTemplate = template;
};

TextAreaField.prototype = Object.create(StringField.prototype);
TextAreaField.prototype.constructor = TextAreaField;

/**
 * @param {number} value
 * @returns {this}
 */
TextAreaField.prototype.rows = function(value) {
    this.$description.rows = value;
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
TextAreaField.prototype.cols = function(value) {
    this.$description.cols = value;
    return this;
};

/**
 * @param {'none'|'horizontal'|'vertical'|'both'} value
 * @returns {this}
 */
TextAreaField.prototype.resize = function(value) {
    this.$description.resize = value;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
TextAreaField.prototype.autoGrow = function(enabled = true) {
    this.$description.autoGrow = enabled;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
TextAreaField.prototype.characterCounter = function(enabled = true) {
    this.$description.characterCounter = enabled;
    return this;
};

/**
 * @param {number} min
 * @param {number} max
 * @param {string} [message]
 * @returns {this}
 */
TextAreaField.prototype.wordCount = function(min, max, message) {
    this.$description.wordCount = true;
    this.$description.rules.push({
        fn: (value) => {
            if (!value) return true;
            const words = value.trim().split(/\s+/).length;
            if (min && words < min) return false;
            if (max && words > max) return false;
            return true;
        },
        message: message || `Word count must be between ${min || 0} and ${max || '∞'}`
    });
    return this;
};