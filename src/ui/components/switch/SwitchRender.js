import {Div, Span, Label, Input, Match} from '../../../../elements';
import './switch.css';

export default function SwitchRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('switch');
    props.class.add({
        'is-disabled':  $desc.disabled,
        'is-readonly':  $desc.readonly,
        'is-loading':   $desc.loading,
        '_':   $desc.variant.transform((value) => `is-${value}`),
        'is-outline':   $desc.outline,
        'is-checked':   $desc.value,
        '___': $desc.value.transform(value => `is-state-${value ? 'on' : 'off'}`)
    });

    if($desc.labelPosition) {
        props.class.add('is-label-' + $desc.labelPosition);
    }

    const input = Input({
        class:    'switch-input',
        type:     'checkbox',
        checked:  $desc.value,
        disabled: $desc.disabled,
    });

    $desc.value.subscribe(() => {
        const val = $desc.value.val();
        instance.emit('change', val);
        instance.emit(val ? 'on' : 'off', val);
    });

    const thumb      = buildThumb($desc);
    const innerLabel = buildInnerLabel($desc);
    const track      = Div({class: 'switch-track'}, [innerLabel, thumb].filter(Boolean));

    const content = [];

    const label = $desc.label
        ? Span({class: 'switch-label'}, $desc.label)
        : null;

    if(label && ($desc.labelPosition === 'left' || $desc.labelPosition === 'top')) {
        content.push(label);
    }

    content.push(input, track);

    if(label && (!$desc.labelPosition || $desc.labelPosition === 'right' || $desc.labelPosition === 'bottom')) {
        content.push(label);
    }

    return Label(instance.resolveProps(), content);
}

const buildThumb = ($desc) => {
    if($desc.onIcon || $desc.offIcon) {
        return Div({class: 'switch-thumb'},
            Span({class: 'switch-icon'},
                Match($desc.value, {
                    true:  $desc.onIcon,
                    false: $desc.offIcon,
                })
            )
        );
    }

    return Div({class: 'switch-thumb'});
};

const buildInnerLabel = ($desc) => {
    if(!$desc.innerOnLabel && !$desc.innerOffLabel) return null;

    return Span({class: 'switch-inner-label'},
        Match($desc.value, {
            true:  $desc.innerOnLabel  || '',
            false: $desc.innerOffLabel || '',
        })
    );
};