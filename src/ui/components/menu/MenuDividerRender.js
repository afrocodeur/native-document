import {Div, ListItem} from '../../../core/elements';

export default function MenuDividerRender($desc, instance) {
    if($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();
    props.class.add('menu-divider');

    return ListItem(Div( { ...instance.resolveProps(), role: 'separator' }));
}