import DropdownItem from './types/DropdownItem';

const resolveField = (raw, mapperField, fallbackKeys) => {
    if(!mapperField) {
        for(const key of fallbackKeys) {
            if(raw[key] != null) return raw[key];
        }
        return null;
    }
    if(typeof mapperField === 'function') {
        return mapperField(raw);
    }
    return raw[mapperField] ?? null;
};

export const normalizeDropdownItem = (raw, mapper = null, props = {}) => {
    if(raw instanceof DropdownItem) {
        return raw;
    }

    let config;

    if(typeof mapper === 'function') {
        config = mapper(raw);
    }
    else if(mapper && typeof mapper === 'object') {
        config = {
            content: resolveField(raw, mapper.content || mapper.label, ['name', 'label', 'content']),
            value: resolveField(raw, mapper.value, ['value', 'id']),
            icon: resolveField(raw, mapper.icon, ['icon']),
            shortcut: resolveField(raw, mapper.shortcut, ['shortcut']),
            disabled: resolveField(raw, mapper.disabled, ['disabled']) || false,
            action: resolveField(raw, mapper.action, ['action']),
            selected: resolveField(raw, mapper.action, ['selected']),
            data: raw,
        };
    }
    else {
        config = {
            content: raw.content || raw.label || raw.name,
            value: raw.value || raw.id,
            icon: raw.icon || null,
            shortcut: raw.shortcut || null,
            selected: raw.selected || null,
            disabled: raw.disabled || false,
            action: raw.action || null,
            data: raw,
        };
    }


    return DropdownItem(props).setDescription(config);
};