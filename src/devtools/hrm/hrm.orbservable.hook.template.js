
function Observable(name, instance, value, ...args) {
    if(instance.context.states.has(name)) {
        const item =  instance.context.states.get(name);
        if(item.value !== value) {
            item.value = value;
            item.observable.set(value);
        }
        return item.observable;
    }

    const observable = __OriginalObservable__(value, ...args);
    instance.context.states.set(name, {
        observable,
        value
    });
    return observable;
};

Observable.init = function(name, instance, value, ...args) {
    if(instance.context.states.has(name)) {
        const item = instance.context.states.get(name);

        if(item.value !== JSON.stringify(value)) {
            item.value = value;
            item.observable.set(value);
        }

        return item.observable;
    }
    const item = __OriginalObservable__.init(value, ...args);
    instance.context.states.set(name, {
        item,
        value: JSON.stringify(value)
    });
    return item;
};

Observable.array = function(name, instance, value, ...args) {
    if(instance.context.states.has(name)) {
        const item = instance.context.states.get(name);
        if(item.value !== JSON.stringify(value)) {
            item.value = value;
            item.observable.set(value);
        }
        return item.observable;
    }
    const item = __OriginalObservable__.array(value, ...args);
    instance.context.states.set(name, {
        item,
        value: JSON.stringify(value)
    });
    return item;
};

Observable.object = Observable.init;
Observable.json = Observable.init;
const $ = Observable;