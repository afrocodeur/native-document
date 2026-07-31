import {Div, Input, Span, Img, Button, Switch} from '../../../../../elements';
import { $ } from '../../../../core/data/Observable';

import './file-image-preview-mode.css';

export default function FileImagePreviewModeRender($desc, nodeInstance) {
    const {$files, fieldDesc, fieldInstance} = $desc.$context;
    const $preview = $desc.previewSourceFrom ?? $(null);

    if(fieldDesc.defaultValue) {
        $preview.set(fieldDesc.defaultValue);
    }

    const input = buildInput(fieldDesc, fieldInstance, $files, $preview);

    const variant = $desc.variant || 'hover-overlay';

    const imagePreview = buildImagePreview($desc, $preview, nodeInstance);

    fieldInstance.onReset(() => $preview.set(null));

    if(variant === 'hover-overlay') {
        return buildHoverOverlay($desc, imagePreview, input, $files, nodeInstance);
    }
    if(variant === 'corner-badge') {
        return buildCornerBadge($desc, imagePreview, input, $files, nodeInstance);
    }
    if(variant === 'action-buttons') {
        return buildActionButtons($desc, imagePreview, input, $files, nodeInstance, fieldInstance);
    }

    return imagePreview;
}

const buildInput = (fieldDesc, fieldInstance, $files, $preview) => {
    const input = Input({
        class:    'field-file-input',
        type:     'file',
        name:     fieldDesc.name,
        id:       fieldDesc.id || fieldDesc.name,
        accept:   fieldDesc.accept || 'image/*',
        disabled: fieldDesc.disabled,
        style:    {display: 'none'},
    });

    fieldInstance.$input = input;

    input.nd.onChange((e) => {
        const file = e.target.files?.[0];
        if(!file) {
            return;
        }

        fieldInstance.reset();
        fieldInstance.addFile(file);
        $preview.set(URL.createObjectURL(file));

        input.value = '';
    });

    return input;
};


const buildShapeClass = (instance, defaultClass, $desc) => {
    const props = instance.getEditableProps();

    props.class.add({
        [defaultClass]: true,
        'is-circle': ($desc.shape || 'circle') === 'circle',
        'is-square': ($desc.shape || 'circle') === 'square',
        ['is-'+$desc.mode+'-mode']: true
    });

    return props.class.value();
};

const buildImagePreview = ($desc, $preview, instance) => {
    const shape  = $desc.shape || 'circle';
    const radius = shape === 'circle' ? '50%' : '12px';

    const props = instance.getEditableProps();

    if($desc.size) {
        props.style.add('--file-image-preview-size', $desc.size + 'px');
    }


    const previewImg = () => Img($preview, {
        class: 'file-image-preview-img',
        alt:   $desc.alt || 'Image Preview',
    });
    const placeholder = () => Div({class: 'file-image-preview-placeholder'}, [
        Span({class: 'file-image-preview-placeholder-icon'}, $desc.placeholderIcon),
    ]);

    return Div({
        class: buildShapeClass(instance,'file-image-preview', $desc),
        style: props.style.value(),
    }, Switch($preview, previewImg, placeholder));
};

const buildHoverOverlay = ($desc, imagePreview, input, $files, nodeInstance) => {
    let overlay = null;
    const props = nodeInstance.getEditableProps();

    if($desc.ratio) {
        props.style.add('--cover-aspect-ratio', $desc.ratio);
    }

    if($desc.renderOverlay) {
        overlay = $desc.renderOverlay(imagePreview, $desc, nodeInstance);
    } else {
        overlay = Div({class: 'file-image-preview-overlay'}, [
            Span({class: 'file-image-preview-overlay-icon'}, $desc.overlayIcon || $desc.editImageIcon),
        ]);
    }

    const wrapper = Div({
        class: buildShapeClass(nodeInstance, 'file-image-preview-wrapper is-hover-overlay', $desc),
        style: props.style.value()
    }, [imagePreview, overlay]);

    wrapper.nd.onClick(() => input.click());

    return Div({}, [input, wrapper]);
};

const buildCornerBadge = ($desc, imagePreview, input, instance) => {
    const badge = Div({class: 'file-image-preview-badge'}, $desc.editImageIcon);
    badge.nd.onClick(() => input.click());

    return Div({}, [
        input,
        Div({
            class: buildShapeClass(instance, 'file-image-preview-wrapper is-corner-badge', $desc),
        }, [imagePreview, badge]),
    ]);
};

const buildActionButtons = ($desc, imagePreview, input, $files, nodeInstance, fieldInstance) => {
    if($desc.renderActions) {
        return $desc.renderActions($desc, imagePreview, () => input.click(), () => removeImagePreview($files, nodeInstance, fieldInstance), nodeInstance);
    }

    const changeBtn = Button({class: 'file-image-preview-btn is-change'}, $desc.changeLabel);
    changeBtn.nd.onClick(() => input.click());

    const removeBtn = Button({class: 'file-image-preview-btn is-remove'}, $desc.removeLabel);
    removeBtn.nd.onClick(() => removeImagePreview($files, nodeInstance, fieldInstance));

    return Div({class: 'file-image-preview-action-wrapper'}, [
        input,
        imagePreview,
        Div({class: 'file-image-preview-actions'}, [changeBtn, removeBtn]),
    ]);
};

const removeImagePreview = ($files, nodeInstance, fieldInstance) => {
    const item = $files.val()?.[0];
    fieldInstance.reset();
    if(item) {
        nodeInstance.emit('remove', item);
        item.emit('remove', item);
    }
};