import Field from "../../types/Field";
import Validator from "../../../../core/utils/validator";

/**
 * Single checkbox field for boolean values. Supports reactive model binding.
 * @example
 * const field = new CheckboxField('agree')
 *     .label(Span('I agree to the terms'))
 *     .model(agreeObs)
 *     .required('You must agree');
 *
 * CheckboxField.use((description, instance) => {
 *     // description.checked — Observable<boolean> or boolean
 *     return Input({ type: 'checkbox', checked: description.checked });
 * });
 *
 * @constructor
 * @param {string} name
 * @param {GlobalAttributes} [props]
 */
export default function CheckboxField(name, props) {
    if(!(this instanceof CheckboxField)) {
        return new CheckboxField(name, props);
    }

    Field.call(this, name, 'checkbox', props);

    Object.assign(this.$description, {
        checked: false,
    });
}

CheckboxField.defaultTemplate = null;

/**
 * Registers the render template for CheckboxField.
 * @param {(description: {
 *     name: string,
 *     type: 'checkbox',
 *     label: NdChild|null,
 *     checked: Observable<boolean>|boolean,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     props: GlobalAttributes
 * }, instance: CheckboxField) => NdChild} template
 */
CheckboxField.use = function(template) {
    CheckboxField.defaultTemplate = template;
};

CheckboxField.prototype = Object.create(Field.prototype);
CheckboxField.prototype.constructor = CheckboxField;

/**
 * Binds the checked state to an observable.
 * @param {Observable<boolean>} observable
 * @returns {this}
 */
CheckboxField.prototype.model = function(observable) {
    this.$description.checked = observable;
    return this;
};

/**
 * Returns the current checked value (resolves the observable if needed).
 * @returns {boolean}
 */
CheckboxField.prototype.checked = function() {
    const checked = this.$description.checked;
    if(Validator.isObservable(checked)) {
        return checked.val();
    }
    return checked;
};