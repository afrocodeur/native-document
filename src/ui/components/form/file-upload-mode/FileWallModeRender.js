import {Div, Input, Span, Img, ForEachArray} from '../../../../../elements';
import {getFileThumbnail} from '../helpers';
import { $ } from '../../../../../index';

import './file-wall-mode.css';

export default function FileWallModeRender($desc, modeInstance) {
    const {$files, fieldDesc, fieldInstance} = $desc.$context;

    const input = buildInput(fieldDesc, fieldInstance, $files);

    const addCell =   $desc.renderCell
        ? (item) => $desc.renderCell(item, () => removeItem(item, modeInstance, fieldInstance))
        : (item) => buildCell(item, $desc, modeInstance, fieldInstance);

    return Div({class: 'file-wall-wrapper'}, [
        input,
        Div({class: 'file-wall'}, [
            ForEachArray($files, addCell),
            buildAddCell($desc, input, modeInstance),
        ]),
    ]);
}

const buildInput = (fieldDesc, fieldInstance) => {
    const input = Input({
        class:    'field-file-input',
        type:     'file',
        name:     fieldDesc.name,
        id:       fieldDesc.id || fieldDesc.name,
        accept:   fieldDesc.accept || 'image/*',
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

const buildCell = (item, $desc, modeInstance, fieldInstance) => {
    const file    = item.file();
    const size    = $desc.cellSize || 100;

    const removeBtn = Span({class: 'file-item-remove file-wall-cell-remove'}, $desc.removeIcon || '×');
    removeBtn.nd.onStopClick(() => removeItem(item, modeInstance, fieldInstance));

    const cell = Div({
        class: 'file-wall-cell',
        style: { width: size + 'px', height: size + 'px' },
    }, [
        Div({class: 'file-item-thumbnail file-wall-cell-thumbnail'}, getFileThumbnail(file, fieldInstance)),
        removeBtn,
    ]);

    cell.nd.onClick(() => item.emit('click', item));

    return cell;
};

const buildAddCell = ($desc, input, modeInstance) => {
    let cell = null;
    const size = $desc.cellSize || 100;


    if($desc.renderAdd) {
        cell = $desc.renderAdd($desc, modeInstance);
    } else {
        cell = Div({ class: 'file-wall-cell-add', style: {width: size + 'px', height: size + 'px'}, }, [
            Span({class: 'file-wall-cell-add-icon'}, $desc.addIcon || '+'),
            Span({class: 'file-wall-cell-add-label'}, $desc.addLabel || 'Upload'),
        ]);
    }

    cell.nd.onClick(() => input.click());

    return cell;
};

const removeItem = (item, modeInstance, fieldInstance) => {
    fieldInstance.removeFile(item);
    modeInstance.emit('remove', item);
    item.emit('remove', item);
};