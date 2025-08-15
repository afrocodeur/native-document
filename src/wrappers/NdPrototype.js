import DocumentObserver from "./DocumentObserver";

Object.defineProperty(HTMLElement.prototype, 'nd', {
    get() {
        if(this.$ndProx) {
            return this.$ndProx;
        }
        let element = this;
        let lifecycle = null;

        this.$ndProx = new Proxy({}, {
            get(target, property) {
                if(/^on[A-Z]/.test(property)) {
                    const event = property.replace(/^on/, '').toLowerCase();
                    const shouldPrevent = event.toLowerCase().startsWith('prevent');
                    let eventName = event.replace(/^prevent/i, '');
                    const shouldStop = event.toLowerCase().startsWith('stop');
                    eventName = eventName.replace(/^stop/i, '');

                    return function(callback) {
                        if(shouldPrevent && !shouldStop) {
                            element.addEventListener(eventName, function(event) {
                                event.preventDefault();
                                callback(event);
                            });
                            return element;
                        }
                        if(!shouldPrevent && shouldStop) {
                            element.addEventListener(eventName, function(event) {
                                event.stopPropagation();
                                callback(event);
                            });
                            return element;
                        }
                        if(shouldPrevent && shouldStop) {
                            element.addEventListener(eventName, function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                callback(event);
                            });
                            return element;
                        }
                        element.addEventListener(eventName, callback);
                        return element;
                    };
                    return fn;
                }
                if(property === 'ref') {
                    return function(target, name) {
                        target[name] = element;
                        return element;
                    };
                }
                if(property === 'unmountChildren') {
                    return () => {
                        for(let i = 0, length = element.children.length; i < length; i++) {
                            let elementchildren = element.children[i];
                            if(!elementchildren.$ndProx) {
                                elementchildren.nd?.remove();
                            }
                            elementchildren = null;
                        }
                    };
                }
                if(property === 'remove') {
                    return function() {
                        element.nd.unmountChildren();
                        lifecycle = null;
                        element.$ndProx = null;
                        delete element.nd?.on?.prevent;
                        delete element.nd?.on;
                        delete element.nd;
                    };
                }
                if(property === 'hasLifecycle') {
                    return lifecycle !== null;
                }
                if(property === 'lifecycle') {
                    if(lifecycle) {
                        return lifecycle;
                    }
                    let $observer = null;
                    lifecycle = function(states) {
                        $observer = $observer || DocumentObserver.watch(element);

                        states.mounted && $observer.mounted(states.mounted);
                        states.unmounted && $observer.unmounted(states.unmounted);
                        return element;
                    };
                    return lifecycle;
                }
                if(property === 'mounted' || property === 'unmounted') {
                    return function(callback) {
                        element.nd.lifecycle({ [property]: callback});
                        return element;
                    };
                }
            },
            set(target, p, newValue, receiver) {

            },
            configurable: true
        });
        return this.$ndProx;
    }
});