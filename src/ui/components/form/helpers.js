import {ForEachArray, ShowIf, Div, Span, Img} from "../../../../elements";

export const buildErrors = ($desc) => {
    return ShowIf($desc.showErrors, () =>
        ShowIf($desc.hasErrors,
            () => Div({class: 'field-errors', ...($desc.elementsProps.error || {})},
                ForEachArray($desc.errors, (error) =>
                    Span({class: 'field-error'}, error)
                )
            )
        )
    );
};


export const formatSize = (bytes) => {
    if(bytes < 1024)        return bytes + ' B';
    if(bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
};


export const getFileThumbnail = (file, fieldInstance) => {
    const isImage = file.type?.startsWith('image/');
    const url = URL.createObjectURL(file);
    if(isImage) {
        return Img(url, {
            class: 'file-item-img',
            alt: file.name,
        });
    }

    const fieldDesc = fieldInstance.$description;
    if(fieldDesc.fileIcons) {
        for(let i = 0; i < fieldDesc.fileIcons.length; i++) {
            const iconDesc = fieldDesc.fileIcons[i];
            if(iconDesc.pattern && iconDesc.pattern.test(file.type)) {
                return Span({class: 'file-item-icon'}, iconDesc.icon);
            }
            if(iconDesc.type && iconDesc.type === file.type) {
                return Span({class: 'file-item-icon'}, iconDesc.icon);
            }
        }
    }

    return Span({ class: 'file-item-icon file-item-icon-default' });
};

export const buildProgress = (item) => {
    const $status   = item.$description.status;
    const $progress = item.$description.progress;

    return ShowIf($status.is(s => s === 'uploading'),
        () => Div({class: 'file-item-progress'}, [
            Div({class: 'file-item-progress-track'},
                Div({
                    class: 'file-item-progress-bar',
                    style: {width: $progress.transform(v => v + '%')},
                })
            ),
            Span({class: 'file-item-progress-label'}, $progress.transform(v => v + '%')),
        ])
    );
};

export const buildInputWithSlots = (input, $desc, instance, options = {}) => {
    const clearable = options.clearable || $desc.clearable;
    const $value = $desc[options.source || 'value'];
    const onClear = options.onClear;
    const slots = $desc.slots || {};
    if(clearable && $value?.__$Observable) {
        const clearBtn = Span({class: 'field-clear'}, $desc.clearButtonIcon || '×');
        clearBtn.nd.onStopClick((e) => {
            $value.set(null);
            onClear?.(e);
        });
        instance.trailing(ShowIf($value, clearBtn));
    }

    const content = [];

    if(slots.leading) {
        content.push(Div({class: 'field-leading'}, slots.leading));
    }

    content.push(input);

    if(slots.trailing) {
        content.push(Div({class: 'field-trailing'}, slots.trailing));
    }

    const wrapperClass = {
        'field-input-wrapper': true,
        'has-leading':  !!slots.leading,
        'has-trailing': !!slots.trailing,
        'is-touched': $desc.isTouched,
        'is-dirty': $desc.isDirty,
        ...(options.class || {})
    };

    input.nd.onInput((e) => {
        const current = e.target.value;
        $desc.isDirty.set(current !== $desc.initialValue);
    });

    input.nd.onBlur(() => {
        $desc.isTouched.set(true);
    });

    return Div({class: wrapperClass}, content);
};