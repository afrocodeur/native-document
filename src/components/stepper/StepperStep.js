import BaseComponent from "../BaseComponent";
import { $ } from '../../core/data/Observable';

const NO_VALIDATION = () => true;

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


StepperStep.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

StepperStep.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

StepperStep.prototype.description = function(description) {
    this.$description.description = description;
    return this;
};

StepperStep.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

StepperStep.prototype.status = function(status) {
    this.$description.status.set(status);
    return this;
};

StepperStep.prototype.optional = function(optional = true) {
    this.$description.optional.set(optional);
    return this;
};

StepperStep.prototype.disabled = function(disabled = true) {
    this.$description.disabled.set(disabled);
    return this;
};

StepperStep.prototype.updateStatus = function(status) {
    const isCompleted = status === 'completed';
    const isError = status === 'error';

    this.$description.completed.set(isCompleted);
    this.$description.error.set(isError);
    this.$description.status.set(status);
    return this;
};

StepperStep.prototype.completed = function(completed = true) {
    return this.updateStatus(completed ? 'completed' : 'pending');
};

StepperStep.prototype.error = function(error = true) {
    return this.updateStatus(error ? 'error' : 'pending');
};

StepperStep.prototype.reset = function() {
    return this.updateStatus('pending');
};

StepperStep.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

StepperStep.prototype.key = function(key) {
    this.$description.key = key;
    return this;
};

StepperStep.prototype.getKey = function() {
    return this.$description.key;
};

StepperStep.prototype.visibility = function(condition) {
    this.$description.visibility = (typeof condition === 'function' ?  condition() : condition);
    return this;
};

StepperStep.prototype.validator = function(validatorFn) {
    this.$description.validator = validatorFn;
    return this;
};

StepperStep.prototype.validate = function() {
    if (this.$description.validator) {
        const isValid = this.$description.validator(this);
        this.error(!isValid);
        return isValid;
    }
    return true;
};
