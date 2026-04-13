import {Div, Input, Span, ShowIf} from '../../../../../elements';
import {Dropdown} from '../../../../../components';
import FieldRender from './FieldRender';
import { $ } from '../../../../../index';
import {debounce} from "../../../../core/utils/helpers";

export default function AutocompleteFieldRender($desc, instance) {
    const $suggestions = $.array([]);
    const $loading     = $(false);

    instance.trailing(ShowIf($loading, Span({class: 'field-loading-spinner'}) ));

    const input = buildInput($desc, instance, $suggestions, $loading);
    const field = FieldRender($desc, instance, input);
    const dropdown = buildDropdown($desc, instance, field, input, $suggestions);

    return field.nd.ghostDom(dropdown);
}

const buildInput = ($desc, instance, $suggestions, $loading) => {
    const inputProps = {
        class: 'field-input',
        type: 'text',
        name: $desc.name,
        id: $desc.id || $desc.name,
        placeholder: $desc.placeholder,
        disabled: $desc.disabled,
        readonly: $desc.readonly,
        value: $desc.value,
        autocomplete: 'off',
        ...($desc.elementsProps.input || {}),
    };

    const input = Input(inputProps);

    instance.$input = input;

    const handleSuggestions = debounce(async (query) => {
        if(query.length < ($desc.minChars || 2)) {
            $suggestions.set([]);
            return;
        }

        $loading.set(true);
        const results = await fetchSuggestions($desc, query);
        $suggestions.set(results.slice(0, $desc.maxResults || 10));
        $loading.set(false);
    }, $desc.debounce || 300);


    if($desc.value?.__$Observable) {
        $desc.value.subscribe((val) => handleSuggestions(val));
    } else {
        input.nd.onInput((e) => {
            const query = e.target.value;
            handleSuggestions(query)
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

    return input;
};

const fetchSuggestions = async ($desc, query) => {
    let source = $desc.source;
    if(!source) {
        return [];
    }

    if(typeof source === 'function') {
        const results = await source(query);
        return Array.isArray(results) ? results : [];
    }

    if(source.__$Observable) {
        source = source.val();
    }

    if(Array.isArray(source)) {
        const labelKey = $desc.labelKey || 'label';
        const q = query.toLowerCase();
        return source.filter(item => {
            const label = typeof item === 'string' ? item : item[labelKey] ?? '';
            return label.toLowerCase().includes(q);
        });
    }

    return [];
};

const buildDropdown = ($desc, instance, field, trigger, $suggestions) => {
    return Dropdown()
        .trigger(trigger, false)
        .matchTargetWidth(field)
        .atBottomLeading()
        .onFocused()
        .showIf($suggestions.is((value) => value.length > 0))
        .closeOnSelect(false)
        .renderItem($desc.renderItem)
        .bind($suggestions, (item) => {
            const valueKey = $desc.valueKey || 'value';
            const labelKey = $desc.labelKey || 'label';

            const optValue = typeof item === 'string' ? item : (item[valueKey] ?? item);
            const optLabel = typeof item === 'string' ? item : (item[labelKey] ?? item);

            return {
                value: optValue,
                label: optLabel,
                data: item,
                action: () => {
                    if($desc.value?.__$isObservable) {
                        $desc.value.set(optLabel);
                    }
                    instance.emit('select', item);
                    instance.validate();
                },
            };
        });
};