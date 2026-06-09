import { Li, Div, Span, ShowIf } from '../../../../core/elements';

import './list-item.css';

export default function ListItemRender($desc, instance) {
    if ($desc.render) {
        return $desc.render($desc, instance);
    }

    const props = instance.getEditableProps();

    props.class.add('list-item');

    if ($desc.disabled) {
        props.class.add('is-disabled', $desc.disabled);
        // [a11y] aria-disabled
        props['aria-disabled'] = $desc.disabled;
    }
    if ($desc.selected) {
        props.class.add('is-selected', $desc.selected);
        // [a11y] aria-selected
        props['aria-selected'] = $desc.selected;
    }
    if ($desc.visibility) {
        props.class.add('is-hidden', $desc.visibility.isFalsy());
    }

    const backContent  = [];
    const frontContent = [];

    const $list = instance.$parent;

    // Checkbox — réactif via ShowIf
    if ($list?.$description?.selectByCheckbox) {
        const selectedValues = $list.$description.selectedValues;
        const value          = $desc.value ?? instance;
        const isChecked      = selectedValues ? selectedValues.isIncludes(value) : null;

        const cls = isChecked
            ? isChecked.transform((c) => 'list-item-checkbox' + (c ? ' is-checked' : ''))
            : 'list-item-checkbox';

        frontContent.push(
            ShowIf($list.$description.selectByCheckbox, () =>
                Span({ class: cls, 'aria-hidden': 'true' })
            )
        );
    }

    if ($desc.icon) {
        frontContent.push(Span({ class: 'list-item-icon' }, $desc.icon));
    }

    frontContent.push(buildBody($desc));

    // Select indicator — réactif via isIncludes
    if ($list?.$description?.selectByClick) {
        const selectedValues = $list.$description.selectedValues;
        const value          = $desc.value ?? instance;
        const isSelected     = selectedValues ? selectedValues.isIncludes(value) : null;

        if (isSelected) {
            frontContent.push(
                Span({
                    class: isSelected.transform((s) => 'list-item-indicator' + (s ? ' is-visible' : '')),
                    'aria-hidden': 'true',
                }, $desc.isSelectedIcon)
            );
        }
    }

    if ($desc.trailing) {
        frontContent.push(Div({ class: 'list-item-trailing' }, $desc.trailing));
    }

    // Swipe actions
    const hasLeadingSwipe  = Array.isArray($desc.swipeLeading)  && $desc.swipeLeading.length  > 0;
    const hasTrailingSwipe = Array.isArray($desc.swipeTrailing) && $desc.swipeTrailing.length > 0;

    if (hasLeadingSwipe || hasTrailingSwipe) {
        props.class.add('is-swipeable');

        if (hasLeadingSwipe) {
            backContent.push(Div({ class: 'swipe-actions-container container-leading' }, $desc.swipeLeading));
        }
        if (hasTrailingSwipe) {
            backContent.push(Div({ class: 'swipe-actions-container container-trailing' }, $desc.swipeTrailing));
        }
    }

    const elFront = Div({ class: 'list-item-content' }, frontContent);
    const elBack  = backContent.length > 0
        ? Div({ class: 'list-item-swipe-background' }, backContent)
        : null;

    const el = Li(instance.resolveProps(), elBack ? [elBack, elFront] : [elFront]);

    if (elBack) {
        setupSwipeEvents(elFront, elBack, hasLeadingSwipe, hasTrailingSwipe);
    }

    el.nd.onClick((e) => {
        if ($desc.disabled) return;

        const $list = instance.$parent;
        if (!$list) {
            instance.emit('click', instance, e);
            return;
        }

        const desc = $list.$description;
        if (desc.selectable || desc.selectByClick || desc.selectByCheckbox) {
            handleSelect($list, $desc, instance);
            instance.emit('itemSelect', instance);
            $list.emit('itemSelect', instance);
        }

        instance.emit('click', instance, e);
        $list.emit('itemClick', instance, e);
    });

    return el;
}

function buildBody($desc) {
    const parts = [];

    if ($desc.label) {
        parts.push(Span({ class: 'list-item-label' }, $desc.label));
    }

    if ($desc.subtitle) {
        parts.push(Span({ class: 'list-item-subtitle' }, $desc.subtitle));
    }

    return Div({ class: 'list-item-body' }, parts);
}

function handleSelect($list, $desc, instance) {
    const $values = $list.$description.selectedValues;
    if (!$values) return;

    const value = $desc.value ?? instance;

    if ($values.includes(value)) {
        $values.removeItem(value);
    } else {
        if (!$list.$description.multiSelect.val()) {
            $values.clear();
        }
        $values.push(value);
    }
}

function setupSwipeEvents(elFront, elBack, hasLeading, hasTrailing) {
    let startX    = 0;
    let currentX  = 0;
    let isSwiping = false;
    let isOpen    = false;

    const leadingContainer  = elBack.querySelector('.container-leading');
    const trailingContainer = elBack.querySelector('.container-trailing');

    // Stop propagation on all swipe action clicks — must not bubble to list-item onClick
    elBack.addEventListener('click', (e) => e.stopPropagation());

    elFront.addEventListener('pointerdown', (e) => {
        startX    = e.clientX;
        isSwiping = true;
        elFront.style.transition = 'none';
    });

    elFront.addEventListener('pointermove', (e) => {
        if (!isSwiping) return;

        let diffX = e.clientX - startX;

        if (diffX > 0 && !hasLeading)  diffX = 0;
        if (diffX < 0 && !hasTrailing) diffX = 0;

        const threshold = diffX > 0
            ? (leadingContainer  ? leadingContainer.offsetWidth  : 100)
            : (trailingContainer ? trailingContainer.offsetWidth : 100);

        if (Math.abs(diffX) > threshold) {
            diffX = diffX > 0
                ? threshold  + (diffX - threshold)  * 0.2
                : -threshold + (diffX + threshold) * 0.2;
        }

        currentX = diffX;
        elFront.style.transform = `translate3d(${currentX}px, 0, 0)`;
    });

    const resetSwipe = () => {
        elFront.style.transition = 'transform 0.2s ease-out';
        elFront.style.transform  = 'translate3d(0, 0, 0)';
        currentX = 0;
        isOpen   = false;
    };

    const closeSwipe = () => {
        isSwiping = false;
        elFront.style.transition = 'transform 0.2s ease-out';

        const leadingThreshold  = leadingContainer  ? leadingContainer.offsetWidth  : 100;
        const trailingThreshold = trailingContainer ? trailingContainer.offsetWidth : 100;

        if (currentX > leadingThreshold / 2 && hasLeading) {
            elFront.style.transform = `translate3d(${leadingThreshold}px, 0, 0)`;
            isOpen = true;
        } else if (currentX < -trailingThreshold / 2 && hasTrailing) {
            elFront.style.transform = `translate3d(-${trailingThreshold}px, 0, 0)`;
            isOpen = true;
        } else {
            resetSwipe();
        }
    };

    elFront.addEventListener('pointerup',    closeSwipe);
    elFront.addEventListener('pointerleave', closeSwipe);

    // Close swipe when clicking outside the item
    const onDocumentClick = (e) => {
        if (!isOpen) return;
        if (!elFront.closest('.list-item')?.contains(e.target)) {
            resetSwipe();
        }
    };

    document.addEventListener('click', onDocumentClick);

    // Close swipe when clicking on a swipe action (after the action fires)
    elBack.addEventListener('click', () => {
        if (isOpen) resetSwipe();
    });

    // Cleanup on unmount
    elFront.nd?.unmounted(() => {
        document.removeEventListener('click', onDocumentClick);
    });
}
