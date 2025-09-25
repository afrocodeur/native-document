import DocumentObserver from "./DocumentObserver";
import PluginsManager from "../utils/plugins-manager";
import Validator from "../utils/validator";
import {EVENTS} from "../utils/events";

export function NDElement(element) {
    this.$element = element;
    this.$observer = null;
    PluginsManager.emit('NDElementCreated', element, this);
}
NDElement.prototype.__$isNDElement = true;



NDElement.prototype.valueOf = function() {
    return this.$element;
};

NDElement.prototype.ref = function(target, name) {
    target[name] = this.$element;
    return this;
};

NDElement.prototype.unmountChildren = function() {
    let element = this.$element;
    for(let i = 0, length = element.children.length; i < length; i++) {
        let elementChildren = element.children[i];
        if(!elementChildren.$ndProx) {
            elementChildren.nd?.remove();
        }
        elementChildren = null;
    }
    element = null;
    return this;
};

NDElement.prototype.remove = function() {
    let element = this.$element;
    element.nd.unmountChildren();
    element.$ndProx = null;
    delete element.nd?.on?.prevent;
    delete element.nd?.on;
    delete element.nd;
    element = null;
    return this;
};

NDElement.prototype.lifecycle = function(states) {
    this.$observer = this.$observer || DocumentObserver.watch(this.$element);

    states.mounted && this.$observer.mounted(states.mounted);
    states.unmounted && this.$observer.unmounted(states.unmounted);
    return this;
};
NDElement.prototype.mounted = function(callback) {
    return this.lifecycle({ mounted: callback });
};

NDElement.prototype.unmounted = function(callback) {
    return this.lifecycle({ unmounted: callback });
};

NDElement.prototype.htmlElement = function() {
    return this.$element;
};

NDElement.prototype.node = NDElement.prototype.htmlElement;

NDElement.prototype.shadow = function(mode, style = null) {
    const $element = this.$element;
    const children = Array.from($element.childNodes)
    const shadowRoot = $element.attachShadow({ mode });
    if(style) {
        const styleNode = document.createElement("style");
        styleNode.textContent = style;
        shadowRoot.appendChild(styleNode);
    }
    $element.append = shadowRoot.append.bind(shadowRoot);
    $element.appendChild = shadowRoot.appendChild.bind(shadowRoot);
    shadowRoot.append(...children);

    return this;
};
NDElement.prototype.openShadow = function(style = null) {
    return this.shadow('open', style);
};
NDElement.prototype.closedShadow = function(style = null) {
    return this.shadow('closed', style);
};

NDElement.prototype.attach = function(bindingHydrator) {
    bindingHydrator.$hydrate(this.$element);
    return this.$element;
};


/**
 *
 * ND events API
 *
 */

const DelegatedEventsCallbackStore = {};

const addCallbackToCallbacksStore = function(element, eventName, callback) {
    if(!element) return;
    if(!DelegatedEventsCallbackStore[eventName]) {
        const eventStore = new WeakMap();
        DelegatedEventsCallbackStore[eventName] = eventStore;
        eventStore.set(element, callback);
        return;
    }
    const eventStore = DelegatedEventsCallbackStore[eventName];

    if(!eventStore.has(element)) {
        eventStore.set(element, callback);
        return;
    }
    const existingCallbacks = eventStore.get(element);
    if(!Validator.isArray(existingCallbacks)) {
        eventStore.set(element, [store[eventName], callback]);
        return;
    }
    existingCallbacks.push(callback);
}

const handleDelegatedCallbacks = function(container, eventName) {
    container.addEventListener(eventName, (event) => {
        const eventStore = DelegatedEventsCallbackStore[eventName];
        if(!eventStore) {
            return;
        }
        let target = event.target;
        while(target && target !== container) {
            const callback = eventStore.get(target);
            if(!callback) {
                target = target.parentElement;
                continue;
            }

            if(Validator.isFunction(callback)) {
                callback.call(target, event);
            }
            else {
                for(let i = 0; i < callback.length; i++) {
                    callback[i].call(target, event);
                }
            }
            return;
        }
    });
};


const preventDefaultWrapper = function(element, eventName, callback) {
    element.addEventListener(eventName, (event) => {
        event.preventDefault();
        callback && callback.call(element, event);
    });
    return this;
}
const stopPropagationWrapper = function(element, eventName, callback) {
    element.addEventListener(eventName, (event) => {
        event.stopPropagation();
        callback && callback.call(element, event);
    });
    return this;
};
const preventDefaultAndStopPropagationWrapper = function(element, eventName, callback) {
    element.addEventListener(eventName, (event) => {
        event.stopPropagation();
        event.preventDefault();
        callback && callback.call(element, event);
    });
    return this;
};
const captureEventWrapper = function(element, eventName, directHandler) {
    if(directHandler) {
        element.addEventListener(eventName, directHandler);
        return this;
    }
    handleDelegatedCallbacks(element, eventName);
    return this;
}

for(const event of EVENTS) {
    const eventName = event.toLowerCase();
    NDElement.prototype['on'+event] = function(callback) {
        this.$element.addEventListener(eventName, callback);
        return this;
    };
    NDElement.prototype['onPrevent'+event] = function(callback) {
        preventDefaultWrapper(this.$element, eventName, callback);
        return this;
    };
    NDElement.prototype['onStop'+event] = function(callback) {
        stopPropagationWrapper(this.$element, eventName, callback);
        return this;
    };
    NDElement.prototype['onPreventStop'+event] = function(callback) {
        preventDefaultAndStopPropagationWrapper(this.$element, eventName, callback);
        return this;
    };

    NDElement.prototype['when'+event] = function(callback) {
        addCallbackToCallbacksStore(this.$element, eventName, callback);
        return this;
    };

    NDElement.prototype['capture'+event] = function(directHandler) {
        captureEventWrapper(this.$element, eventName, directHandler);
        return this;
    };
}