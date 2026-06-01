import {Div, Label, Input, Span, ShowIf, ForEachArray} from '../../../../../elements';
import {buildInputWithSlots} from '../helpers';

import './field.css';

export default function FieldRender($desc, instance, input = null) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-' + $desc.type + '-' + $desc.suffix);
    props.class.add({'has-error': $desc.hasErrors, 'is-disabled': $desc.disabled});

    const slots = $desc.slots || {};

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    const resolvedInput = input || buildInput($desc, instance);
    content.push(buildInputWithSlots(resolvedInput, $desc, instance, {
        class: ($desc.elementsProps.wrapper || {}),
    }));

    if(slots.bottom) {
        content.push(slots.bottom);
    }

    if($desc.help) {
        content.push(Span({class: 'field-hint', ...($desc.elementsProps.hint || {})}, $desc.help));
    }

    content.push(buildErrors($desc));

    return Div(instance.resolveProps(), content).nd.with({ input: resolvedInput });
}

const buildLabel = ($desc) => {
    const labelContent = [$desc.label];

    if($desc.rules?.some(rule => rule.fn?.name === 'required')) {
        labelContent.push(Span({class: 'field-required'}, '*'));
    }

    return Label({
        class: 'field-label',
        for:   $desc.id || $desc.key || $desc.name,
        ...($desc.elementsProps.label || {}),
    }, labelContent);
};

const buildInput = ($desc, instance) => {
    const inputProps = {
        class:       'field-input',
        type:        $desc.type,
        name:        $desc.name,
        id:          $desc.id || $desc.name,
        placeholder: $desc.placeholder,
        disabled:    $desc.disabled,
        readonly:    $desc.readonly,
        value:       $desc.value,
        ...($desc.elementsProps.input || {}),
    };

    const input = Input(inputProps);

    instance.$input = input;

    setupEvents(input, $desc, instance);

    return input;
};

const setupEvents = (input, $desc, instance) => {
    if($desc.clearErrorOn === 'input') {
        input.nd.onInput((e) => {
            $desc.errors?.set(null);
        });
    }

    input.nd.onFocus(() => {
        $desc.focus.set(true);

        if($desc.clearErrorOn === 'focus') {
            $desc.showErrors.set(false);
        }
    });

    input.nd.onBlur(() => {
        $desc.focus.set(false);
        $desc.showErrors.set(true);

        if($desc.validateOn === 'blur') {
            instance.validate();
        }
    });

    $desc.focus.subscribe((focused) => {
        if(focused) {
            input.focus();
            return;
        }
        input.blur();
    });
};

const buildErrors = ($desc) => {
    return ShowIf($desc.showErrors, () => {
        return ShowIf($desc.hasErrors,
            () => Div({class: 'field-errors', ...($desc.elementsProps.error || {})},
                ForEachArray($desc.errors, (error) =>
                    Span({class: 'field-error'}, error),
                ),
            ),
        );
    });
};