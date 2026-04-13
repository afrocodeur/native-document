import {Div, Span, ForEachArray, ShowIf, Switch} from '../../../core/elements';
import {MenuDivider} from "../../../components/menu";

export default function MenuGroupRender($desc, instance) {
    if($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();
    if($desc.collapsable) {
        props.class.add('is-collapsable');
    }

    const content = [];

    if($desc.label || $desc.icon) {
        content.push(buildGroupHeader($desc, instance));
    }

    const items = Div({class: 'menu-group-items'}, ForEachArray($desc.items));

    if($desc.collapsable && $desc.collapsed) {
        content.push(ShowIf($desc.collapsed, () => items));
    }
    else {
        content.push(items);
    }

    return Div(instance.resolveProps(), content);
}

const buildGroupHeader = ($desc, instance) => {
    const content = [];

    if($desc.icon) {
        content.push(Span({class: 'menu-group-icon'}, $desc.icon));
    }

    if($desc.label) {
        content.push(Span({class: 'menu-group-label'}, $desc.label));
    }

    if($desc.collapsable) {
        const closedIcon = $desc.collapsableOpenedIcon || '▾';
        const openedIcon = $desc.collapsableClosedIcon || '';
        content.push(
            Span({ class: $desc.collapsed?.transform(c => 'menu-group-chevron' + (c ? '' : ' is-open')), },
                Switch($desc.collapsed, openedIcon, closedIcon)
            )
        );
    }

    const header = Div({class: 'menu-group-header'}, content);

    if($desc.collapsable && $desc.collapsed) {
        header.nd.onStopClick(() => $desc.collapsed.toggle());
    }

    return header;
};