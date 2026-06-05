import { Li } from '../../../../core/elements';

import './list-divider.css';

export default function ListDividerRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('list-divider');

    return Li(instance.resolveProps());
}
