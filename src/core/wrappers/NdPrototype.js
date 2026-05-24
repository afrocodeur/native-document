import { NDElement } from "./NDElement";
import {EVENTS, EVENTS_WITH_PREVENT, EVENTS_WITH_STOP} from "../utils/events";

const property = {
    configurable: true,
    get() {
        return new NDElement(this);
    }
};

Object.defineProperty(HTMLElement.prototype, 'nd', property);

Object.defineProperty(DocumentFragment.prototype, 'nd', property);

Object.defineProperty(NDElement.prototype, 'nd', {
    configurable: true,
    get: function() {
        return this;
    }
});



// ----------------------------------------------------------------
// Events helpers
// ----------------------------------------------------------------
EVENTS.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    NDElement.prototype['on'+eventSourceName] = function(callback = null, options = {}) {
        this.$element.addEventListener(eventName, callback, {
            signal: this.$getSignal(),
            ...options
        });
        return this;
    };
})

EVENTS_WITH_STOP.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    NDElement.prototype['onStop'+eventSourceName] = function(callback = null, options = {}) {
        _stop(this.$element, eventName, callback, {
            signal: this.$getSignal(),
            ...options
        });
        return this;
    };
    NDElement.prototype['onPreventStop'+eventSourceName] = function(callback = null, options = {}) {
        _preventStop(this.$element, eventName, callback, {
            signal: this.$getSignal(),
            ...options
        });
        return this;
    };
});

EVENTS_WITH_PREVENT.forEach(eventSourceName => {
    const eventName = eventSourceName.toLowerCase();
    NDElement.prototype['onPrevent'+eventSourceName] = function(callback = null, options = {}) {
        _prevent(this.$element, eventName, callback, {
            signal: this.$getSignal(),
            ...options
        });
        return this;
    };
});

NDElement.prototype.$getSignal = function() {
    if(!this.$controller) {
        this.$controller = new AbortController();
        this.beforeUnmount('abort-controller', () => {
            this.$controller.abort();
            this.$controller = null;
        });
    }
    return this.$controller.signal;
};

NDElement.prototype.on = function(name, callback, options) {
    this.$element.addEventListener(name.toLowerCase(), callback, {
        signal: this.$getSignal(),
        ...options
    });
    return this;
};

NDElement.prototype.off = function(name, callback) {
    this.$element.removeEventListener(name.toLowerCase(), callback);
    return this;
};

NDElement.prototype.once = function(name, callback) {
    this.$element.addEventListener(name.toLowerCase(), callback, {
        signal: this.$getSignal(),
        once: true
    });
    return this;
};

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
    element.addEventListener(eventName, handler, options);
    return this;
}

const _stop = function(element, eventName, callback, options) {
    const handler = (event) => {
        event.stopPropagation();
        callback && callback.call(element, event);
    };
    element.addEventListener(eventName, handler, options);
    return this;
};

const _preventStop = function(element, eventName, callback, options) {
    const handler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        callback && callback.call(element, event);
    };
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
    }
}

Object.defineProperty(HTMLElement.prototype, 'classes', {
    configurable: true,
    get() {
        return {
            $element: this,
            ...classListMethods
        };
    }
});