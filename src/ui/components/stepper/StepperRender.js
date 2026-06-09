import {Div, ForEachArray, Match} from '../../../core/elements';

import './stepper.css';

export default function StepperRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('stepper');
    props.class.add('is-' + ($desc.orientation || 'horizontal'));
    props.class.add('has-navigation-at-' + $desc.position);

    if($desc.alternativeLabel) {
        props.class.add('is-alternative-label');
    }

    const nav = buildNav($desc, instance);
    const content = buildContent($desc, instance);

    const order = ($desc.position === 'top' || $desc.position === 'leading')
        ? [nav, content]
        : [content, nav];

    return Div(instance.resolveProps(), order);
}

const buildNav = ($desc, instance) => {
    // [a11y] aria-label on stepper nav
    return Div({ class: 'stepper-nav', 'aria-label': $desc.label || 'Steps' },
        ForEachArray($desc.visibleSteps, (step, index) => {
            step.$setStepper(instance);
            const items = [];

            items.push(step);
            if($desc.showConnector) {
                items.push(buildConnector(index, $desc));
            }

            return Div({class: 'stepper-step-wrapper'}, items);
        }),
    );
};

const buildConnector = (index, $desc) => {
    if($desc.renderStepIndicatorConnector) {
        return $desc.renderStepIndicatorConnector(index);
    }

    const isCompleted = $desc.currentStep.is(current => current > index);

    return Div({
        class: isCompleted.transform(c => 'stepper-connector' + (c ? ' is-completed' : '')),
    });
};

const buildContent = ($desc, instance) => {
    if($desc.renderContent) {
        return $desc.renderContent($desc.steps, $desc, instance);
    }

    const contents = {};
    $desc.steps.forEach((step, index) => {
        contents[index] = () => {
            const isActive = $desc.currentStep.is(index);

            return Div({
                class: isActive.transform(a => 'stepper-panel' + (a ? '' : ' is-hidden')),
            }, step.$description.content);
        };
    });

    return Div({class: 'stepper-content'}, Match($desc.currentStep, contents));
};