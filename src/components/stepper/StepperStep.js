import BaseComponent from "@components/BaseComponent";
import { $ } from '@core';

export default function StepperStep(label, config = {}) {
    if(!(this instanceof StepperStep)) {
        return new StepperStep(label, config);
    }

    this.$description = {
        icon: null,
        label: label,
        description: null,
        content: null,
        status: $('pending'),
        optional: $(false),
        disabled: $(false),
        completed: $(false),
        error: $(false),
        data: null,
        render: null,
        validator: null,
        key: null,
        ...config
    };
}

BaseComponent.extends(StepperStep);

StepperStep.defaultTemplate = null;

StepperStep.use = function(template) {
    StepperStep.defaultTemplate = template.stepperStep;
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

StepperStep.prototype.completed = function(completed = true) {
    this.$description.completed.set(completed);
    this.$description.status.set(completed ? 'completed' : 'pending');
    return this;
};

StepperStep.prototype.error = function(error = true) {
    this.$description.error.set(error);
    this.$description.status.set(error ? 'error' : 'pending');
    return this;
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

StepperStep.prototype.validator = function(validatorFn) {
    this.$description.validator = validatorFn;
    return this;
};

StepperStep.prototype.validate = function() {
    return true;
};
