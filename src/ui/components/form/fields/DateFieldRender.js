import {Div, Input, Label, Span, ShowIf, Switch} from '../../../../../elements';
import {buildErrors, buildInputWithSlots} from '../helpers';
import './date-field.css';

export default function DateFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-date-field');
    props.class.add({ 'is-disabled': $desc.disabled, 'has-error': $desc.hasErrors });

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    const inputType  = ($desc.withTime?.__$isObservable
        ? $desc.withTime.transform((hasTime) => (hasTime ? 'datetime-local' : 'date'))
        : ($desc.withTime ? 'datetime-local' : 'date'));

    if($desc.range?.__$Observable) {
        content.push(
            Switch($desc.range,
                () => buildRangeWrapper($desc, instance, inputType),
                () => buildSingleWrapper($desc, instance, inputType)
            )
        );
    }
    else {
        content.push(buildSingleWrapper($desc, instance, inputType));
    }

    if($desc.help) {
        content.push(
            Span({ class: 'field-hint', ...($desc.elementsProps.hint || {}) }, $desc.help)
        );
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

const buildSingleWrapper = ($desc, instance, inputType) => {
    const input = buildInput($desc, instance, inputType, $desc.value, $desc.name);

    const controls = [];

    let callback = null;
    if($desc.clearable) {
        if($desc.value?.__$isObservable) {
            callback = () => {
                instance.emit('clear');
                $desc.value.set(null);
            }
        } else {
            callback = (e) => {
                e.target.value = '';
                instance.emit('clear');
            };
        }
    }

    return Div({class: 'date-field-single'}, [
        buildInputWithSlots(input, $desc, instance, { onClear: callback } ),
        controls.length ? Div({class: 'date-field-controls'}, controls) : null,
    ]);
};

const buildRangeWrapper = ($desc, instance, inputType) => {
    const startInput = buildInput($desc, instance, inputType, $desc.valueStart, $desc.name + '_start');
    const endInput   = buildInput($desc, instance, inputType, $desc.valueEnd,   $desc.name + '_end');

    let callback;
    if($desc.valueStart?.__$Observable && $desc.valueEnd?.__$Observable) {
        callback = () => {
            instance.emit('change', { start: $desc.valueStart.val(), end: $desc.valueEnd?.val() });

            if((new Date($desc.valueEnd.val())) < (new Date($desc.valueStart.val()))) {
                $desc.valueEnd.set($desc.valueStart.val());
            }
        }
    } else {
        callback = () => {
            if((new Date(endInput.value)) < (new Date(startInput.value))) {
                endInput.value = startInput.value;
            }
        };
    }

    startInput.nd.onChange(callback);
    endInput.nd.onChange(callback);

    if($desc.valueEnd?.__$Observable) {
        endInput.nd.onChange((e) => {
            instance.emit('change', { start: $desc.valueStart?.val(), end: $desc.valueEnd.val() });
        });
    }
    else {
        endInput.nd.onChange((e) => {
            instance.emit('change', { start: startInput.value, end: endInput.value });
        });
    }

    return Div({class: 'date-field-range'}, [
        Div({class: 'date-field-range-start'}, [
            Span({class: 'date-field-range-label'}, 'From'),
            buildInputWithSlots(startInput, $desc, instance, { source: 'valueStart', onClear: null } )
        ]),
        Span({class: 'date-field-range-separator'}, $desc.rangeSeparator),
        Div({class: 'date-field-range-end'}, [
            Span({class: 'date-field-range-label'}, 'To'),
            buildInputWithSlots(endInput, $desc, instance, { source: 'valueEnd', onClear: null } )
        ]),
    ]);
};

const buildInput = ($desc, instance, inputType, $value, name) => {

    const input = Input({
        class: 'field-input',
        type: inputType,
        name: name,
        id: $desc.id || $desc.name,
        disabled: $desc.disabled,
        readonly: $desc.readonly,
        min: $desc.minDate || null,
        max: $desc.maxDate || null,
        step: $desc.timeStep || null,
        value: $value,
        ...($desc.elementsProps.input || {}),
    });

    instance.$input = input;

    input.nd.onChange($value?.__$Observable ? (e) => {
        instance.emit('change', $value.val());
        instance.validate();
    }: (e) => {
        instance.emit('change', e.target.value);
        instance.validate();
    });

    return input;
};