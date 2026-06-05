import { Div } from '../../../core/elements';

export default function SpacerRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('spacer');
    props.style.add('flex', '1');

    return Div(instance.resolveProps());
}
