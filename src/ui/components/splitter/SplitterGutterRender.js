import {Div} from '../../../core/elements';

export default function SplitterGutterRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('splitter-gutter');
    props.class.add('is-' + ($desc.orientation || 'horizontal'));
    props.class.add({'is-dragging': $desc.isDragging});

    // props.style.add({
    //     [($desc.orientation === 'vertical') ? 'height' : 'width']: ($desc.size || 8) + 'px',
    // });

    const gutter = Div(instance.resolveProps(),
        Div({class: 'splitter-gutter-handle'})
    );

    setupDrag(gutter, $desc, instance);

    return gutter;
}

const setupDrag = (gutter, $desc, instance) => {
    const isHorizontal = $desc.orientation !== 'vertical';
    const cursor       = isHorizontal ? 'is-col-resize' : 'is-row-resize';

    let isDragging = false;
    let startPos   = 0;
    let startSizeA = 0;
    let startSizeB = 0;

    const getSize = (panel) => {
        const el = panel.$element;
        if(!el) {
            return 0;
        }
        return isHorizontal ? el.offsetWidth : el.offsetHeight;
    };

    const onMouseDown = (e) => {
        isDragging = true;
        startPos   = isHorizontal ? e.clientX : e.clientY;
        startSizeA = getSize($desc.leftPanel);
        startSizeB = getSize($desc.rightPanel);

        $desc.isDragging.set(true);
        document.body.classList.add('is-splitter-dragging', cursor);
        instance.emit('dragStart', {sizeA: startSizeA, sizeB: startSizeB});
    };

    const onMouseMove = (e) => {
        if(!isDragging) {
            return;
        }

        const delta     = (isHorizontal ? e.clientX : e.clientY) - startPos;
        const leftDesc  = $desc.leftPanel.$description;
        const rightDesc = $desc.rightPanel.$description;

        const minA = leftDesc.minSize  || 0;
        const minB = rightDesc.minSize || 0;
        const maxA = leftDesc.maxSize  || Infinity;
        const maxB = rightDesc.maxSize || Infinity;

        const newSizeA    = Math.min(maxA, Math.max(minA, startSizeA + delta));
        const actualDelta = newSizeA - startSizeA;
        const newSizeB    = Math.min(maxB, Math.max(minB, startSizeB - actualDelta));
        const actualDeltaB = startSizeB - newSizeB;
        const finalSizeA   = Math.min(maxA, Math.max(minA, startSizeA + actualDeltaB));

        $desc.leftPanel.size(finalSizeA);
        $desc.rightPanel.size(newSizeB);

        instance.emit('drag', {sizeA: newSizeA, sizeB: newSizeB});
    };

    const onMouseUp = () => {
        if(!isDragging) {
            return;
        }

        isDragging = false;
        $desc.isDragging.set(false);
        document.body.classList.remove('is-splitter-dragging', cursor);
        instance.emit('dragEnd', {
            sizeA: getSize($desc.leftPanel),
            sizeB: getSize($desc.rightPanel),
        });
    };

    gutter.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};