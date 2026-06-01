import {Div, Img, Span} from '../../../../core/elements';
import {classPropertyAccumulator} from '../../../../core/utils/property-accumulator';


import './avatar.css';

export default function AvatarRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('avatar');
    props.class.add('is-' + ($desc.size || 'medium'));
    props.class.add('is-' + ($desc.shape || 'circle'));

    if($desc.variant) {
        props.class.add('is-' + $desc.variant);
    }

    const style = {};

    if($desc.color) {
        style.background = $desc.color;
    }

    if($desc.textColor) {
        style.color = $desc.textColor;
    }

    if(Object.keys(style).length) {
        props.style.add(style);
    }

    const avatar = Div(instance.resolveProps(), buildContent($desc));

    if(!$desc.status && !$desc.badge) {
        return avatar;
    }

    const overlays = [];

    if($desc.status) {
        overlays.push(buildStatus($desc));
    }

    if($desc.badge) {
        overlays.push(buildBadge($desc));
    }

    return Div({ class: 'avatar-wrapper' }, [avatar, ...overlays]);
}

function buildContent($desc) {
    if($desc.src) {
        return Img($desc.src, {
            class: 'avatar-image',
            alt: $desc.alt || $desc.name || '',
        });
    }

    if($desc.initials || $desc.name) {
        return Span({class: 'avatar-initials'}, $desc.initials || $desc.name.split(' ').map(n => n[0]).join(''));
    }

    if($desc.icon) {
        return Span({class: 'avatar-icon'}, $desc.icon);
    }

    return null;
}

function buildStatus($desc) {
    const statusClass = classPropertyAccumulator('avatar-status');

    if($desc.status) {
        statusClass.add($desc.status.transform((status) => 'is-' + status));
    }
    statusClass.add('is-' + ($desc.statusPosition || 'bottom-trailing'));

    return Span({ class: statusClass.value() });
}

function buildBadge($desc) {
    const badgeClass = ['avatar-badge'];

    badgeClass.push('is-' + ($desc.badgePosition || 'top-trailing'));

    return Span({class: badgeClass.join(' ')}, $desc.badge);
}