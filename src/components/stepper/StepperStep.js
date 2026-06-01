import BaseComponent from "../BaseComponent";
import { $ } from '../../core/data/Observable';

const NO_VALIDATION = () => true;

/**
 * A single step inside a Stepper. Manages label, description, icon, status (pending/completed/error), optional flag, and async validation.
 *
 *
 * @example
 * const step = new StepperStep(Span('Payment'))
 *     .description(Span('Enter payment details'))
 *     .content(PaymentForm())
 *     .optional(false)
 *     .validator(async (step) => {
 *         return await validatePayment();
 *     })
 *     .onComplete(() => console.log('step done'));
 *
 * @constructor
 * @param {NdChild} label
 * @param {GlobalAttributes} [props={}]
 */
export default function StepperStep(label, props = {}) {
    if(!(this instanceof StepperStep)) {
        return new StepperStep(label, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        icon: null,
        label,
        description: null,
        content: null,
        status: $('pending'),
        optional: $(false),
        disabled: $(false),
        completed: $(false),
        error: $(false),
        data: null,
        render: null,
        validator: NO_VALIDATION,
        stepper: null,
        key: null,
        index: $(0),
        isVisible: $(true),
        props
    };
}

BaseComponent.extends(StepperStep);

StepperStep.defaultTemplate = null;

/**
 * Registers the render template for StepperStep.
 * @param {(description: {
 *     icon: NdChild|null,
 *     label: NdChild,
 *     description: NdChild|null,
 *     content: NdChild|null,
 *     status: Observable<'pending'|'completed'|'error'>,
 *     optional: Observable<boolean>,
 *     disabled: Observable<boolean>,
 *     completed: Observable<boolean>,
 *     error: Observable<boolean>,
 *     data: *|null,
 *     render: ((desc: *, instance: StepperStep) => NdChild)|null,
 *     key: string|null,
 *     index: Observable<number>,
 *     isVisible: Observable<boolean>,
 *     props: GlobalAttributes,
 * }, instance: StepperStep) => NdChild} template
 */
StepperStep.use = function(template) {
    StepperStep.defaultTemplate = template;
};

StepperStep.prototype.$setStepper = function(stepper) {
    this.$description.stepper = stepper;
    return this;
};
StepperStep.prototype.$setIndex = function(index) {
    this.$description.index.set(index);
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
StepperStep.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
StepperStep.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

/**
 * @param {NdChild} description
 * @returns {this}
 */
StepperStep.prototype.description = function(description) {
    this.$description.description = description;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
StepperStep.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {'pending'|'completed'|'error'} status
 * @returns {this}
 */
StepperStep.prototype.status = function(status) {
    this.$description.status.set(status);
    return this;
};

/**
 * @param {*} [optional]
 * @returns {this}
 */
StepperStep.prototype.optional = function(optional = true) {
    this.$description.optional.set(optional);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} [disabled]
 * @returns {this}
 */
StepperStep.prototype.disabled = function(disabled = true) {
    this.$description.disabled.set(disabled);
    return this;
};

/**
 * @param {'pending'|'completed'|'error'} status
 */
StepperStep.prototype.updateStatus = function(status) {
    const isCompleted = status === 'completed';
    const isError = status === 'error';

    this.$description.completed.set(isCompleted);
    this.$description.error.set(isError);
    this.$description.status.set(status);
    return this;
};

/**
 * @param {*} [completed]
 * @returns {this}
 */
StepperStep.prototype.completed = function(completed = true) {
    return this.updateStatus(completed ? 'completed' : 'pending');
};

/**
 * @param {*} [error]
 * @returns {this}
 */
StepperStep.prototype.error = function(error = true) {
    return this.updateStatus(error ? 'error' : 'pending');
};

/**
 * @returns {this}
 */
StepperStep.prototype.reset = function() {
    return this.updateStatus('pending');
};

/**
 * @param {*} data
 * @returns {this}
 */
StepperStep.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {string} key
 * @returns {this}
 */
StepperStep.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

/**
 * @returns {string}
 */
StepperStep.prototype.getKey = function() {
    return this.$description.key;
};

/**
 * @param {Observable<boolean>|boolean|(() => Observable<boolean>)} condition
 * @returns {this}
 */
StepperStep.prototype.visibility = function(condition) {
    this.$description.visibility = (typeof condition === 'function' ?  condition() : condition);
    return this;
};

/**
 * @param {(step: StepperStep) => boolean|Promise<boolean>} validatorFn
 * @returns {this}
 */
StepperStep.prototype.validator = function(validatorFn) {
    this.$description.validator = validatorFn;
    return this;
};

/**
 * @returns {boolean}
 */
StepperStep.prototype.validate = function() {
    if (this.$description.validator) {
        const isValid = this.$description.validator(this);
        this.error(!isValid);
        return isValid;
    }
    return true;
};
