import {Div, Span} from '../../../core/elements';

import './skeleton.css';
import Skeleton from '../../../components/skeleton/Skeleton';
import {HStack, VStack} from '../../../components/stacks';

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


/**
 * @param {string} [type]
 * @returns {*}
 */
Skeleton.card = function(type) {
    return VStack([
        Skeleton().type('image').height(200),
        VStack([
            Skeleton().text(1),
            Skeleton().text(2),
        ]).spacing('cozy'),
    ], { class: 'skeleton-card '+type }).spacing('cozy');
};

/**
 * @param {number} [items=3]
 * @returns {*}
 */
Skeleton.list = function(items = 3) {
    return VStack(
        Array.from({length: items}, () =>
            HStack([
                Div({ class: 'skeleton-list-item-avatar' }, Skeleton().circle().size(40, 40)),
                Div({ class: 'skeleton-list-item-text' }, Skeleton().text(2)),
            ], { class: 'skeleton-list-item' }).spacing('comfortable').alignCenter(),
        ),
    ).spacing('comfortable');
};

/**
 * @param {number} [rows=5]
 * @param {number} [cols=4]
 * @returns {*}
 */
Skeleton.table = function(rows = 5, cols = 4) {
    const buildRow = () =>
        HStack(
            Array.from({length: cols}, () =>
                Div({ class: 'skeleton-table-col' }, Skeleton().rect().height(16)),
            ),
            { class: 'skeleton-table-row' },
        ).spacing('comfortable').alignCenter();

    return VStack([
        buildRow(),
        ...Array.from({length: rows}, () => buildRow()),
    ]).spacing('cozy');
};

Skeleton.paragraph = function(lines = 3) {
    return Skeleton().text(lines);
};