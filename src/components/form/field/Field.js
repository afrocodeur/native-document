import { $ } from "../../../core/data/Observable";
import Validator from "../../../core/utils/validator";
import BaseComponent from "../../BaseComponent";
import HasEventEmitter from "../../../core/utils/HasEventEmitter";
import HasValidation from "../../$traits/has-validation/HasValidation";

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
            hint:    null
        },
        render:          null,
        clearButtonIcon: null,
        focus: $(false),
        isDirty:  $(false),
        isTouched:  $(false),
        slots: {},
        props
    };

    this.$description.errors.intercept((nextValue) => nextValue === null ? [] : nextValue);
}

Field.defaultTemplate = null;
BaseComponent.extends(Field);
BaseComponent.use(Field, HasEventEmitter);
BaseComponent.use(Field, HasValidation);

Field.use = function(template) {
    Field.defaultTemplate = template;
};

// ---------------------------------------------
// COMMON METHODS
// ---------------------------------------------

Field.prototype.$model = function() {
    return this.$description.value || this.$description.checked;
};

Field.prototype.forceShowErrors = function(forceValue) {
    this.$description.showErrors.intercept(() => forceValue);
}

Field.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

Field.prototype.suffix = function(suffix) {
    this.$description.suffix = suffix;
    return this;
};

Field.prototype.field = function() {
    if(!this.$element) {
        this.$element = this.toNdElement();
    }
    return this.$element;
};
Field.prototype.node = Field.prototype.field;

Field.prototype.input = function(callback) {
    if(!this.$input) {
        this.field();
    }
    callback && callback(this.$input);
    return this;
};

Field.prototype.model = function(observable) {
    this.$description.value        = observable;
    this.$description.initialValue = Validator.isObservable(observable)
        ? observable.val()
        : observable;
    return this;
};

Field.prototype.bind = Field.prototype.model;

Field.prototype.errors = function(errors) {
    if(!Validator.isObservable(errors)) {
        throw new Error('Errors must be an observable');
    }
    this.$description.errors = errors;
    return this;
};

Field.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

Field.prototype.default = function(defaultValue) {
    this.$description.defaultValue = defaultValue;
    return this;
};

Field.prototype.label = function(text) {
    this.$description.label = text;
    return this;
};

Field.prototype.help = function(text) {
    this.$description.help = text;
    return this;
};

Field.prototype.hint = function(text) {
    this.$description.help = text;
    return this;
};

Field.prototype.placeholder = function(text) {
    this.$description.placeholder = text;
    return this;
};

Field.prototype.disabled = function(disabled) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

Field.prototype.readonly = function(readonly) {
    this.$description.readonly = BaseComponent.obs(readonly);
    return this;
};

Field.prototype.value = function() {
    const value = this.$model();
    return Validator.isObservable(value) ? value.val() : value;
};

Field.prototype.setValue = function(newValue) {
    const value = this.$model();
    if(Validator.isObservable(value)) {
        value.set(newValue);
        return this;
    }
    this.$description.value = BaseComponent.obs(newValue);
    return this;
};

Field.prototype.wrapperProps = function(wrapperProps) {
    this.$description.elementsProps.wrapper = wrapperProps;
    return this;
};

Field.prototype.inputProps = function(inputProps) {
    this.$description.elementsProps.input = inputProps;
    return this;
};

Field.prototype.labelProps = function(labelProps) {
    this.$description.elementsProps.label = labelProps;
    return this;
};

Field.prototype.errorProps = function(errorProps) {
    this.$description.elementsProps.error = errorProps;
    return this;
};

Field.prototype.hintProps = function(hintProps) {
    this.$description.elementsProps.hint = hintProps;
    return this;
};

Field.prototype.focus = function() {
    this.$description.focus.set(true);
    return this;
};

Field.prototype.blur = function() {
    this.$description.focus.set(false);
    return this;
};

Field.prototype.leading = function(content) {
    this.$description.slots.leading = content;
    return this;
};

Field.prototype.trailing = function(content) {
    this.$description.slots.trailing = content;
    return this;
};

Field.prototype.bottom = function(content) {
    this.$description.slots.bottom = content;
    return this;
};

Field.prototype.clearable = function(mode = true) {
    this.$description.clearable = BaseComponent.obs(mode);
    return this;
};

Field.prototype.clearButtonIcon = function(clearButtonIcon) {
    this.$description.slots.clearButtonIcon = clearButtonIcon;
    return this;
};

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

Field.prototype.setError =  function(error) {
    const errs = Array.isArray(error) ? error : [error];
    this.$description.errors.set(errs);
    this.$description.hasErrors.set(!!error);
    this.$description.showErrors.set(!!error);
};