
import {Div, ForEachArray} from '../../../../core/elements';

export default function DropdownGroupRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('dropdown-group');

    const content = [];

    if($desc.content) {
        content.push(Div({class: 'dropdown-group-label'}, $desc.content));
    }

    const items = $desc.filter ? $desc.items.where($desc.filter) : $desc.items;

    content.push(
        Div({class: 'dropdown-group-items'},
            ForEachArray(items, (item) => item),
        ),
    );

    return Div(instance.resolveProps(), content);
}