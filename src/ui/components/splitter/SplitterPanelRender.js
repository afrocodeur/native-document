import {Div} from '../../../core/elements';

export default function SplitterPanelRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('splitter-panel');

    if($desc.collapsed) {
        props.class.add('is-collapsed');
    }

    ($desc.orientation === 'vertical')
        ? setupVerticalLimit(props, $desc)
        : setupHorizontalLimit(props, $desc);

    return Div(instance.resolveProps(), $desc.content);
}

const setupVerticalLimit = (props, $desc) => {
    if($desc.minSize) {
        props.style.add('minHeight', toUnit($desc.minSize));
    }
    if($desc.maxSize) {
        props.style.add('maxHeight', toUnit($desc.maxSize));
    }

    props.style.add('height', $desc.size.transform(toUnit));
};
const setupHorizontalLimit = (props, $desc) => {
    if($desc.minSize) {
        props.style.add('minWidth', toUnit($desc.minSize));
    }
    if($desc.maxSize) {
        props.style.add('maxWidth', toUnit($desc.maxSize));
    }
    props.style.add('width', $desc.size.transform(toUnit));
};

const toUnit = (value) => typeof value === 'number' ? value + 'px' : value;