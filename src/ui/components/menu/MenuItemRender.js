import {Div, ListItem, Span } from '../../../core/elements';
import ShortcutManager from '../../../core/utils/shortcut-manager';
import { $ } from '../../../../index'
import {buildSubmenu, setupInteraction} from "./helpers";

export default function MenuItemRender($desc, instance) {
    if($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();

    props.class.add('menu-item');
    if($desc.disabled) {
        props.class.add('is-disabled', $desc.disabled);
    }
    if($desc.selected) {
        props.class.add('is-selected', $desc.selected);
    }

    const orientation  = instance.$parent?.$description?.orientation || 'horizontal';
    const interaction  = $desc.interaction || instance.$parent?.$description?.interaction || 'hover';
    const hasSubmenu   = $desc.items?.length;

    if(hasSubmenu) {
        props.class.add('has-submenu');
    }

    const content = [
        Span({class: 'menu-item-icon'}, $desc.icon),
        Span({class: 'menu-item-label'}, $desc.label),
        Span({class: 'menu-item-shortcut'}, ShortcutManager.display($desc.shortcut)),
        Span({class: 'menu-group-chevron'}, hasSubmenu ? '›' : ''),
    ];

    if($desc.trailing) {
        content.push(Span({class: 'menu-item-trailing'}, $desc.trailing));
    }

    const el = Div({class: 'menu-item-wrapper'}, content);

    el.nd.onClick(() => {
        if($desc.disabled?.val()) {
            return;
        }
        $desc.action?.($desc.dataResolver?.());
        instance.emit('click', instance);
    });

    const $isOpen   = $(false);
    const submenuEl = buildSubmenu($desc, orientation, $isOpen, instance);
    const listItem  = ListItem(instance.resolveProps(), [el, submenuEl]);

    setupInteraction(listItem, el, submenuEl, orientation, interaction, $isOpen, hasSubmenu, instance);

    return listItem;
}