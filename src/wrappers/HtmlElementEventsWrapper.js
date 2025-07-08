function eventWrapper(element, name, callback) {
    element.addEventListener(name, callback);
    return element;
}

/**
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export default function HtmlElementEventsWrapper(element) {

    if(!element.nd) {
        element.nd = {};
    }

    /**
     * @param {Object<string,Function>} events
     */
    element.nd.on = function(events) {
        for(const event in events) {
            const callback = events[event];
            eventWrapper(element, event, callback);
        }
    };
    const events = {
        click: (callback) => eventWrapper(element, 'click', callback),
        focus: (callback) => eventWrapper(element, 'focus', callback),
        blur: (callback) => eventWrapper(element, 'blur', callback),
        input: (callback) => eventWrapper(element, 'input', callback),
        change: (callback) => eventWrapper(element, 'change', callback),
        keyup: (callback) => eventWrapper(element, 'keyup', callback),
        keydown: (callback) => eventWrapper(element, 'keydown', callback),
        beforeInput: (callback) => eventWrapper(element, 'beforeinput', callback),
        mouseOver: (callback) => eventWrapper(element, 'mouseover', callback),
        mouseOut: (callback) => eventWrapper(element, 'mouseout', callback),
        mouseDown: (callback) => eventWrapper(element, 'mousedown', callback),
        mouseUp: (callback) => eventWrapper(element, 'mouseup', callback),
        mouseMove: (callback) => eventWrapper(element, 'mousemove', callback),
        hover: (mouseInCallback, mouseOutCallback) => {
            element.addEventListener('mouseover', mouseInCallback);
            element.addEventListener('mouseout', mouseOutCallback);
        },
        dropped: (callback) => eventWrapper(element, 'drop', callback),
        submit: (callback) => eventWrapper(element, 'submit', callback),
        dragEnd: (callback) => eventWrapper(element, 'dragend', callback),
        dragStart: (callback) => eventWrapper(element, 'dragstart', callback),
        drop: (callback) => eventWrapper(element, 'drop', callback),
        dragOver: (callback) => eventWrapper(element, 'dragover', callback),
        dragEnter: (callback) => eventWrapper(element, 'dragenter', callback),
        dragLeave: (callback) => eventWrapper(element, 'dragleave', callback),
    };
    for(let event in events) {
        element.nd.on[event] = events[ event];
    }

    return element;
}