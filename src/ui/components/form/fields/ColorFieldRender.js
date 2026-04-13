import FieldRender from './FieldRender';
import {Input, Span} from '../../../../../elements';

export default function ColorFieldRender($desc, instance) {
    const $colorPreview = Span({
        class: 'field-color-preview',
        style: {
            background: $desc.value?.__$isObservable
                ? $desc.value
                : $desc.value || 'transparent',
        },
    });

    instance.leading($colorPreview);

    const input = Input({
        class:    'field-input field-color-input',
        type:     'color',
        name:     $desc.name,
        id:       $desc.id || $desc.name,
        disabled: $desc.disabled,
        value:    $desc.value,
        ...($desc.elementsProps.input || {}),
    });

    instance.$input = input;
    $colorPreview.nd.onClick(() => input.click());

    return FieldRender($desc, instance, input);
}