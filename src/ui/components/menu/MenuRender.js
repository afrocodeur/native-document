import {Nav, ForEachArray} from '../../../core/elements';

import './menu.css';

export default function MenuRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('menu');
    props.class.add('is-' + ($desc.orientation || 'horizontal'));

    const nav = Nav(instance.resolveProps(), ForEachArray($desc.items));

    if($desc.compactThreshold) {
        const observer = new ResizeObserver(([entry]) => {
            $desc.compact.set(entry.contentRect.width < $desc.compactThreshold);
        });
        observer.observe(nav);
    }

    return nav;

}