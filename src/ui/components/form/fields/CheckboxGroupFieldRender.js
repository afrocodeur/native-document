import {Div, Label, Input, Span, ShowIf, ForEachArray} from '../../../../../elements';
import {buildErrors} from "../helpers";

export default function CheckboxGroupFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-checkbox-group-field');
    props.class.add({'is-disabled': $desc.disabled});

    const content = [];

    if($desc.label) {
        content.push(Span({
            class: 'field-label',
            ...($desc.elementsProps.label || {}),
        }, $desc.label));
    }

    content.push(buildOptions($desc, instance));

    if($desc.help) {
        content.push(Span({class: 'field-hint', ...($desc.elementsProps.hint || {})}, $desc.help));
    }

    content.push(buildErrors($desc));

    return Div(instance.resolveProps(), content);
}

const buildOptions = ($desc, instance) => {
    const options   = $desc.options || [];
    const $selected = $desc.value;

    const isSelected = (optValue) => {
        if(!$selected?.__$Observable) {
            return false;
        }
        return $selected.check(v => Array.isArray(v) && v.includes(optValue));
    };

    let onToggle = () => {};

    if($selected?.__$Observable) {
        onToggle = (optValue) => {
            const current = $selected.val() || [];

            if(current.includes(optValue)) {
                $selected.set(current.filter(v => v !== optValue));
            }
            else {
                $selected.set([...current, optValue]);
            }

            if($desc.validateOn === 'change') {
                instance.validate();
            }
        };
    }

    const buildItem = (option) => {
        const optValue  = option.value ?? option;
        const optLabel  = option.label ?? option;
        const optId     = ($desc.id || $desc.name) + '-' + optValue;
        const $checked  = isSelected(optValue);

        const input = Input({
            class:   'field-checkbox',
            type:    'checkbox',
            id:      optId,
            name:    $desc.name,
            value:   optValue,
            checked: $checked,
            disabled: $desc.disabled,
        });

        input.nd.onChange(() => onToggle(optValue));

        return Div({class: 'field-checkbox-wrapper'}, [
            input,
            Label({
                class: 'field-checkbox-label',
                for:   optId,
            }, optLabel),
        ]);
    };

    return Div({
        class: 'field-checkbox-group is-' + ($desc.layout || 'vertical'),
        ...($desc.elementsProps.wrapper || {}),
    }, ForEachArray($desc.options, buildItem));
};