import {Input, Label, Select} from "@elements";
import { $ } from "@core";




export default function DefaultRender(field) {
    const description = field?.toJSON();
    const suffix = description.suffix || 'field';
    const fieldId = description.id || description.name;

    const inputProps = {
        id: fieldId,
        name: description.name,
        type: description.type,
        value: description.value,
        placeholder: description.placeholder,
        disabled: description.disabled,
        readonly: description.readonly,
        checked: description.checked
    };

    if(description.showErrors) {
        description.errors = description.errors || $(null);
        field.errors(description.errors);
    }

    const hasErrors = description.showErrors ? $.computed(() => {
        const errs = description.errors?.val();
        return errs && errs.length > 0;
    }, [description.errors]) : null;
    const hasFocus = $(false);

    const wrapperClasses = {
        [suffix+'-wrapper']: true,
        [suffix+'-error']: hasErrors,
        [suffix+'-focused']: hasFocus,
        [suffix+'-disabled']: description.disabled,
        [`${suffix}-${description.type}`]: true
    };

    const children = [];

    switch (description.type) {
        case 'radio':
        case 'checkbox':
            field.$input = Input({ ...inputProps });
            children.push(
                field.$input,
                Label({for: fieldId}, description.label),
            );
            break;
        case 'select':
            field.$input = Select({ ...inputProps });
            children.push(
                Label({for: fieldId}, description.label),
                field.$input,
            );
            break;
        default:
            field.$input = Input({ ...inputProps });
            children.push(
                Label({for: fieldId}, description.label),
                field.$input,
            );
    }
    
    for(const eventName in description.events) {
        field.$input.addEventListener(eventName, description.events[eventName]);
    }

    return Div({ class: wrapperClasses }, [
        children,
        description.help ? Div({ class: suffix+'-hint' }, description.help) : null,
        description.showErrors ? ErrorDisplayer(description.errors, field) : null,
    ]);
};