var NativeDocument = (function (exports) {
    'use strict';

    let DebugManager = {};

    {
        DebugManager = {
            enabled: false,

            enable() {
                this.enabled = true;
                console.log('🔍 NativeDocument Debug Mode enabled');
            },

            disable() {
                this.enabled = false;
            },

            log(category, message, data) {
                if (!this.enabled) return;
                console.group(`🔍 [${category}] ${message}`);
                if (data) console.log(data);
                console.trace();
                console.groupEnd();
            },

            warn(category, message, data) {
                if (!this.enabled) return;
                console.warn(`⚠️ [${category}] ${message}`, data);
            },

            error(category, message, error) {
                console.error(`❌ [${category}] ${message}`, error);
            }
        };

    }
    var DebugManager$1 = DebugManager;

    const MemoryManager = (function() {

        let $nextObserverId = 0;
        const $observables = new Map();

        return {
            /**
             * Register an observable and return an id.
             *
             * @param {ObservableItem} observable
             * @param {Function} getListeners
             * @returns {number}
             */
            register(observable) {
                const id = ++$nextObserverId;
                $observables.set(id, new WeakRef(observable));
                return id;
            },
            unregister(id) {
                $observables.delete(id);
            },
            getObservableById(id) {
                return $observables.get(id)?.deref();
            },
            cleanup() {
                for (const [_, weakObservableRef] of $observables) {
                    const observable = weakObservableRef.deref();
                    if (observable) {
                        observable.cleanup();
                    }
                }
                $observables.clear();
            },
            /**
             * Clean observables that are not referenced anymore.
             * @param {number} threshold
             */
            cleanObservables(threshold) {
                if($observables.size < threshold) return;
                let cleanedCount = 0;
                for (const [id, weakObservableRef] of $observables) {
                    if (!weakObservableRef.deref()) {
                        $observables.delete(id);
                        cleanedCount++;
                    }
                }
                if (cleanedCount > 0) {
                    DebugManager$1.log('Memory Auto Clean', `🧹 Cleaned ${cleanedCount} orphaned observables`);
                }
            }
        };
    }());

    class NativeDocumentError extends Error {
        constructor(message, context = {}) {
            super(message);
            this.name = 'NativeDocumentError';
            this.context = context;
            this.timestamp = new Date().toISOString();
        }
    }

    /**
     *
     * @param {ObservableItem} $observable
     * @param {Function} $checker
     * @class ObservableChecker
     */
    function ObservableChecker($observable, $checker) {
        this.observable = $observable;
        this.checker = $checker;
        this.unSubscriptions = [];
    }

    ObservableChecker.prototype.__$isObservableChecker = true;

    /**
     * Subscribes to changes in the checked/transformed value.
     *
     * @param {Function} callback - Function called with the transformed value when observable changes
     * @returns {Function} Unsubscribe function
     * @example
     * const count = Observable(5);
     * const doubled = count.check(n => n * 2);
     * doubled.subscribe(value => console.log(value)); // Logs: 10
     */
    ObservableChecker.prototype.subscribe = function(callback) {
        const unSubscribe = this.observable.subscribe((value) => {
            callback && callback(this.checker(value));
        });
        this.unSubscriptions.push(unSubscribe);
        return unSubscribe;
    };

    /**
     * Creates a new ObservableChecker by applying another transformation.
     * Allows chaining transformations.
     *
     * @param {(value: *) => *} callback - Transformation function to apply to the current checked value
     * @returns {ObservableChecker} New ObservableChecker with chained transformation
     * @example
     * const count = Observable(5);
     * const result = count.check(n => n * 2).check(n => n + 1);
     * result.val(); // 11
     */
    ObservableChecker.prototype.check = function(callback) {
        return this.observable.check(() => callback(this.val()));
    };

    /**
     * Gets the current transformed/checked value.
     *
     * @returns {*} The result of applying the checker function to the observable's current value
     * @example
     * const count = Observable(5);
     * const doubled = count.check(n => n * 2);
     * doubled.val(); // 10
     */
    ObservableChecker.prototype.val = function() {
        return this.checker && this.checker(this.observable.val());
    };

    /**
     * Sets the value of the underlying observable (not the transformed value).
     *
     * @param {*} value - New value for the underlying observable
     * @example
     * const count = Observable(5);
     * const doubled = count.check(n => n * 2);
     * doubled.set(10); // Sets count to 10, doubled.val() returns 20
     */
    ObservableChecker.prototype.set = function(value) {
        return this.observable.set(value);
    };

    /**
     * Manually triggers the underlying observable to notify subscribers.
     *
     * @example
     * const count = Observable(5);
     * const doubled = count.check(n => n * 2);
     * doubled.trigger(); // Notifies all subscribers
     */
    ObservableChecker.prototype.trigger = function() {
        return this.observable.trigger();
    };

    /**
     * Cleans up the underlying observable and all its subscriptions.
     */
    ObservableChecker.prototype.cleanup = function() {
        return this.observable.cleanup();
    };

    let PluginsManager = null;

    {
        PluginsManager = (function() {

            const $plugins = new Map();
            const $pluginByEvents = new Map();

            return {
                list() {
                    return $pluginByEvents;
                },
                add(plugin, name){
                    if (!plugin || typeof plugin !== 'object') {
                        throw new Error(`Plugin ${name} must be an object`);
                    }
                    name = name || plugin.name;
                    if (!name || typeof name !== 'string') {
                        throw new Error(`Please, provide a valid plugin name`);
                    }
                    if($plugins.has(name)) {
                        return;
                    }

                    plugin.$name = name;
                    $plugins.set(name ,plugin);
                    if(typeof plugin?.init === 'function') {
                        plugin.init();
                    }
                    for(const methodName in plugin) {
                        if(/^on[A-Z]/.test(methodName)) {
                            const eventName = methodName.replace(/^on/, '');
                            if(!$pluginByEvents.has(eventName)) {
                                $pluginByEvents.set(eventName, new Set());
                            }
                            $pluginByEvents.get(eventName).add(plugin);
                        }
                    }
                },
                remove(pluginName){
                    if(!$plugins.has(pluginName)) {
                        return;
                    }
                    const plugin = $plugins.get(pluginName);
                    if(typeof plugin.cleanup === 'function') {
                        plugin.cleanup();
                    }
                    for(const [name, sets] of $pluginByEvents.entries() ) {
                        if(sets.has(plugin)) {
                            sets.delete(plugin);
                        }
                        if(sets.size === 0) {
                            $pluginByEvents.delete(name);
                        }
                    }
                    $plugins.delete(pluginName);
                },
                emit(eventName, ...data) {
                    if(!$pluginByEvents.has(eventName)) {
                        return;
                    }
                    const plugins = $pluginByEvents.get(eventName);

                    for(const plugin of plugins) {
                        const callback = plugin['on'+eventName];
                        if(typeof callback === 'function') {
                            try{
                                callback.call(plugin, ...data);
                            } catch (error) {
                                DebugManager$1.error('Plugin Manager', `Error in plugin ${plugin.$name} for event ${eventName}`, error);
                            }
                        }
                    }
                }
            };
        }());
    }

    var PluginsManager$1 = PluginsManager;

    /**
     * Creates an ObservableWhen that tracks whether an observable equals a specific value.
     *
     * @param {ObservableItem} observer - The observable to watch
     * @param {*} value - The value to compare against
     * @class ObservableWhen
     */
    const ObservableWhen = function(observer, value) {
        this.$target = value;
        this.$observer = observer;
    };

    ObservableWhen.prototype.__$isObservableWhen = true;

    /**
     * Subscribes to changes in the match status (true when observable equals target value).
     *
     * @param {Function} callback - Function called with boolean indicating if values match
     * @returns {Function} Unsubscribe function
     * @example
     * const status = Observable('idle');
     * const isLoading = status.when('loading');
     * isLoading.subscribe(active => console.log('Loading:', active));
     */
    ObservableWhen.prototype.subscribe = function(callback) {
        return this.$observer.on(this.$target, callback);
    };

    /**
     * Returns true if the observable's current value equals the target value.
     *
     * @returns {boolean} True if observable value matches target value
     */
    ObservableWhen.prototype.val = function() {
        return this.$observer.$currentValue === this.$target;
    };

    /**
     * Returns true if the observable's current value equals the target value.
     * Alias for val().
     *
     * @returns {boolean} True if observable value matches target value
     */
    ObservableWhen.prototype.isMatch = ObservableWhen.prototype.val;

    /**
     * Returns true if the observable's current value equals the target value.
     * Alias for val().
     *
     * @returns {boolean} True if observable value matches target value
     */
    ObservableWhen.prototype.isActive = ObservableWhen.prototype.val;

    const nextTick = function(fn) {
        let pending = false;
        return function(...args) {
            if (pending) return;
            pending = true;

            Promise.resolve().then(() => {
                fn.apply(this, args);
                pending = false;
            });
        };
    };

    /**
     *
     * @param {*} item
     * @param {string|null} defaultKey
     * @param {?Function} key
     * @returns {*}
     */
    const getKey = (item, defaultKey, key) => {
        if (Validator.isString(key)) {
            const val = Validator.isObservable(item) ? item.val() : item;
            const result = val?.[key];
            return Validator.isObservable(result) ? result.val() : (result ?? defaultKey);
        }

        if (Validator.isFunction(key)) {
            return key(item, defaultKey);
        }

        const val = Validator.isObservable(item) ? item.val() : item;
        return val ?? defaultKey;
    };

    const trim = function(str, char) {
        return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
    };

    const deepClone = (value, onObservableFound) => {
        try {
            if(window.structuredClone !== undefined) {
                return window.structuredClone(value);
            }
        } catch (e){}

        if (value === null || typeof value !== 'object') {
            return value;
        }

        // Dates
        if (value instanceof Date) {
            return new Date(value.getTime());
        }

        // Arrays
        if (Array.isArray(value)) {
            return value.map(item => deepClone(item));
        }

        // Observables - keep the référence
        if (Validator.isObservable(value)) {
            onObservableFound && onObservableFound(value);
            return value;
        }

        // Objects
        const cloned = {};
        for (const key in value) {
            if (Object.hasOwn(value, key)) {
                cloned[key] = deepClone(value[key]);
            }
        }
        return cloned;
    };

    /**
     *
     * @param {*} value
     * @param {{ propagation: boolean, reset: boolean} | null} configs
     * @class ObservableItem
     */
    function ObservableItem(value, configs = null) {
        value = Validator.isObservable(value) ? value.val() : value;

        this.$previousValue = null;
        this.$currentValue = value;
        {
            this.$isCleanedUp = false;
        }

        this.$firstListener = null;
        this.$listeners = null;
        this.$watchers = null;

        this.$memoryId = null;

        if(configs) {
            this.configs = configs;
            if(configs.reset) {
                this.$initialValue = Validator.isObject(value) ? deepClone(value) : value;
            }
        }
        {
            PluginsManager$1.emit('CreateObservable', this);
        }
    }

    Object.defineProperty(ObservableItem.prototype, '$value', {
        get() {
            return this.$currentValue;
        },
        set(value) {
            this.set(value);
        },
        configurable: true,
    });

    ObservableItem.prototype.__$isObservable = true;
    const noneTrigger = function() {};

    /**
     * Intercepts and transforms values before they are set on the observable.
     * The interceptor can modify the value or return undefined to use the original value.
     *
     * @param {(value) => any} callback - Interceptor function that receives (newValue, currentValue) and returns the transformed value or undefined
     * @returns {ObservableItem} The observable instance for chaining
     * @example
     * const count = Observable(0);
     * count.intercept((newVal, oldVal) => Math.max(0, newVal)); // Prevent negative values
     */
    ObservableItem.prototype.intercept = function(callback) {
        this.$interceptor = callback;
        this.set = this.$setWithInterceptor;
        return this;
    };

    ObservableItem.prototype.triggerFirstListener = function(operations) {
        this.$firstListener(this.$currentValue, this.$previousValue, operations);
    };

    ObservableItem.prototype.triggerListeners = function(operations) {
        const $listeners = this.$listeners;
        const $previousValue = this.$previousValue;
        const $currentValue = this.$currentValue;

        for(let i = 0, length = $listeners.length; i < length; i++) {
            $listeners[i]($currentValue, $previousValue, operations);
        }
    };

    ObservableItem.prototype.triggerWatchers = function(operations) {
        const $watchers = this.$watchers;
        const $previousValue = this.$previousValue;
        const $currentValue = this.$currentValue;

        const $currentValueCallbacks = $watchers.get($currentValue);
        const $previousValueCallbacks = $watchers.get($previousValue);
        if($currentValueCallbacks) {
            $currentValueCallbacks(true, $previousValue, operations);
        }
        if($previousValueCallbacks) {
            $previousValueCallbacks(false, $currentValue, operations);
        }
    };

    ObservableItem.prototype.triggerAll = function(operations) {
        this.triggerWatchers(operations);
        this.triggerListeners(operations);
    };

    ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
        this.triggerWatchers(operations);
        this.triggerFirstListener(operations);
    };

    ObservableItem.prototype.assocTrigger = function() {
        this.$firstListener = null;
        if(this.$watchers?.size && this.$listeners?.length) {
            this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
            return;
        }
        if(this.$listeners?.length) {
            if(this.$listeners.length === 1) {
                this.$firstListener = this.$listeners[0];
                this.trigger = this.triggerFirstListener;
            }
            else {
                this.trigger = this.triggerListeners;
            }
            return;
        }
        if(this.$watchers?.size) {
            this.trigger = this.triggerWatchers;
            return;
        }
        this.trigger = noneTrigger;
    };
    ObservableItem.prototype.trigger = noneTrigger;

    ObservableItem.prototype.$updateWithNewValue = function(newValue) {
        newValue = newValue?.__$isObservable ? newValue.val() : newValue;
        if(this.$currentValue === newValue) {
            return;
        }
        this.$previousValue = this.$currentValue;
        this.$currentValue = newValue;
        {
            PluginsManager$1.emit('ObservableBeforeChange', this);
        }
        this.trigger();
        this.$previousValue = null;
        {
            PluginsManager$1.emit('ObservableAfterChange', this);
        }
    };

    /**
     * @param {*} data
     */
    ObservableItem.prototype.$setWithInterceptor = function(data) {
        let newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
        const result = this.$interceptor(newValue, this.$currentValue);

        if (result !== undefined) {
            newValue = result;
        }

        this.$updateWithNewValue(newValue);
    };

    /**
     * @param {*} data
     */
    ObservableItem.prototype.$basicSet = function(data) {
        let newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
        this.$updateWithNewValue(newValue);
    };

    ObservableItem.prototype.set = ObservableItem.prototype.$basicSet;

    ObservableItem.prototype.val = function() {
        return this.$currentValue;
    };

    ObservableItem.prototype.disconnectAll = function() {
        this.$listeners?.splice(0);
        this.$previousValue = null;
        this.$currentValue = null;
        if(this.$watchers) {
            for (const [_, watchValueList] of this.$watchers) {
                if(Validator.isArray(watchValueList)) {
                    watchValueList.splice(0);
                }
            }
        }
        this.$watchers?.clear();
        this.$listeners = null;
        this.$watchers = null;
        this.trigger = noneTrigger;
    };

    /**
     * Registers a cleanup callback that will be executed when the observable is cleaned up.
     * Useful for disposing resources, removing event listeners, or other cleanup tasks.
     *
     * @param {Function} callback - Cleanup function to execute on observable disposal
     * @example
     * const obs = Observable(0);
     * obs.onCleanup(() => console.log('Cleaned up!'));
     * obs.cleanup(); // Logs: "Cleaned up!"
     */
    ObservableItem.prototype.onCleanup = function(callback) {
        this.$cleanupListeners = this.$cleanupListeners ?? [];
        this.$cleanupListeners.push(callback);
    };

    ObservableItem.prototype.cleanup = function() {
        if (this.$cleanupListeners) {
            for (let i = 0; i < this.$cleanupListeners.length; i++) {
                this.$cleanupListeners[i]();
            }
            this.$cleanupListeners = null;
        }
        MemoryManager.unregister(this.$memoryId);
        this.disconnectAll();
        {
            this.$isCleanedUp = true;
        }
        delete this.$value;
    };

    /**
     *
     * @param {Function} callback
     * @returns {(function(): void)}
     */
    ObservableItem.prototype.subscribe = function(callback) {
        {
            if (this.$isCleanedUp) {
                DebugManager$1.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
                return;
            }
            if (typeof callback !== 'function') {
                throw new NativeDocumentError('Callback must be a function');
            }
        }
        this.$listeners = this.$listeners ?? [];

        this.$listeners.push(callback);
        this.assocTrigger();
        {
            PluginsManager$1.emit('ObservableSubscribe', this);
        }
    };

    /**
     * Watches for a specific value and executes callback when the observable equals that value.
     * Creates a watcher that only triggers when the observable changes to the specified value.
     *
     * @param {*} value - The value to watch for
     * @param {(value) => void|ObservableItem} callback - Callback function or observable to set when value matches
     * @example
     * const status = Observable('idle');
     * status.on('loading', () => console.log('Started loading'));
     * status.on('error', isError); // Set another observable
     */
    ObservableItem.prototype.on = function(value, callback) {
        this.$watchers = this.$watchers ?? new Map();

        let watchValueList = this.$watchers.get(value);

        if(callback.__$isObservable) {
            callback = callback.set.bind(callback);
        }

        if(!watchValueList) {
            watchValueList = callback;
            this.$watchers.set(value, callback);
        } else if(!Validator.isArray(watchValueList.list)) {
            watchValueList = [watchValueList, callback];
            callback = (value) => {
                for(let i = 0, length = watchValueList.length; i < length; i++) {
                    watchValueList[i](value);
                }
            };
            callback.list = watchValueList;
            this.$watchers.set(value, callback);
        } else {
            watchValueList.list.push(callback);
        }

        this.assocTrigger();
    };

    /**
     * Removes a watcher for a specific value. If no callback is provided, removes all watchers for that value.
     *
     * @param {*} value - The value to stop watching
     * @param {Function} [callback] - Specific callback to remove. If omitted, removes all watchers for this value
     * @example
     * const status = Observable('idle');
     * const handler = () => console.log('Loading');
     * status.on('loading', handler);
     * status.off('loading', handler); // Remove specific handler
     * status.off('loading'); // Remove all handlers for 'loading'
     */
    ObservableItem.prototype.off = function(value, callback) {
        if(!this.$watchers) return;

        const watchValueList = this.$watchers.get(value);
        if(!watchValueList) return;

        if(!callback || !Array.isArray(watchValueList.list)) {
            this.$watchers?.delete(value);
            this.assocTrigger();
            return;
        }
        const index = watchValueList.indexOf(callback);
        watchValueList?.splice(index, 1);
        if(watchValueList.length === 1) {
            this.$watchers.set(value, watchValueList[0]);
        }
        else if(watchValueList.length === 0) {
            this.$watchers?.delete(value);
        }
        this.assocTrigger();
    };

    /**
     * Subscribes to the observable but automatically unsubscribes after the first time the predicate matches.
     *
     * @param {(value) => Boolean|any} predicate - Value to match or function that returns true when condition is met
     * @param {(value) => void} callback - Callback to execute when predicate matches, receives the matched value
     * @example
     * const status = Observable('loading');
     * status.once('ready', (val) => console.log('Ready!'));
     * status.once(val => val === 'error', (val) => console.log('Error occurred'));
     */
    ObservableItem.prototype.once = function(predicate, callback) {
        const fn = typeof predicate === 'function' ? predicate : (v) => v === predicate;

        const handler = (val) => {
            if (fn(val)) {
                this.unsubscribe(handler);
                callback(val);
            }
        };
        this.subscribe(handler);
    };

    /**
     * Unsubscribe from an observable.
     * @param {Function} callback
     */
    ObservableItem.prototype.unsubscribe = function(callback) {
        if(!this.$listeners) return;
        const index = this.$listeners.indexOf(callback);
        if (index > -1) {
            this.$listeners.splice(index, 1);
        }
        this.assocTrigger();
        {
            PluginsManager$1.emit('ObservableUnsubscribe', this);
        }
    };

    /**
     * Create an Observable checker instance
     * @param callback
     * @returns {ObservableChecker}
     */
    ObservableItem.prototype.check = function(callback) {
        return new ObservableChecker(this, callback)
    };

    ObservableItem.prototype.transform = ObservableItem.prototype.check;
    ObservableItem.prototype.pluck = ObservableItem.prototype.check;
    ObservableItem.prototype.is = ObservableItem.prototype.check;
    ObservableItem.prototype.select = ObservableItem.prototype.check;

    /**
     * Gets a property value from the observable's current value.
     * If the property is an observable, returns its value.
     *
     * @param {string|number} key - Property key to retrieve
     * @returns {*} The value of the property, unwrapped if it's an observable
     * @example
     * const user = Observable({ name: 'John', age: Observable(25) });
     * user.get('name'); // 'John'
     * user.get('age'); // 25 (unwrapped from observable)
     */
    ObservableItem.prototype.get = function(key) {
        const item = this.$currentValue[key];
        return Validator.isObservable(item) ? item.val() : item;
    };

    /**
     * Creates an ObservableWhen that represents whether the observable equals a specific value.
     * Returns an object that can be subscribed to and will emit true/false.
     *
     * @param {*} value - The value to compare against
     * @returns {ObservableWhen} An ObservableWhen instance that tracks when the observable equals the value
     * @example
     * const status = Observable('idle');
     * const isLoading = status.when('loading');
     * isLoading.subscribe(active => console.log('Loading:', active));
     * status.set('loading'); // Logs: "Loading: true"
     */
    ObservableItem.prototype.when = function(value) {
        return new ObservableWhen(this, value);
    };

    /**
     * Compares the observable's current value with another value or observable.
     *
     * @param {*|ObservableItem} other - Value or observable to compare against
     * @returns {boolean} True if values are equal
     * @example
     * const a = Observable(5);
     * const b = Observable(5);
     * a.equals(5);  // true
     * a.equals(b);  // true
     * a.equals(10); // false
     */
    ObservableItem.prototype.equals = function(other) {
        if(Validator.isObservable(other)) {
            return this.$currentValue === other.$currentValue;
        }
        return this.$currentValue === other;
    };

    /**
     * Converts the observable's current value to a boolean.
     *
     * @returns {boolean} The boolean representation of the current value
     * @example
     * const count = Observable(0);
     * count.toBool(); // false
     * count.set(5);
     * count.toBool(); // true
     */
    ObservableItem.prototype.toBool = function() {
        return !!this.$currentValue;
    };

    /**
     * Toggles the boolean value of the observable (false becomes true, true becomes false).
     *
     * @example
     * const isOpen = Observable(false);
     * isOpen.toggle(); // Now true
     * isOpen.toggle(); // Now false
     */
    ObservableItem.prototype.toggle = function() {
        this.set(!this.$currentValue);
    };

    /**
     * Resets the observable to its initial value.
     * Only works if the observable was created with { reset: true } config.
     *
     * @example
     * const count = Observable(0, { reset: true });
     * count.set(10);
     * count.reset(); // Back to 0
     */
    ObservableItem.prototype.reset = function() {
        if(!this.configs?.reset) {
            return;
        }
        const resetValue = (Validator.isObject(this.$initialValue))
            ? deepClone(this.$initialValue, (observable) => {
                observable.reset();
            })
            : this.$initialValue;
        this.set(resetValue);
    };

    /**
     * Returns a string representation of the observable's current value.
     *
     * @returns {string} String representation of the current value
     */
    ObservableItem.prototype.toString = function() {
        return String(this.$currentValue);
    };

    /**
     * Returns the primitive value of the observable (its current value).
     * Called automatically in type coercion contexts.
     *
     * @returns {*} The current value of the observable
     */
    ObservableItem.prototype.valueOf = function() {
        return this.$currentValue;
    };

    const DocumentObserver = {
        mounted: new WeakMap(),
        beforeUnmount: new WeakMap(),
        mountedSupposedSize: 0,
        unmounted: new WeakMap(),
        unmountedSupposedSize: 0,
        observer: null,

        executeMountedCallback(node) {
            const data = DocumentObserver.mounted.get(node);
            if(!data) {
                return;
            }
            data.inDom = true;
            if(!data.mounted) {
                return;
            }
            if(Array.isArray(data.mounted)) {
                for(const cb of data.mounted) {
                    cb(node);
                }
                return;
            }
            data.mounted(node);
        },

        executeUnmountedCallback(node) {
            const data = DocumentObserver.unmounted.get(node);
            if(!data) {
                return;
            }
            data.inDom = false;
            if(!data.unmounted) {
                return;
            }

            let shouldRemove = false;
            if(Array.isArray(data.unmounted)) {
                for(const cb of data.unmounted) {
                    if(cb(node) === true) {
                        shouldRemove = true;
                    }
                }
            } else {
                shouldRemove = data.unmounted(node) === true;
            }

            if(shouldRemove) {
                data.disconnect();
                node.nd?.remove();
            }
        },

        checkMutation: function(mutationsList) {
            for(const mutation of mutationsList) {
                if(DocumentObserver.mountedSupposedSize > 0) {
                    for(const node of mutation.addedNodes) {
                        DocumentObserver.executeMountedCallback(node);
                        if(!node.querySelectorAll) {
                            continue;
                        }
                        const children = node.querySelectorAll('[data--nd-mounted]');
                        for(const child of children) {
                            DocumentObserver.executeMountedCallback(child);
                        }
                    }
                }

                if (DocumentObserver.unmountedSupposedSize > 0) {
                    for (const node of mutation.removedNodes) {
                        DocumentObserver.executeUnmountedCallback(node);
                        if(!node.querySelectorAll) {
                            continue;
                        }
                        const children = node.querySelectorAll('[data--nd-unmounted]');
                        for(const child of children) {
                            DocumentObserver.executeUnmountedCallback(child);
                        }
                    }
                }
            }
        },

        /**
         * @param {HTMLElement} element
         * @param {boolean} inDom
         * @returns {{ disconnect: Function, mounted: Function, unmounted: Function, off: Function }}
         */
        watch: function(element, inDom = false) {
            let mountedRegistered   = false;
            let unmountedRegistered = false;

            let data = {
                inDom,
                mounted: null,
                unmounted: null,
                disconnect: () => {
                    if (mountedRegistered) {
                        DocumentObserver.mounted.delete(element);
                        DocumentObserver.mountedSupposedSize--;
                    }
                    if (unmountedRegistered) {
                        DocumentObserver.unmounted.delete(element);
                        DocumentObserver.unmountedSupposedSize--;
                    }
                    data = null;
                }
            };

            const addListener = (type, callback) => {
                if (!data[type]) {
                    data[type] = callback;
                    return;
                }
                if (!Array.isArray(data[type])) {
                    data[type] = [data[type], callback];
                    return;
                }
                data[type].push(callback);
            };

            const removeListener = (type, callback) => {
                if(!data?.[type]) {
                    return;
                }
                if(Array.isArray(data[type])) {
                    const index = data[type].indexOf(callback);
                    if(index > -1) {
                        data[type].splice(index, 1);
                    }
                    if(data[type].length === 1) {
                        data[type] = data[type][0];
                    }
                    if(data[type].length === 0) {
                        data[type] = null;
                    }
                    return;
                }
                data[type] = null;
            };

            return {
                disconnect: () => data?.disconnect(),

                mounted: (callback) => {
                    addListener('mounted', callback);
                    DocumentObserver.mounted.set(element, data);
                    if (!mountedRegistered) {
                        DocumentObserver.mountedSupposedSize++;
                        mountedRegistered = true;
                    }
                },

                unmounted: (callback) => {
                    addListener('unmounted', callback);
                    DocumentObserver.unmounted.set(element, data);
                    if (!unmountedRegistered) {
                        DocumentObserver.unmountedSupposedSize++;
                        unmountedRegistered = true;
                    }
                },

                off: (type, callback) => {
                    removeListener(type, callback);
                }
            };
        }
    };

    DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
    DocumentObserver.observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    function NDElement(element) {
        this.$element = element;
        this.$observer = null;
        {
            PluginsManager$1.emit('NDElementCreated', element, this);
        }
    }

    NDElement.prototype.__$isNDElement = true;

    NDElement.prototype.valueOf = function() {
        return this.$element;
    };

    NDElement.prototype.ref = function(target, name) {
        target[name] = this.$element;
        return this;
    };

    NDElement.prototype.refSelf = function(target, name) {
        target[name] = this;
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

        if(states.mounted) {
            this.$element.setAttribute('data--nd-mounted', '1');
            this.$observer.mounted(states.mounted);
        }
        if(states.unmounted) {
            this.$element.setAttribute('data--nd-unmounted', '1');
            this.$observer.unmounted(states.unmounted);
        }
        return this;
    };

    NDElement.prototype.mounted = function(callback) {
        return this.lifecycle({ mounted: callback });
    };

    NDElement.prototype.unmounted = function(callback) {
        return this.lifecycle({ unmounted: callback });
    };

    NDElement.prototype.beforeUnmount = function(id, callback) {
        const el = this.$element;

        if(!DocumentObserver.beforeUnmount.has(el)) {
            DocumentObserver.beforeUnmount.set(el, new Map());
            const originalRemove = el.remove.bind(el);

            let  $isUnmounting = false;

            el.remove = async () => {
                if($isUnmounting) {
                    return;
                }
                $isUnmounting = true;

                try {
                    const callbacks = DocumentObserver.beforeUnmount.get(el);
                    for (const cb of callbacks.values()) {
                        await cb.call(this, el);
                    }
                } finally {
                    originalRemove();
                    $isUnmounting = false;
                }
            };
        }

        DocumentObserver.beforeUnmount.get(el).set(id, callback);
        return this;
    };

    NDElement.prototype.htmlElement = function() {
        return this.$element;
    };

    NDElement.prototype.node = NDElement.prototype.htmlElement;

    NDElement.prototype.shadow = function(mode, style = null) {
        const $element = this.$element;
        const children = Array.from($element.childNodes);
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

    /**
     * Attaches a template binding to the element by hydrating it with the specified method.
     *
     * @param {string} methodName - Name of the hydration method to call
     * @param {BindingHydrator} bindingHydrator - Template binding with $hydrate method
     * @returns {HTMLElement} The underlying HTML element
     * @example
     * const onClick = $binder.attach((event, data) => console.log(data));
     * element.nd.attach('onClick', onClick);
     */
    NDElement.prototype.attach = function(methodName, bindingHydrator) {
        bindingHydrator.$hydrate(this.$element, methodName);
        return this.$element;
    };

    /**
     * Extends the current NDElement instance with custom methods.
     * Methods are bound to the instance and available for chaining.
     *
     * @param {Object} methods - Object containing method definitions
     * @returns {this} The NDElement instance with added methods for chaining
     * @example
     * element.nd.with({
     *   highlight() {
     *     this.$element.style.background = 'yellow';
     *     return this;
     *   }
     * }).highlight().onClick(() => console.log('Clicked'));
     */
    NDElement.prototype.with = function(methods) {
        if (!methods || typeof methods !== 'object') {
            throw new NativeDocumentError('extend() requires an object of methods');
        }
        {
            if (!this.$localExtensions) {
                this.$localExtensions = new Map();
            }
        }

        for (const name in methods) {
            const method = methods[name];

            if (typeof method !== 'function') {
                console.warn(`⚠️ extends(): "${name}" is not a function, skipping`);
                continue;
            }
            {
                if (this[name] && !this.$localExtensions.has(name)) {
                    DebugManager$1.warn('NDElement.extend', `Method "${name}" already exists and will be overwritten`);
                }
                this.$localExtensions.set(name, method);
            }

            this[name] = method.bind(this);
        }

        return this;
    };

    /**
     * Extends the NDElement prototype with new methods available to all NDElement instances.
     * Use this to add global methods to all NDElements.
     *
     * @param {Object} methods - Object containing method definitions to add to prototype
     * @returns {typeof NDElement} The NDElement constructor
     * @throws {NativeDocumentError} If methods is not an object or contains non-function values
     * @example
     * NDElement.extend({
     *   fadeIn() {
     *     this.$element.style.opacity = '1';
     *     return this;
     *   }
     * });
     * // Now all NDElements have .fadeIn() method
     * Div().nd.fadeIn();
     */
    NDElement.extend = function(methods) {
        if (!methods || typeof methods !== 'object') {
            throw new NativeDocumentError('NDElement.extend() requires an object of methods');
        }

        if (Array.isArray(methods)) {
            throw new NativeDocumentError('NDElement.extend() requires an object, not an array');
        }

        const protectedMethods = new Set([
            'constructor', 'valueOf', '$element', '$observer',
            'ref', 'remove', 'cleanup', 'with', 'extend', 'attach',
            'lifecycle', 'mounted', 'unmounted', 'unmountChildren'
        ]);

        for (const name in methods) {
            if (!Object.hasOwn(methods, name)) {
                continue;
            }

            const method = methods[name];

            if (typeof method !== 'function') {
                DebugManager$1.warn('NDElement.extend', `"${name}" is not a function, skipping`);
                continue;
            }

            if (protectedMethods.has(name)) {
                DebugManager$1.error('NDElement.extend', `Cannot override protected method "${name}"`);
                throw new NativeDocumentError(`Cannot override protected method "${name}"`);
            }

            if (NDElement.prototype[name]) {
                DebugManager$1.warn('NDElement.extend', `Overwriting existing prototype method "${name}"`);
            }

            NDElement.prototype[name] = method;
        }
        {
            PluginsManager$1.emit('NDElementExtended', methods);
        }

        return NDElement;
    };

    function TemplateBinding(hydrate) {
        this.$hydrate = hydrate;
    }

    TemplateBinding.prototype.__$isTemplateBinding = true;

    const COMMON_NODE_TYPES = {
        ELEMENT: 1,
        TEXT: 3,
        COMMENT: 8,
        DOCUMENT_FRAGMENT: 11
    };

    const Validator = {
        isObservable(value) {
            return  value?.__$isObservable;
        },
        isTemplateBinding(value) {
            return  value?.__$isTemplateBinding;
        },
        isObservableWhenResult(value) {
            return value && (value.__$isObservableWhen || (typeof value === 'object' && '$target' in value && '$observer' in value));
        },
        isArrayObservable(value) {
            return  value?.__$isObservableArray;
        },
        isProxy(value) {
            return value?.__isProxy__
        },
        isObservableOrProxy(value) {
            return Validator.isObservable(value) || Validator.isProxy(value);
        },
        isAnchor(value) {
            return value?.__Anchor__
        },
        isObservableChecker(value) {
            return value?.__$isObservableChecker || value instanceof ObservableChecker;
        },
        isArray(value) {
            return Array.isArray(value);
        },
        isString(value) {
            return typeof value === 'string';
        },
        isNumber(value) {
            return typeof value === 'number';
        },
        isBoolean(value) {
            return typeof value === 'boolean';
        },
        isFunction(value) {
            return typeof value === 'function';
        },
        isAsyncFunction(value) {
            return typeof value === 'function' && value.constructor.name === 'AsyncFunction';
        },
        isObject(value) {
            return typeof value === 'object' && value !== null;
        },
        isJson(value) {
            return !(typeof value !== 'object' || value === null || Array.isArray(value) || value.constructor.name !== 'Object')
        },
        isElement(value) {
            return value && (
                value.nodeType === COMMON_NODE_TYPES.ELEMENT ||
                value.nodeType === COMMON_NODE_TYPES.TEXT ||
                value.nodeType === COMMON_NODE_TYPES.DOCUMENT_FRAGMENT ||
                value.nodeType === COMMON_NODE_TYPES.COMMENT
            );
        },
        isFragment(value) {
            return value?.nodeType === COMMON_NODE_TYPES.DOCUMENT_FRAGMENT;
        },
        isStringOrObservable(value) {
            return this.isString(value) || this.isObservable(value);
        },
        isValidChild(child) {
            return child === null ||
                this.isElement(child) ||
                this.isObservable(child) ||
                this.isNDElement(child) ||
                ['string', 'number', 'boolean'].includes(typeof child);
        },
        isNDElement(child) {
            return child?.__$isNDElement || child instanceof NDElement;
        },
        isValidChildren(children) {
            if (!Array.isArray(children)) {
                children = [children];
            }

            const invalid = children.filter(child => !this.isValidChild(child));
            return invalid.length === 0;
        },
        validateChildren(children) {
            if (!Array.isArray(children)) {
                children = [children];
            }

            const invalid = children.filter(child => !this.isValidChild(child));
            if (invalid.length > 0) {
                throw new NativeDocumentError(`Invalid children detected: ${invalid.map(i => typeof i).join(', ')}`);
            }

            return children;
        },
        /**
         * Check if the data contains observables.
         * @param {Array|Object} data
         * @returns {boolean}
         */
        containsObservables(data) {
            if(!data) {
                return false;
            }
            return Validator.isObject(data)
                && Object.values(data).some(value => Validator.isObservable(value));
        },
        /**
         * Check if the data contains an observable reference.
         * @param {string} data
         * @returns {boolean}
         */
        containsObservableReference(data) {
            if(!data || typeof data !== 'string') {
                return false;
            }
            return /\{\{#ObItem::\([0-9]+\)\}\}/.test(data);
        },
        validateAttributes(attributes) {},

        validateEventCallback(callback) {
            if (typeof callback !== 'function') {
                throw new NativeDocumentError('Event callback must be a function');
            }
        }
    };
    {
        Validator.validateAttributes = function(attributes) {
            if (!attributes || typeof attributes !== 'object') {
                return attributes;
            }

            const reserved = [];
            const foundReserved = Object.keys(attributes).filter(key => reserved.includes(key));

            if (foundReserved.length > 0) {
                DebugManager$1.warn('Validator', `Reserved attributes found: ${foundReserved.join(', ')}`);
            }

            return attributes;
        };
    }

    function Anchor(name, isUniqueChild = false) {
        const anchorFragment = document.createDocumentFragment();
        anchorFragment.__Anchor__ = true;

        const anchorStart = document.createComment('Anchor Start : '+name);
        const anchorEnd = document.createComment('/ Anchor End '+name);

        anchorFragment.appendChild(anchorStart);
        anchorFragment.appendChild(anchorEnd);

        anchorFragment.nativeInsertBefore = anchorFragment.insertBefore;
        anchorFragment.nativeAppendChild = anchorFragment.appendChild;
        anchorFragment.nativeAppend = anchorFragment.append;

        const isParentUniqueChild = (parent) => (isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd));

        const insertBefore = function(parent, child, target) {
            const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            if(parent === anchorFragment) {
                parent.nativeInsertBefore(childElement, target);
                return;
            }
            if(isParentUniqueChild(parent) && target === anchorEnd) {
                parent.append(childElement,  target);
                return;
            }
            parent.insertBefore(childElement, target);
        };

        anchorFragment.appendElement = function(child, before = null) {
            const parentNode = anchorStart.parentNode;
            const targetBefore = before || anchorEnd;
            if(parentNode === anchorFragment) {
                parentNode.nativeInsertBefore(child, targetBefore);
                return;
            }
            parentNode?.insertBefore(child, targetBefore);
        };

        anchorFragment.appendChild = function(child, before = null) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                DebugManager$1.error('Anchor', 'Anchor : parent not found', child);
                return;
            }
            before = before ?? anchorEnd;
            insertBefore(parent, child, before);
        };

        anchorFragment.append = function(...args ) {
            return anchorFragment.appendChild(args);
        };

        anchorFragment.removeChildren = async function() {
            const parent = anchorEnd.parentNode;
            if(parent === anchorFragment) {
                return;
            }
            // if(isParentUniqueChild(parent)) {
            //     parent.replaceChildren(anchorStart, anchorEnd);
            //     return;
            // }

            let itemToRemove = anchorStart.nextSibling, tempItem;
            const removes = [];
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                removes.push(itemToRemove.remove());
                itemToRemove =  tempItem;
            }
            await Promise.all(removes);
        };

        anchorFragment.remove = async function() {
            const parent = anchorEnd.parentNode;
            if(parent === anchorFragment) {
                return;
            }
            let itemToRemove = anchorStart.nextSibling, tempItem;
            const allItemToRemove = [];
            const removes = [];
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                allItemToRemove.push(itemToRemove);
                removes.push(itemToRemove.remove());
                itemToRemove = tempItem;
            }
            await Promise.all(removes);
            anchorFragment.nativeAppend(...allItemToRemove);
        };

        anchorFragment.removeWithAnchors = async function() {
            await anchorFragment.removeChildren();
            anchorStart.remove();
            anchorEnd.remove();
        };

        anchorFragment.replaceContent = async function(child) {
            const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            const parent = anchorEnd.parentNode;
            if(!parent) {
                return;
            }
            // if(isParentUniqueChild(parent)) {
            //     parent.replaceChildren(anchorStart, childElement, anchorEnd);
            //     return;
            // }
            await anchorFragment.removeChildren();
            parent.insertBefore(childElement, anchorEnd);
        };

        anchorFragment.setContent = anchorFragment.replaceContent;

        anchorFragment.insertBefore = function(child, anchor = null) {
            anchorFragment.appendChild(child, anchor);
        };


        anchorFragment.endElement = function() {
            return anchorEnd;
        };

        anchorFragment.startElement = function() {
            return anchorStart;
        };
        anchorFragment.restore = function() {
            anchorFragment.appendChild(anchorFragment);
        };
        anchorFragment.clear = anchorFragment.remove;
        anchorFragment.detach = anchorFragment.remove;

        anchorFragment.getByIndex = function(index) {
            let currentNode = anchorStart;
            for(let i = 0; i <= index; i++) {
                if(!currentNode.nextSibling) {
                    return null;
                }
                currentNode = currentNode.nextSibling;
            }
            return currentNode !== anchorStart ? currentNode : null;
        };

        return anchorFragment;
    }
    /**
     *
     * @param {HTMLElement|DocumentFragment|Text|String|Array} children
     * @param {{ parent?: HTMLElement, name?: String}} configs
     * @returns {DocumentFragment}
     */
    function createPortal(children, { parent, name = 'unnamed' } = {}) {
        const anchor = Anchor('Portal '+name);
        anchor.appendChild(ElementCreator.getChild(children));

        (parent || document.body).appendChild(anchor);
        return anchor;
    }

    DocumentFragment.prototype.setAttribute = () => {};

    const BOOLEAN_ATTRIBUTES = new Set([
        'checked',
        'selected',
        'disabled',
        'readonly',
        'required',
        'autofocus',
        'multiple',
        'autocomplete',
        'hidden',
        'contenteditable',
        'spellcheck',
        'translate',
        'draggable',
        'async',
        'defer',
        'autoplay',
        'controls',
        'loop',
        'muted',
        'download',
        'reversed',
        'open',
        'default',
        'formnovalidate',
        'novalidate',
        'scoped',
        'itemscope',
        'allowfullscreen',
        'allowpaymentrequest',
        'playsinline'
    ]);

    /**
     *
     * @param {*} value
     * @param {{ propagation: boolean, reset: boolean} | null} configs
     * @returns {ObservableItem}
     * @constructor
     */
    function Observable(value, configs = null) {
        return new ObservableItem(value, configs);
    }

    const $ = Observable;
    const obs = Observable;

    /**
     *
     * @param {string} propertyName
     */
    Observable.useValueProperty = function(propertyName = 'value') {
        Object.defineProperty(ObservableItem.prototype, propertyName, {
            get() {
                return this.$currentValue;
            },
            set(value) {
                this.set(value);
            },
            configurable: true,
        });
    };


    /**
     *
     * @param id
     * @returns {ObservableItem|null}
     */
    Observable.getById = function(id) {
        const item = MemoryManager.getObservableById(parseInt(id));
        if(!item) {
            throw new NativeDocumentError('Observable.getById : No observable found with id ' + id);
        }
        return item;
    };

    /**
     *
     * @param {ObservableItem} observable
     */
    Observable.cleanup = function(observable) {
        observable.cleanup();
    };

    /**
     * Enable auto cleanup of observables.
     * @param {Boolean} enable
     * @param {{interval:Boolean, threshold:number}} options
     */
    Observable.autoCleanup = function(enable = false, options = {}) {
        if(!enable) {
            return;
        }
        const { interval = 60000, threshold = 100 } = options;

        window.addEventListener('beforeunload', () => {
            MemoryManager.cleanup();
        });

        setInterval(() => MemoryManager.cleanObservables(threshold), interval);
    };

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} data
     */
    function bindClassAttribute(element, data) {
        for(const className in data) {
            const value = data[className];
            if(value.__$isObservable) {
                element.classes.toggle(className, value.val());
                value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
                continue;
            }
            if(value.__$isObservableWhen) {
                element.classes.toggle(className, value.isActive());
                value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
                continue;
            }
            if(value.$hydrate) {
                value.$hydrate(element, className);
                continue;
            }
            element.classes.toggle(className, value);
        }
        data = null;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} data
     */
    function bindStyleAttribute(element, data) {
        for(const styleName in data) {
            const value = data[styleName];
            if(value.__$isObservable) {
                element.style[styleName] = value.val();
                value.subscribe((newValue) => element.style[styleName] = newValue);
                continue;
            }
            element.style[styleName] = value;
        }
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @param {boolean|number|Observable} value
     */
    function bindBooleanAttribute(element, attributeName, value) {
        const isObservable = value.__$isObservable;
        const defaultValue = isObservable? value.val() : value;
        if(Validator.isBoolean(defaultValue)) {
            element[attributeName] = defaultValue;
        }
        else {
            element[attributeName] = defaultValue === element.value;
        }
        if(isObservable) {
            if(attributeName === 'checked') {
                if(typeof defaultValue === 'boolean') {
                    element.addEventListener('input', () => value.set(element[attributeName]));
                }
                else {
                    element.addEventListener('input', () => value.set(element.value));
                }
                value.subscribe((newValue) => element[attributeName] = newValue);
                return;
            }
            value.subscribe((newValue) => element[attributeName] = (newValue === element.value));
        }
    }


    /**
     *
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @param {Observable} value
     */
    function bindAttributeWithObservable(element, attributeName, value) {
        const applyValue = attributeName === 'value' ? (newValue) => element.value = newValue : (newValue) => element.setAttribute(attributeName, newValue);
        value.subscribe(applyValue);

        if(attributeName === 'value') {
            element.value = value.val();
            element.addEventListener('input', () => value.set(element.value));
            return;
        }
        element.setAttribute(attributeName, value.val());
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    function AttributesWrapper(element, attributes) {

        Validator.validateAttributes(attributes);

        for(const originalAttributeName in attributes) {
            const attributeName = originalAttributeName.toLowerCase();
            let value = attributes[originalAttributeName];
            if(value == null) {
                continue;
            }
            if(value.handleNdAttribute) {
                value.handleNdAttribute(element, attributeName, value);
                continue;
            }
            if(typeof value ===  'object') {
                if(attributeName === 'class') {
                    bindClassAttribute(element, value);
                    continue;
                }
                if(attributeName === 'style') {
                    bindStyleAttribute(element, value);
                    continue;
                }
            }
            if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
                bindBooleanAttribute(element, attributeName, value);
                continue;
            }

            element.setAttribute(attributeName, value);
        }
        return element;
    }

    String.prototype.toNdElement = function () {
        const formattedChild = this.resolveObservableTemplate ? this.resolveObservableTemplate() : this;
        if(Validator.isString(formattedChild)) {
            return ElementCreator.createStaticTextNode(null, formattedChild);
        }
        return ElementCreator.getChild(null, formattedChild);
    };

    Element.prototype.toNdElement = function () {
        return this;
    };
    Text.prototype.toNdElement = function () {
        return this;
    };
    Comment.prototype.toNdElement = function () {
        return this;
    };
    Document.prototype.toNdElement = function () {
        return this;
    };
    DocumentFragment.prototype.toNdElement = function () {
        return this;
    };

    ObservableItem.prototype.toNdElement = function () {
        return ElementCreator.createObservableNode(null, this);
    };

    ObservableChecker.prototype.toNdElement = ObservableItem.prototype.toNdElement;

    NDElement.prototype.toNdElement = function () {
        return this.$element ?? this.$build?.() ?? this.build?.() ?? null;
    };

    Array.prototype.toNdElement = function () {
        const fragment = document.createDocumentFragment();
        for(let i = 0, length = this.length; i < length; i++) {
            const child = ElementCreator.getChild(this[i]);
            if(child === null) continue;
            fragment.appendChild(child);
        }
        return fragment;
    };

    Function.prototype.toNdElement = function () {
        const child = this;
        {
            PluginsManager$1.emit('BeforeProcessComponent', child);
        }
        return ElementCreator.getChild(child());
    };

    TemplateBinding.prototype.toNdElement = function () {
        return ElementCreator.createHydratableNode(null, this);
    };

    /**
     * @param {HTMLElement} el
     * @param {number} timeout
     */
    const waitForVisualEnd = (el, timeout = 1000) => {
        return new Promise((resolve) => {
            let isResolved = false;

            const cleanupAndResolve = (e) => {
                if (e && e.target !== el) return;
                if (isResolved) return;

                isResolved = true;
                el.removeEventListener('transitionend', cleanupAndResolve);
                el.removeEventListener('animationend', cleanupAndResolve);
                clearTimeout(timer);
                resolve();
            };

            el.addEventListener('transitionend', cleanupAndResolve);
            el.addEventListener('animationend', cleanupAndResolve);

            const timer = setTimeout(cleanupAndResolve, timeout);

            const style = window.getComputedStyle(el);
            const hasTransition = style.transitionDuration !== '0s';
            const hasAnimation = style.animationDuration !== '0s';

            if (!hasTransition && !hasAnimation) {
                cleanupAndResolve();
            }
        });
    };

    NDElement.prototype.transitionOut = function(transitionName) {
        const exitClass = transitionName + '-exit';
        this.beforeUnmount('transition-exit', async function() {
            this.$element.classes.add(exitClass);
            await waitForVisualEnd(this.$element);
            this.$element.classes.remove(exitClass);
        });
        return this;
    };

    NDElement.prototype.transitionIn = function(transitionName) {
        const startClass = transitionName + '-enter-from';
        const endClass = transitionName + '-enter-to';

        this.$element.classes.add(startClass);

        this.mounted(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.$element.classes.remove(startClass);
                    this.$element.classes.add(endClass);

                    waitForVisualEnd(this.$element).then(() => {
                        this.$element.classes.remove(endClass);
                    });
                });
            });
        });
        return this;
    };


    NDElement.prototype.transition = function (transitionName) {
        this.transitionIn(transitionName);
        this.transitionOut(transitionName);
        return this;
    };

    NDElement.prototype.animate = function(animationName) {
        this.$element.classes.add(animationName);

        waitForVisualEnd(this.$element).then(() => {
            this.$element.classes.remove(animationName);
        });

        return this;
    };

    String.prototype.handleNdAttribute = function(element, attributeName) {
        element.setAttribute(attributeName, this);
    };

    ObservableItem.prototype.handleNdAttribute = function(element, attributeName) {
        if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
            bindBooleanAttribute(element, attributeName, this);
            return;
        }

        bindAttributeWithObservable(element, attributeName, this);
    };

    TemplateBinding.prototype.handleNdAttribute = function(element, attributeName) {
        this.$hydrate(element, attributeName);
    };

    const $nodeCache = new Map();
    let $textNodeCache = null;

    const ElementCreator = {
        createTextNode() {
            if(!$textNodeCache) {
                $textNodeCache = document.createTextNode('');
            }
            return $textNodeCache.cloneNode();
        },
        /**
         *
         * @param {HTMLElement|DocumentFragment} parent
         * @param {ObservableItem} observable
         * @returns {Text}
         */
        createObservableNode(parent, observable) {
            const text = ElementCreator.createTextNode();
            observable.subscribe(value => text.nodeValue = value);
            text.nodeValue = observable.val();
            parent && parent.appendChild(text);
            return text;
        },
        /**
         *
         * @param {HTMLElement|DocumentFragment} parent
         * @param {{$hydrate: Function}} item
         * @returns {Text}
         */
        createHydratableNode(parent, item) {
            const text = ElementCreator.createTextNode();
            item.$hydrate(text);
            return text;
        },

        /**
         *
         * @param {HTMLElement|DocumentFragment} parent
         * @param {*} value
         * @returns {Text}
         */
        createStaticTextNode(parent, value) {
            let text = ElementCreator.createTextNode();
            text.nodeValue = value;
            parent && parent.appendChild(text);
            return text;
        },
        /**
         *
         * @param {string} name
         * @returns {HTMLElement|DocumentFragment}
         */
        createElement(name)  {
            if(name) {
                const cacheNode = $nodeCache.get(name);
                if(cacheNode) {
                    return cacheNode.cloneNode();
                }
                const node = document.createElement(name);
                $nodeCache.set(name, node);
                return node.cloneNode();
            }
            return Anchor('Fragment');
        },
        bindTextNode(textNode, value) {
            if(value?.__$isObservable) {
                value.subscribe(newValue => textNode.nodeValue = newValue);
                textNode.nodeValue = value.val();
                return;
            }
            textNode.nodeValue = value;
        },
        /**
         *
         * @param {*} children
         * @param {HTMLElement|DocumentFragment} parent
         */
        processChildren(children, parent) {
            if(children === null) return;
            {
                PluginsManager$1.emit('BeforeProcessChildren', parent);
            }
            let child = this.getChild(children);
            if(child) {
                parent.appendChild(child);
            }
            {
                PluginsManager$1.emit('AfterProcessChildren', parent);
            }
        },
        async safeRemove(element) {
            await element.remove();

        },
        getChild(child) {
            if(child == null) {
                return null;
            }
            if(child.toNdElement) {
                do {
                    child =  child.toNdElement();
                    if(Validator.isElement(child)) {
                        return child;
                    }
                } while (child.toNdElement);
            }

            return ElementCreator.createStaticTextNode(null, child);
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {Object} attributes
         */
        processAttributes(element, attributes) {
            if (attributes) {
                AttributesWrapper(element, attributes);
            }
        }
    };

    const EVENTS = [
      "Click",
      "DblClick",
      "MouseDown",
      "MouseEnter",
      "MouseLeave",
      "MouseMove",
      "MouseOut",
      "MouseOver",
      "MouseUp",
      "Wheel",
      "KeyDown",
      "KeyPress",
      "KeyUp",
      "Blur",
      "Change",
      "Focus",
      "Input",
      "Invalid",
      "Reset",
      "Search",
      "Select",
      "Submit",
      "Drag",
      "DragEnd",
      "DragEnter",
      "DragLeave",
      "DragOver",
      "DragStart",
      "Drop",
      "AfterPrint",
      "BeforePrint",
      "BeforeUnload",
      "Error",
      "HashChange",
      "Load",
      "Offline",
      "Online",
      "PageHide",
      "PageShow",
      "Resize",
      "Scroll",
      "Unload",
      "Abort",
      "CanPlay",
      "CanPlayThrough",
      "DurationChange",
      "Emptied",
      "Ended",
      "LoadedData",
      "LoadedMetadata",
      "LoadStart",
      "Pause",
      "Play",
      "Playing",
      "Progress",
      "RateChange",
      "Seeked",
      "Seeking",
      "Stalled",
      "Suspend",
      "TimeUpdate",
      "VolumeChange",
      "Waiting",

      "TouchCancel",
      "TouchEnd",
      "TouchMove",
      "TouchStart",
      "AnimationEnd",
      "AnimationIteration",
      "AnimationStart",
      "TransitionEnd",
      "Copy",
      "Cut",
      "Paste",
      "FocusIn",
      "FocusOut",
      "ContextMenu"
    ];

    const EVENTS_WITH_PREVENT = [
      "Click",
      "DblClick",
      "MouseDown",
      "MouseUp",
      "Wheel",
      "KeyDown",
      "KeyPress",
      "Invalid",
      "Reset",
      "Submit",
      "DragOver",
      "Drop",
      "BeforeUnload",
      "TouchCancel",
      "TouchEnd",
      "TouchMove",
      "TouchStart",
      "Copy",
      "Cut",
      "Paste",
      "ContextMenu"
    ];

    const EVENTS_WITH_STOP =  [
      "Click",
      "DblClick",
      "MouseDown",
      "MouseMove",
      "MouseOut",
      "MouseOver",
      "MouseUp",
      "Wheel",
      "KeyDown",
      "KeyPress",
      "KeyUp",
      "Change",
      "Input",
      "Invalid",
      "Reset",
      "Search",
      "Select",
      "Submit",
      "Drag",
      "DragEnd",
      "DragEnter",
      "DragLeave",
      "DragOver",
      "DragStart",
      "Drop",
      "BeforeUnload",
      "HashChange",
      "TouchCancel",
      "TouchEnd",
      "TouchMove",
      "TouchStart",
      "AnimationEnd",
      "AnimationIteration",
      "AnimationStart",
      "TransitionEnd",
      "Copy",
      "Cut",
      "Paste",
      "FocusIn",
      "FocusOut",
      "ContextMenu"
    ];

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
        NDElement.prototype['on'+eventSourceName] = function(callback = null) {
            this.$element.addEventListener(eventName, callback);
            return this;
        };
    });

    EVENTS_WITH_STOP.forEach(eventSourceName => {
        const eventName = eventSourceName.toLowerCase();
        NDElement.prototype['onStop'+eventSourceName] = function(callback = null) {
            _stop(this.$element, eventName, callback);
            return this;
        };
        NDElement.prototype['onPreventStop'+eventSourceName] = function(callback = null) {
            _preventStop(this.$element, eventName, callback);
            return this;
        };
    });

    EVENTS_WITH_PREVENT.forEach(eventSourceName => {
        const eventName = eventSourceName.toLowerCase();
        NDElement.prototype['onPrevent'+eventSourceName] = function(callback = null) {
            _prevent(this.$element, eventName, callback);
            return this;
        };
    });

    NDElement.prototype.on = function(name, callback, options) {
        this.$element.addEventListener(name.toLowerCase(), callback, options);
        return this;
    };

    const _prevent = function(element, eventName, callback) {
        const handler = (event) => {
            event.preventDefault();
            callback && callback.call(element, event);
        };
        element.addEventListener(eventName, handler);
        return this;
    };

    const _stop = function(element, eventName, callback) {
        const handler = (event) => {
            event.stopPropagation();
            callback && callback.call(element, event);
        };
        element.addEventListener(eventName, handler);
        return this;
    };

    const _preventStop = function(element, eventName, callback) {
        const handler = (event) => {
            event.stopPropagation();
            event.preventDefault();
            callback && callback.call(element, event);
        };
        element.addEventListener(eventName, handler);
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
    };

    Object.defineProperty(HTMLElement.prototype, 'classes', {
        configurable: true,
        get() {
            return {
                $element: this,
                ...classListMethods
            };
        }
    });

    class ArgTypesError extends Error {
        constructor(message, errors) {
            super(`${message}\n\n${errors.join("\n")}\n\n`);
        }
    }

    exports.withValidation = (fn) => fn;
    exports.ArgTypes = {};

    /**
     *
     * @type {{string: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      number: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      boolean: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      observable: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      element: (function(*): {name: *, type: string, validate: function(*): *}),
     *      function: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      object: (function(*): {name: *, type: string, validate: function(*): boolean}),
     *      objectNotNull: (function(*): {name: *, type: string, validate: function(*): *}),
     *      children: (function(*): {name: *, type: string, validate: function(*): *}),
     *      attributes: (function(*): {name: *, type: string, validate: function(*): *}),
     *      optional: (function(*): *&{optional: boolean}),
     *      oneOf: (function(*, ...[*]): {name: *, type: string, types: *[],
     *      validate: function(*): boolean})
     * }}
     */
    {
        exports.ArgTypes = {
            string: (name) => ({ name, type: 'string', validate: (v) => Validator.isString(v) }),
            number: (name) => ({ name, type: 'number', validate: (v) => Validator.isNumber(v) }),
            boolean: (name) => ({ name, type: 'boolean', validate: (v) => Validator.isBoolean(v) }),
            observable: (name) => ({ name, type: 'observable', validate: (v) => Validator.isObservable(v) }),
            element: (name) => ({ name, type: 'element', validate: (v) => Validator.isElement(v) }),
            function: (name) => ({ name, type: 'function', validate: (v) => Validator.isFunction(v) }),
            object: (name) => ({ name, type: 'object', validate: (v) => (Validator.isObject(v)) }),
            objectNotNull: (name) => ({ name, type: 'object', validate: (v) => (Validator.isObject(v) && v !== null) }),
            children: (name) => ({ name, type: 'children', validate: (v) => Validator.validateChildren(v) }),
            attributes: (name) => ({ name, type: 'attributes', validate: (v) => Validator.validateAttributes(v) }),

            // Optional arguments
            optional: (argType) => ({ ...argType, optional: true }),

            // Union types
            oneOf: (name, ...argTypes) => ({
                name,
                type: 'oneOf',
                types: argTypes,
                validate: (v) => argTypes.some(type => type.validate(v))
            })
        };


        /**
         *
         * @param {Array} args
         * @param {Array} argSchema
         * @param {string} fnName
         */
        const validateArgs = (args, argSchema, fnName = 'Function') => {
            if (!argSchema) return;

            const errors = [];

            // Check the number of arguments
            const requiredCount = argSchema.filter(arg => !arg.optional).length;
            if (args.length < requiredCount) {
                errors.push(`${fnName}: Expected at least ${requiredCount} arguments, got ${args.length}`);
            }

            // Validate each argument
            argSchema.forEach((schema, index) => {
                const position = index + 1;
                const value = args[index];

                if (value === undefined) {
                    if (!schema.optional) {
                        errors.push(`${fnName}: Missing required argument '${schema.name}' at position ${position}`);
                    }
                    return;
                }

                if (!schema.validate(value)) {
                    const valueTypeOf = value?.constructor?.name || typeof value;
                    errors.push(`${fnName}: Invalid argument '${schema.name}' at position ${position}, expected ${schema.type}, got ${valueTypeOf}`);
                }
            });

            if (errors.length > 0) {
                throw new ArgTypesError(`Argument validation failed`, errors);
            }
        };



        /**
         * @param {Function} fn
         * @param {Array} argSchema
         * @param {string} fnName
         * @returns {Function}
         */
        exports.withValidation = (fn, argSchema, fnName = 'Function') => {
            if(!Validator.isArray(argSchema)) {
                throw new NativeDocumentError('withValidation : argSchema must be an array');
            }
            return function(...args) {
                validateArgs(args, argSchema, fn.name || fnName);
                return fn.apply(this, args);
            };
        };
    }

    const normalizeComponentArgs = function(props, children = null) {
        if(Array.isArray(props) || typeof props !== 'object' || props === null || props.constructor.name !== 'Object' ||  props.$hydrate) { // IF it's not a JSON
            return { props: children, children: props }
        }
        return { props, children };
    };

    /**
     *
     * @param {*} value
     * @returns {Text}
     */
    const createTextNode = function(value) {
        return (Validator.isObservable(value))
            ? ElementCreator.createObservableNode(null, value)
            : ElementCreator.createStaticTextNode(null, value);
    };


    function createHtmlElement($tagName, customWrapper, _attributes, _children = null) {
        let { props: attributes, children = null } = normalizeComponentArgs(_attributes, _children);
        let element = ElementCreator.createElement($tagName);
        let finalElement = (customWrapper && typeof customWrapper === 'function') ? customWrapper(element) : element;

        ElementCreator.processAttributes(finalElement, attributes);
        ElementCreator.processChildren(children, finalElement);
        return finalElement;
    }

    /**
     *
     * @param {string} name
     * @param {?Function=} customWrapper
     * @returns {Function}
     */
    function HtmlElementWrapper(name, customWrapper = null) {
        return createHtmlElement.bind(null, name, customWrapper);
    }

    const cloneBindingsDataCache = new WeakMap();


    const bindAttributes = (node, bindDingData, data) => {
        let attributes = null;
        if(bindDingData.attributes) {
            attributes = {};
            for (const attr in bindDingData.attributes) {
                attributes[attr] = bindDingData.attributes[attr].apply(null, data);
            }
        }

        if(bindDingData.classes) {
            attributes = attributes || {};
            attributes.class = {};
            for (const className in bindDingData.classes) {
                attributes.class[className] = bindDingData.classes[className].apply(null, data);
            }
        }

        if(bindDingData.styles) {
            attributes = attributes || {};
            attributes.style = {};
            for (const property in bindDingData.styles) {
                attributes.style[property] = bindDingData.styles[property].apply(null, data);
            }
        }

        if(attributes) {
            ElementCreator.processAttributes(node, attributes);
            return true;
        }

        return null;
    };

    const $hydrateFn = function(hydrateFunction, targetType, element, property) {
        if(!cloneBindingsDataCache.has(element)) {
            // { classes, styles, attributes, value, attach }
            cloneBindingsDataCache.set(element, {});
        }
        const hydrationState = cloneBindingsDataCache.get(element);
        if(targetType === 'value') {
            hydrationState.value = hydrateFunction;
            return;
        }
        hydrationState[targetType] = hydrationState[targetType] || {};
        hydrationState[targetType][property] = hydrateFunction;
    };

    const bindAttachMethods = (node, bindDingData, data) => {
        if(!bindDingData.attach) {
            return null;
        }
        for(const methodName in bindDingData.attach) {
            node.nd[methodName](function(...args) {
                bindDingData.attach[methodName].apply(this, [...args, ...data]);
            });
        }
    };


    const applyBindingTreePath = (root, target, data, path) => {
        if(path.fn) {
            if(typeof path.fn === 'string') {
                ElementCreator.bindTextNode(target, data[0][path.fn]);
            }
            else {
                path.fn(data, target, root);
            }
        }
        if(path.children) {
            for(let i = 0, length = path.children.length; i < length; i++) {
                const currentPath = path.children[i];
                const pathTargetNode = target.childNodes[currentPath.index];
                applyBindingTreePath(root, pathTargetNode, data, currentPath);
            }
        }
    };

    function TemplateCloner($fn) {
        let $node = null;
        let $hasBindingData = false;

        const $bindingTreePath = {
            fn: null,
            children: [],
        };

        const clone = (node, data, currentPath) => {
            const bindDingData = cloneBindingsDataCache.get(node);
            if(node.nodeType === 3) {
                if(bindDingData && bindDingData.value) {
                    currentPath.fn = bindDingData.value;
                    const textNode = node.cloneNode();
                    if(typeof bindDingData.value === 'string') {
                        ElementCreator.bindTextNode(textNode, data[0][bindDingData.value]);
                        return textNode;
                    }
                    bindDingData.value(data, textNode);
                    return textNode;
                }
                return node.cloneNode(true);
            }
            const nodeCloned = node.cloneNode();
            if(bindDingData) {
                bindAttributes(nodeCloned, bindDingData, data);
                bindAttachMethods(nodeCloned, bindDingData, data);
                currentPath.fn = (data, targetNode) => {
                    bindAttributes(targetNode, bindDingData, data);
                    bindAttachMethods(targetNode, bindDingData, data);
                };
            }
            const childNodes = node.childNodes;
            const bindingPathChildren = [];
            for(let i = 0, length = childNodes.length; i < length; i++) {
                const childNode = childNodes[i];
                const path = { index: i, fn: null };
                const childNodeCloned = clone(childNode, data, path);
                if(path.children || path.fn) {
                    bindingPathChildren.push(path);
                }
                nodeCloned.appendChild(childNodeCloned);
            }
            if(bindingPathChildren.length) {
                currentPath.children = currentPath.children || [];
                currentPath.children = bindingPathChildren;
            }
            return nodeCloned;
        };

        const cloneWithBindingPaths = (data) => {
            let root = $node.cloneNode(true);

            applyBindingTreePath(root, root, data, $bindingTreePath);
            return root;
        };

        this.clone = (data) => {
            $node = $fn(this);
            if(!$hasBindingData) {
                this.clone = () => $node.cloneNode(true);
                return $node.cloneNode(true);
            }

            const firstClone = clone($node, data, $bindingTreePath);
            this.clone = cloneWithBindingPaths;
            return firstClone;
        };


        const createBinding = (hydrateFunction, targetType) => {
            return new TemplateBinding((element, property) => {
                $hasBindingData = true;
                $hydrateFn(hydrateFunction, targetType, element, property);
            });
        };

        this.style = (fn) => {
            return createBinding(fn, 'styles');
        };
        this.class = (fn) => {
            return createBinding(fn, 'classes');
        };
        this.property = (propertyName) => {
            return this.value(propertyName);
        };
        this.value = (callbackOrProperty) => {
            if(typeof callbackOrProperty !== 'function') {
                return createBinding(callbackOrProperty, 'value');
            }
            return createBinding((data, textNode) => {
                ElementCreator.bindTextNode(textNode, callbackOrProperty(...data));
            }, 'value');
        };
        this.attr = (fn) => {
            return createBinding(fn, 'attributes');
        };
        this.attach = (fn) => {
            return createBinding(fn, 'attach');
        };

    }

    function useCache(fn) {
        let $cache = null;

        const wrapper = function(args) {
            if(!$cache) {
                $cache = new TemplateCloner(fn);
            }
            return $cache.clone(args);
        };

        if(fn.length < 2) {
            return function(...args) {
                return wrapper(args);
            };
        }
        return function(_, __, ...args) {
            return wrapper([_, __, ...args]);
        };
    }

    function SingletonView($viewCreator) {
        let $cacheNode = null;
        let $components = null;

        this.render = (data) => {
            if(!$cacheNode) {
                $cacheNode = $viewCreator(this);
            }
            if(!$components) {
                return $cacheNode;
            }
            for(const index in $components) {
                const updater = $components[index];
                updater(...data);
            }
            return $cacheNode;
        };

        this.createSection = (name, fn) => {
            $components = $components || {};
            const anchor = Anchor('Component '+name);

            $components[name] = function(...args) {
                anchor.removeChildren();
                if(!fn) {
                    anchor.append(args);
                    return;
                }
                anchor.appendChild(fn(...args));
            };
            return anchor;
        };
    }


    function useSingleton(fn) {
        let $cache = null;

        return function(...args) {
            if(!$cache) {
                $cache = new SingletonView(fn);
            }
            return $cache.render(args);
        };
    }

    DocumentFragment.prototype.__IS_FRAGMENT = true;

    Function.prototype.args = function(...args) {
        return exports.withValidation(this, args);
    };

    Function.prototype.cached = function(...args) {
        let $cache;
        let  getCache = () => $cache;
        return () => {
            if(!$cache) {
                $cache = this.apply(this, args);
                if($cache.cloneNode) {
                    getCache = () => $cache.cloneNode(true);
                } else if($cache.$element) {
                    getCache = () => new NDElement($cache.$element.cloneNode(true));
                }
            }
            return getCache();
        };
    };

    Function.prototype.errorBoundary = function(callback) {
        const handler = (...args)  => {
            try {
                return this.apply(this, args);
            } catch(e) {
                return callback(e, {caller: handler, args: args });
            }
        };
        return handler;
    };

    String.prototype.use = function(args) {
        const value = this;

        return Observable.computed(() => {
            return value.replace(/\$\{(.*?)}/g, (match, key) => {
                const data = args[key];
                if(Validator.isObservable(data)) {
                    return data.val();
                }
                return data;
            });
        }, Object.values(args));
    };

    String.prototype.resolveObservableTemplate = function() {
        if(!Validator.containsObservableReference(this)) {
            return this.valueOf();
        }
        return this.split(/(\{\{#ObItem::\([0-9]+\)\}\})/g).filter(Boolean).map((value) => {
            if(!Validator.containsObservableReference(value)) {
                return value;
            }
            const [_, id] = value.match(/\{\{#ObItem::\(([0-9]+)\)\}\}/);
            return Observable.getById(id);
        });
    };

    const cssPropertyAccumulator = function(initialValue = {}) {
        let data = Validator.isString(initialValue) ? initialValue.split(';').filter(Boolean) : initialValue;
        const isArray = Validator.isArray(data);

        return {
            add(key, value) {
                if(isArray) {
                    data.push(key+' :  '+value);
                    return;
                }
                data[key] = value;
            },
            value() {
                if(isArray) {
                    return data.join(';').concat(';');
                }
                return { ...data };
            },
        };
    };

    const classPropertyAccumulator = function(initialValue = []) {
        let data = Validator.isString(initialValue) ? initialValue.split(" ").filter(Boolean) : initialValue;
        const isArray = Validator.isArray(data);

        return {
            add(key, value = true) {
                if(isArray) {
                    data.push(key);
                    return;
                }
                data[key] = value;
            },
            value() {
                if(isArray) {
                    return data.join(' ');
                }
                return { ...data };
            },
        };
    };

    const once$1 = (fn) => {
        let result = null;
        return (...args) => {
            if(result != null) {
                return result;
            }
            result = fn(...args);
            return result;
        };
    };

    const autoOnce = (fn) => {
        let target = null;
        return new Proxy({}, {
            get: (_, key) => {
                if(target) {
                    return target[key];
                }
                target = fn();
                return target[key];
            }
        });
    };

    const memoize$1 = (fn) => {
        const cache = new Map();
        return (...args) => {
            const [key, ...rest] = args;
            const cached = cache.get(key);
            if(cached) {
                return cached;
            }
            const result = fn(...rest);
            cache.set(key, result);
            return result;
        };
    };

    const autoMemoize = (fn) => {
        const cache = new Map();
        return new Proxy({}, {
            get: (_, key) => {
                const cached = cache.get(key);
                if(cached) {
                    return cached;
                }

                if(fn.length > 0) {
                    return (...args) => {
                        const result = fn(...args, key);
                        cache.set(key, result);
                        return result;
                    }
                }
                const result = fn(key);
                cache.set(key, result);
                return result;
            }
        });
    };

    function toDate(value) {
        if (value instanceof Date) return value;
        return new Date(value);
    }

    function isSameDay(date1, date2) {
        const d1 = toDate(date1);
        const d2 = toDate(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    function getSecondsOfDay(date) {
        const d = toDate(date);
        return (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
    }

    function createFilter(observableOrValue, callbackFn){
        const isObservable = Validator.isObservable(observableOrValue);

        return {
            dependencies: isObservable ? observableOrValue : null,
            callback: (value) => callbackFn(value, isObservable ? observableOrValue.val() : observableOrValue)
        };
    }

    function createMultiSourceFilter(sources, callbackFn){
        const observables = sources.filter(Validator.isObservable);

        const getValues = () => sources.map(src =>
            Validator.isObservable(src) ? src.val() : src
        );

        return {
            dependencies: observables.length > 0 ? observables : null,
            callback: (value) => callbackFn(value, getValues())
        };
    }

    function equals(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value === target);
    }

    function notEquals(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value !== target);
    }

    function greaterThan(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value > target);
    }

    function greaterThanOrEqual(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value >= target);
    }

    function lessThan(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value < target);
    }

    function lessThanOrEqual(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value <= target);
    }

    function between(minObservableOrValue, maxObservableOrValue){
        return createMultiSourceFilter(
            [minObservableOrValue, maxObservableOrValue],
            (value, [min, max]) => value >= min && value <= max
        );
    }

    function inArray(observableOrArray){
        return createFilter(observableOrArray, (value, arr) => arr.includes(value));
    }

    function notIn(observableOrArray){
        return createFilter(observableOrArray, (value, arr) => !arr.includes(value));
    }

    function isEmpty(observableOrValue = true){
        return createFilter(observableOrValue, (value, shouldBeEmpty) => {
            const isActuallyEmpty = !value || value === '' ||
                (Array.isArray(value) && value.length === 0);

            return shouldBeEmpty ? isActuallyEmpty : !isActuallyEmpty;
        });
    }

    function isNotEmpty(observableOrValue = true){
        return createFilter(observableOrValue, (value, shouldBeNotEmpty) => {
            const isActuallyNotEmpty = !!value && value !== '' &&
                (!Array.isArray(value) || value.length > 0);

            return shouldBeNotEmpty ? isActuallyNotEmpty : !isActuallyNotEmpty;
        });
    }

    function match(patternObservableOrValue, asRegexObservableOrValue = true, flagsObservableOrValue = ''){
        return createMultiSourceFilter(
            [patternObservableOrValue, asRegexObservableOrValue, flagsObservableOrValue],
            (value, [pattern, asRegex, flags]) => {
                if (!pattern) return true;

                if (asRegex){
                    try {
                        const regex = new RegExp(pattern, flags);
                        return regex.test(String(value));
                    } catch (error){
                        console.warn('Invalid regex pattern:', pattern, error);
                        return false;
                    }
                }

                if (!flags || flags === ''){
                    return String(value).toLowerCase().includes(String(pattern).toLowerCase());
                }
                return String(value).includes(String(pattern));
            }
        );
    }

    function and(...filters){
        const dependencies = filters
            .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
            .filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => filters.every(f => f.callback(value))
        };
    }

    function or(...filters){
        const dependencies = filters
            .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
            .filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => filters.some(f => f.callback(value))
        };
    }

    function not(filter){
        return {
            dependencies: filter.dependencies,
            callback: (value) => !filter.callback(value)
        };
    }

    function custom(callbackFn, ...observables){
        const dependencies = observables.filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => {
                const values = observables.map(o =>
                    Validator.isObservable(o) ? o.val() : o
                );
                return callbackFn(value, ...values);
            }
        };
    }

    const gt = greaterThan;
    const gte = greaterThanOrEqual;
    const lt = lessThan;
    const lte = lessThanOrEqual;
    const eq = equals;
    const neq = notEquals;
    const all = and;
    const any = or;

    const dateEquals = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return isSameDay(value, target);
        });
    };

    const dateBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) < toDate(target);
        });
    };

    const dateAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) > toDate(target);
        });
    };

    const dateBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter(
            [startObservableOrValue, endObservableOrValue],
            (value, [start, end]) => {
                if (!value || !start || !end) return false;
                const date = toDate(value);
                return date >= toDate(start) && date <= toDate(end);
            }
        );
    };

    const timeEquals = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            const d1 = toDate(value);
            const d2 = toDate(target);
            return d1.getHours() === d2.getHours() &&
                d1.getMinutes() === d2.getMinutes() &&
                d1.getSeconds() === d2.getSeconds();
        });
    };

    const timeAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return getSecondsOfDay(value) > getSecondsOfDay(target);
        });
    };

    const timeBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return getSecondsOfDay(value) < getSecondsOfDay(target);
        });
    };

    const timeBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter([startObservableOrValue, endObservableOrValue],
            (value, [start, end]) => {
                if (!value || !start || !end) return false;
                const date = getSecondsOfDay(value);
                return date >= getSecondsOfDay(start) && date <= getSecondsOfDay(end);
            }
        );
    };

    const dateTimeEquals = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value).getTime() === toDate(target).getTime();
        });
    };

    const dateTimeAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) > toDate(target);
        });
    };

    const dateTimeBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) < toDate(target);
        });
    };

    const dateTimeBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter([startObservableOrValue, endObservableOrValue], (value, [start, end]) => {
            if (!value || !start || !end) return false;
            const date = toDate(value);
            return date >= toDate(start) && date <= toDate(end);
        });
    };

    function includes(observableOrValue, caseSensitive = false){
        return createFilter(observableOrValue, (value, query) => {
            if (!value) return false;
            if (!query) return true;
            if (!caseSensitive){
                return String(value).toLowerCase().includes(String(query).toLowerCase());
            }
            return String(value).includes(String(query));
        });
    }

    const contains = includes;

    function startsWith(observableOrValue, caseSensitive = false){
        return createFilter(observableOrValue, (value, query) => {
            if (!query) return true;
            if (!caseSensitive){
                return String(value).toLowerCase().startsWith(String(query).toLowerCase());
            }
            return String(value).startsWith(String(query));
        });
    }

    function endsWith(observableOrValue, caseSensitive = false){
        return createFilter(observableOrValue, (value, query) => {
            if (!query) return true;
            if (!caseSensitive){
                return String(value).toLowerCase().endsWith(String(query).toLowerCase());
            }
            return String(value).endsWith(String(query));
        });
    }

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        all: all,
        and: and,
        any: any,
        between: between,
        contains: contains,
        createFilter: createFilter,
        createMultiSourceFilter: createMultiSourceFilter,
        custom: custom,
        dateAfter: dateAfter,
        dateBefore: dateBefore,
        dateBetween: dateBetween,
        dateEquals: dateEquals,
        dateTimeAfter: dateTimeAfter,
        dateTimeBefore: dateTimeBefore,
        dateTimeBetween: dateTimeBetween,
        dateTimeEquals: dateTimeEquals,
        endsWith: endsWith,
        eq: eq,
        equals: equals,
        getSecondsOfDay: getSecondsOfDay,
        greaterThan: greaterThan,
        greaterThanOrEqual: greaterThanOrEqual,
        gt: gt,
        gte: gte,
        inArray: inArray,
        includes: includes,
        isEmpty: isEmpty,
        isNotEmpty: isNotEmpty,
        isSameDay: isSameDay,
        lessThan: lessThan,
        lessThanOrEqual: lessThanOrEqual,
        lt: lt,
        lte: lte,
        match: match,
        neq: neq,
        not: not,
        notEquals: notEquals,
        notIn: notIn,
        or: or,
        startsWith: startsWith,
        timeAfter: timeAfter,
        timeBefore: timeBefore,
        timeBetween: timeBetween,
        timeEquals: timeEquals,
        toDate: toDate
    });

    const mutationMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
    const noMutationMethods = ['map', 'forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'concat', 'includes', 'indexOf'];


    /**
     *
     * @param target
     * @param {{propagation: boolean, deep: boolean, reset: boolean}|null} configs
     * @constructor
     */
    const ObservableArray = function (target, configs = null) {
        if(!Array.isArray(target)) {
            throw new NativeDocumentError('Observable.array : target must be an array');
        }

        ObservableItem.call(this, target, configs);
        {
            PluginsManager$1.emit('CreateObservableArray', this);
        }
    };

    ObservableArray.prototype = Object.create(ObservableItem.prototype);
    ObservableArray.prototype.constructor = ObservableArray;
    ObservableArray.prototype.__$isObservableArray = true;


    Object.defineProperty(ObservableArray.prototype, 'length', {
        get() {
            return this.$currentValue.length;
        }
    });

    mutationMethods.forEach((method) => {
        ObservableArray.prototype[method] = function(...values) {
            const result = this.$currentValue[method].apply(this.$currentValue, values);
            this.trigger({ action: method, args: values, result });
            return result;
        };
    });

    noMutationMethods.forEach((method) => {
        ObservableArray.prototype[method] = function(...values) {
            return this.$currentValue[method].apply(this.$currentValue, values);
        };
    });

    /**
     * Removes all items from the array and triggers an update.
     *
     * @returns {boolean} True if array was cleared, false if it was already empty
     * @example
     * const items = Observable.array([1, 2, 3]);
     * items.clear(); // []
     */
    ObservableArray.prototype.clear = function() {
        if(this.$currentValue.length === 0) {
            return;
        }
        this.$currentValue.length = 0;
        this.trigger({ action: 'clear' });
        return true;
    };

    /**
     * Returns the element at the specified index in the array.
     *
     * @param {number} index - Zero-based index of the element to retrieve
     * @returns {*} The element at the specified index
     * @example
     * const items = Observable.array(['a', 'b', 'c']);
     * items.at(1); // 'b'
     */
    ObservableArray.prototype.at = function(index) {
        return this.$currentValue[index];
    };


    /**
     * Merges multiple values into the array and triggers an update.
     * Similar to push but with a different operation name.
     *
     * @param {Array} values - Array of values to merge
     * @example
     * const items = Observable.array([1, 2]);
     * items.merge([3, 4]); // [1, 2, 3, 4]
     */
    ObservableArray.prototype.merge = function(values) {
        this.$currentValue.push.apply(this.$currentValue, values);
        this.trigger({ action: 'merge',  args: values });
    };

    /**
     * Counts the number of elements that satisfy the provided condition.
     *
     * @param {(value: *, index: number) => Boolean} condition - Function that tests each element (item, index) => boolean
     * @returns {number} The count of elements that satisfy the condition
     * @example
     * const numbers = Observable.array([1, 2, 3, 4, 5]);
     * numbers.count(n => n > 3); // 2
     */
    ObservableArray.prototype.count = function(condition) {
        let count = 0;
        this.$currentValue.forEach((item, index) => {
            if(condition(item, index)) {
                count++;
            }
        });
        return count;
    };

    /**
     * Swaps two elements at the specified indices and triggers an update.
     *
     * @param {number} indexA - Index of the first element
     * @param {number} indexB - Index of the second element
     * @returns {boolean} True if swap was successful, false if indices are out of bounds
     * @example
     * const items = Observable.array(['a', 'b', 'c']);
     * items.swap(0, 2); // ['c', 'b', 'a']
     */
    ObservableArray.prototype.swap = function(indexA, indexB) {
        const value = this.$currentValue;
        const length = value.length;
        if(length < indexA || length < indexB) {
            return false;
        }
        if(indexB < indexA) {
            const temp = indexA;
            indexA = indexB;
            indexB = temp;
        }
        const elementA = value[indexA];
        const elementB = value[indexB];

        value[indexA] = elementB;
        value[indexB] = elementA;
        this.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
        return true;
    };

    /**
     * Removes the element at the specified index and triggers an update.
     *
     * @param {number} index - Index of the element to remove
     * @returns {Array} Array containing the removed element, or empty array if index is invalid
     * @example
     * const items = Observable.array(['a', 'b', 'c']);
     * items.remove(1); // ['b'] - Array is now ['a', 'c']
     */
    ObservableArray.prototype.remove = function(index) {
        const deleted = this.$currentValue.splice(index, 1);
        if(deleted.length === 0) {
            return [];
        }
        this.trigger({ action: 'remove', args: [index], result: deleted[0] });
        return deleted;
    };

    /**
     * Removes the first occurrence of the specified item from the array.
     *
     * @param {*} item - The item to remove
     * @returns {Array} Array containing the removed element, or empty array if item not found
     * @example
     * const items = Observable.array(['a', 'b', 'c']);
     * items.removeItem('b'); // ['b'] - Array is now ['a', 'c']
     */
    ObservableArray.prototype.removeItem = function(item) {
        const indexOfItem = this.$currentValue.indexOf(item);
        if(indexOfItem === -1) {
            return [];
        }
        return this.remove(indexOfItem);
    };

    /**
     * Checks if the array is empty.
     *
     * @returns {boolean} True if array has no elements
     * @example
     * const items = Observable.array([]);
     * items.isEmpty(); // true
     */
    ObservableArray.prototype.isEmpty = function() {
        return this.$currentValue.length === 0;
    };

    /**
     * Triggers a populate operation with the current array, iteration count, and callback.
     * Used internally for rendering optimizations.
     *
     * @param {number} iteration - Iteration count for rendering
     * @param {Function} callback - Callback function for rendering items
     */
    ObservableArray.prototype.populateAndRender = function(iteration, callback) {
        this.trigger({ action: 'populate', args: [this.$currentValue, iteration, callback] });
    };


    /**
     * Creates a filtered view of the array based on predicates.
     * The filtered array updates automatically when source data or predicates change.
     *
     * @param {Object} predicates - Object mapping property names to filter conditions or functions
     * @returns {ObservableArray} A new observable array containing filtered items
     * @example
     * const users = Observable.array([
     *   { name: 'John', age: 25 },
     *   { name: 'Jane', age: 30 }
     * ]);
     * const adults = users.where({ age: (val) => val >= 18 });
     */
    ObservableArray.prototype.where = function(predicates) {
        const sourceArray = this;
        const observableDependencies = [sourceArray];
        const filterCallbacks = {};

        for (const [key, rawPredicate] of Object.entries(predicates)) {
            const predicate = Validator.isObservable(rawPredicate) ? match(rawPredicate, false) : rawPredicate;
            if (predicate && typeof predicate === 'object' && 'callback' in predicate) {
                filterCallbacks[key] = predicate.callback;

                if (predicate.dependencies) {
                    const deps = Array.isArray(predicate.dependencies)
                        ? predicate.dependencies
                        : [predicate.dependencies];
                    observableDependencies.push.apply(observableDependencies, deps);
                }
            } else if(typeof predicate === 'function') {
                filterCallbacks[key] = predicate;
            } else {
                filterCallbacks[key] = (value) => value === predicate;
            }
        }

        const viewArray = Observable.array();

        const filters = Object.entries(filterCallbacks);
        const updateView = () => {
            const filtered = sourceArray.val().filter(item => {
                for (const [key, callback] of filters) {
                    if(key === '_') {
                        if (!callback(item)) return false;
                    } else {
                        if (!callback(item[key])) return false;
                    }
                }
                return true;
            });

            viewArray.set(filtered);
        };

        observableDependencies.forEach(dep => dep.subscribe(updateView));

        updateView();

        return viewArray;
    };

    /**
     * Creates a filtered view where at least one of the specified fields matches the filter.
     *
     * @param {Array<string>} fields - Array of field names to check
     * @param {FilterResult} filter - Filter condition with callback and dependencies
     * @returns {ObservableArray} A new observable array containing filtered items
     * @example
     * const products = Observable.array([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' }
     * ]);
     * const searchTerm = Observable('App');
     * const filtered = products.whereSome(['name', 'category'], match(searchTerm));
     */
    ObservableArray.prototype.whereSome = function(fields, filter) {
        return this.where({
            _: {
                dependencies: filter.dependencies,
                callback: (item) => fields.some(field => filter.callback(item[field]))
            }
        });
    };

    /**
     * Creates a filtered view where all specified fields match the filter.
     *
     * @param {Array<string>} fields - Array of field names to check
     * @param {FilterResult} filter - Filter condition with callback and dependencies
     * @returns {ObservableArray} A new observable array containing filtered items
     * @example
     * const items = Observable.array([
     *   { status: 'active', verified: true },
     *   { status: 'active', verified: false }
     * ]);
     * const activeFilter = equals('active');
     * const filtered = items.whereEvery(['status', 'verified'], activeFilter);
     */
    ObservableArray.prototype.whereEvery = function(fields, filter) {
        return this.where({
            _: {
                dependencies: filter.dependencies,
                callback: (item) => fields.every(field => filter.callback(item[field]))
            }
        });
    };

    /**
     * Creates an observable array with reactive array methods.
     * All mutations trigger updates automatically.
     *
     * @param {Array} [target=[]] - Initial array value
     * @param {Object|null} [configs=null] - Configuration options
     * // @param {boolean} [configs.propagation=true] - Whether to propagate changes to parent observables
     * // @param {boolean} [configs.deep=false] - Whether to make nested objects observable
     * @param {boolean} [configs.reset=false] - Whether to store initial value for reset()
     * @returns {ObservableArray} An observable array with reactive methods
     * @example
     * const items = Observable.array([1, 2, 3]);
     * items.push(4); // Triggers update
     * items.subscribe((arr) => console.log(arr));
     */
    Observable.array = function(target = [], configs = null) {
        return new ObservableArray(target, configs);
    };

    /**
     *
     * @param {Function} callback
     * @returns {Function}
     */
    Observable.batch = function(callback) {
        const $observer = Observable(0);
        const batch = function() {
            if(Validator.isAsyncFunction(callback)) {
                return (callback(...arguments)).then(() => {
                    $observer.trigger();
                }).catch(error => { throw error; });
            }
            callback(...arguments);
            $observer.trigger();
        };
        batch.$observer = $observer;
        return batch;
    };

    const ObservableObjectValue = function(data) {
        const result = {};
        for(const key in data) {
            const dataItem = data[key];
            if(Validator.isObservable(dataItem)) {
                let value = dataItem.val();
                if(Array.isArray(value)) {
                    value = value.map(item => {
                        if(Validator.isObservable(item)) {
                            return item.val();
                        }
                        if(Validator.isProxy(item)) {
                            return item.$value;
                        }
                        return item;
                    });
                }
                result[key] = value;
            } else if(Validator.isProxy(dataItem)) {
                result[key] = dataItem.$value;
            } else {
                result[key] = dataItem;
            }
        }
        return result;
    };

    const ObservableGet = function(target, property) {
        const item = target[property];
        if(Validator.isObservable(item)) {
            return item.val();
        }
        if(Validator.isProxy(item)) {
            return item.$value;
        }
        return item;
    };

    /**
     * Creates an observable proxy for an object where each property becomes an observable.
     * Properties can be accessed directly or via getter methods.
     *
     * @param {Object} initialValue - Initial object value
     * @param {Object|null} [configs=null] - Configuration options
     * // @param {boolean} [configs.propagation=true] - Whether changes propagate to parent
     * @param {boolean} [configs.deep=false] - Whether to make nested objects observable
     * @param {boolean} [configs.reset=false] - Whether to enable reset() method
     * @returns {ObservableProxy} A proxy where each property is an observable
     * @example
     * const user = Observable.init({
     *   name: 'John',
     *   age: 25,
     *   address: { city: 'NYC' }
     * }, { deep: true });
     *
     * user.name.val(); // 'John'
     * user.name.set('Jane');
     * user.name = 'Jane X'
     * user.age.subscribe(val => console.log('Age:', val));
     */
    Observable.init = function(initialValue, configs = null) {
        const data = {};
        for(const key in initialValue) {
            const itemValue = initialValue[key];
            if(Array.isArray(itemValue)) {
                if(configs?.deep !== false) {
                    const mappedItemValue = itemValue.map(item => {
                        if(Validator.isJson(item)) {
                            return Observable.json(item, configs);
                        }
                        if(Validator.isArray(item)) {
                            return Observable.array(item, configs);
                        }
                        return Observable(item, configs);
                    });
                    data[key] = Observable.array(mappedItemValue, configs);
                    continue;
                }
                data[key] = Observable.array(itemValue, configs);
                continue;
            }
            if(Validator.isObservable(itemValue) || Validator.isProxy(itemValue)) {
                data[key] = itemValue;
                continue;
            }
            data[key] = Observable(itemValue, configs);
        }

        const $reset = () => {
            for(const key in data) {
                const item = data[key];
                item.reset();
            }
        };

        const $val = () => ObservableObjectValue(data);

        const $clone = () => Observable.init($val(), configs);

        const $updateWith = (values) => {
            Observable.update(proxy, values);
        };

        const $get = (key) => ObservableGet(data, key);

        const proxy = new Proxy(data, {
            get(target, property) {
                if(property === '__isProxy__') { return true; }
                if(property === '$value') { return $val() }
                if(property === 'get' || property === '$get') { return $get; }
                if(property === 'val' || property === '$val') { return $val; }
                if(property === 'set' || property === '$set' || property === '$updateWith') { return $updateWith; }
                if(property === 'observables' || property === '$observables') { return Object.values(target); }
                if(property === 'keys'|| property === '$keys') { return Object.keys(initialValue); }
                if(property === 'clone' || property === '$clone') { return $clone; }
                if(property === 'reset') { return $reset; }
                if(property === 'configs') { return configs; }
                return target[property];
            },
            set(target, prop, newValue) {
                if(target[prop] !== undefined) {
                    Validator.isObservable(newValue)
                        ? target[prop].set(newValue.val())
                        : target[prop].set(newValue);
                    return true;
                }
                return true;
            }
        });

        return proxy;
    };

    /**
     *
     * @param {any[]} data
     * @return Proxy[]
     */
    Observable.arrayOfObject = function(data) {
        return data.map(item => Observable.object(item));
    };

    /**
     * Get the value of an observable or an object of observables.
     * @param {ObservableItem|Object<ObservableItem>} data
     * @returns {{}|*|null}
     */
    Observable.value = function(data) {
        if(Validator.isObservable(data)) {
            return data.val();
        }
        if(Validator.isProxy(data)) {
            return data.$value;
        }
        if(Validator.isArray(data)) {
            const result = [];
            for(let i = 0, length = data.length; i < length; i++) {
                const item = data[i];
                result.push(Observable.value(item));
            }
            return result;
        }
        return data;
    };


    Observable.update = function($target, newData) {
        const data = Validator.isProxy(newData) ? newData.$value : newData;
        const configs = $target.configs;

        for(const key in data) {
            const targetItem = $target[key];
            const newValueOrigin = newData[key];
            const newValue = data[key];

            if(Validator.isObservable(targetItem)) {
                if(Validator.isArray(newValue)) {
                    const firstElementFromOriginalValue = newValueOrigin.at(0);
                    if(Validator.isObservable(firstElementFromOriginalValue) || Validator.isProxy(firstElementFromOriginalValue)) {
                        const newValues = newValue.map(item => {
                            if(Validator.isProxy(firstElementFromOriginalValue)) {
                                return Observable.init(item, configs);
                            }
                            return Observable(item, configs);
                        });
                        targetItem.set(newValues);
                        continue;
                    }
                    targetItem.set([...newValue]);
                    continue;
                }
                targetItem.set(newValue);
                continue;
            }
            if(Validator.isProxy(targetItem)) {
                Observable.update(targetItem, newValue);
                continue;
            }
            $target[key] = newValue;
        }
    };

    Observable.object = Observable.init;
    Observable.json = Observable.init;

    /**
     * Creates a computed observable that automatically updates when its dependencies change.
     * The callback is re-executed whenever any dependency observable changes.
     *
     * @param {Function} callback - Function that returns the computed value
     * @param {Array<ObservableItem|ObservableChecker|ObservableProxy>|Function} [dependencies=[]] - Array of observables to watch, or batch function
     * @returns {ObservableItem} A new observable that updates automatically
     * @example
     * const firstName = Observable('John');
     * const lastName = Observable('Doe');
     * const fullName = Observable.computed(
     *   () => `${firstName.val()} ${lastName.val()}`,
     *   [firstName, lastName]
     * );
     *
     * // With batch function
     * const batch = Observable.batch(() => { ...  });
     * const computed = Observable.computed(() => { ... }, batch);
    */
    Observable.computed = function(callback, dependencies = []) {
        const initialValue = callback();
        const observable = new ObservableItem(initialValue);
        const updatedValue = nextTick(() => observable.set(callback()));
        {
            PluginsManager$1.emit('CreateObservableComputed', observable, dependencies);
        }

        if(Validator.isFunction(dependencies)) {
            if(!Validator.isObservable(dependencies.$observer)) {
                throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
            }
            dependencies.$observer.subscribe(updatedValue);
            return observable;
        }

        dependencies.forEach(dependency => {
            if(Validator.isProxy(dependency)) {
                dependency.$observables.forEach((observable) => {
                    observable.subscribe(updatedValue);
                });
                return;
            }
            dependency.subscribe(updatedValue);
        });

        return observable;
    };

    const StoreFactory = function() {

        const $stores = new Map();
        const $followersCache = new Map();

        /**
         * Internal helper — retrieves a store entry or throws if not found.
         */
        const $getStoreOrThrow = (method, name) => {
            const item = $stores.get(name);
            if (!item) {
                DebugManager$1.error('Store', `Store.${method}('${name}') : store not found. Did you call Store.create('${name}') first?`);
                throw new NativeDocumentError(
                    `Store.${method}('${name}') : store not found.`
                );
            }
            return item;
        };

        /**
         * Internal helper — blocks write operations on a read-only observer.
         */
        const $applyReadOnly = (observer, name, context) => {
            const readOnlyError = (method) => () => {
                DebugManager$1.error('Store', `Store.${context}('${name}') is read-only. '${method}()' is not allowed.`);
                throw new NativeDocumentError(
                    `Store.${context}('${name}') is read-only.`
                );
            };
            observer.set    = readOnlyError('set');
            observer.toggle = readOnlyError('toggle');
            observer.reset  = readOnlyError('reset');
        };

        const $createObservable = (value, options = {}) => {
            if(Array.isArray(value)) {
                return Observable.array(value, options);
            }
            if(typeof value === 'object') {
                return Observable.object(value, options);
            }
            return Observable(value, options);
        };

        const $api = {
            /**
             * Create a new state and return the observer.
             * Throws if a store with the same name already exists.
             *
             * @param {string} name
             * @param {*} value
             * @returns {ObservableItem}
             */
            create(name, value) {
                if ($stores.has(name)) {
                    DebugManager$1.warn('Store', `Store.create('${name}') : a store with this name already exists. Use Store.get('${name}') to retrieve it.`);
                    throw new NativeDocumentError(
                        `Store.create('${name}') : a store with this name already exists.`
                    );
                }
                const observer = $createObservable(value);
                $stores.set(name, { observer, subscribers: new Set(), resettable: false, composed: false });
                return observer;
            },

            /**
             * Create a new resettable state and return the observer.
             * The store can be reset to its initial value via Store.reset(name).
             * Throws if a store with the same name already exists.
             *
             * @param {string} name
             * @param {*} value
             * @returns {ObservableItem}
             */
            createResettable(name, value) {
                if ($stores.has(name)) {
                    DebugManager$1.warn('Store', `Store.createResettable('${name}') : a store with this name already exists.`);
                    throw new NativeDocumentError(
                        `Store.createResettable('${name}') : a store with this name already exists.`
                    );
                }
                const observer = $createObservable(value, { reset: true });
                $stores.set(name, { observer, subscribers: new Set(), resettable: true, composed: false });
                return observer;
            },

            /**
             * Create a computed store derived from other stores.
             * The value is automatically recalculated when any dependency changes.
             * This store is read-only — Store.use() and Store.set() will throw.
             * Throws if a store with the same name already exists.
             *
             * @param {string} name
             * @param {() => *} computation - Function that returns the computed value
             * @param {string[]} dependencies - Names of the stores to watch
             * @returns {ObservableItem}
             *
             * @example
             * Store.create('products', [{ id: 1, price: 10 }]);
             * Store.create('cart', [{ productId: 1, quantity: 2 }]);
             *
             * Store.createComposed('total', () => {
             *     const products = Store.get('products').val();
             *     const cart     = Store.get('cart').val();
             *     return cart.reduce((sum, item) => {
             *         const product = products.find(p => p.id === item.productId);
             *         return sum + (product.price * item.quantity);
             *     }, 0);
             * }, ['products', 'cart']);
             */
            createComposed(name, computation, dependencies) {
                if ($stores.has(name)) {
                    DebugManager$1.warn('Store', `Store.createComposed('${name}') : a store with this name already exists.`);
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : a store with this name already exists.`
                    );
                }
                if (typeof computation !== 'function') {
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : computation must be a function.`
                    );
                }
                if (!Array.isArray(dependencies) || dependencies.length === 0) {
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : dependencies must be a non-empty array of store names.`
                    );
                }

                // Resolve dependency observers
                const depObservers = dependencies.map(depName => {
                    if(typeof depName !== 'string') {
                        return depName;
                    }
                    const depItem = $stores.get(depName);
                    if (!depItem) {
                        DebugManager$1.error('Store', `Store.createComposed('${name}') : dependency '${depName}' not found. Create it first.`);
                        throw new NativeDocumentError(
                            `Store.createComposed('${name}') : dependency store '${depName}' not found.`
                        );
                    }
                    return depItem.observer;
                });

                // Create computed observable from dependency observers
                const observer = Observable.computed(computation, depObservers);

                $stores.set(name, { observer, subscribers: new Set(), resettable: false, composed: true });
                return observer;
            },

            /**
             * Returns true if a store with the given name exists.
             *
             * @param {string} name
             * @returns {boolean}
             */
            has(name) {
                return $stores.has(name);
            },

            /**
             * Resets a resettable store to its initial value and notifies all subscribers.
             * Throws if the store was not created with createResettable().
             *
             * @param {string} name
             */
            reset(name) {
                const item = $getStoreOrThrow('reset', name);
                if (item.composed) {
                    DebugManager$1.error('Store', `Store.reset('${name}') : composed stores cannot be reset. Their value is derived from dependencies.`);
                    throw new NativeDocumentError(
                        `Store.reset('${name}') : composed stores cannot be reset.`
                    );
                }
                if (!item.resettable) {
                    DebugManager$1.error('Store', `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`);
                    throw new NativeDocumentError(
                        `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`
                    );
                }
                item.observer.reset();
            },

            /**
             * Returns a two-way synchronized follower of the store.
             * Writing to the follower propagates the value back to the store and all its subscribers.
             * Throws if called on a composed store — use Store.follow() instead.
             * Call follower.destroy() or follower.dispose() to unsubscribe.
             *
             * @param {string} name
             * @returns {ObservableItem}
             */
            use(name) {
                const item = $getStoreOrThrow('use', name);

                if (item.composed) {
                    DebugManager$1.error('Store', `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`);
                    throw new NativeDocumentError(
                        `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`
                    );
                }

                const { observer: originalObserver, subscribers } = item;
                const observerFollower = $createObservable(originalObserver.val());

                const onStoreChange    = value => observerFollower.set(value);
                const onFollowerChange = value => originalObserver.set(value);

                originalObserver.subscribe(onStoreChange);
                observerFollower.subscribe(onFollowerChange);

                observerFollower.destroy = () => {
                    originalObserver.unsubscribe(onStoreChange);
                    observerFollower.unsubscribe(onFollowerChange);
                    subscribers.delete(observerFollower);
                    observerFollower.cleanup();
                };
                observerFollower.dispose = observerFollower.destroy;

                subscribers.add(observerFollower);
                return observerFollower;
            },

            /**
             * Returns a read-only follower of the store.
             * The follower reflects store changes but cannot write back to the store.
             * Any attempt to call .set(), .toggle() or .reset() will throw.
             * Call follower.destroy() or follower.dispose() to unsubscribe.
             *
             * @param {string} name
             * @returns {ObservableItem}
             */
            follow(name) {
                const { observer: originalObserver, subscribers } = $getStoreOrThrow('follow', name);
                const observerFollower = $createObservable(originalObserver.val());

                const onStoreChange = value => observerFollower.set(value);
                originalObserver.subscribe(onStoreChange);

                $applyReadOnly(observerFollower, name, 'follow');

                observerFollower.destroy = () => {
                    originalObserver.unsubscribe(onStoreChange);
                    subscribers.delete(observerFollower);
                    observerFollower.cleanup();
                };
                observerFollower.dispose = observerFollower.destroy;

                subscribers.add(observerFollower);
                return observerFollower;
            },

            /**
             * Returns the raw store observer directly (no follower, no cleanup contract).
             * Use this for direct read access when you don't need to unsubscribe.
             * WARNING : mutations on this observer impact all subscribers immediately.
             *
             * @param {string} name
             * @returns {ObservableItem|null}
             */
            get(name) {
                const item = $stores.get(name);
                if (!item) {
                    DebugManager$1.warn('Store', `Store.get('${name}') : store not found.`);
                    return null;
                }
                return item.observer;
            },

            /**
             * @param {string} name
             * @returns {{ observer: ObservableItem, subscribers: Set } | null}
             */
            getWithSubscribers(name) {
                return $stores.get(name) ?? null;
            },

            /**
             * Destroys a store : cleans up the observer, destroys all followers, and removes the entry.
             *
             * @param {string} name
             */
            delete(name) {
                const item = $stores.get(name);
                if (!item) {
                    DebugManager$1.warn('Store', `Store.delete('${name}') : store not found, nothing to delete.`);
                    return;
                }
                item.subscribers.forEach(follower => follower.destroy());
                item.subscribers.clear();
                item.observer.cleanup();
                $stores.delete(name);
            },
            /**
             * Creates an isolated store group with its own state namespace.
             * Each group is a fully independent StoreFactory instance —
             * no key conflicts, no shared state with the parent store.
             *
             * @param {string | ((group: ReturnType<typeof StoreFactory>) => void)} name - Group name for debugging, or setup callback if no name is provided
             * @param {((group: ReturnType<typeof StoreFactory>) => void)} [callback] - Setup function receiving the isolated store instance
             * @returns {ReturnType<typeof StoreFactory>}
             *
             * @example
             * // With name (recommended)
             * const EventStore = Store.group('events', (group) => {
             *     group.create('catalog', []);
             *     group.create('filters', { category: null, date: null });
             *     group.createResettable('selected', null);
             *     group.createComposed('filtered', () => {
             *         const catalog = EventStore.get('catalog').val();
             *         const filters = EventStore.get('filters').val();
             *         return catalog.filter(event => {
             *             if (filters.category && event.category !== filters.category) return false;
             *             return true;
             *         });
             *     }, ['catalog', 'filters']);
             * });
             *
             * // Without name
             * const CartStore = Store.group((group) => {
             *     group.create('items', []);
             * });
             *
             * // Usage
             * EventStore.use('catalog'); // two-way follower
             * EventStore.follow('filtered'); // read-only follower
             * EventStore.get('filters'); // raw observable
             *
             * // Cross-group composed
             * const OrderStore = Store.group('orders', (group) => {
             *     group.createComposed('summary', () => {
             *         const items = CartStore.get('items').val();
             *         const events = EventStore.get('catalog').val();
             *         return { items, events };
             *     }, [CartStore.get('items'), EventStore.get('catalog')]);
             * });
             */
            group(name, callback) {
                if (typeof name === 'function') {
                    callback = name;
                    name = 'anonymous';
                }
                const store = StoreFactory();
                callback && callback(store);
                return store;
            }
        };


        return new Proxy($api, {
            get(target, prop) {
                if (typeof prop === 'symbol' || prop.startsWith('$') || prop in target) {
                    return target[prop];
                }
                if (target.has(prop)) {
                    if ($followersCache.has(prop)) {
                        return $followersCache.get(prop);
                    }
                    const follower = target.follow(prop);
                    $followersCache.set(prop, follower);
                    return follower;
                }
                return undefined;
            },
            set(target, prop, value) {
                DebugManager$1.error('Store', `Forbidden: You cannot overwrite the store key '${String(prop)}'. Use .use('${String(prop)}').set(value) instead.`);
                throw new NativeDocumentError(`Store structure is immutable. Use .set() on the observable.`);
            },
            deleteProperty(target, prop) {
                throw new NativeDocumentError(`Store keys cannot be deleted.`);
            }
        });
    };

    const Store = StoreFactory();

    /**
     * Renders a list of items from an observable array or object, automatically updating when data changes.
     * Efficiently manages DOM updates by tracking items with keys.
     *
     * @param {ObservableItem<Array|Object>} data - Observable containing array or object to iterate over
     * @param {(item: *, index: null|ObservableItem) => NdChild} callback - Function that renders each item (item, index) => ValidChild
     * @param {string|Function} [key] - Property name or function to generate unique keys for items
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.shouldKeepItemsInCache=false] - Whether to cache rendered items
     * @returns {AnchorDocumentFragment} Fragment managing the list rendering
     * @example
     * const users = Observable([
     *   { id: 1, name: 'John' },
     *   { id: 2, name: 'Jane' }
     * ]);
     * ForEach(users, (user) => Div({}, user.name), 'id');
     *
     * // With function key
     * ForEach(items, (item) => Div({}, item), (item) => item.id);
     */
    function ForEach(data, callback, key, { shouldKeepItemsInCache = false } = {}) {
        const element = Anchor('ForEach');
        const blockEnd = element.endElement();
        element.startElement();

        let cache = new Map();
        let lastKeyOrder = null;
        const keyIds = new Set();

        const clear = () => {
            element.removeChildren();
            cleanCache();
        };

        const cleanCache = (parent) => {
            if(shouldKeepItemsInCache) {
                return;
            }
            for(const [keyId, cacheItem] of cache.entries()) {
                if(keyIds.has(keyId)) {
                    continue;
                }
                const child = cacheItem.child?.deref();
                if(parent && child) {
                    child.remove();
                }
                cacheItem.indexObserver?.cleanup();
                cacheItem.child = null;
                cacheItem.indexObserver = null;
                cache.delete(cacheItem.keyId);
                lastKeyOrder && lastKeyOrder.delete(cacheItem.keyId);
            }
        };

        const handleContentItem = (item, indexKey) => {
            const keyId = getKey(item, indexKey, key);

            if(cache.has(keyId)) {
                const cacheItem = cache.get(keyId);
                cacheItem.indexObserver?.set(indexKey);
                cacheItem.isNew = false;
                if(cacheItem.child?.deref()) {
                    return keyId;
                }
                cache.delete(keyId);
            }

            try {
                const indexObserver = callback.length >= 2 ? Observable(indexKey) : null;
                let child = ElementCreator.getChild(callback(item, indexObserver));
                if(!child) {
                    throw new NativeDocumentError("ForEach child can't be null or undefined!");
                }
                cache.set(keyId, { keyId, isNew: true, child: new WeakRef(child), indexObserver});
            } catch (e) {
                DebugManager$1.error('ForEach', `Error creating element for key ${keyId}` , e);
                throw e;
            }
            return keyId;
        };

        const batchDOMUpdates = (parent) => {
            const fragment = document.createDocumentFragment();
            for(const itemKey of keyIds) {
                const cacheItem = cache.get(itemKey);
                if(!cacheItem) {
                    continue;
                }
                const child = cacheItem.child?.deref();
                child && fragment.appendChild(child);
            }
            parent.insertBefore(fragment, blockEnd);
        };

        const diffingDOMUpdates = (parent) => {
            let fragment = document.createDocumentFragment();
            const newKeys = Array.from(keyIds);
            Array.from(lastKeyOrder);

            for(const index in newKeys) {
                const itemKey = newKeys[index];
                const cacheItem = cache.get(itemKey);
                if(!cacheItem) {
                    continue;
                }
                const child = cacheItem.child.deref();
                if(!child) {
                    continue;
                }
                fragment.appendChild(child);
            }
            element.replaceContent(fragment);
        };

        const buildContent = () => {
            const parent = blockEnd.parentNode;
            if(!parent) {
                return;
            }

            const items = (Validator.isObservable(data)) ? data.val() : data;
            keyIds.clear();
            if(Array.isArray(items)) {
                for(let i = 0, length = items.length; i < length; i++) {
                    const keyId = handleContentItem(items[i], i);
                    keyIds.add(keyId);
                }
            } else {
                for(const indexKey in items) {
                    const keyId = handleContentItem(items[indexKey], indexKey);
                    keyIds.add(keyId);
                }
            }

            if(keyIds.size === 0) {
                clear();
                lastKeyOrder?.clear();
                return;
            }

            cleanCache(parent);
            if(!lastKeyOrder || lastKeyOrder.size === 0) {
                batchDOMUpdates(parent);
            } else {
                diffingDOMUpdates();
            }
            lastKeyOrder?.clear();
            lastKeyOrder = new Set([...keyIds]);
        };

        buildContent();
        if(Validator.isObservable(data)) {
            data.subscribe(buildContent);
        }
        return element;
    }

    /**
     * Renders items from an ObservableArray with optimized array-specific updates.
     * Provides index observables and handles array mutations efficiently.
     *
     * @param {ObservableArray} data - ObservableArray to iterate over
     * @param {(item: *, index: null|ObservableItem) => NdChild} callback - Function that renders each item (item, indexObservable) => ValidChild
     * @param {Object} [configs={}] - Configuration options
     * @param {boolean} [configs.shouldKeepItemsInCache] - Whether to cache rendered items
     * @param {boolean} [configs.isParentUniqueChild] - When it's the only child of the parent
     * @returns {AnchorDocumentFragment} Fragment managing the list rendering
     * @example
     * const items = Observable.array([1, 2, 3]);
     * ForEachArray(items, (item, index) =>
     *   Div({}, `Item ${item} at index ${index.val()}`)
     * );
     *
     * items.push(4); // Automatically updates DOM
     */
    function ForEachArray(data, callback, configs = {}) {
        const element = Anchor('ForEach Array', configs.isParentUniqueChild);
        const blockEnd = element.endElement();
        const blockStart = element.startElement();

        let cache = new Map();
        let lastNumberOfItems = 0;
        const isIndexRequired = callback.length >= 2;

        const clear = (items) => {
            element.removeChildren();
            cleanCache(items);
            lastNumberOfItems = 0;
        };

        const getItemChild = (item) => {
            return cache.get(item)?.child;
        };

        const updateIndexObservers = (items, startFrom = 0) => {
            if(!isIndexRequired) {
                return;
            }
            let index = startFrom;
            for(let i = startFrom, length = items?.length; i < length; i++) {
                const cacheItem = cache.get(items[i]);
                if(!cacheItem) {
                    continue;
                }
                cacheItem.indexObserver?.set(index);
                index++;
            }
        };

        const removeCacheItem = (item, removeChild = true) => {
            const cacheItem = cache.get(item);
            if(!cacheItem) {
                return;
            }
            if(removeChild) {
                const child = cacheItem.child;
                child?.remove();
                cache.delete(cacheItem.keyId);
            }
            cacheItem.indexObserver?.cleanup();
        };

        const cleanCache = (items) => {
            if(configs.shouldKeepItemsInCache) {
                return;
            }
            if(!isIndexRequired) {
                cache.clear();
                return;
            }
            for (const [itemAsKey, _] of cache.entries()) {
                if(items && items.contains(itemAsKey)) {
                    continue;
                }
                removeCacheItem(itemAsKey, false);
            }
            cache.clear();
        };

        const buildItem = (item, indexKey) => {
            const cacheItem = cache.get(item);
            if(cacheItem) {
                cacheItem.indexObserver?.set(indexKey);
                const child = cacheItem.child;
                if(child) {
                    return child;
                }
                cache.delete(item);
            }

            const indexObserver = isIndexRequired ? Observable(indexKey) : null;
            let child = ElementCreator.getChild(callback(item, indexObserver));
            if(child) {
                cache.set(item, {
                    child,
                    indexObserver
                });
                return child;
            }

            throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
        };

        const removeByItem = function(item, fragment) {
            const cacheItem = cache.get(item);
            if(!cacheItem) {
                return null;
            }
            const child = cacheItem.child;
            if(!child) {
                return null;
            }

            if(fragment) {
                fragment.appendChild(child);
                return;
            }
            child.remove();
        };

        const Actions = {
            toFragment(items, startIndexFrom = 0){
                const fragment = document.createDocumentFragment();
                for(let i = 0, length = items.length; i < length; i++) {
                    fragment.appendChild(buildItem(items[i], lastNumberOfItems));
                    lastNumberOfItems++;
                }
                return fragment;
            },
            add(items, delay = 2) {
                element.appendElement(Actions.toFragment(items));
            },
            replace(items) {
                clear(items);
                Actions.add(items);
            },
            reOrder(items) {
                let child = null;
                const fragment = document.createDocumentFragment();
                for(const item of items) {
                    child = getItemChild(item);
                    if(child) {
                        fragment.appendChild(child);
                    }
                }
                child = null;
                element.appendElement(fragment, blockEnd);
            },
            removeOne(element, index) {
                removeCacheItem(element, true);
            },
            clear,
            merge(items) {
                Actions.add(items);
            },
            push(items) {
                let delay = 0;
                if(configs.pushDelay) {
                    delay = configs.pushDelay(items) ?? 0;
                }

                Actions.add(items, delay);
            },
            populate([target, iteration, callback]) {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < iteration; i++) {
                    const data = callback(i);
                    target.push(data);
                    fragment.append(buildItem(data, i));
                    lastNumberOfItems++;
                }
                element.appendChild(fragment);
                fragment.replaceChildren();
            },
            unshift(values){
                element.insertBefore(Actions.toFragment(values), blockStart.nextSibling);
            },
            splice(args, deleted) {
                const [start, deleteCount, ...values] = args;
                let elementBeforeFirst = null;
                const garbageFragment = document.createDocumentFragment();

                if(deleted.length > 0) {
                    let firstItem = deleted[0];
                    if(deleted.length === 1) {
                        removeByItem(firstItem, garbageFragment);
                    } else if(deleted.length > 1) {
                        const firstChildRemoved = getItemChild(deleted[0]);
                        elementBeforeFirst = firstChildRemoved?.previousSibling;

                        for(let i = 0; i < deleted.length; i++) {
                            removeByItem(deleted[i], garbageFragment);
                        }
                    }
                } else {
                    elementBeforeFirst = blockEnd;
                }
                garbageFragment.replaceChildren();

                if(values && values.length && elementBeforeFirst) {
                    element.insertBefore(Actions.toFragment(values), elementBeforeFirst.nextSibling);
                }

            },
            reverse(_, reversed) {
                Actions.reOrder(reversed);
            },
            sort(_, sorted) {
                Actions.reOrder(sorted);
            },
            remove(_, deleted) {
                Actions.removeOne(deleted);
            },
            pop(_, deleted) {
                Actions.removeOne(deleted);
            },
            shift(_, deleted) {
                Actions.removeOne(deleted);
            },
            swap(args, elements) {
                const parent = blockEnd.parentNode;

                let childA = getItemChild(elements[0]);
                let childB = getItemChild(elements[1]);
                if(!childA || !childB) {
                    return;
                }

                const childBNext = childB.nextSibling;
                parent.insertBefore(childB, childA);
                parent.insertBefore(childA, childBNext);
                childA = null;
                childB = null;
            }
        };

        const buildContent = (items, _, operations) => {
            if(operations?.action === 'clear' || !items.length) {
                if(lastNumberOfItems === 0) {
                    return;
                }
                clear();
                return;
            }

            if(!operations?.action) {
                if(lastNumberOfItems === 0) {
                    Actions.add(items);
                    return;
                }
                Actions.replace(items);
            }
            else if(Actions[operations.action]) {
                Actions[operations.action](operations.args, operations.result);
            }

            updateIndexObservers(items, 0);
        };

        if(data.val().length) {
            buildContent(data.val(), null, {action: null});
        }
        if(Validator.isObservable(data)) {
            data.subscribe(buildContent);
        }

        return element;
    }

    /**
     * Conditionally shows an element based on an observable condition.
     * The element is mounted/unmounted from the DOM as the condition changes.
     *
     * @param {ObservableItem<boolean>|ObservableChecker<boolean>|ObservableWhen} condition - Observable condition to watch
     * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
     * @param {Object} [options={}] - Configuration options
     * @param {string|null} [options.comment=null] - Comment for debugging
     * @param {boolean} [options.shouldKeepInCache=true] - Whether to cache the element when hidden
     * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
     * @example
     * const isVisible = Observable(false);
     * ShowIf(isVisible, Div({}, 'Hello World'));
     */
    const ShowIf = function(condition, child, { comment = null, shouldKeepInCache = true} = {}) {
        if(!(Validator.isObservable(condition)) && !Validator.isObservableWhenResult(condition)) {
            return DebugManager$1.warn('ShowIf', "ShowIf : condition must be an Observable / "+comment, condition);
        }
        const element = Anchor('Show if : '+(comment || ''));

        let childElement = null;
        const getChildElement = () => {
            if(childElement && shouldKeepInCache) {
                return childElement;
            }
            childElement = ElementCreator.getChild(child);
            if(Validator.isFragment(childElement)) {
                childElement = Array.from(childElement.childNodes);
            }
            return childElement;
        };

        const currentValue = condition.val();

        if(currentValue) {
            element.appendChild(getChildElement());
        }
        condition.subscribe(value => {
            if(value) {
                element.appendChild(getChildElement());
            } else {
                element.remove();
            }
        });

        return element;
    };

    /**
     * Conditionally hides an element when the observable condition is true.
     * Inverse of ShowIf - element is shown when condition is false.
     *
     * @param {ObservableItem<boolean>|ObservableChecker<boolean>} condition - Observable condition to watch
     * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
     * @param {Object} [configs] - Configuration options
     * @param {string|null} [configs.comment] - Comment for debugging
     * @param {boolean} [configs.shouldKeepInCache] - Whether to cache element when hidden
     * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
     * @example
     * const hasError = Observable(false);
     * HideIf(hasError, Div({}, 'Content'));
     */
    const HideIf = function(condition, child, configs) {
        const hideCondition = Observable(!condition.val());
        condition.subscribe(value => hideCondition.set(!value));

        return ShowIf(hideCondition, child, configs);
    };

    /**
     * Conditionally hides an element when the observable condition is false.
     * Same as ShowIf - element is shown when condition is true.
     *
     * @param {ObservableItem<boolean>|ObservableChecker<boolean>|ObservableWhen} condition - Observable condition to watch
     * @param {NdChild|(() => NdChild)} child - Element or content to show/hide
     * @param {Object} [configs] - Configuration options
     * @param {string|null} [configs.comment] - Comment for debugging
     * @param {boolean} [configs.shouldKeepInCache] - Whether to cache element when hidden
     * @returns {AnchorDocumentFragment} Anchor fragment managing the conditional content
     */
    const HideIfNot = function(condition, child, configs) {
        return ShowIf(condition, child, configs);
    };

    /**
     * Shows content when an observable equals a specific value.
     * Can be called with 2 or 3 arguments.
     *
     * @overload
     * @param {ObservableWhen} observerWhenResult - Result from observable.when(value)
     * @param {NdChild|(() => NdChild)} view - Content to show when condition matches
     * @returns {AnchorDocumentFragment}
     *
     * @overload
     * @param {ObservableItem} observer - Observable to watch
     * @param {*} target - Value to match
     * @param {NdChild|(() => NdChild)} view - Content to show when observable equals target
     * @returns {AnchorDocumentFragment}
     *
     * @example
     * // 2 arguments
     * const status = Observable('idle');
     * ShowWhen(status.when('loading'), LoadingSpinner());
     *
     * // 3 arguments
     * ShowWhen(status, 'loading', LoadingSpinner());
     */
    const ShowWhen = function() {
        if(arguments.length === 2) {
            const [observer, target] = arguments;
            if(!Validator.isObservableWhenResult(observer)) {
                throw new NativeDocumentError('showWhen observer must be an ObservableWhenResult', {
                    data: observer,
                    'help': 'Use observer.when(target) to create an ObservableWhenResult'
                });
            }
            return ShowIf(observer, target);
        }
        if(arguments.length === 3) {
            const [observer, target, view] = arguments;
            if(!Validator.isObservable(observer)) {
                throw new NativeDocumentError('showWhen observer must be an Observable', {
                    data: observer,
                });
            }
            return ShowIf(observer.when(target), view);
        }
        throw new NativeDocumentError('showWhen must have 2 or 3 arguments', {
            data: [
                'showWhen(observer, target, view)',
                'showWhen(observerWhenResult, view)',
            ]
        });
    };

    /**
     * Displays different content based on the current value of an observable.
     * Like a switch statement for UI - shows the content corresponding to current value.
     *
     * @param {ObservableItem|ObservableChecker} $condition - Observable to watch
     * @param {Object<string|number, NdChild|(() => NdChild)>} values - Map of values to their corresponding content
     * @param {boolean} [shouldKeepInCache=true] - Whether to cache rendered views
     * @returns {AnchorDocumentFragment & {add: Function, remove: Function}} Fragment with dynamic methods
     * @example
     * const status = Observable('idle');
     * const view = Match(status, {
     *   idle: Div({}, 'Ready'),
     *   loading: Div({}, 'Loading...'),
     *   error: Div({}, 'Error occurred')
     * });
     *
     * // Dynamic addition
     * view.add('success', Div({}, 'Success!'));
     * view.remove('idle');
     */
    const Match = function($condition, values, shouldKeepInCache = true) {

        if(!Validator.isObservable($condition)) {
            throw new NativeDocumentError("Toggle : condition must be an Observable");
        }

        const anchor = Anchor('Match');
        const cache = new Map();

        const getItem = function(key) {
            if(shouldKeepInCache && cache.has(key)) {
                return cache.get(key);
            }
            let item = values[key];
            if(!item) {
                return null;
            }
            item = ElementCreator.getChild(item);
            if(Validator.isFragment(item)) {
                item = Array.from(item.children);
            }
            shouldKeepInCache && cache.set(key, item);
            return item;
        };

        const defaultValue = $condition.val();
        const defaultContent = getItem(defaultValue);
        if(defaultContent) {
            anchor.appendChild(defaultContent);
        }

        $condition.subscribe(value => {
            const content = getItem(value);
            anchor.remove();
            if(content) {
                anchor.appendChild(content);
            }
        });

        return anchor.nd.with({
            add(key, view, shouldFocusOn = false) {
                values[key] = view;
                if(shouldFocusOn) {
                    $condition.set(key);
                }
            },
            remove(key) {
                shouldKeepInCache && cache.delete(key);
                delete values[key];
            }
        });
    };


    /**
     * Displays one of two views based on a boolean observable condition.
     * Simplified version of Match for true/false cases.
     *
     * @param {ObservableItem<boolean>|ObservableChecker<boolean>} $condition - Boolean observable to watch
     * @param {ValidChild} onTrue - Content to show when condition is true
     * @param {ValidChild} onFalse - Content to show when condition is false
     * @returns {AnchorDocumentFragment} Fragment managing the conditional content
     * @example
     * const isLoggedIn = Observable(false);
     * Switch(isLoggedIn,
     *   Div({}, 'Welcome back!'),
     *   Div({}, 'Please login')
     * );
     */
    const Switch = function ($condition, onTrue, onFalse) {
        if(!Validator.isObservable($condition)) {
            throw new NativeDocumentError("Toggle : condition must be an Observable");
        }

        return Match($condition, {
            true: onTrue,
            false: onFalse,
        });
    };

    /**
     * Provides a fluent API for conditional rendering with show/otherwise pattern.
     *
     * @param {ObservableItem<boolean>|ObservableChecker<boolean>} $condition - Boolean observable to watch
     * @returns {{show: Function, otherwise: Function}} Object with fluent methods
     * @example
     * const isLoading = Observable(false);
     * When(isLoading)
     *   .show(LoadingSpinner())
     *   .otherwise(Content());
     */
    const When = function($condition) {
        if(!Validator.isObservable($condition)) {
            throw new NativeDocumentError("When : condition must be an Observable");
        }

        let $onTrue = null;
        let $onFalse = null;

        return {
            show(onTrue) {
                $onTrue = onTrue;
                return this;
            },
            otherwise(onFalse) {
                $onFalse = onFalse;
                return Switch($condition, $onTrue, $onFalse);
            },
            toNdElement() {
                return Switch($condition, $onTrue, $onFalse);
            }
        }
    };

    /**
     * Creates a `<div>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDivElement}
     */
    const Div = HtmlElementWrapper('div');

    /**
     * Creates a `<span>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLSpanElement}
     */
    const Span = HtmlElementWrapper('span');

    /**
     * Creates a `<label>` element.
     * @type {function(LabelAttributes=, NdChild|NdChild[]=): HTMLLabelElement}
     */
    const Label = HtmlElementWrapper('label');

    /**
     * Creates a `<p>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLParagraphElement}
     */
    const P = HtmlElementWrapper('p');

    /**
     * Alias for {@link P}.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLParagraphElement}
     */
    const Paragraph = P;

    /**
     * Creates a `<strong>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Strong = HtmlElementWrapper('strong');

    /**
     * Creates a `<h1>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H1 = HtmlElementWrapper('h1');

    /**
     * Creates a `<h2>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H2 = HtmlElementWrapper('h2');

    /**
     * Creates a `<h3>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H3 = HtmlElementWrapper('h3');

    /**
     * Creates a `<h4>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H4 = HtmlElementWrapper('h4');

    /**
     * Creates a `<h5>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H5 = HtmlElementWrapper('h5');

    /**
     * Creates a `<h6>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLHeadingElement}
     */
    const H6 = HtmlElementWrapper('h6');

    /**
     * Creates a `<br>` element.
     * @type {function(GlobalAttributes=): HTMLBRElement}
     */
    const Br = HtmlElementWrapper('br');

    /**
     * Creates an `<a>` element.
     * @type {function(AnchorAttributes=, NdChild|NdChild[]=): HTMLAnchorElement}
     */
    const Link$1 = HtmlElementWrapper('a');

    /**
     * Creates a `<pre>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLPreElement}
     */
    const Pre = HtmlElementWrapper('pre');

    /**
     * Creates a `<code>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Code = HtmlElementWrapper('code');

    /**
     * Creates a `<blockquote>` element.
     * @type {function(GlobalAttributes & { cite?: string }=, NdChild|NdChild[]=): HTMLQuoteElement}
     */
    const Blockquote = HtmlElementWrapper('blockquote');

    /**
     * Creates an `<hr>` element.
     * @type {function(GlobalAttributes=): HTMLHRElement}
     */
    const Hr = HtmlElementWrapper('hr');

    /**
     * Creates an `<em>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Em = HtmlElementWrapper('em');

    /**
     * Creates a `<small>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Small = HtmlElementWrapper('small');

    /**
     * Creates a `<mark>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Mark = HtmlElementWrapper('mark');

    /**
     * Creates a `<del>` element.
     * @type {function(ModAttributes=, NdChild|NdChild[]=): HTMLModElement}
     */
    const Del = HtmlElementWrapper('del');

    /**
     * Creates an `<ins>` element.
     * @type {function(ModAttributes=, NdChild|NdChild[]=): HTMLModElement}
     */
    const Ins = HtmlElementWrapper('ins');

    /**
     * Creates a `<sub>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Sub = HtmlElementWrapper('sub');

    /**
     * Creates a `<sup>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Sup = HtmlElementWrapper('sup');

    /**
     * Creates an `<abbr>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Abbr = HtmlElementWrapper('abbr');

    /**
     * Creates a `<cite>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Cite = HtmlElementWrapper('cite');

    /**
     * Creates a `<q>` element.
     * @type {function(GlobalAttributes & { cite?: string }=, NdChild|NdChild[]=): HTMLQuoteElement}
     */
    const Quote = HtmlElementWrapper('q');

    /**
     * Creates a `<dl>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDListElement}
     */
    const Dl = HtmlElementWrapper('dl');

    /**
     * Creates a `<dt>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Dt = HtmlElementWrapper('dt');

    /**
     * Creates a `<dd>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Dd = HtmlElementWrapper('dd');

    /**
     * Creates a `<form>` element.
     * Extended with fluent methods: `.submit()`, `.post()`, `.get()`, `.multipartFormData()`.
     * @type {function(FormAttributes=, NdChild|NdChild[]=): HTMLFormElement & {
     *   submit: (actionOrFn: string | ((e: SubmitEvent) => void)) => HTMLFormElement,
     *   post: (action: string) => HTMLFormElement,
     *   get: (action: string) => HTMLFormElement,
     *   multipartFormData: () => HTMLFormElement,
     * }}
     */
    const Form = HtmlElementWrapper('form', function(el) {

        el.submit = function(action) {
            if(typeof action === 'function') {
                el.onSubmit((e) => {
                    e.preventDefault();
                    action(e);
                });
                return el;
            }
            this.setAttribute('action', action);
            return el;
        };
        el.multipartFormData = function() {
            this.setAttribute('enctype', 'multipart/form-data');
            return el;
        };
        el.post = function(action) {
            this.setAttribute('method', 'post');
            this.setAttribute('action', action);
            return el;
        };
        el.get = function(action) {
            this.setAttribute('method', 'get');
            this.setAttribute('action', action);
        };
        return el;
    });

    /**
     * Creates an `<input>` element.
     * @type {function(InputAttributes=): HTMLInputElement}
     */
    const Input = HtmlElementWrapper('input');

    /**
     * Creates a `<textarea>` element.
     * @type {function(TextAreaAttributes=, NdChild|NdChild[]=): HTMLTextAreaElement}
     */
    const TextArea = HtmlElementWrapper('textarea');

    /**
     * Alias for {@link TextArea}.
     * @type {function(TextAreaAttributes=, NdChild|NdChild[]=): HTMLTextAreaElement}
     */
    const TextInput = TextArea;

    /**
     * Creates a `<select>` element.
     * @type {function(SelectAttributes=, NdChild|NdChild[]=): HTMLSelectElement}
     */
    const Select = HtmlElementWrapper('select');

    /**
     * Creates a `<fieldset>` element.
     * @type {function(GlobalAttributes & { disabled?: Observable<boolean>|boolean }=, NdChild|NdChild[]=): HTMLFieldSetElement}
     */
    const FieldSet = HtmlElementWrapper('fieldset');

    /**
     * Creates an `<option>` element.
     * @type {function(OptionAttributes=, NdChild|NdChild[]=): HTMLOptionElement}
     */
    const Option = HtmlElementWrapper('option');

    /**
     * Creates a `<legend>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLLegendElement}
     */
    const Legend = HtmlElementWrapper('legend');

    /**
     * Creates a `<datalist>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDataListElement}
     */
    const Datalist = HtmlElementWrapper('datalist');

    /**
     * Creates an `<output>` element.
     * @type {function(OutputAttributes=, NdChild|NdChild[]=): HTMLOutputElement}
     */
    const Output = HtmlElementWrapper('output');

    /**
     * Creates a `<progress>` element.
     * @type {function(ProgressAttributes=, NdChild|NdChild[]=): HTMLProgressElement}
     */
    const Progress = HtmlElementWrapper('progress');

    /**
     * Creates a `<meter>` element.
     * @type {function(MeterAttributes=, NdChild|NdChild[]=): HTMLMeterElement}
     */
    const Meter = HtmlElementWrapper('meter');

    /**
     * Creates an `<input readonly>` element.
     * @param {Omit<InputAttributes, 'type'|'readonly'|'readOnly'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const ReadonlyInput = (attributes) => Input({ readonly: true, ...attributes });

    /**
     * Creates an `<input type="hidden">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const HiddenInput = (attributes) => Input({ type: 'hidden', ...attributes });

    /**
     * Creates an `<input type="file">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const FileInput = (attributes) => Input({ type: 'file', ...attributes });

    /**
     * Creates an `<input type="password">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const PasswordInput = (attributes) => Input({ type: 'password', ...attributes });

    /**
     * Creates an `<input type="checkbox">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const Checkbox = (attributes) => Input({ type: 'checkbox', ...attributes });

    /**
     * Creates an `<input type="radio">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const Radio = (attributes) => Input({ type: 'radio', ...attributes });

    /**
     * Creates an `<input type="range">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const RangeInput = (attributes) => Input({ type: 'range', ...attributes });

    /**
     * Creates an `<input type="color">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const ColorInput = (attributes) => Input({ type: 'color', ...attributes });

    /**
     * Creates an `<input type="date">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const DateInput = (attributes) => Input({ type: 'date', ...attributes });

    /**
     * Creates an `<input type="time">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const TimeInput = (attributes) => Input({ type: 'time', ...attributes });

    /**
     * Creates an `<input type="datetime-local">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const DateTimeInput = (attributes) => Input({ type: 'datetime-local', ...attributes });

    /**
     * Creates an `<input type="week">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const WeekInput = (attributes) => Input({ type: 'week', ...attributes });

    /**
     * Creates an `<input type="month">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const MonthInput = (attributes) => Input({ type: 'month', ...attributes });

    /**
     * Creates an `<input type="search">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const SearchInput = (attributes) => Input({ type: 'search', ...attributes });

    /**
     * Creates an `<input type="tel">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const TelInput = (attributes) => Input({ type: 'tel', ...attributes });

    /**
     * Creates an `<input type="url">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const UrlInput = (attributes) => Input({ type: 'url', ...attributes });

    /**
     * Creates an `<input type="email">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const EmailInput = (attributes) => Input({ type: 'email', ...attributes });

    /**
     * Creates an `<input type="number">` element.
     * @param {Omit<InputAttributes, 'type'>} [attributes]
     * @returns {HTMLInputElement}
     */
    const NumberInput = (attributes) => Input({ type: 'number', ...attributes });

    /**
     * Creates a `<button>` element.
     * @type {function(ButtonAttributes=, NdChild|NdChild[]=): HTMLButtonElement}
     */
    const Button = HtmlElementWrapper('button');

    /**
     * Creates a `<button type="button">` element.
     * @param {NdChild|NdChild[]} [child]
     * @param {Omit<ButtonAttributes, 'type'>} [attributes]
     * @returns {HTMLButtonElement}
     */
    const SimpleButton = (child, attributes) => Button(child, { type: 'button', ...attributes });

    /**
     * Creates a `<button type="submit">` element.
     * @param {NdChild|NdChild[]} [child]
     * @param {Omit<ButtonAttributes, 'type'>} [attributes]
     * @returns {HTMLButtonElement}
     */
    const SubmitButton = (child, attributes) => Button(child, { type: 'submit', ...attributes });

    /**
     * Creates a `<main>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Main = HtmlElementWrapper('main');

    /**
     * Creates a `<section>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Section = HtmlElementWrapper('section');

    /**
     * Creates an `<article>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Article = HtmlElementWrapper('article');

    /**
     * Creates an `<aside>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Aside = HtmlElementWrapper('aside');

    /**
     * Creates a `<nav>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Nav = HtmlElementWrapper('nav');

    /**
     * Creates a `<figure>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Figure = HtmlElementWrapper('figure');

    /**
     * Creates a `<figcaption>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const FigCaption = HtmlElementWrapper('figcaption');

    /**
     * Creates a `<header>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Header = HtmlElementWrapper('header');

    /**
     * Creates a `<footer>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Footer = HtmlElementWrapper('footer');

    /**
     * Creates an `<img>` element.
     * @type {function(ImgAttributes=): HTMLImageElement}
     */
    const BaseImage = HtmlElementWrapper('img');

    /**
     * Creates an `<img>` element.
     * @param {Observable<string>|string} src
     * @param {Omit<ImgAttributes, 'src'>} [attributes]
     * @returns {HTMLImageElement}
     */
    const Img = function(src, attributes) {
        return BaseImage({ src, ...attributes });
    };

    /**
     * Creates an `<img>` that loads asynchronously, showing a placeholder until the image is ready.
     * Supports reactive `src` — automatically updates when the observable changes.
     * @param {Observable<string>|string} src                                        - Final image URL
     * @param {string|null}               defaultImage                               - Placeholder shown while loading
     * @param {Omit<ImgAttributes, 'src'>} attributes
     * @param {(error: NativeDocumentError|null, img: HTMLImageElement) => void} [callback]
     * @returns {HTMLImageElement}
     */
    const AsyncImg = function(src, defaultImage, attributes, callback) {
        const defaultSrc = Validator.isObservable(src) ? src.val() : src;
        const image = Img(defaultImage || defaultSrc, attributes);
        const img = new Image();

        img.onload = () => {
            Validator.isFunction(callback) && callback(null, image);
            image.src = Validator.isObservable(src) ? src.val() : src;
        };
        img.onerror = () => {
            Validator.isFunction(callback) && callback(new NativeDocumentError('Image not found'));
        };
        if(Validator.isObservable(src)) {
            src.subscribe(newSrc => {
                img.src = newSrc;
            });
        }
        img.src = defaultSrc;
        return image;
    };

    /**
     * Creates an `<img loading="lazy">` element.
     * @param {Observable<string>|string}          src
     * @param {Omit<ImgAttributes, 'src'|'loading'>} [attributes]
     * @returns {HTMLImageElement}
     */
    const LazyImg = function(src, attributes) {
        return Img(src, { ...attributes, loading: 'lazy' });
    };

    /**
     * Creates a `<details>` element.
     * @type {function(DetailsAttributes=, NdChild|NdChild[]=): HTMLDetailsElement}
     */
    const Details = HtmlElementWrapper('details');

    /**
     * Creates a `<summary>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Summary = HtmlElementWrapper('summary');

    /**
     * Creates a `<dialog>` element.
     * @type {function(DialogAttributes=, NdChild|NdChild[]=): HTMLDialogElement}
     */
    const Dialog = HtmlElementWrapper('dialog');

    /**
     * Creates a `<menu>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLMenuElement}
     */
    const Menu = HtmlElementWrapper('menu');

    /**
     * Creates an `<ol>` element.
     * @type {function(OlAttributes=, NdChild|NdChild[]=): HTMLOListElement}
     */
    const OrderedList = HtmlElementWrapper('ol');

    /**
     * Creates a `<ul>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLUListElement}
     */
    const UnorderedList = HtmlElementWrapper('ul');

    /**
     * Creates a `<li>` element.
     * @type {function(GlobalAttributes & { value?: number }=, NdChild|NdChild[]=): HTMLLIElement}
     */
    const ListItem = HtmlElementWrapper('li');

    /**
     * Alias for {@link ListItem}.
     * @type {typeof ListItem}
     */
    const Li = ListItem;

    /**
     * Alias for {@link OrderedList}.
     * @type {typeof OrderedList}
     */
    const Ol = OrderedList;

    /**
     * Alias for {@link UnorderedList}.
     * @type {typeof UnorderedList}
     */
    const Ul = UnorderedList;

    /**
     * Creates an `<audio>` element.
     * @type {function(AudioAttributes=, NdChild|NdChild[]=): HTMLAudioElement}
     */
    const Audio = HtmlElementWrapper('audio');

    /**
     * Creates a `<video>` element.
     * @type {function(VideoAttributes=, NdChild|NdChild[]=): HTMLVideoElement}
     */
    const Video = HtmlElementWrapper('video');

    /**
     * Creates a `<source>` element.
     * @type {function(SourceAttributes=): HTMLSourceElement}
     */
    const Source = HtmlElementWrapper('source');

    /**
     * Creates a `<track>` element.
     * @type {function(TrackAttributes=): HTMLTrackElement}
     */
    const Track = HtmlElementWrapper('track');

    /**
     * Creates a `<canvas>` element.
     * @type {function(CanvasAttributes=, NdChild|NdChild[]=): HTMLCanvasElement}
     */
    const Canvas = HtmlElementWrapper('canvas');

    /**
     * Creates an `<svg>` element.
     * @type {function(SvgAttributes=, NdChild|NdChild[]=): SVGSVGElement}
     */
    const Svg = HtmlElementWrapper('svg');

    /**
     * Creates a `<time>` element.
     * @type {function(TimeAttributes=, NdChild|NdChild[]=): HTMLTimeElement}
     */
    const Time = HtmlElementWrapper('time');

    /**
     * Creates a `<data>` element.
     * @type {function(GlobalAttributes & { value?: Observable<string>|string }=, NdChild|NdChild[]=): HTMLDataElement}
     */
    const Data = HtmlElementWrapper('data');

    /**
     * Creates an `<address>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Address = HtmlElementWrapper('address');

    /**
     * Creates a `<kbd>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Kbd = HtmlElementWrapper('kbd');

    /**
     * Creates a `<samp>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Samp = HtmlElementWrapper('samp');

    /**
     * Creates a `<var>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLElement}
     */
    const Var = HtmlElementWrapper('var');

    /**
     * Creates a `<wbr>` element.
     * @type {function(GlobalAttributes=): HTMLElement}
     */
    const Wbr = HtmlElementWrapper('wbr');

    /**
     * Creates a `<caption>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableCaptionElement}
     */
    const Caption = HtmlElementWrapper('caption');

    /**
     * Creates a `<table>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableElement}
     */
    const Table = HtmlElementWrapper('table');

    /**
     * Creates a `<thead>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
     */
    const THead = HtmlElementWrapper('thead');

    /**
     * Creates a `<tfoot>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
     */
    const TFoot = HtmlElementWrapper('tfoot');

    /**
     * Creates a `<tbody>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableSectionElement}
     */
    const TBody = HtmlElementWrapper('tbody');

    /**
     * Creates a `<tr>` element.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLTableRowElement}
     */
    const Tr = HtmlElementWrapper('tr');

    /**
     * Alias for {@link Tr}.
     * @type {typeof Tr}
     */
    const TRow = Tr;

    /**
     * Creates a `<th>` element.
     * @type {function(ThAttributes=, NdChild|NdChild[]=): HTMLTableCellElement}
     */
    const Th = HtmlElementWrapper('th');

    /**
     * Alias for {@link Th}.
     * @type {typeof Th}
     */
    const THeadCell = Th;

    /**
     * Alias for {@link Th}.
     * @type {typeof Th}
     */
    const TFootCell = Th;

    /**
     * Creates a `<td>` element.
     * @type {function(TdAttributes=, NdChild|NdChild[]=): HTMLTableCellElement}
     */
    const Td = HtmlElementWrapper('td');

    /**
     * Alias for {@link Td}.
     * @type {typeof Td}
     */
    const TBodyCell = Td;

    /**
     * Creates an empty `DocumentFragment` wrapper.
     * Useful for grouping elements without adding a DOM node.
     * @type {function(GlobalAttributes=, NdChild|NdChild[]=): DocumentFragment}
     */
    const Fragment = HtmlElementWrapper('');

    var elements = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Abbr: Abbr,
        Address: Address,
        Anchor: Anchor,
        Article: Article,
        Aside: Aside,
        AsyncImg: AsyncImg,
        Audio: Audio,
        BaseImage: BaseImage,
        Blockquote: Blockquote,
        Br: Br,
        Button: Button,
        Canvas: Canvas,
        Caption: Caption,
        Checkbox: Checkbox,
        Cite: Cite,
        Code: Code,
        ColorInput: ColorInput,
        Data: Data,
        Datalist: Datalist,
        DateInput: DateInput,
        DateTimeInput: DateTimeInput,
        Dd: Dd,
        Del: Del,
        Details: Details,
        Dialog: Dialog,
        Div: Div,
        Dl: Dl,
        Dt: Dt,
        Em: Em,
        EmailInput: EmailInput,
        FieldSet: FieldSet,
        FigCaption: FigCaption,
        Figure: Figure,
        FileInput: FileInput,
        Footer: Footer,
        ForEach: ForEach,
        ForEachArray: ForEachArray,
        Form: Form,
        Fragment: Fragment,
        H1: H1,
        H2: H2,
        H3: H3,
        H4: H4,
        H5: H5,
        H6: H6,
        Header: Header,
        HiddenInput: HiddenInput,
        HideIf: HideIf,
        HideIfNot: HideIfNot,
        Hr: Hr,
        Img: Img,
        Input: Input,
        Ins: Ins,
        Kbd: Kbd,
        Label: Label,
        LazyImg: LazyImg,
        Legend: Legend,
        Li: Li,
        Link: Link$1,
        ListItem: ListItem,
        Main: Main,
        Mark: Mark,
        Match: Match,
        Menu: Menu,
        Meter: Meter,
        MonthInput: MonthInput,
        NativeDocumentFragment: Anchor,
        Nav: Nav,
        NumberInput: NumberInput,
        Ol: Ol,
        Option: Option,
        OrderedList: OrderedList,
        Output: Output,
        P: P,
        Paragraph: Paragraph,
        PasswordInput: PasswordInput,
        Pre: Pre,
        Progress: Progress,
        Quote: Quote,
        Radio: Radio,
        RangeInput: RangeInput,
        ReadonlyInput: ReadonlyInput,
        Samp: Samp,
        SearchInput: SearchInput,
        Section: Section,
        Select: Select,
        ShowIf: ShowIf,
        ShowWhen: ShowWhen,
        SimpleButton: SimpleButton,
        Small: Small,
        Source: Source,
        Span: Span,
        Strong: Strong,
        Sub: Sub,
        SubmitButton: SubmitButton,
        Summary: Summary,
        Sup: Sup,
        Svg: Svg,
        Switch: Switch,
        TBody: TBody,
        TBodyCell: TBodyCell,
        TFoot: TFoot,
        TFootCell: TFootCell,
        THead: THead,
        THeadCell: THeadCell,
        TRow: TRow,
        Table: Table,
        Td: Td,
        TelInput: TelInput,
        TextArea: TextArea,
        TextInput: TextInput,
        Th: Th,
        Time: Time,
        TimeInput: TimeInput,
        Tr: Tr,
        Track: Track,
        Ul: Ul,
        UnorderedList: UnorderedList,
        UrlInput: UrlInput,
        Var: Var,
        Video: Video,
        Wbr: Wbr,
        WeekInput: WeekInput,
        When: When,
        createPortal: createPortal
    });

    const RouteParamPatterns = {

    };

    /**
     * Creates a new Route instance.
     *
     * @param {string} $path - URL pattern with optional parameters (e.g., '/user/{id:number}')
     * @param {Function} $component - Component function that returns HTMLElement or DocumentFragment
     * @param {Object} [$options={}] - Route configuration options
     * @param {string} [$options.name] - Unique name for the route (used for navigation)
     * @param {Function[]} [$options.middlewares] - Array of middleware functions
     * @param {boolean} [$options.shouldRebuild] - Whether to rebuild component on each navigation
     * @param {Object} [$options.with] - Custom parameter validation patterns
     * @param {Function} [$options.layout] - Layout component wrapper function
     */
    function Route($path, $component, $options = {}) {

        $path = '/'+trim($path, '/').replace(/\/+/, '/');

        let $pattern = null;
        let $name = $options.name || null;

        const $middlewares = $options.middlewares || [];
        const $shouldRebuild = $options.shouldRebuild || false;
        const $paramsValidators = $options.with || {};
        const $layout = $options.layout  || null;

        const $params = {};
        const $paramsNames = [];


        const paramsExtractor = (description) => {
            if(!description) return null;
            const [name, type] = description.split(':');

            let pattern = $paramsValidators[name];
            if(!pattern && type) {
                pattern = RouteParamPatterns[type];
            }
            if(!pattern) {
                pattern = '[^/]+';
            }

            pattern = pattern.replace('(', '(?:');

            return { name, pattern: `(${pattern})` };
        };

        const getPattern = () => {
            if($pattern) {
                return $pattern;
            }

            const patternDescription = $path.replace(/\{(.*?)}/ig, (block, definition) => {
                const description = paramsExtractor(definition);
                if(!description || !description.pattern) return block;
                $params[description.name] = description.pattern;
                $paramsNames.push(description.name);
                return description.pattern;
            });

            $pattern = new RegExp('^'+patternDescription+'$');
            return $pattern;
        };

        this.name = () => $name;
        this.component = () => $component;
        this.middlewares = () => $middlewares;
        this.shouldRebuild = () => $shouldRebuild;
        this.path = () => $path;
        this.layout = () => $layout;

        /**
         *
         * @param {string} path
         */
        this.match = function(path) {
            path = '/'+trim(path, '/');
            const match = getPattern().exec(path);
            if(!match) return false;
            const params = {};

            getPattern().exec(path).forEach((value, index) => {
                if(index < 1) return;
                const name = $paramsNames[index - 1];
                params[name] = value;
            });

            return params;
        };
        /**
         * @param {{params: ?Object, query: ?Object, basePath: ?string}} configs
         */
        this.url = function(configs) {
            const path = $path.replace(/\{(.*?)}/ig, (block, definition) => {
                const description = paramsExtractor(definition);
                if(configs.params && configs.params[description.name]) {
                    return configs.params[description.name];
                }
                throw new Error(`Missing parameter '${description.name}'`);
            });

            const queryString = (typeof configs.query === 'object') ? (new URLSearchParams(configs.query)).toString() : null;
            return (configs.basePath ? configs.basePath : '') + (queryString ? `${path}?${queryString}` : path);
        };
    }

    class RouterError extends Error {
        constructor(message, context) {
            super(message);
            this.context = context;
        }
    }

    const RouteGroupHelper = {
        /**
         *
         * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
         * @param {string} path
         * @returns {string}
         */
        fullPath: ($groupTree, path) => {
            const fullPath = [];
            $groupTree.forEach(group => {
                fullPath.push(trim(group.suffix, '/'));
            });
            fullPath.push(trim(path, '/'));
            return fullPath.join('/');
        },
        /**
         *
         * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
         * @param {Function[]} middlewares
         * @returns {Function[]}
         */
        fullMiddlewares: ($groupTree, middlewares) => {
            const fullMiddlewares = [];
            $groupTree.forEach(group => {
                if(group.options.middlewares) {
                    fullMiddlewares.push(...group.options.middlewares);
                }
            });
            if(middlewares) {
                fullMiddlewares.push(...middlewares);
            }
            return fullMiddlewares;
        },
        /**
         *
         * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
         * @param {string} name
         * @returns {string}
         */
        fullName: ($groupTree, name) => {
            const fullName = [];
            $groupTree.forEach(group => {
                if(group.options?.name) {
                    fullName.push(group.options.name);
                }
            });
            name && fullName.push(name);
            return fullName.join('.');
        },
        layout: ($groupTree) => {
            for(let i = $groupTree.length - 1; i >= 0; i--) {
                if($groupTree[i]?.options?.layout) {
                    return $groupTree[i].options.layout;
                }
            }
            return null;
        }
    };

    function HashRouter() {

        const $history = [];
        let $currentIndex = 0;

        /**
         *
         * @param {number} delta
         */
        const go = (delta) => {
            const index = $currentIndex + delta;
            if(!$history[index]) {
                return;
            }
            $currentIndex = index;
            const { route, params, query, path } = $history[index];
            setHash(path);
        };

        const canGoBack = function() {
            return $currentIndex > 0;
        };
        const canGoForward = function() {
            return $currentIndex < $history.length - 1;
        };

        /**
         *
         * @param {string} path
         */
        const setHash = (path) => {
            window.location.replace(`${window.location.pathname}${window.location.search}#${path}`);
        };

        const getCurrentHash = () => window.location.hash.slice(1);

        /**
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.push = function(target) {
            const { route, params, query, path } = this.resolve(target);
            if(path === getCurrentHash()) {
                return;
            }
            $history.splice($currentIndex + 1);
            $history.push({ route, params, query, path });
            $currentIndex++;
            setHash(path);
        };
        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.replace = function(target) {
            const { route, params, query, path } = this.resolve(target);
            if(path === getCurrentHash()) {
                return;
            }
            $history[$currentIndex] = { route, params, query, path };
        };
        this.forward = function() {
            return canGoForward() && go(1);
        };
        this.back = function() {
            return canGoBack() && go(-1);
        };

        /**
         * @param {string} defaultPath
         */
        this.init = function(defaultPath) {
            window.addEventListener('hashchange', () => {
                const { route, params, query, path } = this.resolve(getCurrentHash());
                this.handleRouteChange(route, params, query, path);
            });
            const { route, params, query, path } = this.resolve(defaultPath || getCurrentHash());
            $history.push({ route, params, query, path });
            $currentIndex = 0;
            this.handleRouteChange(route, params, query, path);
        };
    }

    function HistoryRouter() {

        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.push = function(target) {
            try {
                const { route, path, params, query } = this.resolve(target);
                if(window.history.state && window.history.state.path === path) {
                    return;
                }
                window.history.pushState({ name: route.name(), params, path}, route.name() || path , path);
                this.handleRouteChange(route, params, query, path);
            } catch (e) {
                DebugManager$1.error('HistoryRouter', 'Error in pushState', e);
            }
        };
        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.replace = function(target) {
            const { route, path, params } = this.resolve(target);
            try {
                window.history.replaceState({ name: route.name(), params, path}, route.name() || path , path);
                this.handleRouteChange(route, params, {}, path);
            } catch(e) {
                DebugManager$1.error('HistoryRouter', 'Error in replaceState', e);
            }
        };
        this.forward = function() {
            window.history.forward();
        };

        this.back = function() {
            window.history.back();
        };

        /**
         * @param {string} defaultPath
         */
        this.init = function(defaultPath) {
            window.addEventListener('popstate', (event) => {
                try {
                    if(!event.state || !event.state.path) {
                        return;
                    }
                    const statePath = event.state.path;
                    const {route, params, query, path} = this.resolve(statePath);
                    if(!route) {
                        return;
                    }
                    this.handleRouteChange(route, params, query, path);
                } catch(e) {
                    DebugManager$1.error('HistoryRouter', 'Error in popstate event', e);
                }
            });
            const { route, params, query, path } = this.resolve(defaultPath || (window.location.pathname+window.location.search));
            this.handleRouteChange(route, params, query, path);
        };

    }

    function MemoryRouter() {
        const $history = [];
        let $currentIndex = 0;

        /**
         *
         * @param {number} delta
         */
        const go = (delta) => {
            const index = $currentIndex + delta;
            if(!$history[index]) {
                return;
            }
            $currentIndex = index;
            const { route, params, query, path } = $history[index];
            this.handleRouteChange(route, params, query, path);
        };

        const canGoBack = function() {
            return $currentIndex > 0;
        };
        const canGoForward = function() {
            return $currentIndex < $history.length - 1;
        };

        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.push = function(target) {
            const { route, params, query, path} = this.resolve(target);
            if($history[$currentIndex] && $history[$currentIndex].path === path) {
                return;
            }
            $history.splice($currentIndex + 1);
            $history.push({ route, params, query, path });
            $currentIndex++;
            this.handleRouteChange(route, params, query, path);
        };

        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         */
        this.replace = function(target) {
            const { route, params, query, path} = this.resolve(target);
            $history[$currentIndex] = { route, params, query, path };
            this.handleRouteChange(route, params, query, path);
        };

        this.forward = function() {
            return canGoForward() && go(1);
        };

        this.back = function() {
            return canGoBack() && go(-1);
        };

        /**
         * @param {string} defaultPath
         */
        this.init = function(defaultPath) {
            const currentPath = defaultPath || (window.location.pathname + window.location.search);
            const { route, params, query, path } = this.resolve(currentPath);
            $history.push({ route, params, query, path });
            $currentIndex = 0;

            this.handleRouteChange(route, params, query, path);
        };
    }

    /**
     *
     * @param {Router} router
     * @param {?HTMLElement} container
     */
    function RouterComponent(router, container) {

        const $cache = new Map();
        const $layoutCache = new WeakMap();
        const $routeInstanceAnchors = new WeakMap();
        let $currentLayout = null;

        let $lastNodeInserted  = null;

        const getNodeAnchorForLayout = (node, path) => {
            const existingAnchor = $routeInstanceAnchors.get(node);
            if(existingAnchor) {
                return existingAnchor;
            }

            let anchor = node;
            if(!Validator.isAnchor(node)) {
                anchor = Anchor(path);
                anchor.appendChild(node);
            }
            $routeInstanceAnchors.set(node, anchor);
            return anchor;
        };

        const removeLastNodeInserted = () => {
            if(Validator.isAnchor($lastNodeInserted)) {
                $lastNodeInserted.remove();
            }
        };
        const cleanContainer = () => {
            container.nodeValue = '';
            removeLastNodeInserted();

            if($currentLayout) {
                $currentLayout.remove();
            }
        };

        const getNodeToInsert = (node) => {
            let nodeToInsert = node;
            if(Validator.isNDElement(node)) {
                nodeToInsert = node.node();
            }
            return nodeToInsert;
        };

        const updateContainerByLayout = (layout, node, route, path) => {
            let nodeToInsert = getNodeToInsert(node);

            const cachedLayout = $layoutCache.get(nodeToInsert);
            if(cachedLayout) {
                if(cachedLayout === $currentLayout) {
                    const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
                    removeLastNodeInserted();
                    layoutAnchor.replaceContent(nodeToInsert);
                    return;
                }
                cleanContainer();
                $currentLayout = cachedLayout;
                const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
                layoutAnchor.replaceContent(nodeToInsert);
                container.appendChild($currentLayout);
                return;
            }
            cleanContainer();
            const anchor = getNodeAnchorForLayout(nodeToInsert, path);

            $currentLayout = layout(anchor);
            $layoutCache.set(nodeToInsert, $currentLayout);
            container.appendChild($currentLayout);
        };

        const updateContainer = function(node, route, path) {
            const layout = route.layout();
            if(layout) {
                updateContainerByLayout(layout, node, route, path);
                return;
            }
            let nodeToInsert = getNodeToInsert(node);

            cleanContainer();
            container.appendChild(nodeToInsert);
            $lastNodeInserted = node;
        };

        const handleCurrentRouterState = function(state) {
            if(!state.route) {
                return;
            }
            const { route, params, query, path } = state;
            if($cache.has(path)) {
                const cacheNode = $cache.get(path);
                updateContainer(cacheNode, route);
                return;
            }
            const Component = route.component();
            const node = Component({ params, query });
            $cache.set(path, node);
            updateContainer(node, route, path);
        };

        router.subscribe(handleCurrentRouterState);

        handleCurrentRouterState(router.currentState());
        return container;
    }

    const DEFAULT_ROUTER_NAME = 'default';

    /**
     *
     * @param {{mode: 'memory'|'history'|'hash'}} $options
     * @class
     */
    function Router($options = {}) {

        /** @type {Route[]} */
        const $routes = [];
        /** @type {{[string]: Route}} */
        const $routesByName = {};
        const $groupTree = [];
        const $listeners = [];
        const $currentState = { route: null, params: null, query: null, path: null, hash: null };

        if($options.mode === 'hash') {
            HashRouter.apply(this, []);
        } else if($options.mode === 'history') {
            HistoryRouter.apply(this, []);
        } else if($options.mode === 'memory') {
            MemoryRouter.apply(this, []);
        } else {
            throw new RouterError('Invalid router mode '+$options.mode);
        }

        const trigger = function(request, next) {
            for(const listener of $listeners) {
                try {
                    listener(request);
                    next && next(request);
                } catch (e) {
                    DebugManager$1.warn('Route Listener', 'Error in listener:', e);
                }
            }
        };

        this.routes = () => [...$routes];
        this.currentState = () => ({ ...$currentState });

        /**
         *
         * @param {string} path
         * @param {Function} component
         * @param {{name:?string, middlewares:Function[], shouldRebuild:Boolean, with: Object, layout: Function }} options
         * @returns {this}
         */
        this.add = function(path, component, options) {
            const route = new Route(RouteGroupHelper.fullPath($groupTree, path), component, {
                ...options,
                middlewares: RouteGroupHelper.fullMiddlewares($groupTree, options?.middlewares || []),
                name: options?.name ? RouteGroupHelper.fullName($groupTree, options.name) : null,
                layout: options?.layout || RouteGroupHelper.layout($groupTree)
            });
            $routes.push(route);
            if(route.name()) {
                $routesByName[route.name()] = route;
            }
            return this;
        };

        /**
         * Groups routes under a common path prefix with shared options.
         *
         * @param {string} suffix - Path prefix to prepend to all routes in the group
         * @param {Object} options - Group configuration options
         * @param {Function[]} [options.middlewares] - Middlewares applied to all routes in group
         * @param {string} [options.name] - Name prefix for all routes in group
         * @param {Function} [options.layout] - Layout component for all routes in group
         * @param {Function} callback - Function that defines routes within the group
         * @returns {this} Router instance for chaining
         * @example
         * router.group('/admin', { middlewares: [authMiddleware], layout: AdminLayout }, () => {
         *   router.add('/users', UsersPage, { name: 'users' });
         *   router.add('/settings', SettingsPage, { name: 'settings' });
         * });
         */
        this.group = function(suffix, options, callback) {
            if(!Validator.isFunction(callback)) {
                throw new RouterError('Callback must be a function');
            }
            $groupTree.push({suffix, options});
            callback();
            $groupTree.pop();
            return this;
        };

        /**
         *
         * @param {string} name
         * @param {Object}params
         * @param {Object} query
         * @returns {*}
         */
        this.generateUrl = function(name, params = {}, query = {}) {
            const route = $routesByName[name];
            if(!route) {
                throw new RouterError(`Route not found for name: ${name}`);
            }
            return route.url({ params, query });
        };

        /**
         *
         * @param {string|{name:string,params?:Object, query?:Object }} target
         * @returns {{route:Route, params:Object, query:Object, path:string}}
         */
        this.resolve = function(target) {
            if(Validator.isJson(target)) {
                const route = $routesByName[target.name];
                if(!route) {
                    throw new RouterError(`Route not found for name: ${target.name}`);
                }
                return {
                    route,
                    params: target.params,
                    query: target.query,
                    path: route.url({ ...target })
                };
            }

            const [urlPath, urlQuery] = target.split('?');
            const path = '/'+trim(urlPath, '/');
            let routeFound = null, params;

            for(const route of $routes) {
                params = route.match(path);
                if(params) {
                    routeFound = route;
                    break;
                }
            }
            if(!routeFound) {
                throw new RouterError(`Route not found for url: ${urlPath}`);
            }
            const queryParams = {};
            if(urlQuery) {
                const queries = new URLSearchParams(urlQuery).entries();
                for (const [key, value] of queries) {
                    queryParams[key] = value;
                }
            }

            return { route: routeFound, params, query: queryParams, path: target };
        };

        /**
         *
         * @param {Function} listener
         * @returns {(function(): void)|*}
         */
        this.subscribe = function(listener) {
            if(!Validator.isFunction(listener)) {
                throw new RouterError('Listener must be a function');
            }
            $listeners.push(listener);
            return () => {
                $listeners.splice($listeners.indexOf(listener), 1);
            };
        };

        /**
         *
         * @param {Route} route
         * @param {Object} params
         * @param {Object} query
         * @param {string} path
         */
        this.handleRouteChange = function(route, params, query, path) {
            $currentState.route = route;
            $currentState.params = params;
            $currentState.query = query;
            $currentState.path = path;

            const middlewares = [...route.middlewares(), trigger];
            let currentIndex = 0;
            const request = { ...$currentState };

            const next = (editableRequest) => {
                currentIndex++;
                if(currentIndex >= middlewares.length) {
                    return;
                }
                return middlewares[currentIndex](editableRequest || request, next);
            };
            return middlewares[currentIndex](request, next);
        };

    }

    Router.routers = {};

    /**
     * Creates and initializes a new router instance.
     *
     * @param {Object} options - Router configuration
     * @param {'memory'|'history'|'hash'} options.mode - Routing mode
     * @param {string} [options.name] - Router name for multi-router apps
     * @param {string} [options.entry] - Initial route path
     * @param {Function} callback - Setup function that receives the router instance
     * @returns {Router} The configured router instance with mount() method
     * @example
     * const router = Router.create({ mode: 'history' }, (r) => {
     *   r.add('/home', HomePage, { name: 'home' });
     *   r.add('/about', AboutPage, { name: 'about' });
     * });
     * router.mount('#app');
     */
    Router.create = function(options, callback) {
        if(!Validator.isFunction(callback)) {
            DebugManager$1.error('Router', 'Callback must be a function');
            throw new RouterError('Callback must be a function');
        }
        const router = new Router(options);
        Router.routers[options.name || DEFAULT_ROUTER_NAME] = router;
        callback(router);

        router.init(options.entry);

        router.mount = function(container) {
            if(Validator.isString(container)) {
                const mountContainer = document.querySelector(container);
                if(!mountContainer) {
                    throw new RouterError(`Container not found for selector: ${container}`);
                }
                container = mountContainer;
            } else if(!Validator.isElement(container)) {
                throw new RouterError('Container must be a string or an Element');
            }

            return RouterComponent(router, container);
        };

        return router;
    };

    Router.get = function(name) {
        const router = Router.routers[name || DEFAULT_ROUTER_NAME];
        if(!router) {
            throw new RouterError(`Router not found for name: ${name}`);
        }
        return router;
    };

    Router.push = function(target, name = null) {
        return Router.get(name).push(target);
    };

    Router.replace = function(target, name = null) {
        return Router.get(name).replace(target);
    };

    Router.forward = function(name = null) {
        return Router.get(name).forward();
    };
    Router.back = function(name = null) {
        return Router.get(name).back();
    };

    function Link(options, children){
        const { to, href, ...attributes } = options;
        if(href) {
            const router = Router.get();
            return Link$1({ ...attributes, href}, children).nd.onPreventClick(() => {
                router.push(href);
            });
        }
        const target = typeof to === 'string' ? { name: to } : to;
        const routerName = target.router || DEFAULT_ROUTER_NAME;
        const router = Router.get(routerName);
        if(!router) {
            throw new RouterError('Router not found "'+routerName+'" for link "'+target.name+'"');
        }
        const url = router.generateUrl(target.name, target.params, target.query);
        return Link$1({ ...attributes, href: url }, children).nd.onPreventClick(() => {
            router.push(url);
        });
    }

    Link.blank = function(attributes, children){
        return Link$1({ ...attributes, target: '_blank'}, children);
    };

    var router = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Link: Link,
        RouteParamPatterns: RouteParamPatterns,
        Router: Router
    });

    function NativeFetch($baseUrl) {

        const $interceptors = {
            request: [],
            response: []
        };

        this.interceptors = {
            response: (callback) => {
                $interceptors.response.push(callback);
            },
            request: (callback) => {
                $interceptors.request.push(callback);
            }
        };

        this.fetch = async function(method, endpoint, params = {}, options = {}) {
            if(options.formData) {
                const formData = new FormData();
                for(const key in params) {
                    formData.append(key, params[key]);
                }
                params = formData;
            }
            if(!endpoint.startsWith('http')) {
                endpoint = ($baseUrl.endsWith('/') ? $baseUrl : $baseUrl+'/') + endpoint;
            }
            let configs = {
                method,
                headers: {
                    ...(options.headers || {})
                },
            };
            if(params) {
                if(params instanceof FormData) {
                    configs.body = params;
                }
                else {
                    if(method !== 'GET') {
                        configs.headers['Content-Type'] = 'application/json';
                        configs.body = JSON.stringify(params);
                    } else {
                        const queryString = new URLSearchParams(params).toString();
                        if (queryString) {
                            endpoint = endpoint + (endpoint.includes('?') ? '&' : '?') + queryString;
                        }
                    }
                }
            }

            for(const interceptor of $interceptors.request) {
                configs = (await interceptor(configs, endpoint)) || configs;
            }

            let response = await fetch(endpoint, configs);

            for(const interceptor of $interceptors.response) {
                response = (await interceptor(response, endpoint)) || response;
            }

            const contentType = response.headers.get('content-type') || '';
            const data = contentType.includes('application/json')
                ? await response.json()
                : await response.text();

            if(!response.ok) {
                const error = new Error(data?.message || response.statusText);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        };


        this.post = function (endpoint, params = {}, options = {}) {
            return this.fetch('POST', endpoint, params, options);
        };
        this.put = function (endpoint, params = {}, options = {}) {
            return this.fetch('PUT', endpoint, params, options);
        };
        this.delete = function (endpoint, params = {}, options = {}) {
            return this.fetch('DELETE', endpoint, params, options);
        };
        this.get = function (endpoint, params = {}, options = {}) {
            return this.fetch('GET', endpoint, params, options);
        };
    }

    const once = fn => autoOnce(fn);
    const singleton = fn => once$1(fn);
    const memoize = fn => autoMemoize(fn);

    var cache = /*#__PURE__*/Object.freeze({
        __proto__: null,
        memoize: memoize,
        once: once,
        singleton: singleton
    });

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Cache: cache,
        NativeFetch: NativeFetch,
        filters: index
    });

    exports.$ = $;
    exports.ElementCreator = ElementCreator;
    exports.HtmlElementWrapper = HtmlElementWrapper;
    exports.NDElement = NDElement;
    exports.Observable = Observable;
    exports.PluginsManager = PluginsManager$1;
    exports.SingletonView = SingletonView;
    exports.Store = Store;
    exports.StoreFactory = StoreFactory;
    exports.TemplateCloner = TemplateCloner;
    exports.Validator = Validator;
    exports.autoMemoize = autoMemoize;
    exports.autoOnce = autoOnce;
    exports.classPropertyAccumulator = classPropertyAccumulator;
    exports.createTextNode = createTextNode;
    exports.cssPropertyAccumulator = cssPropertyAccumulator;
    exports.elements = elements;
    exports.memoize = memoize$1;
    exports.normalizeComponentArgs = normalizeComponentArgs;
    exports.obs = obs;
    exports.once = once$1;
    exports.router = router;
    exports.useCache = useCache;
    exports.useSingleton = useSingleton;
    exports.utils = utils;

    return exports;

})({});
//# sourceMappingURL=native-document.dev.js.map
