import {Div, Input, Label, Span, Switch} from '../../../../../elements';
import {buildErrors, buildInputWithSlots} from '../helpers';

import './date-field.css';

export default function TimeFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-time-field');
    props.class.add({'is-disabled': $desc.disabled, 'has-error': $desc.hasErrors});

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    if($desc.range?.__$Observable) {
        content.push(
            Switch($desc.range,
                () => buildRangeWrapper($desc, instance),
                () => buildSingleWrapper($desc, instance)
            )
        );
    } else {
        content.push(buildSingleWrapper($desc, instance));
    }

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

const buildSingleWrapper = ($desc, instance) => {
    let callback = null;
    if($desc.clearable) {
        callback = () => {
            if($desc.value?.__$isObservable) {
                $desc.value.set(null);
            }
            instance.emit('clear');
        };
    }

    const input = buildInput($desc, instance, $desc.value, $desc.name);
    return buildInputWithSlots(input, $desc, instance, {onClear: callback});
};

const buildRangeWrapper = ($desc, instance) => {
    const startInput = buildInput($desc, instance, $desc.valueStart, $desc.name + '_start');
    const endInput   = buildInput($desc, instance, $desc.valueEnd,   $desc.name + '_end');

    const getSeconds = (time) => {
        if(!time) return 0;
        const [h, m, s] = time.split(':').map(Number);
        return h * 3600 + m * 60 + (s || 0);
    };


    let syncEnd, onChange;
    if($desc.valueStart?.__$Observable && $desc.valueEnd?.__$Observable) {
        syncEnd = () => {
            const start = $desc.valueStart.val();
            const end = $desc.valueEnd.val();
            if(start && end && getSeconds(end) < getSeconds(start)) {
                $desc.valueEnd.set(start)
            }
            instance.emit('change', {start, end});
        };

        onChange = () => {
            const start = $desc.valueStart.val();
            const end   = $desc.valueEnd.val();
            instance.emit('change', {start, end});
        };
    } else {
        syncEnd = () => {
            const start= startInput.value;
            const end = endInput.value;
            if(start && end && getSeconds(end) < getSeconds(start)) {
                endInput.value = start;
            }
            instance.emit('change', {start, end});
        };

        onChange = () => {
            const start = startInput.value;
            const end   = endInput.value;
            instance.emit('change', {start, end});
        };
    }

    startInput.nd.onChange(syncEnd);
    endInput.nd.onChange(onChange);

    return Div({class: 'date-field-range'}, [
        Div({class: 'date-field-range-start'}, [
            Span({class: 'date-field-range-label'}, 'From'),
            buildInputWithSlots(startInput, $desc, instance, { source: 'valueStart', onClear: null }),
        ]),
        Span({class: 'date-field-range-separator'}, $desc.rangeSeparator),
        Div({class: 'date-field-range-end'}, [
            Span({class: 'date-field-range-label'}, 'To'),
            buildInputWithSlots(endInput, $desc, instance, { source: 'valueEnd', onClear: null }),
        ]),
    ]);
};

const buildInput = ($desc, instance, $value, name) => {
    const input = Input({
        class:    'field-input',
        type:     'time',
        name:     name,
        id:       $desc.id || $desc.name,
        disabled: $desc.disabled,
        readonly: $desc.readonly,
        step:     $desc.step || null,
        value:    $value,
        ...($desc.elementsProps.input || {}),
    });

    instance.$input = input;

    input.nd.onChange(() => {
        instance.validate();
    });

    return input;
};