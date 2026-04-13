import {Div} from "../../../core/elements";
import './position-stack.css';

export default function PositionStackRender(mainClass, $desc, instance) {
    const props = instance.getEditableProps();
    props.class.add(mainClass);

    const style = {};

    if($desc.top !== null) {
        style.top = $desc.top;
    }
    if($desc.right !== null) {
        style.right = $desc.right;
    }
    if($desc.bottom !== null) {
        style.bottom = $desc.bottom;
    }
    if($desc.left !== null) {
        style.left = $desc.left;
    }
    if($desc.width !== null) {
        style.width = $desc.width;
    }
    if($desc.height !== null) {
        style.height = $desc.height;
    }
    if($desc.zIndex !== null) {
        style.zIndex = $desc.zIndex;
    }
    if($desc.anchor) {
        props.class.add('is-' + $desc.anchor);
    }

    props.style.add(style);

    return Div(instance.resolveProps(), $desc.content);
};