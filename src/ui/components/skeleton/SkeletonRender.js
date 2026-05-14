import {Div, Span} from '../../../core/elements';

import './skeleton.css';

export default function SkeletonRender($desc, instance) {
    const props  = instance.getEditableProps();
    const type    = $desc.type    || 'rect';
    const variant = $desc.variant || 'pulse';
    const repeat  = $desc.repeat  || 1;

    if(type === 'text') {
        if(repeat <= 1) {
            return buildText($desc, variant);
        }

        const items = [];

        for(let i = 0; i < repeat; i++) {
            items.push(buildText($desc, variant));
        }

        return Div({ class: 'skeleton-group' }, items);
    }

    props.class.add('skeleton');
    props.class.add('is-' + variant);
    props.class.add('is-' + ($desc.borderRadiusType || 'rounded'));

    if(type === 'circle' || type === 'avatar') {
        props.class.add('is-circle');
    }

    const style = {};

    if($desc.width) {
        style.width = toUnit($desc.width);
    }

    if($desc.height) {
        style.height = toUnit($desc.height);
    }

    if(Object.keys(style).length) {
        props.style.add(style);
    }

    if(repeat <= 1) {
        return Div(instance.resolveProps());
    }

    const resolvedProps = instance.resolveProps();
    const items = [];

    for(let i = 0; i < repeat; i++) {
        items.push(Div(resolvedProps));
    }

    return Div({class: 'skeleton-group'}, items);
}

function buildText($desc, variant) {
    const lines   = $desc.lines || 3;
    const content = [];

    for(let i = 0; i < lines; i++) {
        content.push(Span({class: 'skeleton-text-line is-' + variant}));
    }

    return Div({class: 'skeleton-text'}, content);
}

const toUnit = (value) => {
    if(typeof value === 'number') {
        return value + 'px';
    }
    if(value?.__$Observable) {
        return value.transform(v => typeof v === 'number' ? v + 'px' : v);
    }
    return value;
};