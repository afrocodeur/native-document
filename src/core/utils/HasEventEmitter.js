
export default function HasEventEmitter() {

    this.__$events = null;

}

HasEventEmitter.prototype.on = function(eventName, callback) {
    if(!this.__$events) {
        this.__$events = new Map();
    }
    if(!this.__$events.has(eventName)) {
        this.__$events.set(eventName, callback);
        return;
    }
    const existingCallback = this.__$events.get(eventName);
    if(!Array.isArray(existingCallback)) {
        this.__$events.set(eventName, [existingCallback, callback]);
        return;
    }
    existingCallback.push(callback);
};

HasEventEmitter.prototype.hasListeners = function(eventName) {
    if(!this.__$events) {
        return false;
    }
    return !!this.__$events.get(eventName);
};

HasEventEmitter.prototype.trigger = async function(eventName, ...args) {
    if(!this.__$events) {
        return;
    }
    const callbacks = this.__$events.get(eventName);
    if(!callbacks) {
        // throw new NativeDocumentError(this.constructor.name, 'Event '+eventName+' not found');
        return;
    }

    if(typeof callbacks === 'function') {
        return await Promise.resolve(callbacks.apply(this, args))
    }

    let result = null;
    for(let i = 0, length = callbacks.length; i < length; i++) {
        result = await Promise.resolve(await callbacks[i].apply(this, args));
    }
    return result;
};
HasEventEmitter.prototype.emit = HasEventEmitter.prototype.trigger;