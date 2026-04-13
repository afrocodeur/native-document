import {Button as NativeButton, ShowIf, Span} from '../../../core/elements';
import {Spinner} from "../../../components/spinner";

import './button.css';

export default function ButtonRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('btn');
    props.class.add('is-' + ($desc.variant || 'secondary'));
    props.class.add('is-' + ($desc.size || 'medium'));

    if($desc.outline) {
        props.class.add('is-outline');
    }
    if($desc.block) {
        props.class.add('is-block');
    }
    if($desc.borderRadiusType) {
        props.class.add('is-' + $desc.borderRadiusType);
    }
    if($desc.iconOnly) {
        props.class.add('is-icon-only');
    }

    if($desc.loading) {
        props.class.add('is-loading',  $desc.loading);
    }
    if($desc.disabled) {
        props.class.add('is-disabled', $desc.disabled);
    }

    const content = buildContent($desc);

    return NativeButton({
        ...instance.resolveProps(),
        type:     $desc.type || 'button',
        disabled: $desc.disabled,
    }, content);
}

function buildContent($desc) {
    const content = [];

    if($desc.loading) {
        content.push(ShowIf($desc.loading, Spinner({ class: 'btn-spinner' })));
    }

    if($desc.icon && isIconBefore($desc.iconPosition)) {
        content.push(Span({class: 'btn-icon'}, $desc.icon));
    }

    if($desc.label != null) {
        content.push(Span({class: 'btn-label'}, $desc.label));
    }

    if($desc.icon && isIconAfter($desc.iconPosition)) {
        content.push(Span({class: 'btn-icon'}, $desc.icon));
    }

    return content;
}

const isIconBefore = (position) => !position || position === 'leading' || position === 'top';
const isIconAfter  = (position) => position === 'trailing' || position === 'bottom';