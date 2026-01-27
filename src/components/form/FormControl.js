import {debounce} from "@src/core/utils/helpers";
import EventEmitter from "@src/core/utils/EventEmitter";
import {Validator, Observable as $ } from "@core";
import NativeDocumentError from "@src/core/errors/NativeDocumentError";
import BaseComponent from "@components/BaseComponent";

/**
 * @param { {data: Observable } } configs
 * @constructor
 */
export default function FormControl(configs) {
    if(!(this instanceof FormControl)) {
        return new FormControl(configs);
    }
    EventEmitter.call(this);

    this.$element = null;
    this.$configs = configs;
    this.$fields = new Map();
    this.$submitting = $(false);
    this.$errors = $(null);
    this.$isDirty = $(false);
    this.$isValid = $(false);
}

FormControl.defaultLayoutTemplate = null;

FormControl.use = function(template) {
    FormControl.defaultLayoutTemplate = template.formControl;
};

FormControl.create = function (configs) {
    return new FormControl(configs);
};

BaseComponent.extends(FormControl, EventEmitter);

Object.defineProperty(FormControl.prototype, 'isDirty', {
    get() { return this.$isDirty; }
});

Object.defineProperty(FormControl.prototype, 'isValid', {
    get() { return this.$isValid; }
});

Object.defineProperty(FormControl.prototype, 'submitting', {
    get() { return this.$submitting; }
});

FormControl.prototype.layout = function(layoutCallback) {
    if (typeof layoutCallback !== 'function') {
        throw new Error('Layout must be a function');
    }

    this.$layout = layoutCallback;
    return this;
};

FormControl.prototype.field = function(field) {
    const name = field.$description.name;
    this.$fields.set(name, field);

    const dataSource = this.$configs?.data?.[name];
    if(!dataSource) {
        return this;
    }

    if(Validator.isObservable(dataSource)) {
        field.model(dataSource);
        dataSource.subscribe(() => {
            this.$isDirty.set(true);
            this.emit('change', name, dataSource, field);
        });
        return this;
    }

    field.value(dataSource);

    return this;
};

FormControl.prototype.get = function(fieldName) {
    const field = this.$fields.get(fieldName);
    if (!field) {
        throw new Error(`Field "${fieldName}" not found in form`);
    }
    return field;
};


FormControl.prototype.reset = function() {
    this.$isDirty.set(false);
    this.$isValid.set(true);

    this.$configs?.data?.reset();

    this.emit('reset');
    return this;
};

FormControl.prototype.submit = function() {
    this.$element?.submit();
    return this;
};

FormControl.prototype.$handleSubmit = async function(event) {
    this.emit('beforeSubmit', event, this);

    const values = this.values();
    const isValid = await this.validate(values);
    if (!isValid) {
        event.preventDefault();
        this.emit('validationError', this.$errors.val(), this);
        return;
    }

    this.$submitting.set(true);

    try {
        const result = await this.emit('submit', event, values);

        this.emit('success', result, values, this);

        return result;

    } catch (error) {
        this.emit('error', error, this);
        if(!this.hasListeners('error')) {
            throw error;
        }
    } finally {
        this.$submitting.set(false);
        this.emit('afterSubmit', this);
    }
};

FormControl.prototype.disable = function() {
    for (const [_, field] of this.$fields) {
        field.disabled?.(true);
    }
    this.emit('disable');
    return this;
};

FormControl.prototype.enable = function() {
    for (const [_, field] of this.$fields) {
        field.disabled?.(false);
    }
    this.emit('enable');
    return this;
};

FormControl.prototype.values = function() {
    const values = {};
    for(const [_, field] of this.$fields) {
        values[field.$description.name] = field.value();
    }
    return values;
};

FormControl.prototype.validate = async function(allValues) {
    const errors = {};
    const values = allValues || this.values();

    for (const [name, field] of this.$fields) {
        const fieldErrors = await field.validate(values);

        if (fieldErrors && fieldErrors.length > 0) {
            errors[name] = fieldErrors;
        }
    }

    const hasError = Object.keys(errors).length > 0;

    this.$errors.set(hasError ? errors : null);

    this.$isValid.set(!hasError);

    this.emit('validate', !hasError, errors);

    return Object.keys(errors).length === 0;
};

FormControl.prototype.onSubmit = function(callback) {
    this.on('submit', callback);
    return this;
};

FormControl.prototype.onPreventSubmit = function(callback) {
    this.on('submit', function(event) {
        event.preventDefault();
        return callback.apply(this, arguments);
    });
    return this;
};

FormControl.prototype.onDebouncedSubmit = function(callback, delay = 300) {
    return this.onSubmit(debounce(callback.bind(this), delay));
};

FormControl.prototype.onSuccess = function (callback) {
    this.on('success', callback);
    return this;
};

FormControl.prototype.onError = function (callback) {
    this.on('error', callback);
    return this;
};

FormControl.prototype.onChange = function(callback) {
    this.on('change', callback);
    return this;
};

FormControl.prototype.onReset = function(callback) {
    this.on('reset', callback);
    return this;
};
FormControl.prototype.onBeforeSubmit = function(callback) {
    this.on('beforeSubmit', callback);
    return this;
};
FormControl.prototype.onAfterSubmit = function(callback) {
    this.on('afterSubmit', callback);
    return this;
};
FormControl.prototype.onValidationError = function(callback) {
    this.on('validationError', callback);
    return this;
};


FormControl.prototype.$build = function() {
    const fieldsObject = {};
    for (const [name, field] of this.$fields) {
        fieldsObject[name] = field;
    }

    const layoutFn = this.$layout || FormControl.defaultLayoutTemplate;

    const form = layoutFn({
        fields: fieldsObject,
        form: this
    });
    if(!((form instanceof HTMLFormElement)  || form?.$element instanceof HTMLFormElement)) {
        throw new NativeDocumentError('Layout must return an HtmlFormElement');
    }
    const self = this;
    form.nd.onSubmit(async function(event) {
        return await self.$handleSubmit(event);
    });

    return form;
};