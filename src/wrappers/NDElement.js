import DocumentObserver from "./DocumentObserver";
import { EVENTS } from "../utils/events";

export function NDElement(element) {
    this.$element = element;
    this.$observer = null;
}
NDElement.prototype.__$isNDElement = true;

for(const event of EVENTS) {
    const eventName = event.toLowerCase();
    NDElement.prototype['on'+event] = function(callback) {
        this.$element.addEventListener(eventName, callback);
        return this;
    };
    NDElement.prototype['onPrevent'+event] = function(callback) {
        this.$element.addEventListener(eventName, function(event) {
            event.preventDefault();
            callback && callback(event);
        });
        return this;
    };
    NDElement.prototype['onStop'+event] = function(callback) {
        this.$element.addEventListener(eventName, function(event) {
            event.stopPropagation();
            callback && callback(event);
        });
        return this;
    };
    NDElement.prototype['onPreventStop'+event] = function(callback) {
        this.$element.addEventListener(eventName, function(event) {
            event.stopPropagation();
            event.preventDefault();
            callback && callback(event);
        });
        return this;
    };
}

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