import {Span} from '../../../core/elements';
import './badge.css';

export default function BadgeRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('badge');
    props.class.add('is-' + ($desc.appearance || 'filled'));
    props.class.add('is-' + ($desc.variant || 'primary'));
    props.class.add('is-' + ($desc.size || 'medium'));
    props.class.add('is-' + ($desc.borderRadiusType || 'pill'));

    if($desc.onClick) {
        props.class.add('is-clickable');
    }

    const element = Span(instance.resolveProps(), $desc.content);

    if($desc.onClick) {
        element.nd.onClick($desc.onClick);
    }

    return element;
}