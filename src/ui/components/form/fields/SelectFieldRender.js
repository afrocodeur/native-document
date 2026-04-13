import {Div, Label, Select, Option, Span, ForEachArray, ShowIf} from '../../../../../elements';
import { $ } from '../../../../../index';
import {Dropdown} from '../../../../../components';
import {buildErrors} from '../helpers';
import DebugManager from "../../../../core/utils/debug-manager";

export default function SelectFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-select-field');
    props.class.add({'is-disabled': $desc.disabled, 'has-error': $desc.hasErrors});

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    const {trigger, nativeSelect} = buildSelectWrapper($desc, instance);
    content.push(trigger);

    if($desc.help) {
        content.push(Span({class: 'field-hint', ...($desc.elementsProps.hint || {})}, $desc.help));
    }

    content.push(buildErrors($desc));

    instance.$input = nativeSelect;

    return Div(instance.resolveProps(), content).nd.with({input: nativeSelect});
}

const buildLabel = ($desc) => {
    return Label({
        class: 'field-label',
        for:   $desc.id || $desc.name,
        ...($desc.elementsProps.label || {}),
    }, $desc.label);
};

const buildSelectWrapper = ($desc, instance) => {
    const nativeSelect = buildNativeSelect($desc);
    const isTags       = $desc.multiple && $desc.multipleDisplay === 'tags';

    const valueDisplay = isTags
        ? buildTagsDisplay($desc)
        : Span({class: 'select-field-value'}, buildSelectedLabel($desc));

    const triggerOptions = [];

    if($desc.clearable) {
        const clearBtn = Span({class: 'select-field-clear'}, '×');
        clearBtn.nd.onClick((e) => {
            e.stopPropagation();
            $desc.value?.__$isObservable && $desc.value.set($desc.multiple ? [] : null);
            syncNativeSelect(nativeSelect, $desc);
            instance.validate();
        });
        triggerOptions.push(ShowIf($desc.value.check(val => !!val.length), clearBtn));
    }
    triggerOptions.push(Span({class: 'select-field-chevron'}, '▾'));

    const trigger = Div({
        class: {'field-input select-field-trigger': true, 'has-tags': isTags},
        ...($desc.elementsProps.input || {}),
    }, [
        valueDisplay,
        Div({ class: 'select-field-controls' }, triggerOptions),
    ]);

    const dropdown  = buildDropdown($desc, instance, trigger, nativeSelect);
    const triggerNd = trigger.nd.ghostDom(dropdown).ghostDom(nativeSelect);

    return {trigger: triggerNd, nativeSelect};
};

const buildTagsDisplay = ($desc) => {
    const options = Array.isArray($desc.options) ? $desc.options : [];
    if(!$desc.value?.__$isObservableArray) {
        DebugManager.error('SelectFieldRender', 'buildTagsDisplay', 'Value is not an observable array', $desc.value);
        return;
    }

    return Div({class: 'select-field-tags'},
        ForEachArray($desc.value, (val) => {
            const opt   = options.find(o => (o.value ?? o) === val);
            const label = opt?.label ?? opt ?? val;

            const tag = Span({class: 'select-field-tag'}, [
                Span({class: 'select-field-tag-label'}, label),
                Span({class: 'select-field-tag-remove'}, '×'),
            ]);

            tag.querySelector('.select-field-tag-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                if($desc.value?.__$isObservable) {
                    $desc.value.set($desc.value.val().filter(v => v !== val));
                }
            });

            return tag;
        })
    );
};

const buildSelectedLabel = ($desc) => {
    if(!$desc.value?.__$isObservable) {
        return $desc.placeholder || 'Select...';
    }

    if($desc.selectedLabelRender) {
        return $desc.selectedLabelRender($desc);
    }

    return $desc.value.transform((val) => {
        if(!val || (Array.isArray(val) && val.length === 0)) {
            return $desc.placeholder || 'Select...';
        }

        const options = Array.isArray($desc.options) ? $desc.options : [];

        if(!$desc.multiple || !Array.isArray(val)) {
            const opt = options.find(o => (o.value ?? o) === val);
            return opt?.label ?? opt ?? val;
        }

        const mode = $desc.multipleDisplay || 'truncate';

        if(mode === 'count') {
            return $desc.countRender ? $desc.countRender(val) : (val.length + ' selected');
        }

        const labels = val.map(v => {
            const opt = options.find(o => (o.value ?? o) === v);
            return opt?.label ?? opt ?? v;
        });

        if(mode === 'truncate') {
            const max  = $desc.truncateMax || 2;
            const rest = labels.length - max;
            if(rest > 0) {
                const visibleLabels = labels.slice(0, max);
                return $desc.truncateRender
                    ? $desc.truncateRender(visibleLabels, rest)
                    : (visibleLabels + ' +' + rest + ' more');
            }
            return labels.join(', ');
        }

        return labels.join(', ');
    });
};

const buildNativeSelect = ($desc) => {
    const $options = Array.isArray($desc.options)
        ? $.array($desc.options)
        : $desc.options;

    return Select({
        name:     $desc.name,
        id:       $desc.id || $desc.name,
        multiple: $desc.multiple,
        style:    {display: 'none'},
    }, ForEachArray($options, (option) => {
        const optValue = option.value ?? option;
        const optLabel = option.label ?? option;
        const optProps = option.props ?? {};
        return Option({value: optValue, ...optProps}, optLabel);
    }));
};

const syncNativeSelect = (nativeSelect, $desc) => {
    const val = $desc.value?.__$isObservable ? $desc.value.val() : null;
    if(!val) {
        return;
    }

    Array.from(nativeSelect.options).forEach(opt => {
        opt.selected = $desc.multiple
            ? Array.isArray(val) && val.includes(opt.value)
            : opt.value === String(val);
    });
};

const buildDropdown = ($desc, instance, trigger, nativeSelect) => {
    const $options = Array.isArray($desc.options)
        ? $.array($desc.options)
        : $desc.options;

    let $sourceItem = $options;
    if($desc.removeSelected && $options?.__$Observable) {
        $sourceItem = $.array();
        const updateSourceItem = () => {
            const options = $options.val() || [];
            const values = $desc.value?.val() || [];
            $sourceItem.set(options.filter(v => !values.includes(v?.value || v)));
        };
        $.computed(updateSourceItem, [$options, $desc.value]);
        updateSourceItem();
    }

    const dropdown = Dropdown()
        .trigger(trigger)
        .atBottomLeading()
        .renderItem($desc.renderItem)
        .matchTriggerWidth()
        .closeOnSelect(!$desc.multiple);

    if($desc.searchable) {
        dropdown.searchable(true, $desc.searchPlaceholder);
    }

    return dropdown.bind($sourceItem, (option) => {
        const optValue = option.value ?? option;
        const optLabel = option.label ?? option;

        const $isSelected = $desc.value?.__$isObservable
            ? $desc.value.is(v => $desc.multiple
                ? Array.isArray(v) && v.includes(optValue)
                : v === optValue)
            : false;

        return {
            label:    optLabel,
            data:     option,
            value:    optValue,
            selected: $isSelected,
            action:   () => {
                if($desc.value?.__$isObservable) {
                    if($desc.multiple) {
                        const current = $desc.value.val() || [];
                        const next    = current.includes(optValue)
                            ? current.filter(v => v !== optValue)
                            : [...current, optValue];
                        $desc.value.set(next);
                    }
                    else {
                        $desc.value.set(optValue);
                    }
                }
                instance.emit('change', optValue ?? option ?? $desc.value);
                syncNativeSelect(nativeSelect, $desc);
                instance.validate();
            },
        };
    });
};