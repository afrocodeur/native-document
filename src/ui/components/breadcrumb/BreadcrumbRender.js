import {Nav, OrderedList, ListItem, Span, Link, ForEachArray} from '../../../core/elements';

import './breadcrumb.css';

export default function BreadcrumbRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('breadcrumb');

    // [a11y] aria-label on nav
    props['aria-label'] = (typeof $desc.label === 'string') ? $desc.label : 'Breadcrumb';

    return Nav(instance.resolveProps(),
        OrderedList({ class: 'breadcrumb-list' },
            ForEachArray($desc.items, (item) => buildItem(item, $desc, instance)),
        ),
    );
}

const buildSeparator = ($desc) => {
    if($desc.renderSeparator) {
        return $desc.renderSeparator();
    }

    return Span({class: 'breadcrumb-separator'}, $desc.separator || '/');
};

const buildItem = (item, $desc, instance) => {
    if($desc.renderItem) {
        return $desc.renderItem(item, instance);
    }

    const content = [];

    if(item.href) {
        const link = Link({ class: 'breadcrumb-link', href: item.href }, item.label);
        link.nd.onClick((e) => {
            instance.emit('clickItem', item);
        });
        content.push(link);
    } else {
        content.push(Span({class: 'breadcrumb-label'}, item.label));
    }

    content.push(buildSeparator($desc));

    // [a11y] aria-current on last item (no href = current page)
    const isCurrent = !item.href;
    return ListItem({
        class: 'breadcrumb-item',
        ...( isCurrent ? { 'aria-current': 'page' } : {} ),
    }, content);
};