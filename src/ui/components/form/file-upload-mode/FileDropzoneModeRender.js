import {Div, Input, Span, ForEachArray, ShowIf} from '../../../../../elements';
import { $ } from '../../../../core/data/Observable';
import {buildProgress, formatSize, getFileThumbnail} from '../helpers';

import './file-dropzone-mode.css';

export default function FileDropzoneModeRender($desc, modeInstance) {
    const { $files, fieldDesc, fieldInstance } = $desc.$context;

    const input = buildInput(fieldDesc, fieldInstance, $files);
    const zone  = buildZone($desc, input, $files, fieldDesc, modeInstance, fieldInstance);

    return Div({class: 'file-dropzone-wrapper'}, [zone, buildList($desc, $files, modeInstance, fieldInstance)]);
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
        style:    { display: 'none' },
    });

    fieldInstance.$input = input;

    input.nd.onChange((e) => {
        const files = Array.from(e.target.files || []);
        fieldInstance.addFiles(files);
        input.value = '';
    });

    return input;
};

const buildZone = ($desc, input, $files, fieldDesc, modeInstance, fieldInstance) => {
    if($desc.renderZone) {
        return $desc.renderZone($desc, modeInstance);
    }
    const $isDragOver = $(false);
    const zone = Div({
        class: { 'file-dropzone': true, 'is-drag-over': $isDragOver, 'is-disabled': fieldDesc.disabled },
        style: $desc.height ? { minHeight: $desc.height + 'px' } : {},
    }, [
        input,
        Div({class: 'file-dropzone-content'}, [
            Span({class: 'file-dropzone-icon'}, $desc.icon),
            Span({class: 'file-dropzone-text'}, $desc.text),
            ShowIf($desc.hint, () => Span({class: 'file-dropzone-hint'}, $desc.hint)),
        ]),
    ]);

    zone.nd.onClick(() => input.click());

    zone.nd
        .onDragOver((e) => {
            e.preventDefault();
            $isDragOver.set(true);
        })
        .onDragLeave(() => $isDragOver.set(false))
        .onDrop((e) => {
            e.preventDefault();
            $isDragOver.set(false);

            const files = Array.from(e.dataTransfer.files || []);
            fieldInstance.addFiles(files);
        });

    return zone;
};

const buildList = ($desc, $files, modeInstance, fieldInstance) => {
    const builder = $desc.renderItem
        ? (item) => $desc.renderItem(item, () => removeItem(item, $files, modeInstance, fieldInstance))
        : (item) => buildItem(item, $files, $desc, modeInstance, fieldInstance);

    return ShowIf($files.is(f => f.length > 0),
        () => Div({class: 'file-dropzone-list'},
            ForEachArray($files, builder),
        ),
    );
};

const buildItem = (item, $files, $desc, modeInstance, fieldInstance) => {
    const file    = item.file();

    const removeBtn = Span({class: 'file-item-remove'}, $desc.removeIcon || '×');
    removeBtn.nd.onStopClick(() => removeItem(item, $files, modeInstance, fieldInstance));

    return Div({class: 'file-dropzone-item'}, [
        Div({class: 'file-item-thumbnail'}, getFileThumbnail(file, fieldInstance)),
        Div({class: 'file-item-info'}, [
            Span({class: 'file-item-name'}, file.name),
            Span({class: 'file-item-size'}, formatSize(file.size)),
            buildProgress(item),
        ]),
        removeBtn,
    ]);
};

const removeItem = (item, $files, modeInstance, fieldInstance) => {
    fieldInstance.removeFile(item);
    modeInstance.emit('remove', item);
    item.emit('remove', item);
};