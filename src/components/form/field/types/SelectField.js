import Field from "../../types/Field";

/**
 * Select/dropdown field supporting single and multiple selection, search, groups,
 * and multiple display modes (tags, text, count, truncate).
 * @example
 * const field = new SelectField('country')
 *     .label(Span('Country'))
 *     .options([
 *         { value: 'fr', label: Span('France') },
 *         { value: 'de', label: Span('Germany') },
 *         { value: 'es', label: Span('Spain') },
 *     ])
 *     .searchable(true, 'Search a country...')
 *     .clearable(true)
 *     .required();
 *
 * // Multiple selection with tag display
 * const tags = new SelectField('tags')
 *     .multiple(true)
 *     .multipleDisplayAsTags()
 *     .removeSelected(true)
 *     .options([...]);
 *
 * SelectField.use((description, instance) => {
 *     // description.options, description.multiple, description.searchable,
 *     // description.multipleDisplay, description.groups, description.clearable...
 *     return Div({ class: 'select' });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function SelectField(name, props) {
    if(!(this instanceof SelectField)) {
        return new SelectField(name, props);
    }

    Field.call(this, name, 'select', props);

    Object.assign(this.$description, {
        options: [],
        multiple: false,
        searchable: false,
        searchPlaceholder: null,
        clearable: false,
        groups: null,
        multipleDisplay: 'text',
        removeSelected: false,
        truncateRender: false,
        countRender: false,
        selectedLabelRender: false,
        renderItem: null,
        truncateMax: null
    });
}

SelectField.defaultTemplate = null;

/**
 * Registers the render template for SelectField.
 * @param {(description: {
 *     name: string,
 *     type: 'select',
 *     label: NdChild|null,
 *     options: Array<{ value: *, label: NdChild, props: GlobalAttributes }>,
 *     multiple: boolean,
 *     searchable: boolean,
 *     searchPlaceholder: string|null,
 *     clearable: boolean,
 *     groups: Array<{ label: NdChild, options: Array<{ value: *, label: NdChild }> }>|null,
 *     multipleDisplay: 'text'|'tags'|'count'|'truncate',
 *     truncateMax: number|null,
 *     removeSelected: boolean,
 *     renderItem: ((item: *, isSelected: boolean) => NdChild)|null,
 *     truncateRender: ((count: number) => NdChild)|false,
 *     countRender: ((count: number) => NdChild)|false,
 *     selectedLabelRender: ((selected: *[]) => NdChild)|false,
 *     value: Observable<*>|null,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: SelectField) => NdChild} template
 */
SelectField.use = function(template) {
    SelectField.defaultTemplate = template;
};

SelectField.prototype = Object.create(Field.prototype);
SelectField.prototype.constructor = SelectField;

/**
 * @param {Array<{ value: *, label: NdChild, props?: GlobalAttributes }>} opts
 * @returns {this}
 */
SelectField.prototype.options = function(opts) {
    this.$description.options = opts;
    return this;
};

/**
 * @param {*} value
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
SelectField.prototype.option = function(value, label, props = {}) {
    this.$description.options.push({ label, value, props });
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
SelectField.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @param {string|null} [placeholder=null]
 * @returns {this}
 */
SelectField.prototype.searchable = function(enabled = true, placeholder = null) {
    this.$description.searchable = enabled;
    this.$description.searchPlaceholder = placeholder;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
SelectField.prototype.clearable = function(enabled = true) {
    this.$description.clearable = enabled;
    return this;
};

/**
 * @param {Array<{ label: NdChild, options: Array<{ value: *, label: NdChild }> }>} groupsConfig
 * @returns {this}
 */
SelectField.prototype.groups = function(groupsConfig) {
    this.$description.groups = groupsConfig;
    return this;
};

/**
 * @param {'text'|'tags'|'count'|'truncate'} mode
 * @returns {this}
 */
SelectField.prototype.multipleDisplay = function(mode) {
    this.$description.multipleDisplay = mode;
    return this;
};

/** @returns {this} */
SelectField.prototype.multipleDisplayAsTags = function() {
    this.$description.multipleDisplay = 'tags';
    return this;
};

/** @returns {this} */
SelectField.prototype.multipleDisplayAsText = function() {
    this.$description.multipleDisplay = 'text';
    return this;
};

/** @returns {this} */
SelectField.prototype.multipleDisplayAsCount = function() {
    this.$description.multipleDisplay = 'count';
    return this;
};

/**
 * @param {number} [max=2]
 * @returns {this}
 */
SelectField.prototype.multipleDisplayAsTruncate = function(max = 2) {
    this.$description.multipleDisplay = 'truncate';
    this.$description.truncateMax = max;
    return this;
};

/**
 * @param {boolean} [enabled=true]
 * @returns {this}
 */
SelectField.prototype.removeSelected = function(enabled = true) {
    this.$description.removeSelected = enabled;
    return this;
};

/**
 * Custom render for the truncated overflow label (e.g. "+3 more").
 * @param {(count: number) => NdChild} callback
 * @returns {this}
 */
SelectField.prototype.truncateRender = function(callback) {
    this.$description.truncateRender = callback;
    return this;
};

/**
 * Custom render for the count display (e.g. "3 selected").
 * @param {(count: number) => NdChild} callback
 * @returns {this}
 */
SelectField.prototype.countRender = function(callback) {
    this.$description.countRender = callback;
    return this;
};

/**
 * Custom render for the selected label in text mode.
 * @param {(selected: *[]) => NdChild} callback
 * @returns {this}
 */
SelectField.prototype.selectedLabelRender = function(callback) {
    this.$description.selectedLabelRender = callback;
    return this;
};

/**
 * Custom render for each option in the dropdown list.
 * @param {(item: *, isSelected: boolean) => NdChild} callback
 * @returns {this}
 */
SelectField.prototype.renderItem = function(callback) {
    this.$description.renderItem = callback;
    return this;
};

/**
 * @param {(value: *) => void} handler
 * @returns {this}
 */
SelectField.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};