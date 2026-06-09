import {Link, ListItem, Span} from '../../../core/elements';
import { Link as RouterLink } from '../../../../router';
import ShortcutManager from '../../../core/utils/shortcut-manager';
import { $ } from '../../../core/data/Observable';
import {buildSubmenu, setupInteraction} from './helpers';

export default function MenuLinkRender($desc, instance) {
    if($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();

    props.class.add('menu-item');
    props.class.add({ 'is-disabled': $desc.disabled, 'is-selected': $desc.selected });

    const orientation  = instance.$parent?.$description?.orientation || 'horizontal';
    const interaction  = $desc.interaction || instance.$parent?.$description?.interaction || 'hover';
    const hasSubmenu   = $desc.items?.length;
    const action       = $desc.action;
    const isRoute      = action?.isRoute;
    const targetPath   = typeof action === 'string' ? action : action?.to || '#';
    const target       = $desc.target || null;

    if(hasSubmenu) {
        props.class.add('has-submenu');
        // [a11y] aria-haspopup for submenu links
        props['aria-haspopup'] = 'menu';
        props['aria-expanded'] = 'false';
    }

    // [a11y] aria-disabled, aria-current
    if($desc.disabled) {
        props['aria-disabled'] = $desc.disabled;
    }
    if($desc.selected) {
        props['aria-current'] = $desc.selected.transform ? $desc.selected.transform((s) => s ? 'page' : undefined) : ($desc.selected ? 'page' : undefined);
    }

    const content = [
        Span({class: 'menu-item-icon'}, $desc.icon || null),
        Span({class: 'menu-item-label'}, $desc.label),
        Span({class: 'menu-item-shortcut'}, ShortcutManager.display($desc.shortcut)),
        Span({class: 'menu-group-chevron'}, hasSubmenu ? '›' : ''),
    ];

    if($desc.trailing) {
        content.push(Span({class: 'menu-item-trailing'}, $desc.trailing));
    }

    const el = isRoute
        ? RouterLink({class: 'menu-item-wrapper', to: targetPath, target}, content)
        : Link({class: 'menu-item-wrapper', href: targetPath, target}, content);

    if(!hasSubmenu) {
        return ListItem(instance.resolveProps(), el);
    }

    const $isOpen   = $(false);
    const submenuEl = buildSubmenu($desc, orientation, $isOpen, instance);
    const listItem  = ListItem(instance.resolveProps(), [el, submenuEl]);

    setupInteraction(listItem, el, submenuEl, orientation, interaction, $isOpen, hasSubmenu, instance);

    return listItem;
}