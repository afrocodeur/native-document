import {Div, Span} from '../../../core/elements';
import {SvgSvg, SvgCircle} from '../../../core/elements';


import './progress.css';

export default function ProgressRender($desc, instance) {
    const type = $desc.type || 'bar';

    if(type === 'circle') {
        return buildCircle($desc, instance);
    }

    return buildBar($desc, instance);
}

function getPercentage($desc) {
    const value = $desc.value;
    const max   = $desc.max || 100;

    if(value?.__$Observable) {
        return value.transform(v => Math.min(100, Math.round((v / max) * 100)));
    }

    return Math.min(100, Math.round(((value || 0) / max) * 100));
}

function getLabel($desc, percentage) {
    if($desc.format) {
        const value = $desc.value?.__$Observable ? $desc.value.val() : ($desc.value || 0);
        return $desc.format(value, $desc.max);
    }

    if($desc.showValue) {
        return $desc.value?.__$Observable ? $desc.value : ($desc.value || 0);
    }

    return null;
}

const buildBar = ($desc, instance) => {
    const props      = instance.getEditableProps();
    const percentage = getPercentage($desc);
    const variant    = $desc.variant || 'primary';
    const size       = $desc.size    || 'medium';

    props.class.add('progress');

    const fillClass = ['progress-fill', 'is-' + variant];

    if($desc.striped) {
        fillClass.push('is-striped');
    }

    if($desc.animated) {
        fillClass.push('is-animated');
    }

    if($desc.indeterminate) {
        fillClass.push('is-indeterminate');
    }

    const fillStyle = {};

    if(!$desc.indeterminate && $desc.value !== null) {
        const value = $desc.value;
        const max   = $desc.max || 100;

        if(value?.__$Observable) {
            fillStyle.width = value.transform(v => Math.min(100, Math.round((v / max) * 100)) + '%');
        }
        else {
            fillStyle.width = Math.min(100, Math.round(((value || 0) / max) * 100)) + '%';
        }
    }

    const trackClass = ['progress-track', 'is-' + size];

    if($desc.borderRadiusType) {
        trackClass.push('is-' + $desc.borderRadiusType);
    }

    if($desc.height) {
        props.style.add({height: toUnit($desc.height)});
    }

    const content = [];

    if($desc.label || $desc.showValue) {
        const valueLabel = getLabel($desc, percentage);

        content.push(
            Div({class: 'progress-header'}, [
                $desc.label ? Span({class: 'progress-label'}, $desc.label) : null,
                valueLabel  ? Span({class: 'progress-value'}, valueLabel)  : null,
            ]),
        );
    }

    content.push(
        Div({class: trackClass.join(' ')},
            Div({class: fillClass.join(' '), style: fillStyle}),
        ),
    );

    return Div(instance.resolveProps(), content);
};

const CIRCLE_SIZES = {
    small: { size: 32, stroke: 2 },
    medium: { size: 64, stroke: 6 },
    large: { size: 128, stroke: 10 },
};

const getCircleSize = ($desc) => {
    if(typeof $desc.size === 'number') {
        return {
            size: $desc.size,
            stroke: $desc.stroke || 3,
        };
    }

    return CIRCLE_SIZES[$desc.size] || CIRCLE_SIZES.medium;
};

const buildCircle = ($desc, instance) => {
    const circleSize = getCircleSize($desc);
    const size = circleSize.size;
    const stroke = circleSize.stroke;
    const radius = ((size - stroke) / 2) - 3;
    const circumference = 2 * Math.PI * radius;
    const percentage = getPercentage($desc);

    const offset = percentage?.__$Observable
        ? percentage.transform(p => circumference - (p / 100) * circumference)
        : circumference - (percentage / 100) * circumference;

    return Div({ class: 'progress-circle-container' }, [
        SvgSvg({ width: size, height: size, viewBox: `0 0 ${size} ${size}` }, [
            // Rail (Background circle)
            SvgCircle({
                cx: size / 2, cy: size / 2, r: radius,
                class: 'progress-circle-track',
                'stroke-width': stroke,
            }),
            SvgCircle({
                cx: size / 2, cy: size / 2, r: radius,
                class: 'progress-circle-fill is-' + ($desc.variant || 'primary'),
                'stroke-width': stroke,
                'stroke-dasharray': circumference,
                'stroke-dashoffset': offset,
                'stroke-linecap': 'round',
                transform: `rotate(-90 ${size / 2} ${size / 2})`,
            }),
        ]),
        $desc.showValue ? Span({ class: 'progress-circle-label' }, getLabel($desc)) : null,
    ]);
};

const toUnit = (value) => {
    if(typeof value === 'number') {
        return value + 'px';
    }
    if(value?.__$Observable) {
        return value.transform(v => typeof v === 'number' ? v + 'px' : v);
    }
    return value;
};