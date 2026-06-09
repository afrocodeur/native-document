import {Div, Span} from '../../../../core/elements';


export default function DropdownItemRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('dropdown-item');
    props.class.add({ 'is-disabled': $desc.disabled, 'is-selected': $desc.selected });

    if($desc.selected != null) {
        props['aria-selected'] = $desc.selected;
    }


    const content = [];
    if($desc.renderContent) {
        content.push($desc.renderContent($desc, instance));
    } else {
        if($desc.icon) {
            content.push(Span({ class: 'dropdown-item-icon' }, $desc.icon));
        }
        content.push(Span({ class: 'dropdown-item-label' }, $desc.content));
        if($desc.shortcut) {
            content.push(Span({ class: 'dropdown-item-shortcut' }, $desc.shortcut));
        }
    }

    const el = Div(instance.resolveProps(), content);
    el.nd.onClick(() => {
        $desc.action && $desc.action($desc.data || $desc.value || $desc);
    });

    return el;
}