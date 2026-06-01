import StringField from '../../field/types/StringField';

/**
 * Search input field with built-in debounce support.
 * @example
 * const field = new SearchField('query')
 *     .label(Span('Search'))
 *     .placeholder('Type to search...')
 *     .debounce(400)
 *     .model(searchQuery);
 *
 * SearchField.use((description, instance) => {
 *     // description.debounce, description.value, description.placeholder...
 *     return Input({ type: 'search', placeholder: description.placeholder });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function SearchField(name, props) {
    if(!(this instanceof SearchField)) {
        return new SearchField(name, props);
    }

    StringField.call(this, name, 'search', props);

    Object.assign(this.$description, {
        debounce: 300,
    });
}

SearchField.defaultTemplate = null;

/**
 * Registers the render template for SearchField.
 * @param {(description: {
 *     name: string,
 *     type: 'search',
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     value: Observable<string>|null,
 *     debounce: number,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: SearchField) => NdChild} template
 */
SearchField.use = function(template) {
    SearchField.defaultTemplate = template;
};

SearchField.prototype = Object.create(StringField.prototype);
SearchField.prototype.constructor = SearchField;

/**
 * @param {number} ms - Debounce delay in milliseconds
 * @returns {this}
 */
SearchField.prototype.debounce = function(ms) {
    this.$description.debounce = ms;
    return this;
};