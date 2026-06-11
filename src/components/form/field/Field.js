import { $ } from '../../../core/data/Observable';
import Validator from '../../../core/utils/validator';
import BaseComponent from '../../BaseComponent';
import HasEventEmitter from '../../../core/utils/HasEventEmitter';
import HasValidation from '../../$traits/has-validation/HasValidation';

/**
 * Base form field with label, hint, placeholder, validation rules, clearable state, and reactive value binding. Extended by all typed field variants.
 *
 *
 * @example
 * const field = new Field('username', 'text')
 *     .label(Span('Username'))
 *     .placeholder('Enter your username')
 *     .required('Username is required')
 *     .minLength(3)
 *     .model(usernameObs)
 *     .clearable(true);
 *
 * @constructor
 * @param {string} name
 * @param {string} [type]
 * @param {GlobalAttributes} [props]
 */
export default function Field(name, type, props) {
    if(!(this instanceof Field)) {
        return new Field(name, type, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        name:          name,
        type:          type,
        key:           name,
        label:         null,
        placeholder:   null,
        help:          null,
        defaultValue:  null,
        disabled:      false,
        readonly:      false,
        rules: [],
        clearErrorOn:  'focus',
        validateOn:    'blur',
        requiredIf:    null,
        value:         null,
        clearable:     null,
        hasErrors:     $(false),
        errors:        $.array(),
        showErrors:    $(true),
        suffix:        'field',
        elementsProps: {
            wrapper: null,
            label:   null,
            input:   null,
            error:   null,
            hint:    null,
        },
        render:          null,
        clearButtonIcon: null,
        focus: $(false),
        isDirty:  $(false),
        isTouched:  $(false),
        slots: {},
        props,
    };
    this.aria = { 'role': 'group' };

    this.$description.errors.intercept((nextValue) => nextValue === null ? [] : nextValue);
}

Field.defaultTemplate = null;
BaseComponent.extends(Field);
BaseComponent.use(Field, HasEventEmitter);
BaseComponent.use(Field, HasValidation);

/**
 * Registers the render template for Field.
 * @param {(description: {
 *     name: string,
 *     type: string,
 *     key: string,
 *     label: NdChild|null,
 *     placeholder: NdChild|null,
 *     help: NdChild|null,
 *     defaultValue: *,
 *     disabled: boolean|Observable<boolean>,
 *     readonly: boolean|Observable<boolean>,
 *     rules: Array<{ fn: Function, params: *, message: string }>,
 *     clearErrorOn: string,
 *     validateOn: string,
 *     value: Observable<*>|null,
 *     clearable: boolean|Observable<boolean>|null,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     showErrors: Observable<boolean>,
 *     render: ((desc: *, instance: Field) => NdChild)|null,
 *     clearButtonIcon: NdChild|null,
 *     focus: Observable<boolean>,
 *     isDirty: Observable<boolean>,
 * }, instance: Field) => NdChild} template
 */
Field.use = function(template) {
    Field.defaultTemplate = template;
};

// ---------------------------------------------
// COMMON METHODS
// ---------------------------------------------

Field.prototype.$model = function() {
    return this.$description.value || this.$description.checked;
};

/**
 * @param {*} forceValue
 * @returns {void}
 */
Field.prototype.forceShowErrors = function(forceValue) {
    this.$description.showErrors.intercept(() => forceValue);
};

/**
 * @param {string} key
 * @returns {this}
 */
Field.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

/**
 * @param {string} suffix
 * @returns {this}
 */
Field.prototype.suffix = function(suffix) {
    this.$description.suffix = suffix;
    return this;
};

/**
 * @returns {HTMLElement|DocumentFragment}
 */
Field.prototype.field = function() {
    if(!this.$element) {
        this.$element = this.toNdElement();
    }
    return this.$element;
};
Field.prototype.node = Field.prototype.field;

/**
 * @param {Function} callback
 * @returns {this}
 */
Field.prototype.input = function(callback) {
    if(!this.$input) {
        this.field();
    }
    callback && callback(this.$input);
    return this;
};

/**
 * @param {Observable<*>} observable
 * @returns {this}
 */
Field.prototype.model = function(observable) {
    this.$description.value        = observable;
    this.$description.initialValue = Validator.isObservable(observable)
        ? observable.val()
        : observable;
    return this;
};

Field.prototype.bind = Field.prototype.model;

/**
 * @param {Observable<string[]>} errors
 * @returns {this}
 */
Field.prototype.errors = function(errors) {
    if(!Validator.isObservable(errors)) {
        throw new Error('Errors must be an observable');
    }
    this.$description.errors = errors;
    return this;
};

/**
 * @param {string} type
 * @returns {this}
 */
Field.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

/**
 * @param {*} defaultValue
 * @returns {this}
 */
Field.prototype.default = function(defaultValue) {
    this.$description.defaultValue = defaultValue;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
Field.prototype.label = function(text) {
    this.$description.label = text;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
Field.prototype.help = function(text) {
    this.$description.help = text;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
Field.prototype.hint = function(text) {
    this.$description.help = text;
    return this;
};

/**
 * @param {NdChild} text
 * @returns {this}
 */
Field.prototype.placeholder = function(text) {
    this.$description.placeholder = text;
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [disabled]
 * @returns {this}
 */
Field.prototype.disabled = function(disabled) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [readonly]
 * @returns {this}
 */
Field.prototype.readonly = function(readonly) {
    this.$description.readonly = BaseComponent.obs(readonly);
    return this;
};

/**
 * @returns {*}
 */
Field.prototype.value = function() {
    const value = this.$model();
    return Validator.isObservable(value) ? value.val() : value;
};

/**
 * @param {*} newValue
 * @returns {this}
 */
Field.prototype.setValue = function(newValue) {
    const value = this.$model();
    if(Validator.isObservable(value)) {
        value.set(newValue);
        return this;
    }
    this.$description.value = BaseComponent.obs(newValue);
    return this;
};

/**
 * @param {*} wrapperProps
 * @returns {this}
 */
Field.prototype.wrapperProps = function(wrapperProps) {
    this.$description.elementsProps.wrapper = wrapperProps;
    return this;
};

/**
 * @param {*} inputProps
 * @returns {this}
 */
Field.prototype.inputProps = function(inputProps) {
    this.$description.elementsProps.input = inputProps;
    return this;
};

/**
 * @param {*} labelProps
 * @returns {this}
 */
Field.prototype.labelProps = function(labelProps) {
    this.$description.elementsProps.label = labelProps;
    return this;
};

/**
 * @param {*} errorProps
 * @returns {this}
 */
Field.prototype.errorProps = function(errorProps) {
    this.$description.elementsProps.error = errorProps;
    return this;
};

/**
 * @param {*} hintProps
 * @returns {this}
 */
Field.prototype.hintProps = function(hintProps) {
    this.$description.elementsProps.hint = hintProps;
    return this;
};

/**
 * @returns {this}
 */
Field.prototype.focus = function() {
    this.$description.focus.set(true);
    return this;
};

/**
 * @returns {this}
 */
Field.prototype.blur = function() {
    this.$description.focus.set(false);
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Field.prototype.leading = function(content) {
    this.$description.slots.leading = content;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Field.prototype.trailing = function(content) {
    this.$description.slots.trailing = content;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Field.prototype.bottom = function(content) {
    this.$description.slots.bottom = content;
    return this;
};

/**
 * @param {*} [mode]
 * @returns {this}
 */
Field.prototype.clearable = function(mode = true) {
    this.$description.clearable = BaseComponent.obs(mode);
    return this;
};

/**
 * @param {*} clearButtonIcon
 * @returns {this}
 */
Field.prototype.clearButtonIcon = function(clearButtonIcon) {
    this.$description.slots.clearButtonIcon = clearButtonIcon;
    return this;
};

/**
 * @returns {this}
 */
Field.prototype.reset = function() {
    const value = this.$model();
    if(Validator.isObservable(value)) {
        value.set(this.$description.initialValue ?? this.$description.defaultValue ?? null);
    }

    this.$description.errors.clear();
    this.$description.hasErrors.set(false);
    this.$description.showErrors.set(true);
    this.$description.isDirty.set(false);
    this.$description.isTouched.set(false);

    this.$description.focus.set(false);

    this.emit('reset');
    return this;
};

/**
 *
 * @param {string|string[]} error
 */
Field.prototype.setError =  function(error) {
    const errs = Array.isArray(error) ? error : [error];
    this.$description.errors.set(errs);
    this.$description.hasErrors.set(!!error);
    this.$description.showErrors.set(!!error);
};