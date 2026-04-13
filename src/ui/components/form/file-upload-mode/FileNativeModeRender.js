import {Input} from '../../../../../elements';

export default function FileNativeModeRender($desc, modeInstance) {
    const { fieldDesc, fieldInstance } = $desc.$context;
    const input = Input({
        class:    'field-input',
        type:     'file',
        name:     fieldDesc.name,
        id:       fieldDesc.id || fieldDesc.name,
        accept:   fieldDesc.accept || null,
        multiple: fieldDesc.multiple,
        disabled: fieldDesc.disabled,
        ...( fieldDesc.elementsProps?.input || {}),
    });

    input.nd.onChange((e) => {
        const files = Array.from(e.target.files || []);
        fieldInstance.setFiles(files);
    });

    return input;
}