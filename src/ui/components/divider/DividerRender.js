import {Div, Span} from '../../../core/elements';
import './divider.css';

const toUnit = (value) => {
    if(typeof value === 'number') {
        return value + 'px';
    }
    if(value?.__$Observable) {
        return value.transform(v => typeof v === 'number' ? v + 'px' : v);
    }
    return value;
};

export default function DividerRender($desc, instance) {
    const props = instance.getEditableProps();

    const orientation = $desc.orientation || 'horizontal';

    props.class.add('divider');
    props.class.add('is-' + orientation);

    const style = {};

    if($desc.thickness) {
        style['--divider-thickness'] = toUnit($desc.thickness);
    }

    if($desc.color) {
        style['--divider-color'] = $desc.color;
    }

    if($desc.spacing) {
        const val = toUnit($desc.spacing);
        style.margin = orientation === 'horizontal' ? val + ' 0' : '0 ' + val;
    }

    if(Object.keys(style).length) {
        props.style.add(style);
    }

    const lineClass = 'divider-line is-' + ($desc.variant || 'solid');
    const lineStyle = {};

    if($desc.leading) {
        lineStyle['margin-left'] = toUnit($desc.leading);
    }

    if($desc.trailing) {
        lineStyle['margin-right'] = toUnit($desc.trailing);
    }

    if(!$desc.label) {
        return Div(instance.resolveProps(), Span({class: lineClass, style: lineStyle}));
    }

    const position = $desc.labelPosition || 'center';
    const content  = [];

    if(position === 'center' || position === 'trailing') {
        content.push(Span({class: lineClass, style: lineStyle}));
    }

    content.push(Span({class: 'divider-label'}, $desc.label));

    if(position === 'center' || position === 'leading') {
        content.push(Span({class: lineClass}));
    }

    return Div(instance.resolveProps(), content);
}