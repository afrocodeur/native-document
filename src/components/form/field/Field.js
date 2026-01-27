import {Validation} from "@components/form/validation/Validation";
import {Validator} from "@core";
import {resolveParams} from "@components/form/utils";
import BaseComponent from "@components/BaseComponent";

export default function Field(name, type, defaultConfig) {

    BaseComponent.call(this);

    this.$description = {
        name: name,
        type: type,
        key: name,
        label: null,
        placeholder: null,
        help: null,
        defaultValue: null,
        disabled: false,
        readonly: false,
        rules: [],
        clearErrorOn: 'focus',
        validateOn: 'blur',
        showIf: null,
        requiredIf: null,
        value: null,
        errors: null,
        showErrors: true,
        id: null,
        suffix: 'field',
        classes: {
            wrapper: null,
            label: null,
            input: null,
            error: null,
            hint: null
        },
        events: {},
        render: null,
        ...defaultConfig
    };

    this.$element = null;
    this.$input = null;

}

Field.renderers = {};

Field.defaultTemplate = null;

BaseComponent.extends(Field);

Field.use = function(template) {
    Field.defaultTemplate = template.field;
};

// ---------------------------------------------
// COMMON METHODS
// ---------------------------------------------

Field.prototype.$model = function() {
    return this.$description.value || this.$description.checked;
};

Field.prototype.id = function(id) {
    this.$description.id = id;
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

Field.prototype.showErrors = function(show = true) {
    this.$description.showErrors = show;
    return this;
};

Field.prototype.hideErrors = function() {
    this.$description.showErrors = false;
    return this;
};

Field.prototype.model = function(observable) {
    this.$description.value = observable;
    return this;
};

Field.prototype.errors = function(errors) {
    if(!Validator.isObservable(errors)) {
        throw new Error('Errors must be an observable');
    }
    this.$description.errors = errors;
    return this;
};

Field.prototype.setError = function(error) {
    this.$description.errors?.set?.(error);
    return this;
};

Field.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

Field.prototype.key = function(keyInData) {
    this.$description.key = keyInData;
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
    this.$description.disabled = disabled;
    return this;
};

Field.prototype.readonly = function(readonly) {
    this.$description.readonly = readonly;
    return this;
};

Field.prototype.required = function(message) {
    this.$description.rules.push({
        fn: Validation.required,
        message: message || `${this.$description.label || this.$description.name} is required`
    });
    return this;
};

Field.prototype.custom = function(validatorFn, message) {
    this.$description.rules.push({
        validate: validatorFn,
        message: message || 'Validation failed'
    });
    return this;
};

Field.prototype.clearErrorOn = function(event) {
    this.$description.clearErrorOn = event;
    return this;
};

Field.prototype.validateOn = function(event) {
    this.$description.validateOn = event;
    return this;
};

Field.prototype.showIf = function(condition) {
    this.$description.showIf = condition;
    return this;
};

Field.prototype.requiredIf = function(condition, message) {
    this.addRule(Validation.requiredIf, [condition], message);
    return this;
};

Field.prototype.addRule = function(validationFn, params, message) {
    this.$description.rules.push({
        fn: validationFn,
        params: params || [],
        message
    });
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
    this.$description.value = value;
    return this;
};

Field.prototype.validate = function(allValues = {}) {
    if (!this.$description.rules || this.$description.rules.length === 0) {
        this.$description.errors?.set(null);
        return [];
    }

    const errors = [];
    const value = this.value();

    for (const rule of this.$description.rules) {
        const paramsResolved = resolveParams(rule, allValues);
        const result = rule.fn(value, ...paramsResolved, allValues);

        if (!result.valid) {
            errors.push(rule.message || result.message);
        }
    }

    this.$description.errors?.set(errors.length ? errors : null);
    return errors;
};

Field.prototype.toJSON = function() {
    return {
        ...this.$description,
        rules: this.$description.rules?.map(r => ({
            type: r.fn.name,
            params: r.params,
            message: r.message
        })),
    };
};

Field.prototype.classes = function(classesObject) {
    Object.assign(this.$description.classes, classesObject);
    return this;
};

Field.prototype.wrapperClass = function(wrapperClass) {
    this.$description.classes.wrapper = wrapperClass;
    return this;
};

Field.prototype.inputClass = function(inputClass) {
    this.$description.classes.input = inputClass;
    return this;
};

Field.prototype.labelClass = function(labelClass) {
    this.$description.classes.label = labelClass;
    return this;
};

Field.prototype.errorClass = function(errorClass) {
    this.$description.classes.error = errorClass;
    return this;
};

Field.prototype.hintClass = function(hintClass) {
    this.$description.classes.error = hintClass;
    return this;
};

Field.prototype.render = function(renderFn) {
    if (typeof renderFn !== 'function') {
        throw new Error('Custom renderer must be a function');
    }

    this.$description.render = renderFn;
    return this;
};

Field.registerRenderer = function(type, renderer) {
    if (typeof renderer !== 'function') {
        throw new Error(`Renderer for type "${type}" must be a function`);
    }

    Field.renderers[type] = renderer;
};

Field.prototype.getRenderer = function() {
    if (this.$description.render) {
        return this.$description.render;
    }

    const typeRenderer = Field.renderers[this.$description.type];
    if (typeRenderer) {
        return typeRenderer;
    }

    return this.constructor.defaultTemplate || Field.defaultTemplate;
};

Field.prototype.$build = function() {
    const renderer = this.getRenderer();
    if(!renderer) {
        return null;
    }
    return renderer(this);
};