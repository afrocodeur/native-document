import {debounce} from '../../core/utils/helpers';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { $ } from '../../core/data/Observable';
import Validator from '../../core/utils/validator';
import NativeDocumentError from '../../../src/core/errors/NativeDocumentError';
import BaseComponent from '../BaseComponent';

/**
 * Top-level form controller. Manages field registration, layout, validation, submission, error display, and reactive value tracking.
 *
 *
 * @example
 * const form = new FormControl()
 *     .fields((form) => {
 *         new StringField('email').label('Email').required().email();
 *         new PasswordField('password').label('Password').required().strong();
 *     })
 *     .layout((fields) => VStack(fields.email, fields.password))
 *     .onSubmit(async (values, form) => {
 *         await api.login(values);
 *     })
 *     .onError((errors) => console.log(errors))
 *     .errorsMode('inline');
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function FormControl(props) {
    if(!(this instanceof FormControl)) {
        return new FormControl(props);
    }
    BaseComponent.call(this, props);

    this.$fields  = {};

    this.$description = {
        data:            props?.data || null,
        fieldBuilder:    null,
        layout:          null,
        errorsMode:      'dispatch',
        errorsPosition:  'bottom',
        errorsMapper:    null,
        renderErrors:    null,
        submitting:      $(false),
        errors:          $(null),
        isDirty:         $(false),
        isValid:         $(false),
        props,
    };
}

FormControl.defaultTemplate = null;

/**
 * Registers the render template for FormControl.
 * @param {(description: {
 *     data: *|null,
 *     fieldBuilder: ((form: FormControl) => void)|null,
 *     layout: ((fields: Record<string, Field>) => NdChild)|null,
 *     errorsMode: 'dispatch'|'inline'|'summary'|'none',
 *     errorsPosition: 'top'|'bottom',
 *     errorsMapper: Record<string, string>|null,
 *     renderErrors: ((errors: Record<string, string[]>) => NdChild)|null,
 *     submitting: Observable<boolean>,
 *     errors: Observable<Record<string, string[]>|null>,
 *     isDirty: Observable<boolean>,
 *     isValid: Observable<boolean>,
 *     props: GlobalAttributes,
 * }, instance: FormControl) => NdChild} template
 */
FormControl.use = function(template) {
    FormControl.defaultTemplate = template;
};

/**
 * @param {GlobalAttributes} [props]
 * @returns {FormControl}
 */
FormControl.create = function(props) {
    return new FormControl(props);
};

BaseComponent.extends(FormControl);
BaseComponent.use(FormControl, HasEventEmitter);

Object.defineProperty(FormControl.prototype, 'isDirty', {
    get() { return this.$description.isDirty; },
});

Object.defineProperty(FormControl.prototype, 'isValid', {
    get() { return this.$description.isValid; },
});

Object.defineProperty(FormControl.prototype, 'submitting', {
    get() { return this.$description.submitting; },
});

/**
 * @param {(form: FormControl) => void} fieldBuilder
 * @returns {this}
 */
FormControl.prototype.fields = function(fieldBuilder) {
    if(typeof fieldBuilder !== 'function') {
        throw new NativeDocumentError('FormControl.fields() expects a function');
    }
    this.$description.fieldBuilder = (...args) => {
        const result = fieldBuilder(...args);
        const dirties = [];
        for(const [name, field] of Object.entries(result)) {
            this.$registerField(name, field);
            dirties.push(field.$description.isDirty);
        }

        $.computed(() => {
            const isDirty = dirties.some((item) => item.val());
            this.$description.isDirty.set(isDirty);
        }, dirties);

        return result;
    };
    return this;
};

FormControl.prototype.$registerField = function(name, field) {
    this.$fields[name] = field;

    const dataSource = this.$description.data?.[name];
    if(!dataSource) {
        return;
    }

    if(Validator.isObservable(dataSource)) {
        field.model(dataSource);
        return;
    }

    field.value(dataSource);
};

/**
 * @param {string} fieldName
 * @returns {Field|null}
 */
FormControl.prototype.get = function(fieldName) {
    const field = this.$fields[fieldName];
    if(!field) {
        throw new NativeDocumentError(`Field "${fieldName}" not found in form`);
    }
    return field;
};

/**
 * @param {(fields: Record<string, Field>) => NdChild} layoutCallback
 * @returns {this}
 */
FormControl.prototype.layout = function(layoutCallback) {
    if(typeof layoutCallback !== 'function') {
        throw new NativeDocumentError('FormControl.layout() expects a function');
    }
    this.$description.layout = layoutCallback;
    return this;
};

/**
 * @param {'inline'|'summary'|'none'} mode
 * @returns {this}
 */
FormControl.prototype.errorsMode = function(mode) {
    this.$description.errorsMode = mode;
    return this;
};

/**
 * @param {Record<string, string>|null} [mapper=null]
 * @returns {this}
 */
FormControl.prototype.dispatchErrors = function(mapper = null) {
    this.$description.errorsMode   = this.$description.errorsMode === 'summary' ? 'both' : 'dispatch';
    this.$description.errorsMapper = mapper;
    return this;
};

/**
 * @returns {Record<string, string[]>}
 */
FormControl.prototype.summarizeErrors = function() {
    this.$description.errorsMode = this.$description.errorsMode === 'dispatch' ? 'both' : 'summary';
    return this;
};

/**
 * @param {Record<string, string>|null} [mapper=null]
 * @returns {this}
 */
FormControl.prototype.dispatchAndSummarize = function(mapper = null) {
    this.$description.errorsMode   = 'both';
    this.$description.errorsMapper = mapper;
    return this;
};

/**
 * @param {'top'|'bottom'} position
 * @returns {this}
 */
FormControl.prototype.errorsPosition = function(position) {
    this.$description.errorsPosition = position;
    return this;
};

/**
 * @returns {this}
 */
FormControl.prototype.errorsAtTop = function() {
    this.$description.errorsPosition = 'top';
    return this;
};

/**
 * @returns {this}
 */
FormControl.prototype.errorsAtBottom = function() {
    this.$description.errorsPosition = 'bottom';
    return this;
};

/**
 * @param {(errors: Record<string, string[]>) => NdChild} renderFn
 * @returns {this}
 */
FormControl.prototype.renderErrors = function(renderFn) {
    this.$description.renderErrors = renderFn;
    return this;
};

FormControl.prototype.$dispatchServerErrors = function(error) {
    const serverErrors = error.fields;
    const mapped = this.$description.errorsMapper
        ? this.$description.errorsMapper(serverErrors)
        : serverErrors;

    if(!mapped) {
        return;
    }

    for(const [fieldName, errors] of Object.entries(mapped)) {
        const field = this.$fields[fieldName];
        if(field) {
            const errs = Array.isArray(errors) ? errors : [errors];
            field.setError(errs);
        }
    }
};

/**
 * @returns {this}
 */
FormControl.prototype.reset = function() {
    this.$description.isDirty.set(false);
    this.$description.isValid.set(false);
    this.$description.errors.set(null);

    this.$description.data?.reset?.();

    for(const [_, field] of Object.entries(this.$fields)) {
        field.reset();
    }

    this.emit('reset');
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
FormControl.prototype.resetField = function(name) {
    const field = this.$fields[name];
    if(!field) {
        return this;
    }
    field.reset();
    return this;
};

/**
 * @param {string} event
 * @returns {this}
 */
FormControl.prototype.submit = function(event) {
    return this.$handleSubmit(event);
};

/**
 * @param {...string} fieldNames
 * @returns {this}
 */
FormControl.prototype.trigger = function(...fieldNames) {
    const values = this.values();
    fieldNames.forEach(name => {
        this.$fields[name]?.validate(values);
    });
    return this;
};

/**
 * @param {string|null} [fieldName=null]
 * @returns {this}
 */
FormControl.prototype.disable = function(fieldName = null) {
    if(fieldName) {
        this.$fields[fieldName]?.disabled?.(true);
        return this;
    }
    for(const [_, field] of Object.entries(this.$fields)) {
        field.disabled?.(true);
    }
    this.emit('disable');
    return this;
};

/**
 * @param {string|null} [fieldName=null]
 * @returns {this}
 */
FormControl.prototype.enable = function(fieldName = null) {
    if(fieldName) {
        this.$fields[fieldName]?.disabled?.(false);
        return this;
    }
    for(const [_, field] of Object.entries(this.$fields)) {
        field.disabled?.(false);
    }
    this.emit('enable');
    return this;
};

/**
 * @returns {Record<string, *>}
 */
FormControl.prototype.values = function() {
    const values = {};
    for(const [name, field] of Object.entries(this.$fields)) {
        values[name] = field.value();
    }
    return values;
};

/**
 * @param {string} fieldName
 * @param {(value: *, field: Field) => void} handler
 * @returns {this}
 */
FormControl.prototype.watch = function(fieldName, handler) {
    const field = this.$fields[fieldName];
    if(!field) {
        return this;
    }
    field.$description.value?.subscribe(handler);
    return this;
};

FormControl.prototype.validate = async function(allValues) {
    const errors = {};
    const values = allValues || this.values();

    for(const [name, field] of Object.entries(this.$fields)) {
        const fieldErrors = await field.validate(values);

        if(fieldErrors && fieldErrors.errors?.length > 0) {
            errors[name] = fieldErrors.errors;
        }
    }

    const hasError = Object.keys(errors).length > 0;

    this.$description.errors.set(hasError ? errors : null);
    this.$description.isValid.set(!hasError);

    this.emit('validate', !hasError, errors);

    return !hasError;
};

FormControl.prototype.$handleSubmit = async function(event) {
    this.emit('beforeSubmit', event, this);

    const values  = this.values();
    const isValid = await this.validate(values);

    if(!isValid) {
        event.preventDefault();
        this.emit('validationError', this.$description.errors.val(), this);
        return;
    }

    this.$description.submitting.set(true);

    try {
        const result = await this.emit('submit', event, values);
        this.emit('success', result, values, this);

        return result;

    } catch(error) {
        this.$dispatchServerErrors(error);
        this.emit('error', error, this);
        if(!this.hasListeners('error')) {
            throw error;
        }
    } finally {
        this.$description.submitting.set(false);
        this.emit('afterSubmit', this);
    }
};

/**
 * @param {(values: Record<string, *>, form: FormControl) => void|Promise<void>} callback
 * @returns {this}
 */
FormControl.prototype.onSubmit = function(callback) {
    this.on('submit', callback);
    return this;
};

/**
 * @param {Function} callback
 * @returns {this}
 */
FormControl.prototype.onPreventSubmit = function(callback) {
    this.on('submit', function(event) {
        event.preventDefault();
        return callback.apply(this, arguments);
    });
    return this;
};

/**
 * @param {(values: Record<string, *>) => void} callback
 * @param {number} [delay=300]
 * @returns {this}
 */
FormControl.prototype.onDebouncedSubmit = function(callback, delay = 300){
    return this.onSubmit(debounce(callback.bind(this), delay));
};

/**
 * @param {(values: Record<string, *>) => void} callback
 * @returns {this}
 */
FormControl.prototype.onSuccess = function(callback) {
    this.on('success', callback);
    return this;
};

/**
 * @param {(errors: Record<string, string[]>) => void} callback
 * @returns {this}
 */
FormControl.prototype.onError = function(callback) {
    this.on('error', callback);
    return this;
};


/**
 * @param {Function} callback
 * @returns {this}
 */
FormControl.prototype.onChange = function(callback) {
    this.on('change', callback);
    return this;
};

/**
 * @param {Function} callback
 * @returns {this}
 */
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

FormControl.prototype.onInvalid = FormControl.prototype.onValidationError;