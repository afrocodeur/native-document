
import './has-draggable.css';

/**
 *  @class
 *  */
export default function HasDraggable() {}


/**
 * @param {number} x
 * @param {number} y
 */
HasDraggable.prototype.move = function(x, y) {
    if(!this.$movableElement) {
        return;
    }

    this.$movableElement.style.left   = x + 'px';
    this.$movableElement.style.top    = y + 'px';
    this.$movableElement.style.margin = '0';
};

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement|null} [grip=null]
 * @returns {() => void}
 */
HasDraggable.prototype.makeDraggable = function(parent, grip = null) {
    if(!this.emit) {
        throw new Error('HasDraggable requires HasEventEmitter - add it via BaseComponent.use(Component, HasEventEmitter, HasDraggable).');
    }
    this.$movableElement = parent;

    const gripElement = grip || parent;
    gripElement.classList.add('is-draggable');

    let isDragging = false;
    let startX     = 0;
    let startY     = 0;
    let initialX   = 0;
    let initialY   = 0;

    const onMouseDown = (e) => {
        isDragging = true;
        startX     = e.clientX;
        startY     = e.clientY;
        initialX   = parent.offsetLeft;
        initialY   = parent.offsetTop;
        this.emit('onDragStart', [e, initialX, initialY]);

        gripElement.classList.add('is-dragging');
    };

    const onMouseMove = (e) => {
        if(!isDragging) {
            return;
        }

        const x = initialX + (e.clientX - startX);
        const y = initialY + (e.clientY - startY);

        this.move(x, y);
        this.emit('onDrag', [e, x, y]);
    };

    const onMouseUp = () => {
        isDragging = false;
        this.emit('onDragEnd');
        gripElement.classList.remove('is-dragging');
    };

    gripElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
        gripElement.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
};