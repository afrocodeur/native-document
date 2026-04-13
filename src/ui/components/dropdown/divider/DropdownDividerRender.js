
import {Div} from '../../../../core/elements';

export default function DropdownDividerRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('dropdown-divider');

    return Div(instance.resolveProps());
}