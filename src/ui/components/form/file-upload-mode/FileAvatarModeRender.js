import {Div, Input, Span, Img, Button, Switch} from '../../../../../elements';
import { $ } from '../../../../core/data/Observable';

import './file-avatar-mode.css';

export default function FileAvatarModeRender($desc, modeInstance) {
    const {$files, fieldDesc, fieldInstance} = $desc.$context;
    const $preview = $(null);

    const input = buildInput(fieldDesc, fieldInstance, $files, $preview);

    const variant = $desc.variant || 'hover-overlay';

    const avatar = buildAvatar($desc, $preview);

    fieldInstance.onReset(() => $preview.set(null));

    if(variant === 'hover-overlay') {
        return buildHoverOverlay($desc, avatar, input, $files, modeInstance);
    }
    if(variant === 'corner-badge') {
        return buildCornerBadge($desc, avatar, input, $files, modeInstance);
    }
    if(variant === 'action-buttons') {
        return buildActionButtons($desc, avatar, input, $files, modeInstance, fieldInstance);
    }

    return avatar;
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


const buildShapeClass = (defaultClass, $desc) => ({
    [defaultClass]: true,
    'is-circle': ($desc.shape || 'circle') === 'circle',
    'is-square': ($desc.shape || 'circle') === 'square',
});

const buildAvatar = ($desc, $preview) => {
    const size   = $desc.size || 100;
    const shape  = $desc.shape || 'circle';
    const radius = shape === 'circle' ? '50%' : '12px';


    const previewImg = () => Img($preview, {
        class: 'file-avatar-img',
        alt:   'Avatar',
    });
    const placeholder = () => Div({class: 'file-avatar-placeholder'}, [
        Span({class: 'file-avatar-placeholder-icon'}, $desc.placeholderIcon),
    ]);

    return Div({
        class: buildShapeClass('file-avatar', $desc),
        style: { width: size + 'px', height: size + 'px' },
    }, Switch($preview, previewImg, placeholder));
};

const buildHoverOverlay = ($desc, avatar, input, $files, modeInstance) => {
    let overlay = null;
    if($desc.renderOverlay) {
        overlay = $desc.renderOverlay(avatar, $desc, modeInstance);
    } else {
        overlay = Div({class: 'file-avatar-overlay'}, [
            Span({class: 'file-avatar-overlay-icon'}, $desc.overlayIcon || $desc.editImageIcon),
        ]);
    }

    const wrapper = Div({
        class: buildShapeClass('file-avatar-wrapper is-hover-overlay', $desc),
    }, [avatar, overlay]);

    wrapper.nd.onClick(() => input.click());

    return Div({}, [input, wrapper]);
};

const buildCornerBadge = ($desc, avatar, input) => {
    const badge = Div({class: 'file-avatar-badge'}, $desc.editImageIcon);
    badge.nd.onClick(() => input.click());

    return Div({}, [
        input,
        Div({
            class: buildShapeClass('file-avatar-wrapper is-corner-badge', $desc),
        }, [avatar, badge]),
    ]);
};

const buildActionButtons = ($desc, avatar, input, $files, modeInstance, fieldInstance) => {
    if($desc.renderActions) {
        return $desc.renderActions($desc, avatar, () => input.click(), () => removeAvatar($files, modeInstance, fieldInstance), modeInstance);
    }

    const changeBtn = Button({class: 'file-avatar-btn is-change'}, $desc.changeLabel);
    changeBtn.nd.onClick(() => input.click());

    const removeBtn = Button({class: 'file-avatar-btn is-remove'}, $desc.removeLabel);
    removeBtn.nd.onClick(() => removeAvatar($files, modeInstance, fieldInstance));

    return Div({class: 'file-avatar-action-wrapper'}, [
        input,
        avatar,
        Div({class: 'file-avatar-actions'}, [changeBtn, removeBtn]),
    ]);
};

const removeAvatar = ($files, modeInstance, fieldInstance) => {
    const item = $files.val()?.[0];
    fieldInstance.reset();
    if(item) {
        modeInstance.emit('remove', item);
        item.emit('remove', item);
    }
};