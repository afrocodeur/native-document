import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import {$, Validator} from "../../../index";
import DebugManager from "../../core/utils/debug-manager";
import StepperStep from "./StepperStep";

export default function Stepper(props = {}) {
    if(!(this instanceof Stepper)) {
        return new Stepper(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        steps: $.array(),
        visibleSteps: $.array(),
        currentStep: $(0),
        orientation: 'horizontal',
        linear: true,
        alternativeLabel: false,
        editable: $(true),
        showNumbers: true,
        showConnector: true,
        data: null,
        renderStepIndicator: null,
        renderStepIndicatorConnector: null,
        renderContent: null,
        render: null,
        position: 'bottom',
        props
    };

    this.$element = null;
}

BaseComponent.extends(Stepper);
BaseComponent.use(Stepper, HasEventEmitter);

Stepper.defaultTemplate = null;

Stepper.use = function(template) {
    Stepper.defaultTemplate = template;
};

Stepper.preset = function(name, callback) {
    if (Stepper.prototype[name] || Stepper[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Stepper.`);
        return;
    }
    Stepper[name] = (props) => callback(new Stepper(props));
};

Stepper.presets = function(presets) {
    for (const name in presets) {
        Stepper.preset(name, presets[name]);
    }
};

Stepper.prototype.$originalBuild = BaseComponent.prototype.$build;

Stepper.prototype.$build = function() {
    const visibleSteps = this.$description.visibleSteps;
    const steps = this.$description.steps;

    steps.forEach(step => {
        if(!step.$description.visibility) {
            visibleSteps.push(step);
            return;
        }
        if(step.$description.visibility.val()) {
            visibleSteps.push(step);
        }

        step.$description.visibility.subscribe((value) => {
            if(!value) {
                visibleSteps.removeItem(step);
                return;
            }
            const originalIndex = steps.indexOf(step);
            let stepBefore = null;

            for (let i = 0; i < visibleSteps.length; i++) {
                const itemStep = visibleSteps.get(i);
                if (steps.indexOf(itemStep) < originalIndex) {
                    stepBefore = itemStep
                    continue;
                }
                break;
            }
            if(!stepBefore) {
                visibleSteps.push(step);
                return;
            }
            visibleSteps.insertAfter(step, stepBefore);
        });
    });

    const updateStateIndexes = () => {
        this.$description.visibleSteps.forEach((step, index) => step.$setIndex(index));
    };
    this.$description.visibleSteps.subscribe(updateStateIndexes);
    updateStateIndexes();
    return this.$originalBuild();
};

Stepper.prototype.step = function(step) {
    let finalStep = null;
    if(typeof step === 'function') {
        finalStep = new StepperStep(null);
        step(finalStep, this);
    }
    else {
        finalStep = (step instanceof StepperStep)
            ? step
            : (new StepperStep(step.label)).setDescription(step);
    }

    this.$description.steps.push(finalStep);
    return this;
};

Stepper.prototype.clear = function() {
    this.$description.steps.clear();
    this.$description.visibleSteps.clear();
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
    this.$description.editable.set(editable);
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

Stepper.prototype.next = async function() {
    const currentIdx = this.$description.currentStep.val();
    const total = this.$description.visibleSteps.length;

    if (currentIdx === total - 1) {
        const lastStep = this.$description.visibleSteps.at(currentIdx);
        const isValid = await lastStep.validate();
        if (isValid) {
            lastStep.completed(true);
            this.emit('complete');
        } else {
            lastStep.error(true);
            this.emit('stepError', currentIdx);
        }
        return this;
    }

    return this.goToStep(currentIdx + 1);
};

Stepper.prototype.previous = function() {
    const currentIdx = this.$description.currentStep.val();
    return this.goToStep(currentIdx - 1);
};

Stepper.prototype.goToStep = async function(index) {
    const visibleSteps = this.$description.visibleSteps;
    const total = visibleSteps.length;
    const currentIdx = this.$description.currentStep.val();

    if (index < 0 || index >= total || index === currentIdx) {
        return this;
    }

    const currentStep = visibleSteps.at(currentIdx);

    if (index < currentIdx) {
        if (this.$description.editable.val()) {
            this.$description.currentStep.set(index);
            this.emit('stepChange', index);
        }
        return this;
    }

    if (index > currentIdx) {
        if (this.$description.linear && index > currentIdx + 1) {
            return this;
        }

        const isValid = await currentStep.validate();
        if (isValid) {
            currentStep.completed(true);
            this.$description.currentStep.set(index);
            this.emit('stepChange', index);
        } else {
            currentStep.error(true);
            this.emit('stepError', currentIdx);
        }
    }

    return this;
};

Stepper.prototype.reset = function() {
    this.$description.currentStep.set(0);

    this.$description.steps.forEach(step => {
        step.reset();
    });

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


Stepper.prototype.navigationAtLeading = function() {
    this.$description.position = 'leading';
    this.vertical();
    return this;
};

Stepper.prototype.navigationAtBottom = function() {
    this.$description.position = 'bottom';
    this.horizontal();
    return this;
};


Stepper.prototype.navigationAtTop = function() {
    this.$description.position = 'top';
    this.horizontal()
    return this;
};

Stepper.prototype.navigationAtTrailing = function() {
    this.$description.position = 'trailing';
    this.vertical();
    return this;
};