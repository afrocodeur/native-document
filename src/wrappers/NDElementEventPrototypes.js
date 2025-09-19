import {EVENTS} from "../utils/events";
import {NDElement} from "./NDElement";
import Validator from "../utils/validator";

(function() {
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
            return preventDefaultWrapper(this.$element, eventName, callback);
        };
        NDElement.prototype['onStop'+event] = function(callback) {
            return stopPropagationWrapper(this.$element, eventName, callback);
        };
        NDElement.prototype['onPreventStop'+event] = function(callback) {
            return preventDefaultAndStopPropagationWrapper(this.$element, eventName, callback);
        };

        NDElement.prototype['when'+event] = function(callback) {
            addCallbackToCallbacksStore(this.$element, eventName, callback);
            return this;
        };

        NDElement.prototype['capture'+event] = function(directHandler) {
            captureEventWrapper(this.$element, eventName, directHandler);
            return this;
        };
    };

}())