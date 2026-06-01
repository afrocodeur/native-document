import {Div, Label, Span} from '../../../../../elements';
import {buildErrors} from '../helpers';
import FileNativeMode from '../../../../components/form/types/fields/FileNativeMode';

import './file-field.css';

export default function FileFieldRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field');
    props.class.add('is-file-field');
    props.class.add({'is-disabled': $desc.disabled, 'has-error': $desc.hasErrors});

    const $files = $desc.files;
    const mode   = $desc.mode || new FileNativeMode();

    const content = [];

    if($desc.label) {
        content.push(buildLabel($desc));
    }

    mode.context({ fieldDesc: $desc, fieldInstance: instance, $files });
    content.push(mode);

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