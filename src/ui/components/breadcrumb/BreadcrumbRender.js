import {Nav, OrderedList, ListItem, Span, Link, ForEachArray} from '../../../core/elements';
import './breadcrumb.css';

export default function BreadcrumbRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('breadcrumb');

    return Nav(instance.resolveProps(),
        OrderedList({ class: 'breadcrumb-list' },
            ForEachArray($desc.items, (item) => buildItem(item, $desc, instance))
        )
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

    return ListItem({class: 'breadcrumb-item'}, content);
};