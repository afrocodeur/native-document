import {Div, ForEachArray, Input, Label, Span} from '../../../../../elements';
import {buildErrors} from '../helpers';
import './range-field.css';

export default function RangeFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-range-field');
    props.class.add({
        'is-disabled': $desc.disabled,
        'has-error':   $desc.hasErrors,
        'is-vertical': $desc.vertical,
    });

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    content.push(buildRangeWrapper($desc, instance));

    if($desc.help) {
        content.push(Span({class: 'field-hint', ...($desc.elementsProps.hint || {})}, $desc.help));
    }

    content.push(buildErrors($desc));

    return Div(instance.resolveProps(), content);
}

const buildLabel = ($desc) => {
    return Label({
        class: 'field-label',
        for:   $desc.id || $desc.name,
        ...($desc.elementsProps.label || {}),
    }, $desc.label);
};

const buildRangeWrapper = ($desc, instance) => {
    const input = buildInput($desc, instance);

    const content = [input];

    if($desc.showValue) {
        content.push(buildValueDisplay($desc));
    }

    if($desc.showMarks && $desc.marks?.length) {
        content.push(buildMarks($desc));
    }

    return Div({class: 'range-field-wrapper'}, content);
};

const buildInput = ($desc, instance) => {
    const input = Input({
        class: 'range-field-input',
        type: 'range',
        name: $desc.name,
        id: $desc.id || $desc.name,
        min: $desc.min ?? 0,
        max: $desc.max ?? 100,
        step: $desc.step ?? 1,
        disabled: $desc.disabled,
        value: $desc.value,
        ...($desc.elementsProps.input || {}),
    });

    instance.$input = input;

    input.nd.onInput((e) => {
        const val = Number(e.target.value);
        if($desc.value?.__$isObservable) {
            $desc.value.set(val);
        }
        instance.emit('change', val);
        instance.validate();
    });

    input.nd.onChange((e) => {
        instance.emit('complete', Number(e.target.value));
    });

    return input;
};

const buildValueDisplay = ($desc) => {
    const formatted = $desc.value?.__$isObservable
        ? $desc.value.transform(v => {
            if($desc.decimals) return Number(v).toFixed($desc.decimals);
            if($desc.suffix)   return v + ' ' + $desc.suffix;
            if($desc.prefix)   return $desc.prefix + ' ' + v;
            return String(Math.round(v));
        })
        : String($desc.value ?? 0);

    return Span({class: 'range-field-value'}, formatted);
};

const buildMarks = ($desc) => {
    const min   = $desc.min ?? 0;
    const max   = $desc.max ?? 100;
    const marks = $desc.marks || [];

    return Div({class: 'range-field-marks'},
        ForEachArray(marks, mark => {
            const pct = ((mark.value - min) / (max - min)) * 100;
            return Div({
                class: 'range-field-mark',
                style: $desc.vertical ? {bottom: pct + '%'} : {left: pct + '%'},
            }, [
                Div({class: 'range-field-mark-dot'}),
                mark.label
                    ? Span({class: 'range-field-mark-label'}, mark.label)
                    : null,
            ].filter(Boolean));
        })
    );
};