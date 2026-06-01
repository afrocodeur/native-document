import Field from '../../types/Field';

/**
 * Hidden field for carrying form values that are not displayed to the user.
 * Participates in FormControl validation and value collection.
 * @example
 * const field = new HiddenField('userId')
 *     .model(userIdObs);
 *
 * HiddenField.use((description, instance) => {
 *     // description.name, description.value
 *     return Input({ type: 'hidden', name: description.name });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function HiddenField(name, props) {
    if(!(this instanceof HiddenField)) {
        return new HiddenField(name, props);
    }

    Field.call(this, name, 'hidden', props);
}

HiddenField.defaultTemplate = null;

/**
 * Registers the render template for HiddenField.
 * @param {(description: {
 *     name: string,
 *     type: 'hidden',
 *     value: Observable<*>|null,
 *     defaultValue: *,
 *     props: GlobalAttributes
 * }, instance: HiddenField) => NdChild} template
 */
HiddenField.use = function(template) {
    HiddenField.defaultTemplate = template;
};

HiddenField.prototype = Object.create(Field.prototype);
HiddenField.prototype.constructor = HiddenField;