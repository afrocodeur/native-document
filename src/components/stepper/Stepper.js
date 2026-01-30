import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";
import {$, Validator} from "../../../index";

export default function Stepper(config = {}) {
    if(!(this instanceof Stepper)) {
        return new Stepper(config);
    }

    this.$description = {
        steps: [],
        currentStep: $(0),
        orientation: 'horizontal',
        linear: true,
        alternativeLabel: false,
        editable: false,
        showNumbers: true,
        showConnector: true,
        data: null,
        renderStepIndicator: null,
        renderStepIndicatorConnector: null,
        renderContent: null,
        render: null,
        ...config
    };

    this.$element = null;
}

BaseComponent.extends(Stepper, EventEmitter);

Stepper.defaultTemplate = null;
Stepper.defaultStepTemplate = null;
Stepper.defaultStepConnectorTemplate = null;
Stepper.defaultContentTemplate = null;

Stepper.use = function(template) {
    Stepper.defaultTemplate = template.stepper;
    Stepper.defaultStepIndicatorTemplate = template.stepperStepIndicator;
    Stepper.defaultContentTemplate = template.stepperContent;
    Stepper.defaultStepIndicatorConnectorTemplate = template.stepperStepIndicatorConnector;
};

Stepper.prototype.dynamic = function(observableArray) {
    this.$description.steps = observableArray || $.array([]);
    return this;
};

Stepper.prototype.steps = function(steps) {
    if(Validator.isObservable(steps)) {
        this.$description.steps = steps;
        return this;
    }
    this.$description.steps.set(steps);
    return this;
};

Stepper.prototype.step = function(step) {
    this.$description.steps.push(step);
    return this;
};

Stepper.prototype.clear = function() {
    const steps = this.$description.steps;
    if (Array.isArray(steps)) {
        steps.length = 0;
        return this;
    }

    steps.clear();
    return this;
};

Stepper.prototype.removeStepByIndex = function(index) {
    this.$description.steps.splice(index, 1);
    return this;
};

Stepper.prototype.removeStepByKey = function(key) {
    const index = this.$description.steps.findIndex(step => step.getKey() === key);
    if(index === -1) {
        return this;
    }
    this.$description.steps.splice(index, 1);
    return this;
};

Stepper.prototype.currentStep = function(step) {
    return this.$description.currentStep.val();
};

Stepper.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

Stepper.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

Stepper.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

Stepper.prototype.linear = function() {
    this.$description.linear = true;
    return this;
};

Stepper.prototype.nonLinear = function() {
    this.$description.linear = false;
    return this;
};

Stepper.prototype.editable = function(editable = true) {
    this.$description.editable = editable;
    return this;
};

Stepper.prototype.alternativeLabel = function(alternative = true) {
    this.$description.alternativeLabel = alternative;
    return this;
};

Stepper.prototype.showNumbers = function(show = true) {
    this.$description.showNumbers = show;
    return this;
};

Stepper.prototype.showConnector = function(show = true) {
    this.$description.showConnector = show;
    return this;
};


Stepper.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

Stepper.prototype.next = function() {
    const current = this.$description.currentStep.val();
    const total = this.$description.steps.length;

    if (current < total - 1) {
        const nextStep = current + 1;
        this.$description.currentStep.set(nextStep);
        this.emit('stepChange', nextStep);
    }
    return this;
};

Stepper.prototype.previous = function() {
    const current = this.$description.currentStep.val();
    if (current > 0) {
        const previousStep = current - 1;
        this.$description.currentStep.set(previousStep);
        this.emit('stepChange', previousStep);
    }
    return this;
};

Stepper.prototype.goToStep = function(index) {
    const total = this.$description.steps.length;
    const current = this.$description.currentStep.val();

    if (index < 0 || index >= total) {
        return this;
    }

    if(!this.$description.editable && index < current) {
        return this;
    }
    if(this.$description.linear && !(index === current+1 || index === current-1)) {
        return this;

    }
    this.$description.currentStep.set(index);
    this.emit('stepChange', index);
    return this;
};

Stepper.prototype.reset = function() {
    this.$description.currentStep.set(0);
    this.emit('reset');
    return this;
};

Stepper.prototype.onStepChange = function(handler) {
    this.on('stepChange', handler);
    return this;
};

Stepper.prototype.onNext = function(handler) {
    this.on('next', handler);
    return this;
};

Stepper.prototype.onPrevious = function(handler) {
    this.on('previous', handler);
    return this;
};

Stepper.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};

Stepper.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};

Stepper.prototype.renderStepIndicator = function(renderFn) {
    this.$description.renderStepIndicator = renderFn;
    return this;
};

Stepper.prototype.renderStepIndicatorConnector = function(renderFn) {
    this.$description.renderStepIndicatorConnector = renderFn;
    return this;
};

Stepper.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};
