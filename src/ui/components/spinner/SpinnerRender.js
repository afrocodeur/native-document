import {Div, ShowIf, Span} from '../../../core/elements';
import './spinner.css';

export default function SpinnerRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('spinner');

    props.class.add('is-' + ($desc.type || 'circle'));
    props.class.add('is-' + ($desc.size || 'small'));
    props.class.add('is-' + ($desc.speed || 'normal'));

    if($desc.variant) {
        props.class.add('is-' + $desc.variant);
    }

    if($desc.overlay) {
        props.class.add('has-overlay');
    }
    if($desc.fullScreenOverlay) {
        props.class.add('has-full-screen-overlay');
    }
    if($desc.backdrop) {
        props.class.add('has-backdrop');
    }

    if($desc.labelPosition) {
        props.class.add('is-label-' + $desc.labelPosition);
    }

    const iconStyle = {};

    if($desc.color) {
        iconStyle['--spinner-color'] = $desc.color;
    }

    const icon = Div({ class: 'spinner-icon', style: iconStyle });

    const content = [icon];

    if($desc.label) {
        content.push(Span({class: 'spinner-label'}, $desc.label));
    }

    return Div(instance.resolveProps(), content);
}