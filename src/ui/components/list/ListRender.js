import { Ul, ForEachArray } from '../../../core/elements';

import './list.css';

export default function ListRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add({ list: true, 'with-divider': $desc.divider });

    if ($desc.inset) {
        props.style.add(
            '--list-inset-padding',
            $desc.inset.transform((v) => v > 0 ? `${v}px` : null),
        );
    }

    return Ul(instance.resolveProps(), ForEachArray($desc.items, $desc.itemBuilder));
}
