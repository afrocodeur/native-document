import {Div, Span} from '../../../core/elements';
import { Observable } from "../../../core/data/Observable";

export default function StepperStepRender($desc, instance) {
    if($desc.render) {
        return $desc.render($desc, instance);
    }

    const index = $desc.index;
    const stepper = $desc.stepper;

    const props = instance.getEditableProps();
    props.class.add('stepper-step');

    const isActive = Observable.computed(() => {
        return stepper.$description.currentStep.val() === index.val()
    }, [stepper.$description.currentStep, index]) ;

    const indicatorClass = {
        'step-indicator' : true,
        '_': $desc.status.transform((status) => 'is-' + status),
        'is-active': isActive
    };

    const stateIndicator = $desc.status.transform((status) => {
        if(status === 'completed') {
            return '✓';
        }
        if(status === 'error') {
            return '✕';
        }
        return '';
    });

    let indicatorContent = $desc.icon || (stepper.$description.showNumbers ? index.transform((value) => value + 1) : null);

    const labelClass = isActive.transform(a => 'step-label' + (a ? ' is-active' : ''));

    const labelContent = [
        Span({ class: labelClass }, $desc.label),
    ];

    if($desc.description) {
        labelContent.push(Span({class: 'step-description'}, $desc.description));
    }

    if($desc.optional.val()) {
        labelContent.push(Span({class: 'step-optional'}, 'Optional'));
    }

    const stepEl = Div(instance.resolveProps(), [
        Div({class: indicatorClass}, [
            indicatorContent,
            Span({class: 'step-state-indicator'}, stateIndicator),
        ]),
        Div({class: 'step-label-wrapper'}, labelContent),
    ]);

    stepEl.nd.onClick(() => {
        if($desc.disabled.val()) {
            return;
        }
        stepper.goToStep(index.val());
    });

    return stepEl;
}