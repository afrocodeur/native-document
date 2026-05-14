import {Input} from '../../../../../elements';

export default function HiddenFieldRender($desc, instance) {
    const input = Input({
        type:  'hidden',
        name:  $desc.name,
        id:    $desc.id || $desc.name,
        value: $desc.value,
    });

    instance.$input = input;
    return input;
}