import {Div, Label, Input, Span, ShowIf, ForEachArray} from '../../../../../elements';
import {buildErrors} from "../helpers";

export default function CheckboxFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-checkbox-field');
    props.class.add({'is-disabled': $desc.disabled});

    const input = buildCheckbox($desc, instance);
    const label = buildLabel(input, $desc);

    const content = [
        Div({class: 'field-checkbox-wrapper'}, [input, label]),
    ];

    if($desc.help) {
        content.push(Span({class: 'field-hint', ...($desc.elementsProps.hint || {})}, $desc.help));
    }

    content.push(buildErrors($desc));

    return Div(instance.resolveProps(), content).nd.with({input});
}

const buildCheckbox = ($desc, instance) => {
    const input = Input({
        class:    'field-checkbox',
        type:     'checkbox',
        name:     $desc.name,
        id:       $desc.id || $desc.name,
        disabled: $desc.disabled,
        checked:  $desc.checked,
        ...($desc.elementsProps.input || {}),
    });

    instance.$input = input;

    input.nd.onChange((e) => {
        if($desc.validateOn === 'change') {
            instance.validate();
        }
    });

    return input;
};

const buildLabel = (input, $desc) => {
    if(!$desc.label) {
        return null;
    }

    return Label({
        class: 'field-checkbox-label',
        for:   $desc.id || $desc.name,
        ...($desc.elementsProps.label || {}),
    }, $desc.label);
};