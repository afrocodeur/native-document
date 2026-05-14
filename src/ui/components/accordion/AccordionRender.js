import {Div, ForEachArray} from '../../../core/elements';

import './accordion.css';

export default function AccordionRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('accordion');

    if($desc.variant) {
        props.class.add('is-' + $desc.variant);
    }

    const addItem = (item) => {
        if($desc.renderIndicator && !item.$description.renderIndicator) {
            item.renderIndicator($desc.renderIndicator);
        }
        item.onCollapse(() => instance.emit('collapse', item));
        item.onExpand(() => {
            instance.emit('expand', item);
            if($desc.multiple) {
                return;
            }
            $desc.items.forEach((other) => {
                if(other !== item && other.isExpanded()) {
                    other.expanded(false);
                }
            });
        });

        return item;
    }

    return Div(instance.resolveProps(), ForEachArray($desc.items, addItem));
}