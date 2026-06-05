import { Li, Div, Span, ForEachArray, ShowIf, Switch } from '../../../../core/elements';

import './list-group.css';

export default function ListGroupRender($desc, instance) {
    if ($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();
    props.class.add('list-group');

    if ($desc.collapsable) {
        props.class.add('is-collapsable');
    }

    const content = [];

    if ($desc.label || $desc.icon) {
        content.push(buildGroupHeader($desc, instance));
    }

    if ($desc.collapsable && $desc.collapsed) {
        content.push(ShowIf($desc.collapsed, () => Div({ class: 'list-group-items' }, ForEachArray($desc.items))));
    } else {
        content.push(Div({ class: 'list-group-items' }, ForEachArray($desc.items)));
    }

    return Li(instance.resolveProps(), content);
}

function buildGroupHeader($desc, instance) {
    const content = [];

    if ($desc.icon) {
        content.push(Span({ class: 'list-group-icon' }, $desc.icon));
    }

    if ($desc.label) {
        content.push(Span({ class: 'list-group-label' }, $desc.label));
    }

    if ($desc.collapsable && $desc.collapsed) {
        const openedIcon = $desc.collapsableOpenedIcon || '▾';
        const closedIcon = $desc.collapsableClosedIcon || '▸';

        content.push(
            Span({ class: $desc.collapsed.transform((c) => 'list-group-chevron' + (c ? '' : ' is-open')) },
                Switch($desc.collapsed, closedIcon, openedIcon),
            ),
        );
    }

    const header = Div({ class: 'list-group-header' }, content);

    if ($desc.collapsable && $desc.collapsed) {
        header.nd.onStopClick(() => $desc.collapsed.toggle());
    }

    return header;
}
