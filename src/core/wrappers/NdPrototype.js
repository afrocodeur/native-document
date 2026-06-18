import { NDElement } from './NDElement';
import {EVENTS, EVENTS_WITH_PREVENT, EVENTS_WITH_STOP} from '../utils/events';

const property = {
    configurable: true,
    get() {
        return new NDElement(this);
    },
};

Object.defineProperty(HTMLElement.prototype, 'nd', property);

Object.defineProperty(DocumentFragment.prototype, 'nd', property);

Object.defineProperty(NDElement.prototype, 'nd', {
    configurable: true,
    get: function() {
        return this;
    },
});


// ----------------------------------------------------------------
// Events helpers
// ----------------------------------------------------------------
EVENTS.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    const inlineHandler = 'on'+eventName;
    const fnName = 'on'+eventSourceName;
    NDElement.prototype[fnName] = function(callback = null, options = null) {
        if(!this.$element[inlineHandler] && !options) {
            this.$element[inlineHandler] = callback;
            return this;
        }
        this.$element.addEventListener(eventName, callback, options);
        return this;
    };
    if(!HTMLElement.prototype[fnName]) {
        HTMLElement.prototype[fnName] = function(callback, options) {
            if(!this[inlineHandler] && !options) {
                this[inlineHandler] = callback;
                return this;
            }
            this.addEventListener(eventName, callback, options);
            return this;
        }
    }
});

EVENTS_WITH_STOP.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    const stopFnName = 'onStop'+eventSourceName;
    const preventStopFnName = 'onPreventStop'+eventSourceName;

    NDElement.prototype[stopFnName] = function(callback = null, options = null) {
        _stop(this.$element, eventName, callback, options);
        return this;
    };
    NDElement.prototype[preventStopFnName] = function(callback = null, options = null) {
        _preventStop(this.$element, eventName, callback, options);
        return this;
    };
    if(HTMLElement.prototype[stopFnName]) {
        HTMLElement.prototype[stopFnName] = function(callback = null, options = null) {
            _stop(this, eventName, callback, options);
            return this;
        };
    }
    if(!HTMLElement.prototype[preventStopFnName]) {
        HTMLElement.prototype[preventStopFnName] = function(callback = null, options = null) {
            _preventStop(this, eventName, callback, options);
            return this;
        };
    }
});

EVENTS_WITH_PREVENT.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    const preventFnName = 'onPrevent'+eventSourceName;
    NDElement.prototype[preventFnName] = function(callback = null, options = null) {
        _prevent(this.$element, eventName, callback, options);
        return this;
    };
    if(HTMLElement.prototype[preventFnName]) {
        HTMLElement.prototype[preventFnName] = function(callback = null, options = null) {
            _prevent(this, eventName, callback, options);
            return this;
        };
    }
});


/**
 * Adds a native event listener to the underlying HTMLElement.
 * The listener is automatically removed when the element is unmounted (via AbortSignal).
 *
 * @param {string} name - Event name (case-insensitive, e.g. 'click', 'input')
 * @param {EventListener} callback - Handler to call when the event fires
 * @param {boolean|AddEventListenerOptions} [options] - Listener options merged with the element's AbortSignal
 * @returns {this}
 */
NDElement.prototype.on = function(name, callback, options) {
    this.$element.addEventListener(name.toLowerCase(), callback, {
        ...options,
    });
    return this;
};

/**
 * Removes a previously registered event listener from the underlying HTMLElement.
 *
 * @param {string} name - Event name (case-insensitive)
 * @param {EventListener} callback - The exact handler reference to remove
 * @returns {this}
 */
NDElement.prototype.off = function(name, callback) {
    this.$element.removeEventListener(name.toLowerCase(), callback);
    return this;
};

/**
 * Adds a one-time event listener that removes itself after the first call.
 * Uses the element's AbortSignal for lifecycle-safe cleanup.
 *
 * @param {string} name - Event name (case-insensitive)
 * @param {EventListener} callback - Handler called once when the event fires
 * @returns {this}
 */
NDElement.prototype.once = function(name, callback) {
    this.$element.addEventListener(name.toLowerCase(), callback, {
        once: true,
    });
    return this;
};

/**
 * Dispatches a custom event on the underlying HTMLElement.
 * The event bubbles and is cancelable by default.
 *
 * @param {string} name - Custom event name
 * @param {*} [detail=null] - Data passed in event.detail
 * @returns {this}
 * @example
 * Button('Save').nd.emit('saved', { id: 42 });
 * // Triggers: element.addEventListener('saved', e => console.log(e.detail.id))
 */
NDElement.prototype.emit = function(name, detail = null) {
    const event = new CustomEvent(name, {
        detail,
        bubbles:    true,
        cancelable: true,
    });
    this.$element.dispatchEvent(event);
    return this;
};

const _prevent = function(element, eventName, callback, options) {
    const handler = (event) => {
        event.preventDefault();
        callback && callback.call(element, event);
    };

    const inlineHandler = 'on' + eventName;
    if(!element[inlineHandler] && !options) {
        element[inlineHandler] = handler;
        return;
    }
    element.addEventListener(eventName, handler, options);
};

const _stop = function(element, eventName, callback, options) {
    const handler = (event) => {
        event.stopPropagation();
        callback && callback.call(element, event);
    };

    const inlineHandler = 'on' + eventName;
    if(!element[inlineHandler] && !options) {
        element[inlineHandler] = handler;
        return;
    }

    element.addEventListener(eventName, handler, options);
    return this;
};

const _preventStop = function(element, eventName, callback, options) {
    const handler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        callback && callback.call(element, event);
    };
    const inlineHandler = 'on' + eventName;
    if(!element[inlineHandler] && !options) {
        element[inlineHandler] = handler;
        return;
    }
    element.addEventListener(eventName, handler, options);
    return this;
};



// ----------------------------------------------------------------
// Class attributes binder
// ----------------------------------------------------------------
const classListMethods = {
    getClasses() {
        return this.$element.className?.split(' ').filter(Boolean);
    },
    add(value) {
        const classes = this.getClasses();
        if(classes.indexOf(value) >= 0) {
            return;
        }
        classes.push(value);
        this.$element.className = classes.join(' ');
    },
    remove(value) {
        const classes = this.getClasses();
        const index = classes.indexOf(value);
        if(index < 0) {
            return;
        }
        classes.splice(index, 1);
        this.$element.className = classes.join(' ');
    },
    toggle(value, force = undefined) {
        const classes = this.getClasses();
        const index = classes.indexOf(value);
        if(index >= 0) {
            if(force === true) {
                return;
            }
            classes.splice(index, 1);
        }
        else {
            if(force === false) {
                return;
            }
            classes.push(value);
        }
        this.$element.className = classes.join(' ');
    },
    contains(value) {
        return this.getClasses().indexOf(value) >= 0;
    },
};

Object.defineProperty(HTMLElement.prototype, 'classes', {
    configurable: true,
    get() {
        return {
            $element: this,
            ...classListMethods,
        };
    },
});