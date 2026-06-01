import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { $ } from '../../core/data/Observable';
import DebugManager from '../../core/utils/debug-manager';
import StepperStep from './StepperStep';

/**
 * Multi-step wizard. Supports linear/non-linear modes, horizontal/vertical orientation, editable steps, and step indicator rendering.
 *
 *
 * @example
 * const stepper = new Stepper()
 *     .horizontal()
 *     .linear()
 *     .step(new StepperStep(Span('Account')).content(AccountForm()))
 *     .step(new StepperStep(Span('Profile')).content(ProfileForm()))
 *     .step(new StepperStep(Span('Confirm')).content(ConfirmForm()))
 *     .onComplete(() => finalize())
 *     .onStepChange((index) => console.log(\`step \${index}\`));
 *
 * Stepper.use((description, instance) => {
 *     return Div({ class: 'stepper' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
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
        props,
    };

    this.$element = null;
}

BaseComponent.extends(Stepper);
BaseComponent.use(Stepper, HasEventEmitter);

Stepper.defaultTemplate = null;

/**
 * Registers the render template for Stepper.
 * @param {(description: {
 *     steps: ObservableArray<StepperStep>,
 *     visibleSteps: ObservableArray<StepperStep>,
 *     currentStep: Observable<number>,
 *     orientation: 'horizontal'|'vertical',
 *     linear: boolean,
 *     alternativeLabel: boolean,
 *     editable: Observable<boolean>,
 *     showNumbers: boolean,
 *     showConnector: boolean,
 *     data: *|null,
 *     renderStepIndicator: ((step: StepperStep, index: number) => NdChild)|null,
 *     renderStepIndicatorConnector: ((desc: *) => NdChild)|null,
 *     renderContent: ((step: StepperStep) => NdChild)|null,
 *     render: ((desc: *, instance: Stepper) => NdChild)|null,
 *     position: 'top'|'bottom'|'leading'|'trailing',
 *     props: GlobalAttributes,
 * }, instance: Stepper) => NdChild} template
 */
Stepper.use = function(template) {
    Stepper.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: Stepper) => Stepper} callback
 */
Stepper.preset = function(name, callback) {
    if (Stepper.prototype[name] || Stepper[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Stepper.`);
        return;
    }
    Stepper[name] = (props) => callback(new Stepper(props));
};

/**
 * @param {Record<string, (s: Stepper) => Stepper>} presets
 */
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
                    stepBefore = itemStep;
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

/**
 * @param {StepperStep|((step: StepperStep, stepper: Stepper) => void)} step
 * @returns {this}
 */
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

/**
 * @returns {this}
 */
Stepper.prototype.clear = function() {
    this.$description.steps.clear();
    this.$description.visibleSteps.clear();
    return this;
};

/**
 * @param {number} [step]
 * @returns {number|this}
 */
Stepper.prototype.currentStep = function(step) {
    return this.$description.currentStep.val();
};

/**
 * @param {string} orientation
 * @returns {this}
 */
Stepper.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.linear = function() {
    this.$description.linear = true;
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.nonLinear = function() {
    this.$description.linear = false;
    return this;
};

/**
 * @param {*} [editable]
 * @returns {this}
 */
Stepper.prototype.editable = function(editable = true) {
    this.$description.editable.set(editable);
    return this;
};

/**
 * @param {*} [alternative]
 * @returns {this}
 */
Stepper.prototype.alternativeLabel = function(alternative = true) {
    this.$description.alternativeLabel = alternative;
    return this;
};

/**
 * @param {NdChild} [show]
 * @returns {this}
 */
Stepper.prototype.showNumbers = function(show = true) {
    this.$description.showNumbers = show;
    return this;
};

/**
 * @param {NdChild} [show]
 * @returns {this}
 */
Stepper.prototype.showConnector = function(show = true) {
    this.$description.showConnector = show;
    return this;
};

/**
 * @param {*} data
 * @returns {this}
 */
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

/**
 * @returns {this}
 */
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

/**
 * @param {Function} handler
 * @returns {this}
 */
Stepper.prototype.onStepChange = function(handler) {
    this.on('stepChange', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Stepper.prototype.onNext = function(handler) {
    this.on('next', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Stepper.prototype.onPrevious = function(handler) {
    this.on('previous', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Stepper.prototype.onComplete = function(handler) {
    this.on('complete', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Stepper.prototype.onReset = function(handler) {
    this.on('reset', handler);
    return this;
};

/**
 * @param {(step: StepperStep, index: number) => NdChild} renderFn
 * @returns {this}
 */
Stepper.prototype.renderStepIndicator = function(renderFn) {
    this.$description.renderStepIndicator = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Stepper.prototype.renderStepIndicatorConnector = function(renderFn) {
    this.$description.renderStepIndicatorConnector = renderFn;
    return this;
};

/**
 * @param {(step: StepperStep) => NdChild} renderFn
 * @returns {this}
 */
Stepper.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.navigationAtLeading = function() {
    this.$description.position = 'leading';
    this.vertical();
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.navigationAtBottom = function() {
    this.$description.position = 'bottom';
    this.horizontal();
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.navigationAtTop = function() {
    this.$description.position = 'top';
    this.horizontal();
    return this;
};

/**
 * @returns {this}
 */
Stepper.prototype.navigationAtTrailing = function() {
    this.$description.position = 'trailing';
    this.vertical();
    return this;
};