import {Div, Input, Span, Button, ForEachArray, ShowIf} from '../../../../../elements';
import {buildProgress, formatSize, getFileThumbnail} from '../helpers';

import './file-upload-button-mode.css';

export default function FileUploadButtonModeRender($desc, modeInstance) {
    const {$files, fieldDesc, fieldInstance} = $desc.$context;

    const input = buildInput(fieldDesc, fieldInstance);

    const builder = $desc.renderItem
        ? (item) => $desc.renderItem(item, () => removeItem(item, modeInstance, fieldInstance))
        : (item) => buildItem(item, $desc, modeInstance, fieldInstance);

    return Div({class: 'file-button-wrapper'}, [
        input,
        buildButton($desc, input, modeInstance),
        ShowIf($files.is(f => f.length > 0),
            () => Div({class: 'file-button-list'},
                $desc.renderList
                    ? $desc.renderList($files, modeInstance)
                    : ForEachArray($files, builder),
            ),
        ),
    ]);
}

const buildInput = (fieldDesc, fieldInstance) => {
    const input = Input({
        class:    'field-file-input',
        type:     'file',
        name:     fieldDesc.name,
        id:       fieldDesc.id || fieldDesc.name,
        accept:   fieldDesc.accept || null,
        multiple: fieldDesc.multiple,
        disabled: fieldDesc.disabled,
        style:    {display: 'none'},
    });

    fieldInstance.$input = input;

    input.nd.onChange((e) => {
        const files = Array.from(e.target.files || []);
        fieldInstance.addFiles(files);
        input.value = '';
    });

    return input;
};

const buildButton = ($desc, input, modeInstance) => {
    let btn = null;
    if($desc.renderButton) {
        btn = $desc.renderButton($desc, modeInstance);
    }
    else {
        btn = Button({class: 'file-upload-button'}, [
            $desc.buttonIcon ? Span({class: 'file-upload-button-icon'}, $desc.buttonIcon) : '+',
            Span({class: 'file-upload-button-label'}, $desc.buttonLabel || 'Add file'),
        ]);
    }

    btn.nd.onClick(() => input.click());

    return btn;
};

const buildItem = (item, $desc, modeInstance, fieldInstance) => {
    const file    = item.file();

    const removeBtn = Span({class: 'file-item-remove'}, $desc.removeIcon || '×');
    removeBtn.nd.onStopClick(() => removeItem(item, modeInstance, fieldInstance));

    return Div({class: 'file-button-item'}, [
        Div({class: 'file-item-thumbnail'}, getFileThumbnail(file, fieldInstance)),
        Div({class: 'file-item-info'}, [
            Span({class: 'file-item-name'}, file.name),
            Span({class: 'file-item-size'}, formatSize(file.size)),
            buildProgress(item),
        ]),
        removeBtn,
    ]);
};

const removeItem = (item, modeInstance, fieldInstance) => {
    fieldInstance.removeFile(item);
    modeInstance.emit('remove', item);
    item.emit('remove', item);
};