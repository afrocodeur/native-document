import {Div} from "../../../core/elements";

import './stack.css';

export default function StackRender(mainClass, $desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('stack '+mainClass);

    if ($desc.spacing) {
        if(typeof $desc.spacing === 'number') {
            props.style.add('gap', $desc.spacing);
        }
        else if(typeof $desc.spacing === 'string' && /[0-9]+/.test($desc.spacing)) {
            props.style.add('gap', $desc.spacing);
        }
        else if ($desc.spacing?.__$Observable) {
            props.style.add('gap', $desc.spacing.transform(v => typeof v === 'number' ? v + 'px' : v));
        }
        else {
            props.class.add('has-gap-'+$desc.spacing);
        }
    }

    props.class.add('is-align-'+$desc.alignment);
    props.class.add('is-justify-'+$desc.justifyContent);

    if($desc.wrap) {
        props.class.add('is-wrap');
    }
    if($desc.shrink) {
        props.class.add('is-shrink');
    }
    if($desc.grow) {
        props.class.add('is-grow');
    }
    if($desc.reverse) {
        props.class.add('is-reverse');
    }

    return Div(instance.resolveProps(), $desc.content);
}