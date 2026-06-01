import {Div, Label, Input, Span, ForEachArray} from '../../../../../elements';
import { $ } from '../../../../core/data/Observable';
import {buildErrors} from '../helpers';

export default function RadioFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-radio-field');
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
    const $options  = Array.isArray($desc.options) ? $.array($desc.options) : $desc.options;
    const $selected = $desc.checked;

    const isSelected = (optValue) => {
        if(!$selected?.__$isObservable) {
            return false;
        }
        return $selected.transform(v => v === optValue);
    };

    const onSelect = (optValue) => {
        if($selected?.__$isObservable) {
            $selected.set(optValue);
        }
        instance.validate();
    };

    const buildOption = (option) => {
        const optValue = option.value ?? option;
        const optLabel = option.label ?? option;
        const optId    = ($desc.id || $desc.name) + '-' + optValue;

        const input = Input({
            class:    'field-radio',
            type:     'radio',
            id:       optId,
            name:     $desc.name,
            value:    optValue,
            checked:  isSelected(optValue),
            disabled: $desc.disabled,
        });

        input.nd.onChange(() => onSelect(optValue));

        return Div({class: 'field-radio-wrapper'}, [
            input,
            Label({class: 'field-radio-label', for: optId}, optLabel),
        ]);
    };

    return Div({
        class: 'field-radio-group is-' + ($desc.layout || 'vertical'),
        ...($desc.elementsProps.wrapper || {}),
    }, ForEachArray($options, buildOption));
};