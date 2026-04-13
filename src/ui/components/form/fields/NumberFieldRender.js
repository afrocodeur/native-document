import {Span} from '../../../../../elements';
import FieldRender from './FieldRender';

export default function NumberFieldRender($desc, instance) {
    if($desc.prefix) {
        instance.leading(Span({class: 'field-number-prefix'}, $desc.prefix));
    }

    if($desc.suffix) {
        instance.trailing(Span({class: 'field-number-suffix'}, $desc.suffix));
    }

    if($desc.step) {
        $desc.elementsProps.input = {
            ...$desc.elementsProps.input,
            step: $desc.step,
        };
    }

    if($desc.decimals != null) {
        $desc.elementsProps.input = {
            ...$desc.elementsProps.input,
            step: $desc.step || Math.pow(10, -$desc.decimals),
        };
    }

    const el = FieldRender($desc, instance);

    if($desc.decimals != null) {
        setupDecimalsHandling(instance, $desc);
    }

    return el;
}

const setupDecimalsHandling = (instance, $desc) => {
    const input = instance.$input;
    if(!input) {
        return;
    }

    input.nd.onBlur(() => {
        const raw = parseFloat(input.value);
        if(!isNaN(raw)) {
            const formatted = raw.toFixed($desc.decimals);
            input.value = formatted;
            if($desc.value?.__$isObservable) {
                $desc.value.set(parseFloat(formatted));
            }
        }
    });
};