import {Div, Span} from '../../../../core/elements';
import Avatar from '../../../../components/avatar/types/Avatar';

import './avatar-group.css';

const normalize = (item) => {
    if(typeof item === 'string') {
        return Avatar(item);
    }
    return item;
};

export default function AvatarGroupRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('avatar-group');

    if($desc.overlap) {
        props.style.add({'--avatar-group-overlap': '-' + $desc.overlap + 'px'});
    }

    const items = $desc.items || [];
    const max   = $desc.max > 0 ? $desc.max : items.length;

    const shown = items.slice(0, max).map(normalize);
    const rest  = items.length - shown.length;

    if(rest > 0) {
        return Div(instance.resolveProps(), [...shown, buildMore(rest, $desc)]);
    }

    return Div(instance.resolveProps(), shown);
}

function buildMore(count, $desc) {
    const firstItem = $desc.items[0];
    const size  = firstItem?.$description?.size  || 'medium';
    const shape = firstItem?.$description?.shape || 'circle';
    const isClickable = $desc.onMoreClick ? ' is-clickable' : '';

    const span = Span({
        class: 'avatar-group-more is-' + size + ' is-' + shape + isClickable,
    }, '+' + count);

    if($desc.onMoreClick) {
        span.nd.onClick($desc.onMoreClick);
    }

    return span;
}