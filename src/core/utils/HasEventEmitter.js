/**
 * Mixin constructor that adds a simple synchronous/async event emitter to any class.
 * Extend or call this in your constructor to gain .on(), .trigger(), and .emit().
 *
 * @constructor
 * @example
 * function MyClass() {
 *   HasEventEmitter.call(this);
 * }
 * MyClass.prototype = Object.create(HasEventEmitter.prototype);
 * const instance = new MyClass();
 * instance.on('ready', () => console.log('ready!'));
 * instance.trigger('ready');
 */
export default function HasEventEmitter() {

    this.__$events = null;

}

/**
 * Registers a callback for the given event name.
 * Multiple callbacks for the same event are collected into an array.
 *
 * @param {string} eventName - Event identifier
 * @param {Function} callback - Handler to register
 */
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

/**
 * Returns true if at least one callback is registered for the given event.
 *
 * @param {string} eventName - Event identifier
 * @returns {boolean}
 */
HasEventEmitter.prototype.hasListeners = function(eventName) {
    if(!this.__$events) {
        return false;
    }
    return !!this.__$events.get(eventName);
};

/**
 * Fires all registered callbacks for the given event name, awaiting each one in sequence.
 * Returns the result of the last callback. Alias: .emit()
 *
 * @param {string} eventName - Event identifier
 * @param {...*} args - Arguments passed to each callback
 * @returns {Promise<*>} Result of the last callback, or undefined if none
 */
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
        return await Promise.resolve(callbacks.apply(this, args));
    }

    let result = null;
    for(let i = 0, length = callbacks.length; i < length; i++) {
        result = await Promise.resolve(callbacks[i].apply(this, args));
    }
    return result;
};
HasEventEmitter.prototype.emit = HasEventEmitter.prototype.trigger;