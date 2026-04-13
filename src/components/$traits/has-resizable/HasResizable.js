
import './has-resizable.css';

export default function HasResizable() {}

HasResizable.prototype.makeResizable = function(parent, options = {}) {
    if(!this.emit) {
        throw new Error('HasResizable requires HasEventEmitter — add it via BaseComponent.use(Component, HasEventEmitter).');
    }

    const directions = options.directions || ['right', 'bottom', 'bottom-right'];
    const sizeConstraint = options.size || { minWidth: 200, minHeight: 200 };
    sizeConstraint.minWidth = sizeConstraint.minWidth || 200;
    sizeConstraint.minHeight = sizeConstraint.minHeight || 200;

    parent.classList.add('is-resizable');

    const handles = [];

    directions.forEach((direction) => {
        const handle = document.createElement('div');
        handle.className = 'resize-handle is-' + direction;
        parent.appendChild(handle);
        handles.push(handle);

        setupResizeHandle(handle, parent, direction, sizeConstraint, this);
    });

    return () => {
        handles.forEach(h => h.remove());
    };
};

const setupResizeHandle = (handle, parent, direction, sizeConstraint, instance) => {
    let isResizing = false;
    let startX     = 0;
    let startY     = 0;
    let startW     = 0;
    let startH     = 0;
    let startLeft  = 0;
    let startTop   = 0;

    const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        startX     = e.clientX;
        startY     = e.clientY;
        startW     = parent.offsetWidth;
        startH     = parent.offsetHeight;
        startLeft  = parent.offsetLeft;
        startTop   = parent.offsetTop;

        document.body.classList.add('is-resizing');
        instance.emit?.('onResizeStart', [e, startW, startH]);
    };

    const onMouseMove = (e) => {
        if(!isResizing) {
            return;
        }

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if(direction === 'right' || direction === 'top-right' || direction === 'bottom-right') {
            const newWidth = Math.max(sizeConstraint.minWidth, startW + dx);
            if(newWidth > sizeConstraint.minWidth && (!sizeConstraint.maxWidth || newWidth <= sizeConstraint.maxWidth)) {
                parent.style.width = newWidth + 'px';
            }
        }

        if(direction === 'left' || direction === 'top-left' || direction === 'bottom-left') {
            const newWidth = Math.max(sizeConstraint.minWidth, startW - dx);
            if(newWidth > sizeConstraint.minWidth && (!sizeConstraint.maxWidth || newWidth <= sizeConstraint.maxWidth)) {
                parent.style.width = newWidth + 'px';
                parent.style.left  = (startLeft + dx) + 'px';
            }
        }

        if(direction === 'bottom' || direction === 'bottom-right' || direction === 'bottom-left') {
            const newHeight = Math.max(sizeConstraint.minHeight, startH + dy);
            if(newHeight > sizeConstraint.minHeight && (!sizeConstraint.maxHeight || newHeight <= sizeConstraint.maxHeight)) {
                parent.style.height = newHeight + 'px';
            }
        }

        if(direction === 'top' || direction === 'top-right' || direction === 'top-left') {
            const newHeight = Math.max(sizeConstraint.minHeight, startH - dy);
            if(newHeight > sizeConstraint.minHeight && (!sizeConstraint.maxHeight || newHeight <= sizeConstraint.maxHeight)) {
                parent.style.height = newHeight + 'px';
                parent.style.top    = (startTop + dy) + 'px';
            }
        }

        instance.emit?.('onResize', [e, parent.offsetWidth, parent.offsetHeight]);
    };

    const onMouseUp = () => {
        if(!isResizing) {
            return;
        }

        isResizing = false;
        document.body.classList.remove('is-resizing');
        instance.emit?.('onResizeEnd', [parent.offsetWidth, parent.offsetHeight]);
    };

    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};