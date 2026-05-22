var NativeDocument = (function (exports) {
    'use strict';

    let DebugManager$1 = {};

    {
        DebugManager$1 = {
            enabled: true,

            enable() {
                DebugManager$1.log('NativeDocument Debug Mode enabled');
            },

            disable() {
                this.enabled = false;
            },

            log(category, message, data) {
                console.group(`[${category}] ${message}`);
                if (data) console.log(data);
                console.trace();
                console.groupEnd();
            },

            warn(category, message, data) {
                console.warn(`[${category}] ${message}`, data);
            },

            error(category, message, error) {
                console.error(`[${category}] ${message}`, error);
            },
        };

    }
    var DebugManager$2 = DebugManager$1;

    class NativeDocumentError extends Error {
        constructor(message, context = {}) {
            super(message);
            this.name = 'NativeDocumentError';
            this.context = context;
            this.timestamp = new Date().toISOString();
        }
    }

    const COMMON_NODE_TYPES = {
        ELEMENT: 1,
        TEXT: 3,
        COMMENT: 8,
        DOCUMENT_FRAGMENT: 11,
    };

    const VALID_TYPES = [];
    VALID_TYPES[COMMON_NODE_TYPES.ELEMENT] = true;
    VALID_TYPES[COMMON_NODE_TYPES.TEXT] = true;
    VALID_TYPES[COMMON_NODE_TYPES.DOCUMENT_FRAGMENT] = true;
    VALID_TYPES[COMMON_NODE_TYPES.COMMENT] = true;

    const Validator = {
        isObservable(value) {
            return  value && (value.__$isObservable || value.__$Observable);
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
            return value?.__isProxy__;
        },
        isObservableOrProxy(value) {
            return value?.__$Observable;
        },
        isAnchor(value) {
            return value?.__Anchor__;
        },
        isObservableChecker(value) {
            return value?.__$isObservableChecker;
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
            return !(typeof value !== 'object' || value === null || Array.isArray(value) || value.constructor.name !== 'Object');
        },
        isElement(value) {
            return value && VALID_TYPES[value.nodeType];
        },
        isDOMNode(value) {
            return VALID_TYPES[value.nodeType];
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
                child.__$Observable ||
                child?.__$isNDElement ||
                ['string', 'number', 'boolean'].includes(typeof child);
        },
        isNDElement(child) {
            return child?.__$isNDElement;
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
        },
    };
    {
        Validator.validateAttributes = function(attributes) {
            if (!attributes || typeof attributes !== 'object') {
                return attributes;
            }

            const reserved = [];
            const foundReserved = Object.keys(attributes).filter(key => reserved.includes(key));

            if (foundReserved.length > 0) {
                DebugManager$2.warn('Validator', `Reserved attributes found: ${foundReserved.join(', ')}`);
            }

            return attributes;
        };
    }

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
        'playsinline',
    ]);

    const BOOL_ATTRIBUTES_NAME = {
        'allowfullscreen': 'allowFullscreen',
        'allowpaymentrequest': 'allowPaymentRequest',
        'async': 'async',
        'autocomplete': 'autocomplete',
        'autofocus': 'autofocus',
        'autoplay': 'autoplay',
        'checked': 'checked',
        'controls': 'controls',
        'default': 'default',
        'defer': 'defer',
        'disabled': 'disabled',
        'download': 'download',
        'draggable': 'draggable',
        'formnovalidate': 'formNoValidate',
        'contenteditable': 'contentEditable',
        'hidden': 'hidden',
        'itemscope': 'itemScope',
        'loop': 'loop',
        'multiple': 'multiple',
        'muted': 'muted',
        'novalidate': 'noValidate',
        'open': 'open',
        'playsinline': 'playsInline',
        'readonly': 'readOnly',
        'required': 'required',
        'reversed': 'reversed',
        'scoped': 'scoped',
        'selected': 'selected',
        'spellcheck': 'spellcheck',
        'translate': 'translate',
    };

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
                    DebugManager$2.log('Memory Auto Clean', `🧹 Cleaned ${cleanedCount} orphaned observables`);
                }
            },
        };
    }());

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
                        throw new Error('Please, provide a valid plugin name');
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
                                DebugManager$2.error('Plugin Manager', `Error in plugin ${plugin.$name} for event ${eventName}`, error);
                            }
                        }
                    }
                },
            };
        }());
    }

    var PluginsManager$1 = PluginsManager;

    /**
     * Calls a function with the given arguments and optional context.
     *
     * @internal
     * @param {Function} fn - Function to invoke
     * @param {Array} args - Arguments to pass
     * @param {Object|null} [context] - `this` context, or null to call without binding
     */
    const invoke = function(fn, args, context) {
        if(context) {
            fn.apply(context, args);
        } else {
            fn(...args);
        }
    };
    /**
     *
     * @param {Function} fn
     * @param {number} delay
     * @param {{leading?:Boolean, trailing?:Boolean, debounce?:Boolean, check: Function}}options
     * @returns {(function(...[*]): void)|*}
     */
    const debounce = function(fn, delay, options = {}) {
        let timer = null;
        let lastArgs = null;

        return  function(...args) {
            const context = options.context === true ? this : null;
            if(options.check) {
                options.check(...args);
            }
            lastArgs = args;

            // debounce mode: reset the timer for each call
            clearTimeout(timer);
            timer = setTimeout(() => invoke(fn, lastArgs, context), delay);
        };
    };

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
     * Returns the unique key for a given item, used by ForEach and ForEachArray for DOM diffing.
     * Resolution order:
     * 1. If key is a function: calls key(item, defaultKey)
     * 2. If key is a string: reads item[key] (unwrapping observables)
     * 3. Otherwise: returns item value or defaultKey
     *
     * @param {*} item - The item to extract a key from
     * @param {string|number} defaultKey - Fallback key (usually the array index)
     * @param {string|Function|null} key - Key property name or custom key function
     * @returns {string|number} The resolved unique key
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

    /**
     * Trims all leading and trailing occurrences of char from str.
     *
     * @param {string} str - String to trim
     * @param {string} char - Character to remove from both ends
     * @returns {string} Trimmed string
     * @example
     * trim('/foo/bar/', '/'); // 'foo/bar'
     */
    const trim = function(str, char) {
        return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
    };

    /**
     * Deep clones a value. Uses structuredClone when available.
     * Handles: primitives, Dates, Arrays, plain Objects.
     * Observables are kept by reference (not cloned); onObservableFound is called for each.
     *
     * @param {*} value - Value to clone
     * @param {((observable: ObservableItem) => void)?} [onObservableFound] - Called for each observable encountered
     * @returns {*} Deep clone of the value
     */
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

    const LocalStorage = {
        getJson(key) {
            const value = localStorage.getItem(key);
            try {
                return JSON.parse(value);
            } catch (e) {
                throw new NativeDocumentError('invalid_json:'+key);
            }
        },
        getNumber(key) {
            return Number(this.get(key));
        },
        getBool(key) {
            const value = this.get(key);
            return value === 'true' || value === '1';
        },
        setJson(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        setBool(key, value) {
            localStorage.setItem(key, value ? 'true' : 'false');
        },
        get(key, defaultValue = null) {
            return localStorage.getItem(key) || defaultValue;
        },
        set(key, value) {
            return localStorage.setItem(key, value);
        },
        remove(key) {
            localStorage.removeItem(key);
        },
        has(key) {
            return localStorage.getItem(key) != null;
        },
    };

    const $getFromStorage = (key, value) => {
        if(!LocalStorage.has(key)) {
            return value;
        }
        switch (typeof value) {
        case 'object': return LocalStorage.getJson(key) ?? value;
        case 'boolean': return LocalStorage.getBool(key) ?? value;
        case 'number': return LocalStorage.getNumber(key) ?? value;
        default: return LocalStorage.get(key, value) ?? value;
        }
    };

    const $saveToStorage = (value) => {
        switch (typeof value) {
        case 'object': return LocalStorage.setJson;
        case 'boolean': return LocalStorage.setBool;
        default: return LocalStorage.set;
        }
    };

    /**
     * Reactive primitive value container.
     * Notifies subscribers whenever its value changes.
     * The core building block of NativeDocument's reactivity system.
     *
     * @constructor
     * @param {*} value - Initial value of the observable
     * @param {{ propagation?: boolean, reset?: boolean, deep?: boolean } | null} [configs=null] - Optional configuration
     * @param {boolean} [configs.reset] - If true, stores the initial value for later reset via .reset()
     * @param {boolean} [configs.propagation] - Controls whether changes propagate to parent observables
     * @example
     * const count = new ObservableItem(0);
     * const name  = new ObservableItem('John', { reset: true });
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

    ObservableItem.prototype.__$Observable = true;
    ObservableItem.prototype.__$isObservable = true;
    ObservableItem.computed = () => {};
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

    /**
     * Intercepts mutations of the array observable before they are applied.
     * Allows transforming or cancelling array operations.
     *
     * @param {(operation: { action: string, args: any[] }) => void} callback - Called before each mutation with the operation details
     * @returns {ObservableItem} this
     */
    ObservableItem.prototype.interceptMutations = function(callback) {
        this.$mutationInterceptor = callback;
        return this;
    };

    /**
     * Calls the first registered subscriber directly (internal optimisation).
     *
     * @internal
     * @param {{ action?: string, args?: any[], result?: any }} [operations] - Mutation metadata
     */
    ObservableItem.prototype.triggerFirstListener = function(operations) {
        this.$firstListener(this.$currentValue, this.$previousValue, operations);
    };

    /**
     * Calls all registered subscribers (internal).
     *
     * @internal
     * @param {{ action?: string, args?: any[], result?: any }} [operations] - Mutation metadata
     */
    ObservableItem.prototype.triggerListeners = function(operations) {
        const $listeners = this.$listeners;
        const $previousValue = this.$previousValue;
        const $currentValue = this.$currentValue;

        for(let i = 0, length = $listeners.length; i < length; i++) {
            $listeners[i]($currentValue, $previousValue, operations);
        }
    };

    /**
     * Triggers callbacks registered via .on() for the current and previous values (internal).
     *
     * @internal
     * @param {{ action?: string, args?: any[], result?: any }} [operations] - Mutation metadata
     */
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

    /**
     * Triggers both watchers and all subscribers (internal).
     *
     * @internal
     * @param {{ action?: string, args?: any[], result?: any }} [operations] - Mutation metadata
     */
    ObservableItem.prototype.triggerAll = function(operations) {
        this.triggerWatchers(operations);
        this.triggerListeners(operations);
    };

    /**
     * Triggers both watchers and the first subscriber only (internal optimization).
     *
     * @internal
     * @param {{ action?: string, args?: any[], result?: any }} [operations] - Mutation metadata
     */
    ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
        this.triggerWatchers(operations);
        this.triggerFirstListener(operations);
    };

    /**
     * Selects and assigns the optimal trigger strategy based on the current
     * combination of listeners and watchers (internal).
     * Called automatically after every subscribe / unsubscribe / on / off.
     *
     * @internal
     */
    ObservableItem.prototype.assocTrigger = function() {
        this.$firstListener = null;
        if(this.$watchers?.size && this.$listeners?.length) {
            this.$firstListener = this.$listeners[0];
            this.trigger = this.$firstListener.length === 0 ? this.$firstListener : this.triggerFirstListener;
            this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
            return;
        }
        if(this.$listeners?.length) {
            if(this.$listeners.length === 1) {
                this.$firstListener = this.$listeners[0];
                this.trigger = this.$firstListener.length === 0 ? this.$firstListener : this.triggerFirstListener;
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


    const $setOperation = { action: 'set' };
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
        this.trigger($setOperation);
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
        const newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
        this.$updateWithNewValue(newValue);
    };

    ObservableItem.prototype.set = ObservableItem.prototype.$basicSet;

    /**
     * Returns the current value of the observable.
     *
     * @returns {*} The current value
     * @example
     * const count = Observable(42);
     * count.val(); // 42
     */
    ObservableItem.prototype.val = function() {
        return this.$currentValue;
    };

    /**
     * Disconnects all listeners and watchers and nullifies internal state.
     * Does not trigger cleanup callbacks. Prefer .cleanup() for full disposal.
     *
     * @returns {void}
     */
    ObservableItem.prototype.disconnectAll = function() {
        this.$previousValue = null;
        this.$currentValue = null;
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

    /**
     * Disposes the observable: runs cleanup callbacks, unregisters from MemoryManager,
     * disconnects all listeners and removes the $value property.
     *
     * @returns {void}
     * @example
     * const obs = Observable(0);
     * obs.onCleanup(() => console.log('disposed'));
     * obs.cleanup(); // logs 'disposed', frees memory
     */
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
     * Subscribes to value changes. The callback is called every time the value changes.
     * Returns nothing — use .unsubscribe(callback) to remove the listener.
     *
     * @param {(current: *, previous: *, operations?: { action?: string }) => void} callback - Called on each value change
     * @example
     * const count = Observable(0);
     * count.subscribe((val) => console.log('New value:', val));
     * count.$value++; // logs 'New value: 1'
     */
    ObservableItem.prototype.subscribe = function(callback) {
        {
            if (this.$isCleanedUp) {
                DebugManager$2.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
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
     * Removes a previously registered subscriber.
     *
     * @param {Function} callback - The exact function reference passed to .subscribe()
     * @returns {void}
     * @example
     * const handler = (val) => console.log(val);
     * count.subscribe(handler);
     * count.unsubscribe(handler);
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

    /**
     * Syncs this observable's value to localStorage and restores it on load.
     * Optionally transforms values on get and set.
     *
     * @param {string} key - localStorage key
     * @param {{ get?: (stored: any) => T, set?: (value: T) => any }} [options={}] - Transform options
     * @param {Function} [options.get] - Transform the stored value before applying it
     * @param {Function} [options.set] - Transform the value before saving it
     * @returns {ObservableItem} this — chainable
     * @example
     * const theme = Observable('light').persist('app-theme');
     * const count = Observable(0).persist('count', {
     *   get: (v) => parseInt(v),
     *   set: (v) => String(v),
     * });
     */
    ObservableItem.prototype.persist = function(key, options = {}) {
        let value = $getFromStorage(key, this.$currentValue);
        if(options.get) {
            value = options.get(value);
        }
        this.set(value);
        const saver = $saveToStorage(this.$currentValue);
        this.subscribe((newValue) => {
            saver(key, options.set ? options.set(newValue) : newValue);
        });
        return this;
    };

    /**
     * Creates a new ObservableItem with a deep clone of the current value.
     * For objects implementing a .clone() method, delegates to that method.
     *
     * @returns {ObservableItem} A new independent observable with the cloned value
     * @example
     * const original = Observable({ x: 1 });
     * const copy = original.clone();
     * copy.set({ x: 99 });
     * original.val(); // { x: 1 } — untouched
     */
    ObservableItem.prototype.clone = function() {
        let clonedValue = this.$currentValue;

        if(clonedValue && typeof clonedValue === 'object') {
            if(typeof clonedValue.clone === 'function') {
                clonedValue = clonedValue.clone();
            } else {
                clonedValue = structuredClone(clonedValue);
            }
        }

        return new ObservableItem(clonedValue);
    };

    /**
     * Converts a value to a Date object. Returns the value as-is if it's already a Date.
     *
     * @param {Date|number|string} value - Value to convert
     * @returns {Date}
     */
    function toDate(value) {
        if (value instanceof Date) return value;
        return new Date(value);
    }

    /**
     * Returns true if two date values fall on the same calendar day (year, month, day).
     *
     * @param {Date|number|string} date1 - First date
     * @param {Date|number|string} date2 - Second date
     * @returns {boolean}
     */
    function isSameDay(date1, date2) {
        const d1 = toDate(date1);
        const d2 = toDate(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    /**
     * Returns the total number of seconds elapsed since midnight for the given date's time component.
     * Used internally for time range comparisons.
     *
     * @param {Date|number|string} date - Date value to extract time from
     * @returns {number} Seconds since midnight (0–86399)
     */
    function getSecondsOfDay(date) {
        const d = toDate(date);
        return (d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds();
    }

    /**
     * Creates a FilterResult from a single observable or static value and a comparison callback.
     * If the value is an observable, it is registered as a dependency so the filter reacts to changes.
     *
     * @param {*|ObservableItem} observableOrValue - Observable or static value used as the comparison target
     * @param {(value: *, target: *) => boolean} callbackFn - Filter function receiving (item value, target value)
     * @returns {{ dependencies: ObservableItem|null, callback: (value: *) => boolean }} FilterResult
     */
    function createFilter(observableOrValue, callbackFn){
        const isObservable = Validator.isObservable(observableOrValue);

        return {
            dependencies: isObservable ? observableOrValue : null,
            callback: (value) => callbackFn(value, isObservable ? observableOrValue.val() : observableOrValue),
        };
    }

    /**
     * Creates a FilterResult from multiple observable or static sources and a multi-value comparison callback.
     * All observable sources are registered as dependencies.
     *
     * @param {Array<*|ObservableItem>} sources - Array of observables or static values
     * @param {(value: *, targets: any[]) => boolean} callbackFn - Filter function receiving (item value, array of resolved source values)
     * @returns {{ dependencies: ObservableItem[]|null, callback: (value: *) => boolean }} FilterResult
     */
    function createMultiSourceFilter(sources, callbackFn){
        const observables = sources.filter(Validator.isObservable);

        const getValues = () => sources.map(src =>
            Validator.isObservable(src) ? src.val() : src,
        );

        return {
            dependencies: observables.length > 0 ? observables : null,
            callback: (value) => callbackFn(value, getValues()),
        };
    }

    /**
     * Creates a filter that passes values strictly equal to the target.
     *
     * @param {*|ObservableItem} observableOrValue - Static value or observable to compare against
     * @returns {FilterResult}
     * @example
     * const statusFilter = equals('active');
     * users.where({ status: statusFilter });
     */
    function equals(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value === target);
    }

    /**
     * Creates a filter that passes values not strictly equal to the target.
     *
     * @param {*|ObservableItem} observableOrValue - Static value or observable
     * @returns {FilterResult}
     */
    function notEquals(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value !== target);
    }

    /**
     * Creates a filter that passes values greater than the target.
     *
     * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
     * @returns {FilterResult}
     */
    function greaterThan(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value > target);
    }

    /**
     * Creates a filter that passes values greater than or equal to the target.
     *
     * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
     * @returns {FilterResult}
     */
    function greaterThanOrEqual(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value >= target);
    }

    /**
     * Creates a filter that passes values less than the target.
     *
     * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
     * @returns {FilterResult}
     */
    function lessThan(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value < target);
    }

    /**
     * Creates a filter that passes values less than or equal to the target.
     *
     * @param {number|ObservableItem<number>} observableOrValue - Threshold value or observable
     * @returns {FilterResult}
     */
    function lessThanOrEqual(observableOrValue){
        return createFilter(observableOrValue, (value, target) => value <= target);
    }

    /**
     * Creates a filter that passes values between min and max (inclusive).
     * Both min and max can be static values or observables.
     *
     * @param {number|ObservableItem<number>} minObservableOrValue - Lower bound
     * @param {number|ObservableItem<number>} maxObservableOrValue - Upper bound
     * @returns {FilterResult}
     * @example
     * items.where({ age: between(18, 65) });
     */
    function between(minObservableOrValue, maxObservableOrValue){
        return createMultiSourceFilter(
            [minObservableOrValue, maxObservableOrValue],
            (value, [min, max]) => value >= min && value <= max,
        );
    }

    /**
     * Creates a filter that passes values included in the given array.
     *
     * @param {Array|ObservableItem<Array>} observableOrArray - Array to check membership in
     * @returns {FilterResult}
     * @example
     * items.where({ role: inArray(['admin', 'editor']) });
     */
    function inArray(observableOrArray){
        return createFilter(observableOrArray, (value, arr) => arr.includes(value));
    }

    /**
     * Creates a filter that passes values not included in the given array.
     *
     * @param {Array|ObservableItem<Array>} observableOrArray - Array to check exclusion from
     * @returns {FilterResult}
     */
    function notIn(observableOrArray){
        return createFilter(observableOrArray, (value, arr) => !arr.includes(value));
    }

    /**
     * Creates a filter that passes when the value is empty (null, undefined, empty string, or empty array).
     * Pass false as the argument to filter for non-empty values instead.
     *
     * @param {boolean|ObservableItem<boolean>} [observableOrValue=true] - If true, filters empty values; if false, filters non-empty
     * @returns {FilterResult}
     */
    function isEmpty(observableOrValue = true){
        return createFilter(observableOrValue, (value, shouldBeEmpty) => {
            const isActuallyEmpty = !value || value === '' ||
                (Array.isArray(value) && value.length === 0);

            return shouldBeEmpty ? isActuallyEmpty : !isActuallyEmpty;
        });
    }

    /**
     * Creates a filter that passes when the value is not empty.
     * Pass false as the argument to filter for empty values instead.
     *
     * @param {boolean|ObservableItem<boolean>} [observableOrValue=true] - If true, filters non-empty values
     * @returns {FilterResult}
     */
    function isNotEmpty(observableOrValue = true){
        return createFilter(observableOrValue, (value, shouldBeNotEmpty) => {
            const isActuallyNotEmpty = !!value && value !== '' &&
                (!Array.isArray(value) || value.length > 0);

            return shouldBeNotEmpty ? isActuallyNotEmpty : !isActuallyNotEmpty;
        });
    }

    /**
     * Creates a filter that tests the value against a pattern (string or regex).
     *
     * @param {string|RegExp|ObservableItem} patternObservableOrValue - Pattern to match against
     * @param {boolean|ObservableItem<boolean>} [asRegexObservableOrValue=true] - If true, treat pattern as a regex; if false, use case-insensitive substring match
     * @param {string|ObservableItem<string>} [flagsObservableOrValue=''] - Regex flags (e.g. 'i', 'g')
     * @returns {FilterResult}
     * @example
     * const search = Observable('john');
     * users.where({ name: match(search) }); // regex match, reactive
     * users.where({ name: match('john', false) }); // case-insensitive substring
     */
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
                        DebugManager$2.warn('Invalid regex pattern:', pattern, error);
                        return false;
                    }
                }

                if (!flags || flags === ''){
                    return String(value).toLowerCase().includes(String(pattern).toLowerCase());
                }
                return String(value).includes(String(pattern));
            },
        );
    }

    /**
     * Combines multiple filters with AND logic — all filters must pass.
     * Merges dependencies from all child filters automatically.
     *
     * @param {...FilterResult} filters - Filters to combine
     * @returns {FilterResult}
     * @example
     * items.where({ _: and(greaterThan(18), lessThan(65)) });
     */
    function and(...filters){
        const dependencies = filters
            .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
            .filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => filters.every(f => f.callback(value)),
        };
    }

    /**
     * Combines multiple filters with OR logic — at least one filter must pass.
     * Merges dependencies from all child filters automatically.
     *
     * @param {...FilterResult} filters - Filters to combine
     * @returns {FilterResult}
     * @example
     * items.where({ _: or(equals('admin'), equals('editor')) });
     */
    function or(...filters){
        const dependencies = filters
            .flatMap(f => f.dependencies ? (Array.isArray(f.dependencies) ? f.dependencies : [f.dependencies]) : [])
            .filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => filters.some(f => f.callback(value)),
        };
    }

    /**
     * Negates a filter — passes when the given filter does not pass.
     *
     * @param {FilterResult} filter - Filter to negate
     * @returns {FilterResult}
     * @example
     * items.where({ status: not(equals('deleted')) });
     */
    function not(filter){
        return {
            dependencies: filter.dependencies,
            callback: (value) => !filter.callback(value),
        };
    }

    /**
     * Creates a custom filter from a callback and a list of observable dependencies.
     * The callback receives the item value followed by the current values of all observables.
     *
     * @param {(value: *, ...depValues: any[]) => boolean} callbackFn - Filter function
     * @param {...ObservableItem} observables - Observable dependencies passed as extra arguments to callback
     * @returns {FilterResult}
     * @example
     * const minAge = Observable(18);
     * items.where({ age: custom((age, min) => age >= min, minAge) });
     */
    function custom(callbackFn, ...observables){
        const dependencies = observables.filter(Validator.isObservable);

        return {
            dependencies: dependencies.length > 0 ? dependencies : null,
            callback: (value) => {
                const values = observables.map(o =>
                    Validator.isObservable(o) ? o.val() : o,
                );
                return callbackFn(value, ...values);
            },
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

    /**
     * Creates a filter that passes when the date value is on the same day as the target date.
     * Accepts Date objects, timestamps, or ISO strings.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target date to compare against
     * @returns {FilterResult}
     * @example
     * const today = new Date();
     * events.where({ date: dateEquals(today) });
     */
    const dateEquals = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return isSameDay(value, target);
        });
    };

    /**
     * Creates a filter that passes when the date value is strictly before the target date (day comparison).
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target date
     * @returns {FilterResult}
     */
    const dateBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) < toDate(target);
        });
    };

    /**
     * Creates a filter that passes when the date value is strictly after the target date (day comparison).
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target date
     * @returns {FilterResult}
     */
    const dateAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) > toDate(target);
        });
    };

    /**
     * Creates a filter that passes when the date value falls within the given date range (inclusive, day comparison).
     *
     * @param {Date|number|string|ObservableItem} startObservableOrValue - Start of the range
     * @param {Date|number|string|ObservableItem} endObservableOrValue - End of the range
     * @returns {FilterResult}
     * @example
     * events.where({ date: dateBetween(startDate, endDate) });
     */
    const dateBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter(
            [startObservableOrValue, endObservableOrValue],
            (value, [start, end]) => {
                if (!value || !start || !end) return false;
                const date = toDate(value);
                return date >= toDate(start) && date <= toDate(end);
            },
        );
    };

    /**
     * Creates a filter that passes when the time component (HH:MM:SS) equals the target time.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target time
     * @returns {FilterResult}
     */
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

    /**
     * Creates a filter that passes when the time component is strictly after the target time.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target time
     * @returns {FilterResult}
     */
    const timeAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return getSecondsOfDay(value) > getSecondsOfDay(target);
        });
    };

    /**
     * Creates a filter that passes when the time component is strictly before the target time.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target time
     * @returns {FilterResult}
     */
    const timeBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return getSecondsOfDay(value) < getSecondsOfDay(target);
        });
    };

    /**
     * Creates a filter that passes when the time component falls within the given time range (inclusive).
     *
     * @param {Date|number|string|ObservableItem} startObservableOrValue - Start time
     * @param {Date|number|string|ObservableItem} endObservableOrValue - End time
     * @returns {FilterResult}
     */
    const timeBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter([startObservableOrValue, endObservableOrValue],
            (value, [start, end]) => {
                if (!value || !start || !end) return false;
                const date = getSecondsOfDay(value);
                return date >= getSecondsOfDay(start) && date <= getSecondsOfDay(end);
            },
        );
    };

    /**
     * Creates a filter that passes when the full datetime (date + time) equals the target exactly.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
     * @returns {FilterResult}
     */
    const dateTimeEquals = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value).getTime() === toDate(target).getTime();
        });
    };

    /**
     * Creates a filter that passes when the full datetime is strictly after the target.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
     * @returns {FilterResult}
     */
    const dateTimeAfter = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) > toDate(target);
        });
    };

    /**
     * Creates a filter that passes when the full datetime is strictly before the target.
     *
     * @param {Date|number|string|ObservableItem} observableOrValue - Target datetime
     * @returns {FilterResult}
     */
    const dateTimeBefore = (observableOrValue) => {
        return createFilter(observableOrValue, (value, target) => {
            if (!value || !target) return false;
            return toDate(value) < toDate(target);
        });
    };

    /**
     * Creates a filter that passes when the full datetime falls within the given range (inclusive).
     *
     * @param {Date|number|string|ObservableItem} startObservableOrValue - Start of the range
     * @param {Date|number|string|ObservableItem} endObservableOrValue - End of the range
     * @returns {FilterResult}
     */
    const dateTimeBetween = (startObservableOrValue, endObservableOrValue) => {
        return createMultiSourceFilter([startObservableOrValue, endObservableOrValue], (value, [start, end]) => {
            if (!value || !start || !end) return false;
            const date = toDate(value);
            return date >= toDate(start) && date <= toDate(end);
        });
    };

    /**
     * Creates a filter that passes when the value includes the given query string.
     * Case-insensitive by default.
     * Alias: contains
     *
     * @param {string|ObservableItem<string>} observableOrValue - Substring to search for
     * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
     * @returns {FilterResult}
     * @example
     * const search = Observable('john');
     * users.where({ name: includes(search) }); // reactive, case-insensitive
     * users.where({ name: includes('John', true) }); // case-sensitive
     */
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

    /**
     * Creates a filter that passes when the value starts with the given query string.
     * Case-insensitive by default.
     *
     * @param {string|ObservableItem<string>} observableOrValue - Prefix to search for
     * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
     * @returns {FilterResult}
     * @example
     * users.where({ name: startsWith('Jo') });
     */
    function startsWith(observableOrValue, caseSensitive = false){
        return createFilter(observableOrValue, (value, query) => {
            if (!query) return true;
            if (!caseSensitive){
                return String(value).toLowerCase().startsWith(String(query).toLowerCase());
            }
            return String(value).startsWith(String(query));
        });
    }

    /**
     * Creates a filter that passes when the value ends with the given query string.
     * Case-insensitive by default.
     *
     * @param {string|ObservableItem<string>} observableOrValue - Suffix to search for
     * @param {boolean} [caseSensitive=false] - If true, comparison is case-sensitive
     * @returns {FilterResult}
     * @example
     * files.where({ name: endsWith('.js') });
     */
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
     * Reactive array container extending ObservableItem.
     * Wraps a native array and triggers reactivity on mutations (push, pop, splice, etc.).
     * Use Observable.array() rather than instantiating directly.
     *
     * @constructor
     * @param {Array} target - Initial array value
     * @param {{ propagation?: boolean, deep?: boolean, reset?: boolean }|null} [configs=null] - Configuration
     * @param {boolean} [configs.deep] - If false, nested arrays are not wrapped in ObservableArray
     * @param {boolean} [configs.reset] - If true, stores initial value for .reset()
     * @example
     * const items = Observable.array([1, 2, 3]);
     * items.push(4); // triggers reactivity
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
        },
    });


    ObservableArray.prototype.$mutate = function(action, args, mutateFn) {
        if(this.$mutationInterceptor) {
            const value = this.$mutationInterceptor(args, { action });
            if(args !== undefined) {
                args = value;
            }
        }
        mutateFn(args);
    };

    mutationMethods.forEach((method) => {
        ObservableArray.prototype[method] = function(...values) {
            return this.$mutate(method, values, (argsToUse) => {
                const result = this.$currentValue[method].apply(this.$currentValue, argsToUse);
                this.trigger({ action: method, args: argsToUse, result });
                return result;
            });
        };
    });

    noMutationMethods.forEach((method) => {
        ObservableArray.prototype[method] = function(...values) {
            return this.$currentValue[method].apply(this.$currentValue, values);
        };
    });


    const $clearEvent = { action: 'clear' };

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
        this.$mutate('clear', [], () => {
            this.$currentValue.length = 0;
            this.trigger($clearEvent);
        });
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
        this.$mutate('merge', values, (valuesToMerge) => {
            this.$currentValue.push.apply(this.$currentValue, valuesToMerge);
            this.trigger({ action: 'merge',  args: valuesToMerge });
        });
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
        this.$mutate('swap', [indexA, indexB], ([indexA, indexB]) => {
            const value = this.$currentValue;
            const length = value.length;
            if(indexB < indexA) {
                const temp = indexA;
                indexA = indexB;
                indexB = temp;
            }
            if(length < indexA || length < indexB) {
                return false;
            }
            const elementA = value[indexA];
            const elementB = value[indexB];

            value[indexA] = elementB;
            value[indexB] = elementA;
            this.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
        });
        return true;
    };

    /**
     * Swaps two items by reference (not by index).
     * Finds indices of both items and delegates to .swap().
     *
     * @param {*} itemA - First item (by reference)
     * @param {*} itemB - Second item (by reference)
     * @returns {boolean} True if swap was successful
     * @example
     * const items = Observable.array(['a', 'b', 'c']);
     * items.swapItems('a', 'c'); // ['c', 'b', 'a']
     */
    ObservableArray.prototype.swapItems = function(itemA, itemB) {
        const indexA = this.$currentValue.indexOf(itemA);
        const indexB = this.$currentValue.indexOf(itemB);

        return this.swap(indexA, indexB);
    };

    /**
     * Inserts an item immediately after the target item in the array.
     *
     * @param {*} data - Item to insert
     * @param {*} target - Existing item after which data is inserted
     * @returns {Array} Result of the underlying splice call
     * @example
     * const items = Observable.array(['a', 'c']);
     * items.insertAfter('b', 'a'); // ['a', 'b', 'c']
     */
    ObservableArray.prototype.insertAfter = function(data, target) {
        const targetIndex = this.$currentValue.indexOf(target);
        return this.splice(targetIndex + 1, 0, data);
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
        let deleted = [];
        this.$mutate('remove', [index], ([idx]) => {
            deleted = this.$currentValue.splice(idx, 1);
            if(deleted.length === 0) {
                return;
            }
            this.trigger({action: 'remove', args: [idx], result: deleted[0]});
        });
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
     * Checks if the array has no elements.
     * Semantic alias for length === 0. Different from .clear() which empties the array.
     *
     * @returns {boolean} True if the array contains no elements
     * @example
     * const items = Observable.array([]);
     * items.empty(); // true
     */
    ObservableArray.prototype.empty = function() {
        return this.$currentValue.length === 0;
    };


    /**
     * Triggers a 'populate' operation used internally by ForEachArray for batch rendering.
     * Not intended for direct use in application code.
     *
     * @internal
     * @param {number} iteration - Number of items to render
     * @param {Function} callback - Render callback for each item
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
     *
     * const adults = users.where({ age: (val) => val >= 18 });
     */
    ObservableArray.prototype.where = function(predicates) {
        if(typeof predicates === 'function') {
            predicates = { _: predicates };
        }
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

        const viewArray = new ObservableArray([]);

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
                callback: (item) => fields.some(field => filter.callback(item[field])),
            },
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
                callback: (item) => fields.every(field => filter.callback(item[field])),
            },
        });
    };

    /**
     * Subscribes deeply to all observable items within the array.
     * Automatically binds and unbinds listeners as items are added or removed.
     * Returns an unsubscribe function.
     *
     * @param {(value: Array) => void} callback - Called whenever any nested observable changes
     * @returns {() => void} Unsubscribe function
     * @example
     * const users = Observable.array([Observable({ name: 'John' })]);
     * const unsub = users.deepSubscribe((items) => console.log('changed', items));
     * unsub(); // stop listening
     */
    ObservableArray.prototype.deepSubscribe = function(callback) {
        const updatedValue = nextTick(() => callback(this.val()));
        const $listeners = new WeakMap();

        const bindItem = (item) => {
            if ($listeners.has(item)) {
                return;
            }
            if (item?.__$isObservableArray) {
                $listeners.set(item, item.deepSubscribe(updatedValue));
                return;
            }
            if (item?.__$isObservable) {
                item.subscribe(updatedValue);
                $listeners.set(item, () => item.unsubscribe(updatedValue));
            }
        };

        const unbindItem = (item) => {
            const unsub = $listeners.get(item);
            if (unsub) {
                unsub();
                $listeners.delete(item);
            }
        };

        this.$currentValue.forEach(bindItem);
        this.subscribe(updatedValue);

        this.subscribe((items, _, operations) => {
            switch (operations?.action) {
            case 'push':
            case 'unshift':
                operations.args.forEach(bindItem);
                break;

            case 'splice': {
                const [start, deleteCount, ...newItems] = operations.args;
                operations.result?.forEach(unbindItem);
                newItems.forEach(bindItem);
                break;
            }

            case 'remove':
                unbindItem(operations.result);
                break;

            case 'merge':
                operations.args.forEach(bindItem);
                break;

            case 'clear':
                this.$currentValue.forEach(unbindItem);
                break;
            }
        });

        return () => {
            this.$currentValue.forEach(unbindItem);
        };
    };

    /**
     * Keeps this array in sync with another ObservableArray.
     * All mutations are mirrored to the target array in real time.
     *
     * @param {ObservableArray} targetObservable - The array to sync into
     * @returns {() => void} Unsubscribe function to stop syncing
     * @example
     * const source = Observable.array([1, 2, 3]);
     * const target = Observable.array([]);
     * const unsync = source.sync(target);
     * source.push(4); // target is now [1, 2, 3, 4]
     * unsync();
     */
    ObservableArray.prototype.sync = function(targetObservable) {
        if (!targetObservable || !targetObservable.__$isObservableArray) {
            throw new NativeDocumentError('ObservableArray.sync : target must be an ObservableArray');
        }

        targetObservable.set([...this.$currentValue]);

        const sync = (currentValue, _, operations) => {
            if (!operations) {
                targetObservable.set([...currentValue]);
                return;
            }

            const { action, args } = operations;
            targetObservable[action].apply(targetObservable, args);
        };
        this.subscribe(sync);

        return () => this.unsubscribe(sync);
    };

    /**
     * Creates a new ObservableArray with a shallow clone of the current array.
     *
     * @returns {ObservableArray} New independent ObservableArray with same items
     */
    ObservableArray.prototype.clone = function() {
        return new ObservableArray(this.resolve());
    };

    /**
     * Returns a derived ObservableChecker that emits true when the array has at least one item.
     *
     * @returns {ObservableChecker<boolean>}
     * @example
     * const items = Observable.array([]);
     * items.isNotEmpty().val(); // false
     * items.push(1);
     * items.isNotEmpty().val(); // true
     */
    ObservableArray.prototype.isNotEmpty = function () {
        return this.is((x) => x.length > 0);
    };

    /**
     * Reactive object container extending ObservableItem.
     * Each property of the target object becomes an individual ObservableItem (or ObservableArray/ObservableObject for nested structures).
     * Use Observable.object() or Observable.init() rather than instantiating directly.
     *
     * @constructor
     * @param {Record<string, *>} target - Plain object to make reactive
     * @param {{ deep?: boolean, reset?: boolean, propagation?: boolean }|null} [configs] - Configuration
     * @param {boolean} [configs.deep] - If false, nested objects and arrays are not wrapped recursively (default: true)
     * @example
     * const user = Observable.object({ name: 'John', age: 25 });
     * user.name.$value = 'Jane'; // triggers reactivity on name only
     */
    const ObservableObject = function(target, configs) {
        ObservableItem.call(this, target);
        this.$observables = {};
        this.configs = configs;

        for(const key in target) {
            if(!Object.hasOwn(this, key)) {
                Object.defineProperty(this, key, {
                    get: () => this.$observables[key],
                    set: (value) => {
                        this.$observables[key].set(value);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
        }

        this.$load(target);

        Object.defineProperty(this, '$currentValue', {
            get: function() {
                return this.val();
            },
            set(value) {
                this.set(value);
            }
        });
    };

    ObservableObject.prototype = Object.create(ObservableItem.prototype);

    Object.defineProperty(ObservableObject, '$value', {
        get() {
            return this.val();
        },
        set(value) {
            this.set(value);
        },
    });

    ObservableObject.prototype.__$isObservableObject = true;
    ObservableObject.prototype.__isProxy__ = true;

    /**
     * Initialises (or reinitialize) the internal observables map from a plain object.
     * Called automatically in the constructor.
     *
     * @internal
     * @param {Record<string, *>} initialValue - Object whose properties are turned into observables
     */
    ObservableObject.prototype.$load = function(initialValue) {
        const configs = this.configs;
        for(const key in initialValue) {
            const itemValue = initialValue[key];
            if(Array.isArray(itemValue)) {
                if(configs?.deep !== false) {
                    const mappedItemValue = itemValue.map(item => {
                        if(Validator.isJson(item)) {
                            return new ObservableObject(item, configs);
                        }
                        if(Validator.isArray(item)) {
                            return new ObservableArray(item, configs);
                        }
                        return new ObservableItem(item, configs);
                    });
                    this.$observables[key] = new ObservableArray(mappedItemValue, configs);
                    continue;
                }
                this.$observables[key] = new ObservableArray(itemValue, configs);
                continue;
            }
            if(itemValue?.__$Observable) {
                this.$observables[key] = itemValue;
                continue;
            }
            this.$observables[key] = (Validator.isJson(itemValue)) ? new ObservableObject(itemValue, configs) : new ObservableItem(itemValue, configs);
        }
    };

    /**
     * Returns a plain snapshot of all observable values.
     * Unwraps nested ObservableItem, ObservableArray, and ObservableObject recursively.
     * Alias: $val()
     *
     * @returns {Record<string, *>} Plain object with current values
     * @example
     * const user = Observable.object({ name: 'John', age: 25 });
     * user.val(); // { name: 'John', age: 25 }
     */
    ObservableObject.prototype.val = function() {
        const result = {};
        for(const key in this.$observables) {
            const dataItem = this.$observables[key];
            if(dataItem?.__$Observable) {
                let value = dataItem.val();
                if(Array.isArray(value)) {
                    value = value.map(item => {
                        if(item.__$Observable) {
                            return item.val();
                        }
                        return item;
                    });
                }
                result[key] = value;
            } else {
                result[key] = dataItem;
            }
        }
        return result;
    };
    ObservableObject.prototype.$val = ObservableObject.prototype.val;

    /**
     * Returns the current value of a single property, unwrapped from its observable.
     * Alias: $get(property)
     *
     * @param {string} property - Property name
     * @returns {*} The current value of that property
     * @example
     * const user = Observable.object({ name: 'John' });
     * user.get('name'); // 'John'
     */
    ObservableObject.prototype.get = function(property) {
        const item = this.$observables[property];
        if(item?.__$Observable) {
            return item.val();
        }
        return item;
    };
    ObservableObject.prototype.$get = ObservableObject.prototype.get;

    /**
     * Updates one or more properties with new values.
     * Supports partial updates — only provided keys are changed.
     * Aliases: $set(newData), $updateWith(newData), update(newData)
     *
     * @param {Partial<Record<string, *>>} newData - Object with properties to update
     * @example
     * const user = Observable.object({ name: 'John', age: 25 });
     * user.set({ name: 'Jane' }); // Only name changes, age stays 25
     */
    ObservableObject.prototype.set = function(newData) {
        const data = newData?.__$Observable ? newData.$value : newData;
        const configs = this.configs;

        for(const key in data) {
            const targetItem = this.$observables[key];
            const newValueOrigin = newData[key];
            const newValue = data[key];

            if(targetItem?.__$Observable) {
                if(targetItem.__$isObservableObject) {
                    targetItem.update(newValue);
                    continue;
                }
                if(!Validator.isArray(newValue)) {
                    targetItem.set(newValue);
                    continue;
                }
                const firstElementFromOriginalValue = newValueOrigin.at(0);
                if(firstElementFromOriginalValue?.__$Observable) {
                    const newValues = newValue.map(item => {
                        if(firstElementFromOriginalValue.__$isObservableObject) {
                            return new ObservableObject(item, configs);
                        }
                        return ObservableItem(item, configs);
                    });
                    targetItem.set(newValues);
                    continue;
                }
                targetItem.set([...newValue]);
                continue;
            }
            this[key] = newValue;
        }
    };
    ObservableObject.prototype.$set = ObservableObject.prototype.set;
    ObservableObject.prototype.$updateWith = ObservableObject.prototype.set;

    /**
     * Returns an array of all internal observable instances (one per property).
     * Alias: $observables()
     *
     * @returns {ObservableItem[]} Array of observable instances
     */
    ObservableObject.prototype.observables = function() {
        return Object.values(this.$observables);
    };
    ObservableObject.prototype.$observables = ObservableObject.prototype.observables;

    /**
     * Returns all property names of the observable object.
     * Alias: $keys()
     *
     * @returns {string[]} Array of property names
     */
    ObservableObject.prototype.keys = function() {
        return Object.keys(this.$observables);
    };
    ObservableObject.prototype.$keys = ObservableObject.prototype.keys;

    /**
     * Creates a new ObservableObject with a snapshot of the current values.
     * Changes to the clone do not affect the original.
     * Alias: $clone()
     *
     * @returns {ObservableObject} New independent ObservableObject with the same structure and values
     */
    ObservableObject.prototype.clone = function() {
        return new ObservableObject(this.val(), this.configs);
    };
    ObservableObject.prototype.$clone = ObservableObject.prototype.clone;

    /**
     * Resets all properties to their initial values by calling .reset() on each child observable.
     * Only works if observables were created with { reset: true }.
     */
    ObservableObject.prototype.reset = function() {
        for(const key in this.$observables) {
            this.$observables[key].reset();
        }
    };
    ObservableObject.prototype.originalSubscribe = ObservableObject.prototype.subscribe;

    /**
     * Subscribes to changes across all nested observables.
     * The callback is called whenever any property (or nested value) changes.
     * Internally uses debouncing (nextTick) to batch multiple simultaneous changes.
     *
     * @param {(value: Record<string, *>) => void} callback - Called on any nested change
     * @example
     * const user = Observable.object({ name: 'John', age: 25 });
     * user.subscribe(() => console.log('user changed:', user.val()));
     * user.name.$value = 'Jane'; // logs 'user changed: { name: "Jane", age: 25 }'
     */
    ObservableObject.prototype.subscribe = function(callback) {
        const observables = this.observables();
        const updatedValue = nextTick(() => this.trigger());

        this.originalSubscribe(callback);

        for (let i = 0, length = observables.length; i < length; i++) {
            const observable = observables[i];
            if (observable.__$isObservableArray) {
                observable.deepSubscribe(updatedValue);
                continue;
            }
            observable.subscribe(updatedValue);
        }
    };
    ObservableObject.prototype.configs = function() {
        return this.configs;
    };

    ObservableObject.prototype.update = ObservableObject.prototype.set;

    const $computed = (fn, dependencies) => ObservableItem.computed(fn, dependencies);
    const $checker = (obs, fn) => obs.transform(fn);

    //
    // is... -> ObservableChecker<boolean>
    //

    /**
     * Returns a derived observable that emits true when the value strictly equals the given value.
     * Supports reactive comparison when an ObservableItem is passed.
     *
     * @param {*|ObservableItem} value - Static value or observable to compare against
     * @returns {ObservableChecker<boolean>}
     * @example
     * const age = Observable(25);
     * age.isEqualTo(25).val(); // true
     * age.isEqualTo(Observable(25)).val(); // true
     */
    ObservableItem.prototype.isEqualTo = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a === b, [this, value]);
        }
        return $checker(this, x => x === value);
    };

    /**
     * Returns a derived observable that emits true when the value does not strictly equal the given value.
     *
     * @param {*|ObservableItem} value - Static value or observable to compare against
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isNotEqualTo = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a !== b, [this, value]);
        }
        return $checker(this, x => x !== value);
    };

    /**
     * Returns a derived observable that emits true when the value is greater than the given value.
     *
     * @param {number|ObservableItem<number>} value - Threshold value or observable
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isGreaterThan = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a > b, [this, value]);
        }
        return $checker(this, x => x > value);
    };

    /**
     * Returns a derived observable that emits true when the value is greater than or equal to the given value.
     *
     * @param {number|ObservableItem<number>} value - Threshold value or observable
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isGreaterThanOrEqualTo = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a >= b, [this, value]);
        }
        return $checker(this, x => x >= value);
    };

    /**
     * Returns a derived observable that emits true when the value is less than the given value.
     *
     * @param {number|ObservableItem<number>} value - Threshold value or observable
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isLessThan = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a < b, [this, value]);
        }
        return $checker(this, x => x < value);
    };

    /**
     * Returns a derived observable that emits true when the value is less than or equal to the given value.
     *
     * @param {number|ObservableItem<number>} value - Threshold value or observable
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isLessThanOrEqualTo = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => a <= b, [this, value]);
        }
        return $checker(this, x => x <= value);
    };

    /**
     * Returns a derived observable that emits true when the value is between min and max (inclusive).
     * All combinations of static and observable min/max are supported.
     *
     * @param {number|ObservableItem<number>} min - Lower bound (inclusive)
     * @param {number|ObservableItem<number>} max - Upper bound (inclusive)
     * @returns {ObservableChecker<boolean>}
     * @example
     * const age = Observable(25);
     * age.isBetween(18, 65).val(); // true
     * age.isBetween(Observable(18), Observable(65)).val(); // true
     */
    ObservableItem.prototype.isBetween = function (min, max) {
        if (min.__$Observable && max.__$Observable) {
            return $computed((x, a, b) => x >= a && x <= b, [this, min, max]);
        }
        if (min.__$Observable) {
            return $computed((x, a) => x >= a && x <= max, [this, min]);
        }
        if (max.__$Observable) {
            return $computed((x, b) => x >= min && x <= b, [this, max]);
        }
        return $checker(this, x => x >= min && x <= max);
    };

    /**
     * Returns a derived observable that emits true when the value is null or undefined.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isNull = function () {
        return $checker(this, x => x == null);
    };

    /**
     * Returns a derived observable that emits true when the value is truthy.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isTruthy = function () {
        return $checker(this, x => !!x);
    };

    /**
     * Returns a derived observable that emits true when the value is falsy.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isFalsy = function () {
        return $checker(this, x => !x);
    };

    /**
     * Returns a derived observable that emits true when the string value starts with the given string.
     *
     * @param {string|ObservableItem<string>} str - Prefix to check for
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isStartingWith = function (str) {
        if (str?.__$Observable) {
            return $computed((a, b) => String(a).startsWith(b), [this, str]);
        }
        return $checker(this, x => String(x).startsWith(str));
    };

    /**
     * Returns a derived observable that emits true when the string value ends with the given string.
     *
     * @param {string|ObservableItem<string>} str - Suffix to check for
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isEndingWith = function (str) {
        if (str?.__$Observable) {
            return $computed((a, b) => String(a).endsWith(b), [this, str]);
        }
        return $checker(this, x => String(x).endsWith(str));
    };

    /**
     * Returns a derived observable that emits true when the string value matches the given regex.
     *
     * @param {RegExp|ObservableItem<RegExp>} regex - Pattern to test against
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isMatchingPattern = function (regex) {
        if (regex?.__$Observable) {
            return $computed((a, b) => new RegExp(b).test(String(a)), [this, regex]);
        }
        return $checker(this, x => regex.test(String(x)));
    };

    /**
     * Returns a derived observable that emits true when the value is empty.
     * Empty means: null, undefined, empty string, or empty array.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isEmpty = function () {
        return $checker(this, x => x == null || x === '' || (Array.isArray(x) && x.length === 0));
    };

    /**
     * Returns a derived observable that emits true when the value is not empty.
     * Not empty means: not null, not undefined, not empty string, not empty array.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.isNotEmpty = function () {
        return $checker(this, x => x != null && x !== '' && !(Array.isArray(x) && x.length === 0));
    };

    /**
     * Returns a derived observable that emits true when the value includes the given value.
     * Works for both arrays (includes check) and strings (substring check).
     *
     * @param {*|ObservableItem} value - Value to search for
     * @returns {ObservableChecker<boolean>}
     * @example
     * Observable([1, 2, 3]).isIncludes(2).val(); // true
     * Observable('hello world').isIncludes('world').val(); // true
     */
    ObservableItem.prototype.isIncludes = function (value) {
        if (value?.__$Observable) {
            return $computed((a, b) => {
                if (Array.isArray(a)) return a.includes(b);
                return String(a).includes(String(b));
            }, [this, value]);
        }
        return $checker(this, x => {
            if (Array.isArray(x)) return x.includes(value);
            return String(x).includes(String(value));
        });
    };

    /**
     * Returns a derived observable that emits true when the value is included in the given array.
     * Alias: isOneOf
     *
     * @param {Array|ObservableItem<Array>} array - Array to check membership in
     * @returns {ObservableChecker<boolean>}
     * @example
     * const role = Observable('admin');
     * role.isIncludedIn(['admin', 'editor']).val(); // true
     */
    ObservableItem.prototype.isIncludedIn = function (array) {
        if (array?.__$Observable) {
            return $computed((a, b) => b.includes(a), [this, array]);
        }
        return $checker(this, x => array.includes(x));
    };

    ObservableItem.prototype.isOneOf = ObservableItem.prototype.isIncludedIn;

    /**
     * Returns a derived observable that emits true when the given key exists in the value object.
     *
     * @param {string|ObservableItem<string>} key - Property key to check for
     * @returns {ObservableChecker<boolean>}
     * @example
     * const user = Observable({ name: 'John' });
     * user.isHaving('name').val(); // true
     */
    ObservableItem.prototype.isHaving = function (key) {
        if (key?.__$Observable) {
            return $computed((a, b) => b in Object(a), [this, key]);
        }
        return $checker(this, x => key in Object(x));
    };

    //
    // to... -> ObservableChecker<any>
    //

    /**
     * Returns a derived observable that emits the string value converted to uppercase.
     *
     * @returns {ObservableChecker<string>}
     */
    ObservableItem.prototype.toUpperCase = function () {
        return $checker(this, x => String(x).toUpperCase());
    };

    /**
     * Returns a derived observable that emits the string value converted to lowercase.
     *
     * @returns {ObservableChecker<string>}
     */
    ObservableItem.prototype.toLowerCase = function () {
        return $checker(this, x => String(x).toLowerCase());
    };

    /**
     * Returns a derived observable that emits the string value trimmed of whitespace.
     *
     * @returns {ObservableChecker<string>}
     */
    ObservableItem.prototype.toTrimmed = function () {
        return $checker(this, x => String(x).trim());
    };

    /**
     * Returns a derived observable that emits the value coerced to boolean.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableItem.prototype.toBoolean = function () {
        return $checker(this, x => !!x);
    };

    /**
     * Returns a derived observable that emits a string with the placeholder replaced by the current value.
     * Alias: toFormatted
     *
     * @param {string} template - Template string containing the placeholder
     * @param {string} [placeholder='${v}'] - Placeholder string to replace with the value
     * @returns {ObservableChecker<string>}
     * @example
     * const count = Observable(5);
     * count.toLiteral('You have ${v} items').val(); // 'You have 5 items'
     */
    ObservableItem.prototype.toLiteral = function (template, placeholder = '${v}') {
        return $checker(this, x => template.replace(placeholder, x));
    };

    ObservableItem.prototype.toFormatted = ObservableItem.prototype.toLiteral;

    /**
     * Returns a derived observable that emits a nested property value resolved via dot notation.
     *
     * @param {string} key - Dot-notation path to the property (e.g. 'user.address.city')
     * @returns {ObservableChecker<*>}
     * @example
     * const state = Observable({ user: { name: 'John' } });
     * state.toProperty('user.name').val(); // 'John'
     */
    ObservableItem.prototype.toProperty = function (key) {
        const keys = key.split('.');
        return $checker(this, x => {
            let value = x;
            for (const k of keys) {
                if (value == null) return undefined;
                value = value[k];
            }
            return value;
        });
    };

    /**
     * Returns a derived observable that emits the length of the current value.
     * Returns 0 if the value is null or undefined.
     *
     * @returns {ObservableChecker<number>}
     */
    ObservableItem.prototype.toLength = function () {
        return $checker(this, x => (x == null ? 0 : x.length));
    };

    /**
     * Returns a derived observable that emits the value clamped between min and max.
     * All combinations of static and observable min/max are supported.
     *
     * @param {number|ObservableItem<number>} min - Minimum bound
     * @param {number|ObservableItem<number>} max - Maximum bound
     * @returns {ObservableChecker<number>}
     * @example
     * const volume = Observable(150);
     * volume.toClamped(0, 100).val(); // 100
     */
    ObservableItem.prototype.toClamped = function (min, max) {
        if (min.__$Observable && max.__$Observable) {
            return $computed((x, a, b) => Math.min(Math.max(x, a), b), [this, min, max]);
        }
        if (min.__$Observable) {
            return $computed((x, a) => Math.min(Math.max(x, a), max), [this, min]);
        }
        if (max.__$Observable) {
            return $computed((x, b) => Math.min(Math.max(x, min), b), [this, max]);
        }
        return $checker(this, x => Math.min(Math.max(x, min), max));
    };

    /**
     * Returns a derived observable that emits the value expressed as a percentage of total.
     * Returns 0 if total is 0.
     *
     * @param {number|ObservableItem<number>} total - The total value representing 100%
     * @returns {ObservableChecker<number>}
     * @example
     * const score = Observable(75);
     * score.toPercent(100).val(); // 75
     * score.toPercent(200).val(); // 37.5
     */
    ObservableItem.prototype.toPercent = function (total) {
        if (total?.__$Observable) {
            return $computed((a, b) => (b === 0 ? 0 : (a / b) * 100), [this, total]);
        }
        return $checker(this, x => (total === 0 ? 0 : (x / total) * 100));
    };

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

    ObservableWhen.prototype.__$Observable = true;
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

    /**
     *
     * @param {ObservableItem} $observable
     * @param {Function} $checker
     * @class ObservableChecker
     */
    function ObservableChecker($observable, $checker) {
        this.observable = $observable;

        ObservableItem.call(this);
        {
            PluginsManager$1.emit('CreateObservableChecker', this);
        }

        this.$mutation = $checker;

        $observable.subscribe((newValue) => {
            this.$updateWithMutation(newValue);
        });

        this.$updateWithMutation($observable.val());
    }

    ObservableChecker.prototype = Object.create(ObservableItem.prototype);
    ObservableChecker.prototype.constructor = ObservableChecker;
    ObservableChecker.prototype.__$Observable = true;
    ObservableChecker.prototype.__$isObservableChecker = true;


    const ObservablePipe = ObservableChecker;
    ObservablePipe.prototype.constructor = ObservablePipe;

    ObservableChecker.prototype.$updateWithMutation = function(newValue) {
        newValue = this.$mutation(newValue);
        return this.set(newValue);
    };

    const $parseDateParts = (value, locale) => {
        const d = new Date(value);
        return {
            d,
            parts: new Intl.DateTimeFormat(locale, {
                year:   'numeric',
                month:  'long',
                day:    '2-digit',
                hour:   '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).formatToParts(d).reduce((acc, { type, value }) => {
                acc[type] = value;
                return acc;
            }, {}),
        };
    };

    const $applyDatePattern = (pattern, d, parts) => {
        const pad = n => String(n).padStart(2, '0');
        return pattern
            .replace('YYYY', parts.year)
            .replace('YY',   parts.year.slice(-2))
            .replace('MMMM', parts.month)
            .replace('MMM',  parts.month.slice(0, 3))
            .replace('MM',   pad(d.getMonth() + 1))
            .replace('DD',   pad(d.getDate()))
            .replace('D',    d.getDate())
            .replace('HH',   parts.hour)
            .replace('mm',   parts.minute)
            .replace('ss',   parts.second);
    };

    const Formatters = {
        currency: (value, locale, { currency = 'XOF', notation, minimumFractionDigits, maximumFractionDigits } = {}) =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                notation,
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(value),

        number: (value, locale, { notation, minimumFractionDigits, maximumFractionDigits } = {}) =>
            new Intl.NumberFormat(locale, {
                notation,
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(value),

        percent: (value, locale, { decimals = 1 } = {}) =>
            new Intl.NumberFormat(locale, {
                style:                'percent',
                maximumFractionDigits: decimals,
            }).format(value),

        date: (value, locale, { format, dateStyle = 'long' } = {}) => {
            if (format) {
                const { d, parts } = $parseDateParts(value, locale);
                return $applyDatePattern(format, d, parts);
            }
            return new Intl.DateTimeFormat(locale, { dateStyle }).format(new Date(value));
        },

        time: (value, locale, { format, hour = '2-digit', minute = '2-digit', second } = {}) => {
            if (format) {
                const { d, parts } = $parseDateParts(value, locale);
                return $applyDatePattern(format, d, parts);
            }
            return new Intl.DateTimeFormat(locale, { hour, minute, second }).format(new Date(value));
        },

        datetime: (value, locale, { format, dateStyle = 'long', hour = '2-digit', minute = '2-digit', second } = {}) => {
            if (format) {
                const { d, parts } = $parseDateParts(value, locale);
                return $applyDatePattern(format, d, parts);
            }
            return new Intl.DateTimeFormat(locale, { dateStyle, hour, minute, second }).format(new Date(value));
        },

        relative: (value, locale, { unit = 'day', numeric = 'auto' } = {}) => {
            const diff = Math.round((value - Date.now()) / (1000 * 60 * 60 * 24));
            return new Intl.RelativeTimeFormat(locale, { numeric }).format(diff, unit);
        },

        plural: (value, locale, { singular, plural } = {}) => {
            const rule = new Intl.PluralRules(locale).select(value);
            return `${value} ${rule === 'one' ? singular : plural}`;
        },
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
     * Create an Observable checker instance
     * @param callback
     * @returns {ObservableChecker}
     */
    ObservableItem.prototype.check = function(callback) {
        return new ObservableChecker(this, callback);
    };

    ObservableItem.prototype.transform = ObservableItem.prototype.check;

    /**
     * Returns a derived observable that emits the value of a nested property.
     * Alias for .check(value => value[property]).
     *
     * @param {string} property - Property name to extract
     * @returns {ObservableChecker<*>}
     * @example
     * const user = Observable({ name: 'John', age: 25 });
     * user.pluck('name').val(); // 'John'
     */
    ObservableItem.prototype.pluck = function(property) {
        return new ObservableChecker(this, (value) => value[property]);
    };

    /**
     * Creates a derived observable using a callback or checks equality with a static value.
     * - If callback is a function: equivalent to .check(callback)
     * - If callback is a value: equivalent to .check(v => v === value)
     * Alias: .select()
     *
     * @param {Function|*} callbackOrValue - Transform function or value to compare
     * @returns {ObservableChecker<*>}
     * @example
     * const count = Observable(5);
     * count.is(v => v > 3).val(); // true
     * count.is(5).val(); // true
     */
    ObservableItem.prototype.is = function(callbackOrValue) {
        if(typeof callbackOrValue === 'function') {
            return new ObservableChecker(this, callbackOrValue);
        }
        return new ObservableChecker(this, (value) => value === callbackOrValue);
    };
    ObservableItem.prototype.select = ObservableItem.prototype.check;

    /**
     * Creates a derived observable that formats the current value using Intl.
     * Automatically reacts to both value changes and locale changes (Store.__nd.locale).
     *
     * @param {string | Function} type - Format type or custom formatter function
     * @param {Object} [options={}] - Options passed to the formatter
     * @returns {ObservableItem<string>}
     *
     * @example
     * // Currency
     * price.format('currency')                                      // "15 000 FCFA"
     * price.format('currency', { currency: 'EUR' })                 // "15 000,00 €"
     * price.format('currency', { notation: 'compact' })             // "15 K FCFA"
     *
     * // Number
     * count.format('number')                                        // "15 000"
     *
     * // Percent
     * rate.format('percent')                                        // "15,0 %"
     * rate.format('percent', { decimals: 2 })                       // "15,00 %"
     *
     * // Date
     * date.format('date')                                           // "3 mars 2026"
     * date.format('date', { dateStyle: 'full' })                    // "mardi 3 mars 2026"
     * date.format('date', { format: 'DD/MM/YYYY' })                 // "03/03/2026"
     * date.format('date', { format: 'DD MMM YYYY' })                // "03 mar 2026"
     * date.format('date', { format: 'DD MMMM YYYY' })               // "03 mars 2026"
     *
     * // Time
     * date.format('time')                                           // "20:30"
     * date.format('time', { second: '2-digit' })                    // "20:30:00"
     * date.format('time', { format: 'HH:mm:ss' })                   // "20:30:00"
     *
     * // Datetime
     * date.format('datetime')                                       // "3 mars 2026, 20:30"
     * date.format('datetime', { dateStyle: 'full' })                // "mardi 3 mars 2026, 20:30"
     * date.format('datetime', { format: 'DD/MM/YYYY HH:mm' })       // "03/03/2026 20:30"
     *
     * // Relative
     * date.format('relative')                                       // "dans 11 jours"
     * date.format('relative', { unit: 'month' })                    // "dans 1 mois"
     *
     * // Plural
     * count.format('plural', { singular: 'billet', plural: 'billets' }) // "3 billets"
     *
     * // Custom formatter
     * price.format(value => `${value.toLocaleString()} FCFA`)
     *
     * // Reacts to locale changes automatically
     * Store.setLocale('en-US');
     */


    ObservableItem.prototype.format = function(type, options = {}) {
        const self = this;

        if (typeof type === 'function') {
            return new ObservableChecker(self, type);
        }

        {
            if (!Formatters[type]) {
                throw new NativeDocumentError(
                    `Observable.format : unknown type '${type}'. Available : ${Object.keys(Formatters).join(', ')}.`,
                );
            }
        }

        const formatter = Formatters[type];
        const localeObservable = Formatters.locale;

        return ObservableItem.computed(() => formatter(self.val(), localeObservable.val(), options),
            [self, localeObservable],
        );
    };

    const STATE = {
        UNRESOLVED: 'unresolved',
        PENDING:    'pending',
        READY:      'ready',
        REFRESHING: 'refreshing',
        ERRORED:    'errored',
    };

    /**
     * Reactive async data fetcher with built-in state management.
     * Tracks loading, ready, refreshing, and error states automatically.
     * Use Observable.resource() rather than instantiating directly.
     *
     * @constructor
     * @param {(...depValues: any[], signal?: AbortSignal) => Promise<*>} fn - Async function to fetch data. Receives dependency values as arguments. If its arity exceeds the number of dependencies, an AbortSignal is passed as the last argument.
     * @param {ObservableItem[]} deps - Observable dependencies — resource re-fetches when any changes
     * @param {{ auto?: boolean, lazy?: boolean, debounce?: number, into?: ObservableItem, apply?: Function }} config - Configuration
     * @param {boolean} [config.auto=false] - If true, fetch runs automatically on creation (or when deps change)
     * @param {boolean} [config.lazy=false] - If true with deps, does not fetch immediately — waits for first dep change
     * @param {number} [config.debounce=0] - Debounce delay in ms for dependency-triggered re-fetches
     * @param {ObservableItem} [config.into] - Observable to write results into instead of creating a new one
     * @param {Function} [config.apply] - Custom function to apply the result to this.data
     * @example
     * const userId = Observable(1);
     * const user = Observable.resource(
     *   async (id, signal) => fetch(`/api/users/${id}`, { signal }).then(r => r.json()),
     *   [userId],
     *   { auto: true }
     * );
     */
    function ObservableResource(fn, deps, config) {
        this.$fn = (config.debounce > 0) ? debounce(fn, config.debounce) : fn;
        this.$dependencies = deps;
        this.$config = config;
        this.$controller  = null;
        this.$subscriptions        = [];

        this.data  = config.into ?? new ObservableItem(null);
        this.error = new ObservableItem(null);
        this.state = new ObservableItem(STATE.UNRESOLVED);

        this.loading = ObservableItem.computed(
            (state) => state === STATE.PENDING || state === STATE.REFRESHING,
            [this.state],
        );

        if (config.auto) {
            if (deps.length > 0) {
                this.$watchDependencies();
                return;
            }
            this.fetch();
        }
    }

    ObservableResource.prototype.$applyResult = function(result) {
        if(this.$config.apply) {
            this.$config.apply(result, this.data);
            return;
        }
        this.data.set(result);
    };

    ObservableResource.prototype.$abort = function() {
        if (this.$controller) {
            this.$controller.abort();
            this.$controller = null;
        }
    };

    ObservableResource.prototype.$runWithAbortController = function(isRefetch = false) {
        this.$abort();

        this.$controller = new AbortController();
        const signal = this.$controller.signal;

        const hasData = this.data.val() !== null;
        const nextState = isRefetch && hasData ? STATE.REFRESHING : STATE.PENDING;

        this.error.set(null);
        this.state.set(nextState);

        const depValues = this.$dependencies.map(dep => dep.val());
        const args = [...depValues, signal];

        Promise.resolve(this.$fn(...args))
            .then(result => {
                if (signal.aborted) {
                    return;
                }
                this.$applyResult(result);
                this.error.set(null);
                this.state.set(STATE.READY);
                this.$controller = null;
            })
            .catch(err => {
                if (signal.aborted) {
                    return;
                }
                this.error.set(err);
                this.state.set(STATE.ERRORED);
                this.$controller = null;
            });
    };
    ObservableResource.prototype.$runWithoutAbortController = function(isRefetch = false) {
        const hasData = this.data.val() !== null;
        const nextState = isRefetch && hasData ? STATE.REFRESHING : STATE.PENDING;

        this.error.set(null);
        this.state.set(nextState);

        const args = this.$dependencies.map(dep => dep.val());

        Promise.resolve(this.$fn(...args))
            .then(result => {
                this.$applyResult(result);
                this.error.set(null);
                this.state.set(STATE.READY);
            })
            .catch(err => {
                this.error.set(err);
                this.state.set(STATE.ERRORED);
            });
    };

    ObservableResource.prototype.$run = function(isRefetch = false) {
        const needsSignal = this.$fn.length > this.$dependencies.length;
        if(needsSignal) {
            this.$run = this.$runWithAbortController;
            return this.$runWithAbortController(isRefetch);
        }
        this.$run = this.$runWithoutAbortController;

        return this.$run(isRefetch);
    };

    ObservableResource.prototype.$watchDependencies = function() {
        this.$subscriptions.forEach(unsub => unsub());
        this.$subscriptions = [];

        this.$dependencies.forEach(dep => {
            const callback = () => this.$run(true);
            dep.subscribe(callback);
            this.$subscriptions.push(() => dep.unsubscribe(callback));
        });
        if (!this.$config.lazy) {
            this.$run(false);
        }
    };

    /**
     * Sets a custom function to apply fetched results to this.data.
     * Useful when the raw response needs transformation before storing.
     *
     * @param {(result: *, data: ObservableItem) => void} fn - Function receiving the result and the data observable
     * @returns {this}
     * @example
     * resource.apply((result, data) => data.set(result.items));
     */
    ObservableResource.prototype.apply = function(fn) {
        this.$config.apply = fn;
        return this;
    };

    /**
     * Redirects fetched results into an existing ObservableItem instead of the default internal one.
     * Updates both this.data reference and config.into.
     *
     * @param {ObservableItem} $observable - Target observable to write results into
     * @returns {this}
     * @example
     * const items = Observable([]);
     * resource.into(items);
     */
    ObservableResource.prototype.into = function($observable) {
        this.$config.into = $observable;
        this.data = $observable;
        return this;
    };

    /**
     * Triggers a fresh fetch (state transitions to 'pending').
     * Use when no prior data exists or when a full reload is needed.
     *
     * @returns {this}
     */
    ObservableResource.prototype.fetch = function() {
        this.$run(false);
        return this;
    };

    /**
     * Triggers a re-fetch (state transitions to 'refreshing' if data already exists).
     * Use when you want to reload while keeping the previous data visible.
     *
     * @returns {this}
     */
    ObservableResource.prototype.refetch = function() {
        this.$run(true);
        return this;
    };

    /**
     * Manually sets the data value and marks the state as 'ready'.
     * Useful for optimistic updates or seeding initial data without a network call.
     *
     * @param {*} value - New value to set on this.data
     * @returns {this}
     * @example
     * resource.mutate([...resource.data.val(), newItem]);
     */
    ObservableResource.prototype.mutate = function(value) {
        this.data.set(value);
        this.state.set(STATE.READY);
        return this;
    };

    /**
     * Cancels any pending request, unsubscribes from all dependencies, and clears subscriptions.
     * Call this when the component using this resource is unmounted.
     *
     * @returns {void}
     */
    ObservableResource.prototype.destroy = function() {
        this.$abort();
        this.$subscriptions.forEach(unsub => unsub());
        this.$subscriptions = [];
    };

    /**
     * Returns a derived observable that emits true when the state is 'ready'.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableResource.prototype.isReady = function() {
        return this.state.isEqualTo(STATE.READY);
    };

    /**
     * Returns a derived observable that emits true when the state is 'pending' (initial load).
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableResource.prototype.isPending = function() {
        return this.state.isEqualTo(STATE.PENDING);
    };

    /**
     * Returns a derived observable that emits true when the state is 'refreshing' (reload with existing data).
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableResource.prototype.isRefreshing = function() {
        return this.state.isEqualTo(STATE.REFRESHING);
    };

    /**
     * Returns a derived observable that emits true when the state is 'errored'.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableResource.prototype.isErrored = function() {
        return this.state.isEqualTo(STATE.ERRORED);
    };

    /**
     * Returns a derived observable that emits true when no fetch has been triggered yet.
     *
     * @returns {ObservableChecker<boolean>}
     */
    ObservableResource.prototype.isUnresolved = function() {
        return this.state.isEqualTo(STATE.UNRESOLVED);
    };

    /**
     * Registers a callback that is called every time a fetch completes successfully.
     *
     * @param {(value: *) => void} callback - Called with the fetched data value
     * @returns {this}
     * @example
     * resource.onSuccess((data) => console.log('Loaded:', data));
     */
    ObservableResource.prototype.onSuccess = function(callback) {
        this.data.subscribe((value) => {
            if (this.state.val() === STATE.READY) {
                callback(value);
            }
        });
        return this;
    };

    /**
     * Registers a callback called every time a fetch fails.
     *
     * @param {(error: Error) => void} callback - Called with the error object
     * @returns {this}
     * @example
     * resource.onError((err) => console.error('Failed:', err.message));
     */
    ObservableResource.prototype.onError = function(callback) {
        this.error.subscribe((err) => {
            if (err !== null) {
                callback(err);
            }
        });
        return this;
    };

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

    Observable.setLocale = function(locale) {
        Formatters.locale = locale.__$Observable ? locale : Observable(locale);
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
        const getValues = () => dependencies.map((item) => item.val());
        const initialValue = callback(...getValues());
        const observable = new ObservableItem(initialValue);
        const updatedValue = nextTick(() => observable.set(callback(...getValues())));
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
            if(dependency.__$isObservableObject) {
                dependency.observables().forEach((observable) => {
                    observable.subscribe(updatedValue);
                });
                return;
            }
            dependency.subscribe(updatedValue);
        });

        return observable;
    };
    ObservableItem.computed = Observable.computed;


    Observable.init = function(initialValue, configs = null) {
        return new ObservableObject(initialValue, configs);
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
        if(data?.__$isObservableArray) {
            const result = [];
            for(let i = 0, length = data.length; i < length; i++) {
                const item = data.at(i);
                result.push(Observable.value(item));
            }
            return result;
        }
        if(data?.__$Observable) {
            return data.val();
        }
        return data;
    };

    Observable.object = Observable.init;
    Observable.json = Observable.init;


    Observable.resource = function(fn, deps = [], options = false) {
        const config = (typeof options === 'boolean')
            ? { auto: options, debounce: 0, lazy: false }
            : { auto: false, debounce: 0, lazy: false, ...options };

        return new ObservableResource(fn, deps, config);
    };

    ObservableItem.prototype.resolve = function () {
        return Observable.value(this);
    };

    /**
     * Applies a reactive class map to an HTMLElement.
     * Each key is a CSS class name; each value is a boolean or ObservableItem<boolean>.
     * If the value is an ObservableChecker emitting a string, toggles the class name dynamically.
     *
     * @param {HTMLElement} element - Target element
     * @param {Record<string, boolean|ObservableItem<boolean>|ObservableChecker<boolean|string>>} data - Class map
     */
    const bindClassAttribute = (element, data) => {
        for(const className in data) {
            const value = data[className];
            if(value.__$Observable) {
                if(value.__$isObservableChecker) {
                    let lastClass = value.val();
                    if(typeof lastClass === 'string') {
                        element.classes.toggle(lastClass, true);
                        value.subscribe((currentValue) => {
                            element.classes.remove(lastClass);
                            element.classes.toggle(currentValue, true);
                            lastClass = currentValue;
                        });
                        continue;
                    }
                }
                element.classes.toggle(className, value.val());
                value.subscribe((shouldAdd) => element.classes.toggle(className, shouldAdd));
                continue;
            }
            if(value.$hydrate) {
                value.$hydrate(element, className);
                continue;
            }
            element.classes.toggle(className, value);
        }
    };

    /**
     * Applies a reactive style map to an HTMLElement.
     * Each key is a CSS property name (camelCase or CSS custom property `--var`);
     * each value is a string or ObservableItem<string>.
     * CSS custom properties are set via element.style.setProperty().
     *
     * @param {HTMLElement} element - Target element
     * @param {Record<string, string|ObservableItem<string>>} data - Style map
     */
    const bindStyleAttribute = (element, data) => {
        for(const styleName in data) {
            const value = data[styleName];
            const isCustomProperty = styleName.startsWith('--');

            if(value.__$Observable) {
                if(isCustomProperty) {
                    element.style.setProperty(styleName, value.val());
                    value.subscribe((newValue) => {
                        if(newValue === false) {
                            element.style.removeProperty(styleName);
                            return;
                        }
                        element.style.setProperty(styleName, newValue);
                    });
                } else {
                    element.style[styleName] = value.val();
                    value.subscribe((newValue) => {
                        if(newValue === false) {
                            element.style.removeProperty(styleName);
                            return;
                        }
                        element.style[styleName] = newValue;
                    });
                }
                continue;
            }

            if(isCustomProperty) {
                element.style.setProperty(styleName, value);
                continue;
            }

            element.style[styleName] = value;
        }
    };

    /**
     *
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @param {boolean|number|Observable} value
     */
    const bindBooleanAttribute = (element, attributeName, value) => {
        const isObservable = value.__$isObservable;
        const defaultValue = isObservable? value.val() : value;

        const attributeRealName = BOOL_ATTRIBUTES_NAME[attributeName];

        if(Validator.isBoolean(defaultValue)) {
            element[attributeRealName] = defaultValue;
        }
        else {
            element[attributeRealName] = defaultValue === element.value;
        }
        if(isObservable) {
            if(attributeName === 'checked') {
                if(typeof defaultValue === 'boolean') {
                    element.addEventListener('input', () => value.set(element[attributeRealName]));
                }
                else {
                    element.addEventListener('input', () => value.set(element.value));
                }
                value.subscribe((newValue) => element[attributeRealName] = newValue);
                return;
            }
            value.subscribe((newValue) => element[attributeRealName] = (newValue === element.value));
        }
    };


    /**
     *
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @param {Observable} value
     */
    const bindAttributeWithObservable = (element, attributeName, value) => {
        const applyValue = attributeName === 'value' ? (newValue) => element.value = newValue : (newValue) => element.setAttribute(attributeName, newValue);
        value.subscribe(applyValue);

        if(attributeName === 'value') {
            element.value = value.val();
            element.addEventListener('input', () => value.set(element.value));
            return;
        }
        element.setAttribute(attributeName, value.val());
    };

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    const AttributesWrapper = (element, attributes) => {

        {
            Validator.validateAttributes(attributes);
        }

        for(const originalAttributeName in attributes) {
            const attributeName = originalAttributeName.toLowerCase();
            const value = attributes[originalAttributeName];
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
    };

    let $textNodeCache = null;

    const ElementCreator = {
        createTextNode() {
            if(!$textNodeCache) {
                $textNodeCache = document.createTextNode('');
                ElementCreator.createTextNode = () => $textNodeCache.cloneNode();
            }
            return $textNodeCache.cloneNode();
        },
        /**
         *
         * @param {HTMLElement|DocumentFragment} parent
         * @param {ObservableItem} observable
         * @returns {Text}
         */
        createObservableNode: (parent, observable) => {
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
        createHydratableNode: (parent, item) => {
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
        createStaticTextNode: (parent, value) => {
            const text = ElementCreator.createTextNode();
            text.nodeValue = value;
            parent && parent.appendChild(text);
            return text;
        },
        /**
         *
         * @param {string} name
         * @returns {HTMLElement|DocumentFragment}
         */
        createElement: (name) => {
            const node = document.createElement(name);
            return node.cloneNode();
        },
        bindTextNode: (textNode, value) => {
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
        processChildren: (children, parent) => {
            if(children === null) return;
            {
                PluginsManager$1.emit('BeforeProcessChildren', parent);
            }
            const child = ElementCreator.getChild(children);
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
        getChild: (child) => {
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
        processAttributes: (element, attributes) => {
            if (attributes) {
                AttributesWrapper(element, attributes);
            }
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {Object} attributes
         */
        processAttributesDirect: AttributesWrapper,
        processClassAttribute: bindClassAttribute,
        processStyleAttribute: bindStyleAttribute,
    };

    /**
     * Creates an augmented DocumentFragment with comment sentinel nodes and a MutationObserver
     * that fires when the fragment is inserted into the live DOM.
     * Used as the base for Anchor — not intended for direct use in application code.
     *
     * @internal
     * @constructor
     * @param {string} name - Debug label used in comment node text content
     * @returns {AnchorWithSentinel} Augmented DocumentFragment instance
     */
    function AnchorWithSentinel(name) {
        const instance = Reflect.construct(DocumentFragment, [], AnchorWithSentinel);
        const sentinel = document.createComment((name || '') + ' Anchor Sentinel');
        const anchorStart = document.createComment('Anchor Start : '+name);
        const anchorEnd = document.createComment('/ Anchor End '+name);
        const events = {};

        instance.append(anchorStart, sentinel, anchorEnd);

        const observer = new MutationObserver(() => {
            if (sentinel.parentNode !== instance && !(sentinel.parentNode instanceof DocumentFragment)) {
                events.connected && events.connected(sentinel.parentNode);
            }
        });

        observer.observe(document, { childList: true, subtree: true });


        instance.$sentinel = sentinel;
        instance.$start = anchorStart;
        instance.$end = anchorEnd;
        instance.$observer = observer;
        instance.$events = events;

        return instance;
    }

    AnchorWithSentinel.prototype = Object.create(DocumentFragment.prototype);
    AnchorWithSentinel.prototype.constructor = AnchorWithSentinel;

    /**
     * Registers a callback to call every time the sentinel is connected to the live DOM.
     * The callback receives the parent node as its argument.
     *
     * @param {(parent: Node) => void} callback - Called each time the fragment is inserted
     * @returns {this}
     */
    AnchorWithSentinel.prototype.onConnected = function(callback) {
        this.$events.connected = callback;
        return this;
    };

    /**
     * Registers a callback to call the first time the sentinel is connected to the live DOM.
     * After the first connection, the MutationObserver is disconnected automatically.
     *
     * @param {(parent: Node) => void} callback - Called once on first insertion
     */
    AnchorWithSentinel.prototype.onConnectedOnce = function(callback) {
        this.$events.connected = (parent) => {
            callback(parent);
            this.$observer.disconnect();
            this.$events.connectedOnce = null;
        };
    };

    function oneChildAnchorOverwriting(anchor, parent) {

        anchor.remove = () => {
            anchor.append.apply(anchor, parent.childNodes);
        };
        anchor.getParent = () => parent;

        anchor.appendChild = (child) => {
            child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            parent.appendChild(child);
        };

        anchor.appendChildRaw = parent.appendChild.bind(parent);
        anchor.append = anchor.appendChild;
        anchor.appendRaw = anchor.appendChildRaw;

        anchor.insertAtStart = (child) => {
            child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            parent.firstChild ? parent.insertBefore(child, parent.firstChild) : parent.appendChild(child);
        };
        anchor.insertAtStartRaw = (child) => {
            parent.firstChild ? parent.insertBefore(child, parent.firstChild) : parent.appendChild(child);
        };

        anchor.appendElement = anchor.appendChild;

        anchor.removeChildren = () => {
            parent.textContent = '';
        };

        anchor.replaceContent = function(content) {
            const child = Validator.isElement(content) ? content : ElementCreator.getChild(content);
            parent.replaceChildren(child);
        };

        anchor.replaceContentRaw = function(child) {
            parent.replaceChildren(child);
        };
        anchor.setContent = anchor.replaceContent;

        anchor.insertBefore = (child, anchor) => {
            child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            parent.insertBefore(child, anchor);
        };
        anchor.insertBeforeRaw = (child, anchor) => {
            parent.insertBefore(child, anchor);
        };

        anchor.appendChildBefore = anchor.insertBefore;
        anchor.appendChildBeforeRaw = anchor.insertBeforeRaw;

        anchor.clear = anchor.remove;
        anchor.detach = anchor.remove;

        anchor.replaceChildren = function() {
            parent.replaceChildren(...arguments);
        };

        anchor.getByIndex = (index) => {
            return parent.childNodes[index];
        };
    }

    /**
     * Creates an anchor fragment — a managed DocumentFragment delimited by comment sentinels.
     * Used internally by ForEach, ShowIf, Switch, Match and other control-flow directives
     * to manage dynamic DOM regions without a real container element.
     *
     * @param {string} name - Debug name for the anchor (visible as HTML comments in the DOM)
     * @param {boolean} [isUniqueChild=false] - If true, optimises rendering when this anchor is the only child of its parent
     * @returns {AnchorDocumentFragment} An augmented DocumentFragment with anchor management methods
     */
    function Anchor(name, isUniqueChild = false) {
        const anchorFragment = new AnchorWithSentinel(name);

        anchorFragment.onConnectedOnce((parent) => {
            if(isUniqueChild) {
                oneChildAnchorOverwriting(anchorFragment, parent);
            }
        });

        anchorFragment.__Anchor__ = true;

        const anchorStart = anchorFragment.$start;
        const anchorEnd = anchorFragment.$end;

        anchorFragment.nativeInsertBefore = anchorFragment.insertBefore;
        anchorFragment.nativeAppendChild = anchorFragment.appendChild;
        anchorFragment.nativeAppend = anchorFragment.append;

        const isParentUniqueChild = isUniqueChild
            ? () => true: (parent) => (parent.firstChild === anchorStart && parent.lastChild === anchorEnd);

        const insertBefore = (parent, child, target) => {
            const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            insertBeforeRaw(parent, childElement, target);
        };

        const insertBeforeRaw = (parent, child, target) => {
            if(parent === anchorFragment) {
                parent.nativeInsertBefore(child, target);
                return;
            }
            if(isParentUniqueChild(parent) && target === anchorEnd) {
                parent.append(child,  target);
                return;
            }
            parent.insertBefore(child, target);
        };

        anchorFragment.appendElement = function(child) {
            const parentNode = anchorStart.parentNode;
            if(parentNode === anchorFragment) {
                parentNode.nativeInsertBefore(child, anchorEnd);
                return;
            }
            parentNode.insertBefore(child, anchorEnd);
        };

        anchorFragment.appendChild = function(child, before = null) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                DebugManager.error('Anchor', 'Anchor : parent not found', child);
                return;
            }
            before = before ?? anchorEnd;
            insertBefore(parent, child, before);
        };

        anchorFragment.appendChildRaw = function(child, before = null) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                DebugManager.error('Anchor', 'Anchor : parent not found', child);
                return;
            }
            before = before ?? anchorEnd;
            insertBeforeRaw(parent, child, before);
        };

        anchorFragment.getParent = () => anchorEnd.parentNode;
        anchorFragment.append = anchorFragment.appendChild;
        anchorFragment.appendRaw = anchorFragment.appendChildRaw;

        anchorFragment.insertAtStart = function(child) {
            child = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            anchorFragment.insertAtStartRaw(child);
        };

        anchorFragment.insertAtStartRaw = function(child) {
            const parentNode = anchorStart.parentNode;
            if(parentNode === anchorFragment) {
                parentNode.nativeInsertBefore(child, anchorStart);
                return;
            }
            parentNode.insertBefore(child, anchorStart.nextSibling);
        };

        anchorFragment.removeChildren = function() {
            const parent = anchorEnd.parentNode;
            if(parent === anchorFragment) {
                return;
            }
            if(isParentUniqueChild(parent)) {
                parent.replaceChildren(anchorStart, anchorEnd);
                return;
            }

            let itemToRemove = anchorStart.nextSibling, tempItem;
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                itemToRemove.remove();
                itemToRemove =  tempItem;
            }
        };

        anchorFragment.remove = function() {
            const parent = anchorEnd.parentNode;
            if(parent === anchorFragment) {
                return;
            }
            if(isParentUniqueChild(parent)) {
                anchorFragment.nativeAppend.apply(anchorFragment, parent.childNodes);
                parent.replaceChildren(anchorStart, anchorEnd);
                return;
            }
            let itemToRemove = anchorStart.nextSibling, tempItem;
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                anchorFragment.nativeAppend(itemToRemove);
                itemToRemove = tempItem;
            }
        };

        anchorFragment.removeWithAnchors = function() {
            anchorFragment.removeChildren();
            anchorStart.remove();
            anchorEnd.remove();
        };
        anchorFragment.delete = anchorFragment.removeWithAnchors;

        anchorFragment.replaceContent = function(child) {
            const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            anchorFragment.replaceContentRaw(childElement);
        };

        anchorFragment.replaceContentRaw = function(child) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                return;
            }
            if(isParentUniqueChild(parent)) {
                parent.replaceChildren(anchorStart, child, anchorEnd);
                return;
            }
            anchorFragment.removeChildren();
            parent.insertBefore(child, anchorEnd);
        };

        anchorFragment.setContent = anchorFragment.replaceContent;
        anchorFragment.setContentRaw = anchorFragment.replaceContentRaw;

        anchorFragment.insertBefore = anchorFragment.appendChild;
        anchorFragment.insertBeforeRaw = anchorFragment.appendChildRaw;

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

    class ArgTypesError extends Error {
        constructor(message, errors) {
            super(`${message}\n\n${errors.join('\n')}\n\n`);
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
                validate: (v) => argTypes.some(type => type.validate(v)),
            }),
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
                throw new ArgTypesError('Argument validation failed', errors);
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
        if(props && children) {
            return { props, children };
        }
        if(typeof props !== 'object' || Array.isArray(props) || props === null || props.constructor.name !== 'Object' ||  props.$hydrate) { // IF it's not a JSON
            return { props: children, children: props };
        }
        return { props, children };
    };

    const DocumentObserver = {
        mounted: new WeakMap(),
        beforeUnmount: new WeakMap(),
        mountedSupposedSize: 0,
        unmounted: new WeakMap(),
        unmountedSupposedSize: 0,
        observer: null,
        initObserver: () => {
            if(DocumentObserver.observer) {
                return;
            }
            DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
            DocumentObserver.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        },

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

            DocumentObserver.initObserver();

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
                },
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
                },
            };
        },
    };

    /**
     * Wraps an HTMLElement with NativeDocument's reactivity and lifecycle API.
     * Created automatically by HtmlElementWrapper — not intended to be instantiated directly.
     *
     * @constructor
     * @param {HTMLElement} element - The underlying HTML element to wrap
     */
    function NDElement(element) {
        this.$element = element;
        this.$attachements = null;
        {
            PluginsManager$1.emit('NDElementCreated', element, this);
        }
    }


    NDElement.prototype.__$isNDElement = true;

    NDElement.$getChild = (el) => el;

    /**
     * Appends a child element to an internal DocumentFragment (ghost DOM),
     * keeping it detached from the main document until explicitly mounted.
     *
     * @param {HTMLElement|DocumentFragment|NDElement} element - Element to append
     * @returns {this}
     */
    NDElement.prototype.ghostDom = function(element) {
        if(!this.$attachements) {
            this.$attachements = document.createDocumentFragment();
        }
        this.$attachements.appendChild(NDElement.$getChild(element));
        return this;
    };

    /**
     * Returns the underlying HTMLElement. Used internally for type coercion.
     *
     * @returns {HTMLElement}
     */
    NDElement.prototype.valueOf = function() {
        return this.$element;
    };

    /**
     * Stores the underlying HTMLElement in target[name].
     * Use this to keep a reference to the raw DOM node.
     *
     * @param {Record<string, any>} target - Object to store the reference in
     * @param {string} name - Property name to assign on the target object
     * @returns {this}
     * @example
     * const refs = {};
     * Input({ type: 'text' }).nd.ref(refs, 'emailInput');
     * refs.emailInput.focus();
     */
    NDElement.prototype.ref = function(target, name) {
        target[name] = this.$element;
        return this;
    };

    /**
     * Stores the NDElement instance itself in target[name].
     * Use this to expose a component's public API to a parent (via .with()).
     *
     * @param {Record<string, any>} target - Object to store the reference in
     * @param {string} name - Property name to assign on the target object
     * @returns {this}
     * @example
     * const refs = {};
     * Counter()
     *   .nd.with({ increment() { count.$value++; return this; } })
     *   .refSelf(refs, 'counter');
     *
     * refs.counter.increment();
     */
    NDElement.prototype.refSelf = function(target, name) {
        target[name] = this;
        // TODO: @DIM to check
        // target[name] = new NDElement(this.$element);
        return this;
    };

    /**
     * Calls .nd.remove() on all child NDElements before removing this element.
     * Used to propagate lifecycle cleanup through the component tree.
     *
     * @returns {this}
     */
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

    /**
     * Removes the element from the DOM and cleans up its lifecycle observers.
     * Also calls unmountChildren() recursively.
     *
     * @returns {this}
     */
    NDElement.prototype.remove = function() {
        let element = this.$element;
        element.nd.unmountChildren();
        element.$ndProx = null;

        $lifeCycleObservers.delete(element);

        element = null;
        return this;
    };

    const $lifeCycleObservers = new WeakMap();

    /**
     * Registers mounted and/or unmounted lifecycle callbacks for this element.
     * Uses MutationObserver internally to detect DOM insertion and removal.
     *
     * @param {{ mounted?: (el: HTMLElement) => void, unmounted?: (el: HTMLElement) => boolean|void }} states - Lifecycle hooks
     * @returns {this}
     * @example
     * Div({}).nd.lifecycle({
     *   mounted: (el) => console.log('mounted', el),
     *   unmounted: (el) => console.log('unmounted', el),
     * });
     */
    NDElement.prototype.lifecycle = function(states) {
        const el = this.$element;
        if (!$lifeCycleObservers.has(el)) {
            $lifeCycleObservers.set(el, DocumentObserver.watch(el));
        }
        const observer = $lifeCycleObservers.get(el);

        if(states.mounted) {
            this.$element.setAttribute('data--nd-mounted', '1');
            observer.mounted(states.mounted);
        }
        if(states.unmounted) {
            this.$element.setAttribute('data--nd-unmounted', '1');
            observer.unmounted(states.unmounted);
        }
        return this;
    };

    /**
     * Registers an unmounted callback that cleans up all beforeUnmount handlers
     * and aborts any pending async operations on this element and its children.
     *
     * @returns {this}
     */
    NDElement.prototype.destroyOnUnmount = function() {
        this.unmounted(() => this.destroy());
        return this;
    };

    /**
     * aborts any pending async operations on this element and its children.
     *
     * @returns {this}
     */
    NDElement.prototype.destroy = function() {
        this.$element?.querySelectorAll('[data--nd-before-unmount]').forEach(child => {
            child.remove();
            child.__$controller?.abort();
            child.__$controller = null;
            $lifeCycleObservers.delete(child);
        });

        this.$element.__$controller?.abort();
        this.$element.__$controller = null;
        $lifeCycleObservers.delete(this.$element);
        this.$element = null;
    };

    /**
     * Shorthand for lifecycle({ mounted: callback }).
     *
     * @param {(el: HTMLElement) => void} callback - Called when element is inserted into the DOM
     * @returns {this}
     */
    NDElement.prototype.mounted = function(callback) {
        return this.lifecycle({ mounted: callback });
    };

    /**
     * Shorthand for lifecycle({ unmounted: callback }).
     *
     * @param {(el: HTMLElement) => boolean|void} callback - Called when element is removed from the DOM
     * @returns {this}
     */
    NDElement.prototype.unmounted = function(callback) {
        return this.lifecycle({ unmounted: callback });
    };

    /**
     * Registers an async callback to run before this element is removed from the DOM.
     * The element's .remove() is delayed until all beforeUnmount callbacks resolve.
     *
     * @param {string} id - Unique identifier for this callback (allows overwriting)
     * @param {(this: NDElement, el: HTMLElement) => void|Promise<void>} callback - Async-compatible callback
     * @returns {this}
     * @example
     * Div({}).nd.beforeUnmount('fade-out', async (el) => {
     *   await el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).finished;
     * });
     */
    NDElement.prototype.beforeUnmount = function(id, callback) {
        const el = this.$element;

        if(!DocumentObserver.beforeUnmount.has(el)) {
            DocumentObserver.beforeUnmount.set(el, new Map());
            const originalRemove = el.remove.bind(el);

            let  $isUnmounting = false;
            this.$element.setAttribute('data--nd-before-unmount', '1');

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

    /**
     * Returns the underlying HTMLElement.
     * Alias: .node()
     *
     * @returns {HTMLElement}
     */
    NDElement.prototype.htmlElement = function() {
        return this.$element;
    };

    NDElement.prototype.node = NDElement.prototype.htmlElement;

    /**
     * Attaches a Shadow DOM to this element, redirecting all child appends to the shadow root.
     *
     * @param {'open'|'closed'} mode - Shadow DOM encapsulation mode
     * @param {string|null} [style=null] - Optional CSS string to inject into the shadow root
     * @returns {this}
     */
    NDElement.prototype.shadow = function(mode, style = null) {
        const $element = this.$element;
        const children = Array.from($element.childNodes);
        const shadowRoot = $element.attachShadow({ mode });
        if(style) {
            const styleNode = document.createElement('style');
            styleNode.textContent = style;
            shadowRoot.appendChild(styleNode);
        }
        $element.append = shadowRoot.append.bind(shadowRoot);
        $element.appendChild = shadowRoot.appendChild.bind(shadowRoot);
        shadowRoot.append(...children);

        return this;
    };

    /**
     * Shorthand for .shadow('open', style).
     *
     * @param {string|null} [style=null] - Optional CSS string to inject into the shadow root
     * @returns {this}
     */
    NDElement.prototype.openShadow = function(style = null) {
        return this.shadow('open', style);
    };

    /**
     * Shorthand for .shadow('closed', style).
     *
     * @param {string|null} [style=null] - Optional CSS string to inject into the shadow root
     * @returns {this}
     */
    NDElement.prototype.closedShadow = function(style = null) {
        return this.shadow('closed', style);
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
                DebugManager$2.warn(`⚠️ extends(): "${name}" is not a function, skipping`);
                continue;
            }
            {
                if (this[name] && !this.$localExtensions.has(name)) {
                    DebugManager$2.warn('NDElement.extend', `Method "${name}" already exists and will be overwritten`);
                }
                this.$localExtensions.set(name, method);
            }

            this[name] = method.bind(this);
        }

        return this;
    };

    /**
     * Sets a single attribute on the element.
     * If value is an ObservableItem, the attribute is updated reactively.
     *
     * @param {string} name - Attribute name
     * @param {string|ObservableItem<string>} value - Attribute value, static or reactive
     * @returns {this}
     * @example
     * Input({}).nd.attr('placeholder', label); // reactive placeholder
     */
    NDElement.prototype.attr = function(name, value) {
        if(value?.__$Observable) {
            bindAttributeWithObservable(this.$element, name, value);
            return this;
        }
        this.$element.setAttribute(name, value);
        return this;
    };

    /**
     * Applies a batch of attributes to the element via AttributesWrapper.
     * Supports reactive values, class maps, and style maps.
     *
     * @param {Object} attrs - Attributes object (same format as HtmlElementWrapper props)
     * @returns {this}
     */
    NDElement.prototype.attrs = function(attrs) {
        AttributesWrapper(this.$element, attrs);
        return this;
    };

    /**
     * Applies a reactive class map to the element.
     * Each key is a class name; each value is a boolean or ObservableItem<boolean>.
     *
     * @param {Record<string, boolean|ObservableItem<boolean>>} classes - Class map
     * @returns {this}
     */
    NDElement.prototype.class = function(classes) {
        bindClassAttribute(this.$element, classes);
        return this;
    };

    /**
     * Applies a reactive style map to the element.
     * Each key is a CSS property; each value is a string or ObservableItem<string>.
     *
     * @param {Record<string, string|ObservableItem<string>>} style - Style map
     * @returns {this}
     */
    NDElement.prototype.style = function(style) {
        bindStyleAttribute(this.$element, style);
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
            'lifecycle', 'mounted', 'unmounted', 'unmountChildren',
        ]);

        for (const name in methods) {
            if (!Object.hasOwn(methods, name)) {
                continue;
            }

            const method = methods[name];

            if (typeof method !== 'function') {
                DebugManager$2.warn('NDElement.extend', `"${name}" is not a function, skipping`);
                continue;
            }

            if (protectedMethods.has(name)) {
                DebugManager$2.error('NDElement.extend', `Cannot override protected method "${name}"`);
                throw new NativeDocumentError(`Cannot override protected method "${name}"`);
            }

            if (NDElement.prototype[name]) {
                DebugManager$2.warn('NDElement.extend', `Overwriting existing prototype method "${name}"`);
            }

            NDElement.prototype[name] = method;
        }
        {
            PluginsManager$1.emit('NDElementExtended', methods);
        }

        return NDElement;
    };


    /**
     * The global sanitizer function used by nd.html() when sanitize option is enabled.
     * Must be set via NDElement.setSanitizer() before using {sanitize: true}.
     *
     * @type {Function|null}
     */
    NDElement.$sanitizer = null;

    /**
     * Configures the global sanitizer for nd.html().
     * The sanitizer function receives the HTML string and an optional config object.
     * Designed to be decoupled from any specific sanitizer library.
     *
     * @param {Function} sanitizerFn - Sanitizer function (html, config) => string
     * @returns {typeof NDElement}
     * @throws {NativeDocumentError} If sanitizerFn is not a function
     * @example
     * import DOMPurify from 'dompurify';
     * NDElement.setSanitizer((html, config) => DOMPurify.sanitize(html, config));
     */
    NDElement.setSanitizer = function(sanitizerFn) {
        if(typeof sanitizerFn !== 'function') {
            throw new NativeDocumentError('NDElement.setSanitizer() expects a function');
        }
        NDElement.$sanitizer = sanitizerFn;
        return NDElement;
    };

    /**
     * Sets the inner HTML of the element.
     * Requires either {unsafe: true} to bypass security checks,
     * or {sanitize: true|Object|Function} to sanitize the content.
     * Supports Observable values for reactive HTML updates.
     *
     * @param {string|ObservableItem} content - HTML string or Observable<string>
     * @param {Object} [options={}]
     * @param {boolean} [options.unsafe=false] - Bypass security check. Use only with trusted content.
     * @param {boolean|Object|Function} [options.sanitize=false] - Sanitize strategy:
     *   - true: use global sanitizer with default config
     *   - Object: use global sanitizer with custom config
     *   - Function: use this function directly as sanitizer (html) => string
     * @returns {this}
     * @throws {NativeDocumentError} If sanitize is true/Object but no global sanitizer is configured
     * @example
     * // Unsafe — trusted content only
     * el.nd.html('<strong>Hello</strong>', {unsafe: true})
     *
     * // Global sanitizer with default config
     * el.nd.html($userContent, {sanitize: true})
     *
     * // Global sanitizer with custom config
     * el.nd.html($userContent, {sanitize: {
     *     ALLOWED_TAGS: ['b', 'i', 'strong', 'a'],
     *     ALLOWED_ATTR: ['href'],
     * }})
     *
     * // Custom sanitizer function for this specific case
     * el.nd.html($userContent, {sanitize: (html) => myCustomSanitizer(html)})
     *
     * // Reactive with sanitize
     * el.nd.html($content, {sanitize: true})
     */
    NDElement.prototype.html = function(content, {unsafe = false, sanitize = false} = {}) {
        const $element = this.$element;
        const apply = (value) => {
            if(sanitize) {
                if(typeof sanitize === 'function') {
                    $element.innerHTML = sanitize(value);
                    return;
                }

                if(!NDElement.$sanitizer) {
                    throw new NativeDocumentError('nd.html() — no sanitizer configured. Call NDElement.setSanitizer() first.');
                }
                const config = sanitize === true ? {} : sanitize;
                $element.innerHTML = NDElement.$sanitizer(value, config);
                return;
            }

            if(!unsafe) {
                console.warn('nd.html() — use {unsafe: true} or {sanitize: true|Object|Function}');
                return;
            }

            $element.innerHTML = value;
        };

        if(content?.__$Observable) {
            content.subscribe(apply);
            apply(content.val());
            return this;
        }

        apply(content);
        return this;
    };

    /**
     * Makes the element content editable and binds it to an Observable.
     * Changes in the DOM update the Observable, and changes to the Observable
     * update the DOM (only when the element is not focused to avoid cursor issues).
     *
     * @param {ObservableItem} $obs - Observable to bind to the element content
     * @param {Object} [options={}]
     * @param {string} [options.format='html'] - 'html' uses innerHTML, 'text' uses innerText
     * @returns {this}
     * @example
     * // Basic usage
     * const $content = $('<b>Hello</b>');
     * Div({}).nd.contentEditable($content)
     *
     * // Text only
     * Div({}).nd.contentEditable($content, {format: 'text'})
     */
    NDElement.prototype.contentEditable = function($obs, {format = 'html'} = {}) {
        this.$element.contentEditable = true;

        const getValue = format === 'text'
            ? () => this.$element.innerText
            : () => this.$element.innerHTML;

        const setValue = format === 'text'
            ? (value) => { this.$element.innerText  = value; }
            : (value) => { this.$element.innerHTML = value; };

        if($obs?.__$Observable) {
            $obs.subscribe((value) => {
                if(document.activeElement !== this.$element) {
                    setValue(value);
                }
            });
            setValue($obs.val() || '');
        }

        this.$element.addEventListener('input', () => {
            $obs?.set(getValue());
        }, { signal: this.$getSignal() });

        return this;
    };

    const EVENTS = [
        'Click',
        'DblClick',
        'MouseDown',
        'MouseEnter',
        'MouseLeave',
        'MouseMove',
        'MouseOut',
        'MouseOver',
        'MouseUp',
        'Wheel',
        'KeyDown',
        'KeyPress',
        'KeyUp',
        'Blur',
        'Change',
        'Focus',
        'Input',
        'Invalid',
        'Reset',
        'Search',
        'Select',
        'Submit',
        'Drag',
        'DragEnd',
        'DragEnter',
        'DragLeave',
        'DragOver',
        'DragStart',
        'Drop',
        'AfterPrint',
        'BeforePrint',
        'BeforeUnload',
        'Error',
        'HashChange',
        'Load',
        'Offline',
        'Online',
        'PageHide',
        'PageShow',
        'Resize',
        'Scroll',
        'Unload',
        'Abort',
        'CanPlay',
        'CanPlayThrough',
        'DurationChange',
        'Emptied',
        'Ended',
        'LoadedData',
        'LoadedMetadata',
        'LoadStart',
        'Pause',
        'Play',
        'Playing',
        'Progress',
        'RateChange',
        'Seeked',
        'Seeking',
        'Stalled',
        'Suspend',
        'TimeUpdate',
        'VolumeChange',
        'Waiting',

        'TouchCancel',
        'TouchEnd',
        'TouchMove',
        'TouchStart',
        'AnimationEnd',
        'AnimationIteration',
        'AnimationStart',
        'TransitionEnd',
        'Copy',
        'Cut',
        'Paste',
        'FocusIn',
        'FocusOut',
        'ContextMenu',
    ];

    const EVENTS_WITH_PREVENT = [
        'Click',
        'DblClick',
        'MouseDown',
        'MouseUp',
        'Wheel',
        'KeyDown',
        'KeyPress',
        'Invalid',
        'Reset',
        'Submit',
        'DragOver',
        'Drop',
        'BeforeUnload',
        'TouchCancel',
        'TouchEnd',
        'TouchMove',
        'TouchStart',
        'Copy',
        'Cut',
        'Paste',
        'ContextMenu',
    ];

    const EVENTS_WITH_STOP =  [
        'Click',
        'DblClick',
        'MouseDown',
        'MouseMove',
        'MouseOut',
        'MouseOver',
        'MouseUp',
        'Wheel',
        'KeyDown',
        'KeyPress',
        'KeyUp',
        'Change',
        'Input',
        'Invalid',
        'Reset',
        'Search',
        'Select',
        'Submit',
        'Drag',
        'DragEnd',
        'DragEnter',
        'DragLeave',
        'DragOver',
        'DragStart',
        'Drop',
        'BeforeUnload',
        'HashChange',
        'TouchCancel',
        'TouchEnd',
        'TouchMove',
        'TouchStart',
        'AnimationEnd',
        'AnimationIteration',
        'AnimationStart',
        'TransitionEnd',
        'Copy',
        'Cut',
        'Paste',
        'FocusIn',
        'FocusOut',
        'ContextMenu',
    ];

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
        NDElement.prototype['on'+eventSourceName] = function(callback = null, options = {}) {
            this.$element.addEventListener(eventName, callback, {
                signal: this.$getSignal(),
                ...options,
            });
            return this;
        };
    });

    EVENTS_WITH_STOP.forEach(eventSourceName => {
        const eventName = eventSourceName.toLowerCase();
        NDElement.prototype['onStop'+eventSourceName] = function(callback = null, options = {}) {
            _stop(this.$element, eventName, callback, {
                signal: this.$getSignal(),
                ...options,
            });
            return this;
        };
        NDElement.prototype['onPreventStop'+eventSourceName] = function(callback = null, options = {}) {
            _preventStop(this.$element, eventName, callback, {
                signal: this.$getSignal(),
                ...options,
            });
            return this;
        };
    });

    EVENTS_WITH_PREVENT.forEach(eventSourceName => {
        const eventName = eventSourceName.toLowerCase();
        NDElement.prototype['onPrevent'+eventSourceName] = function(callback = null, options = {}) {
            _prevent(this.$element, eventName, callback, {
                signal: this.$getSignal(),
                ...options,
            });
            return this;
        };
    });

    /**
     * Retrieves or creates an AbortController signal tied to this element's lifecycle.
     * The signal is automatically aborted when the element is removed via .nd.remove().
     * Used internally by all event listeners (onClick, onInput, etc.) to auto-cleanup on unmount.
     *
     * @internal
     * @returns {AbortSignal} The signal for this element's AbortController
     */
    NDElement.prototype.$getSignal = function() {
        if(!this.$element.__$controller) {
            this.$element.__$controller = new AbortController();
        }
        return this.$element.__$controller.signal;
    };


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
            signal: this.$getSignal(),
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
            signal: this.$getSignal(),
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
        element.addEventListener(eventName, handler, options);
        return this;
    };

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

    DocumentFragment.prototype.__IS_FRAGMENT = true;

    /**
     * Wraps a function with argument validation based on an ArgTypes schema.
     * Throws an ArgTypesError if the arguments don't match the schema.
     *
     * @param {...ArgType} args - ArgType descriptors defining expected argument types
     * @returns {Function} Wrapped function that validates its arguments before executing
     * @example
     * function greet(name, age) { ... }
     * const safeGreet = greet.args(ArgTypes.string('name'), ArgTypes.number('age'));
     * safeGreet('John', 25); // OK
     * safeGreet('John', 'old'); // throws ArgTypesError
     */
    Function.prototype.args = function(...args) {
        return exports.withValidation(this, args);
    };


    /**
     * Wraps a function with a try/catch error boundary.
     * If the function throws, the callback is called with the error and context instead.
     *
     * @param {(error: Error, context: { caller: Function, args: any[] }) => *} callback - Error handler
     * @returns {Function} Wrapped function with error boundary
     * @example
     * const safeRender = render.errorBoundary((err, { args }) => {
     *   console.error('Render failed:', err.message);
     *   return Div({}, 'Error');
     * });
     */
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

    function TemplateBinding(hydrate) {
        this.$hydrate = hydrate;
    }

    TemplateBinding.prototype.__$isTemplateBinding = true;

    NDElement.$getChild = ElementCreator.getChild;

    /**
     * Converts a string to a reactive text node.
     *
     * @returns {Text} Static text node containing the string value
     */
    String.prototype.toNdElement = function () {
        return ElementCreator.createStaticTextNode(null, this);
    };

    /**
     * Converts a number to a static text node.
     *
     * @returns {Text} Static text node containing the number as a string
     */
    Number.prototype.toNdElement = function () {
        return ElementCreator.createStaticTextNode(null, this.toString());
    };

    /**
     * Returns the element itself (identity for DOM compatibility).
     *
     * @returns {Element} this
     */
    Element.prototype.toNdElement = function () {
        return this;
    };

    /**
     * Returns the text node itself (identity for DOM compatibility).
     *
     * @returns {Text} this
     */
    Text.prototype.toNdElement = function () {
        return this;
    };

    /**
     * Returns the comment node itself (identity for DOM compatibility).
     *
     * @returns {Comment} this
     */
    Comment.prototype.toNdElement = function () {
        return this;
    };

    /**
     * Returns the document itself (identity for DOM compatibility).
     *
     * @returns {Document} this
     */
    Document.prototype.toNdElement = function () {
        return this;
    };

    /**
     * Returns the document fragment itself (identity for DOM compatibility).
     *
     * @returns {DocumentFragment} this
     */
    DocumentFragment.prototype.toNdElement = function () {
        return this;
    };

    /**
     * Converts the ObservableItem to a reactive text node that updates automatically when the value changes.
     *
     * @returns {Text} Reactive text node bound to this observable
     */
    ObservableItem.prototype.toNdElement = function () {
        return ElementCreator.createObservableNode(null, this);
    };

    ObservableChecker.prototype.toNdElement = ObservableItem.prototype.toNdElement;

    /**
     * Converts the NDElement to its underlying HTMLElement (or ghost DOM fragment if ghostDom was used).
     *
     * @returns {HTMLElement|DocumentFragment} The underlying DOM node
     */
    NDElement.prototype.toNdElement = function () {
        const element = this.$element ?? this.$build?.() ?? this.build?.() ?? null;
        if(this.$attachements) {
            if(!this.$attachements.contains(this.$element)) {
                this.$attachements.append(this.$element);
            }
            return this.$attachements;
        }
        return element;
    };

    /**
     * Converts the array to a DocumentFragment containing all elements.
     * Each item is processed through ElementCreator.getChild().
     *
     * @returns {DocumentFragment} Fragment containing all array children
     */
    Array.prototype.toNdElement = function () {
        const fragment = document.createDocumentFragment();
        for(let i = 0, length = this.length; i < length; i++) {
            const child = ElementCreator.getChild(this[i]);
            if(child === null) continue;
            fragment.appendChild(child);
        }
        return fragment;
    };

    /**
     * Calls the function and converts its return value to a DOM node.
     * Used internally by ElementCreator to process function-based children.
     *
     * @returns {Node} The DOM node returned by the function
     */
    Function.prototype.toNdElement = function () {
        const child = this;
        {
            PluginsManager$1.emit('BeforeProcessComponent', child);
        }
        return ElementCreator.getChild(child());
    };

    /**
     * Converts the TemplateBinding to a hydratable DOM node for use in TemplateCloner.
     *
     * @returns {Node} Hydratable node
     */
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

    /**
     * Registers a beforeUnmount hook that plays an exit CSS transition before the element is removed.
     * Adds the class `{transitionName}-exit`, waits for the transition/animation to end, then removes it.
     *
     * @param {string} transitionName - CSS class prefix for the exit transition
     * @returns {this}
     * @example
     * Div({ class: 'modal' }).nd.transitionOut('fade');
     * // Adds 'fade-exit' before removal, waits for transitionend/animationend
     */
    NDElement.prototype.transitionOut = function(transitionName) {
        const exitClass = transitionName + '-exit';
        const el = this.$element;
        this.beforeUnmount('transition-exit', async function() {
            el.classes.add(exitClass);
            await waitForVisualEnd(el);
            el.classes.remove(exitClass);
        });
        return this;
    };

    /**
     * Plays an enter CSS transition when the element is mounted into the DOM.
     * Adds `{transitionName}-enter-from` immediately, then swaps to `{transitionName}-enter-to`
     * on the next animation frame, and cleans up after the transition ends.
     *
     * @param {string} transitionName - CSS class prefix for the enter transition
     * @returns {this}
     * @example
     * Div({ class: 'modal' }).nd.transitionIn('fade');
     * // On mount: adds 'fade-enter-from', then swaps to 'fade-enter-to'
     */
    NDElement.prototype.transitionIn = function(transitionName) {
        const startClass = transitionName + '-enter-from';
        const endClass = transitionName + '-enter-to';

        const el = this.$element;

        el.classes.add(startClass);

        this.mounted(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classes.remove(startClass);
                    el.classes.add(endClass);

                    waitForVisualEnd(el).then(() => {
                        el.classes.remove(endClass);
                    });
                });
            });
        });
        return this;
    };

    /**
     * Applies both enter and exit transitions to the element.
     * Shorthand for calling .transitionIn(name) and .transitionOut(name).
     *
     * @param {string} transitionName - CSS class prefix for both enter and exit transitions
     * @returns {this}
     * @example
     * Div({}).nd.transition('slide');
     * // On mount: enter transition; on unmount: exit transition
     */
    NDElement.prototype.transition = function (transitionName) {
        this.transitionIn(transitionName);
        this.transitionOut(transitionName);
        return this;
    };

    /**
     * Immediately applies a CSS animation class to the element.
     * Removes the class automatically once the animation ends.
     *
     * @param {string} animationName - CSS animation class name to add
     * @returns {this}
     * @example
     * Button('Click me').nd.animate('shake');
     * // Adds 'shake' class, removes it when animationend fires
     */
    NDElement.prototype.animate = function(animationName) {
        const el = this.$element;
        el.classes.add(animationName);

        waitForVisualEnd(el).then(() => {
            el.classes.remove(animationName);
        });

        return this;
    };

    ObservableItem.prototype.handleNdAttribute = function(element, attributeName) {
        if(BOOLEAN_ATTRIBUTES.has(attributeName)) {
            bindBooleanAttribute(element, attributeName, this);
            return;
        }

        bindAttributeWithObservable(element, attributeName, this);
    };

    ObservableChecker.prototype.handleNdAttribute = ObservableItem.prototype.handleNdAttribute;

    TemplateBinding.prototype.handleNdAttribute = function(element, attributeName) {
        this.$hydrate(element, attributeName);
    };

    /**
     * Creates a reactive or static text node from the given value.
     * If the value has a .toNdElement() method, delegates to it.
     * Otherwise creates an empty text node.
     *
     * @param {string|number|ObservableItem|*} value - Value to convert to a text node
     * @returns {Text} Text node, reactive if value is an ObservableItem
     */
    const createTextNode = (value) => {
        if(value) {
            return value.toNdElement();
        }
        return ElementCreator.createTextNode();
    };


    /**
     * Applies attributes and children to an existing HTMLElement.
     * Used internally by HtmlElementWrapper on each cloned node.
     *
     * @internal
     * @param {HTMLElement} element - Element to configure
     * @param {Object|null} _attributes - Attributes object or children if no attrs provided
     * @param {ValidChild|null} [_children=null] - Children to append
     * @returns {HTMLElement} The configured element
     */
    const createHtmlElement = (element, _attributes, _children = null) => {
        const { props: attributes, children = null } = normalizeComponentArgs(_attributes, _children);

        ElementCreator.processAttributes(element, attributes);
        ElementCreator.processChildren(children, element);
        return element;
    };

    /**
     * Creates a reusable element factory function for the given HTML tag.
     * The factory clones a cached template node on each call for performance.
     * Optionally wraps the created element with a custom wrapper function.
     *
     * @param {string} name - HTML tag name (e.g. 'div', 'button', 'input'). Pass empty string to create a Fragment.
     * @param {((element: HTMLElement) => HTMLElement)|null} [customWrapper=null] - Optional function to augment the element before returning
     * @returns {(attr?: Object, children?: ValidChild) => HTMLElement} Element factory function
     * @example
     * const Div = HtmlElementWrapper('div');
     * Div({ class: 'container' }, 'Hello');
     *
     * // With custom wrapper
     * const Form = HtmlElementWrapper('form', (el) => {
     *   el.submit = (action) => { ... };
     *   return el;
     * });
     */
    function  HtmlElementWrapper(name, customWrapper = null) {
        if(name) {
            if(customWrapper) {
                let node = null;
                let createElement = (attr, children) => {
                    node = document.createElement(name);
                    createElement = (attr, children) => {
                        return createHtmlElement(customWrapper(node.cloneNode()), attr, children);
                    };
                    return createHtmlElement(customWrapper(node.cloneNode()), attr, children);            };

                return (attr, children) => createElement(attr, children);
            }

            let node = null;
            let createElement = (attr, children) => {
                node = document.createElement(name);
                createElement = (attr, children) => {
                    return createHtmlElement(node.cloneNode(), attr, children);
                };
                return createHtmlElement(node.cloneNode(), attr, children);
            };

            return (attr, children) => createElement(attr, children);
        }
        return (children, name = '') => {
            const anchor = Anchor(name);
            anchor.append(children);
            return anchor;
        };
    }

    /**
     * Stores deferred attribute, class, style, and event bindings for a cloneable element.
     * Used internally by TemplateCloner to apply per-instance data to cloned DOM nodes.
     * Not intended for direct use in application code.
     *
     * @internal
     * @constructor
     * @param {HTMLElement} $element - The template element to clone
     */
    function NodeCloner($element) {
        this.$element = $element;
        this.$classes = null;
        this.$styles = null;
        this.$attrs = null;
        this.$ndMethods = null;
    }


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
        if(typeof bindingHydrator === 'function') {
            const element = this.$element;
            element.nodeCloner = element.nodeCloner || new NodeCloner(element);
            element.nodeCloner.attach(methodName, bindingHydrator);
            return element;
        }
        bindingHydrator.$hydrate(this.$element, methodName);
        return this.$element;
    };

    NodeCloner.prototype.__$isNodeCloner = true;

    const buildProperties = (cache, properties, data) => {
        for(const key in properties) {
            cache[key] = properties[key].apply(null, data);
        }
        return cache;
    };

    /**
     * Pre-compiles all registered bindings into a sequence of optimised steps.
     * Called once before the first clone operation. Subsequent calls are no-ops.
     *
     * @internal
     */
    NodeCloner.prototype.resolve = function() {
        if(this.$content) {
            return;
        }
        const steps = [];
        if(this.$ndMethods) {
            const methods = Object.keys(this.$ndMethods);
            if(methods.length === 1) {
                const methodName = methods[0];
                const callback = this.$ndMethods[methodName];
                steps.push((clonedNode, data) => {
                    clonedNode.nd[methodName](callback.bind(clonedNode, ...data));
                });
            } else {
                steps.push((clonedNode, data) => {
                    const nd = clonedNode.nd;
                    for(const methodName in this.$ndMethods) {
                        nd[methodName](this.$ndMethods[methodName].bind(clonedNode, ...data));
                    }
                });
            }
        }
        if(this.$classes) {
            const cache = {};
            const keys = Object.keys(this.$classes);

            if(keys.length === 1) {
                const key = keys[0];
                const callback = this.$classes[key];
                steps.push((clonedNode, data) => {
                    cache[key] = callback.apply(null, data);
                    ElementCreator.processClassAttribute(clonedNode, cache);
                });
            } else {
                steps.push((clonedNode, data) => {
                    ElementCreator.processClassAttribute(clonedNode, buildProperties(cache, this.$classes, data));
                });
            }
        }
        if(this.$styles) {
            const cache = {};
            const keys = Object.keys(this.$styles);

            if(keys.length === 1) {
                const key = keys[0];
                const callback = this.$styles[key];
                steps.push((clonedNode, data) => {
                    cache[key] = callback.apply(null, data);
                    ElementCreator.processStyleAttribute(clonedNode, cache);
                });
            } else {
                steps.push((clonedNode, data) => {
                    ElementCreator.processStyleAttribute(clonedNode, buildProperties(cache, this.$styles, data));
                });
            }
        }
        if(this.$attrs) {
            const cache = {};
            const keys = Object.keys(this.$attrs);

            if(keys.length === 1) {
                const key = keys[0];
                const callback = this.$attrs[key];
                steps.push((clonedNode, data) => {
                    cache[key] = callback.apply(null, data);
                    ElementCreator.processAttributes(clonedNode, cache);
                });
            } else {
                steps.push((clonedNode, data) => {
                    ElementCreator.processAttributes(clonedNode, buildProperties(cache, this.$attrs, data));
                });
            }
        }

        const stepsCount = steps.length;
        const $element = this.$element;

        this.cloneNode = (data) => {
            const clonedNode = $element.cloneNode(false);
            for(let i = 0; i < stepsCount; i++) {
                steps[i](clonedNode, data);
            }
            return clonedNode;
        };
    };

    /**
     * Clones the template element and applies all compiled binding steps with the given data.
     *
     * @internal
     * @param {Array} data - Data array passed to each binding callback
     * @returns {HTMLElement} The cloned and hydrated element
     */
    NodeCloner.prototype.cloneNode = function(data) {
        return this.$element.cloneNode(false);
    };

    /**
     * Registers an NDElement method binding (e.g. onClick, onInput) to be applied on each clone.
     *
     * @internal
     * @param {string} methodName - Name of the NDElement method to call (e.g. 'onClick')
     * @param {Function} callback - Callback function to pass to the method
     * @returns {NodeCloner} this
     */
    NodeCloner.prototype.attach = function(methodName, callback) {
        this.$ndMethods = this.$ndMethods || {};
        this.$ndMethods[methodName] = callback;
        return this;
    };

    /**
     * Registers a reactive text content binding for the element.
     *
     * @internal
     * @param {Function} valueorProperty - Function receiving data and returning the text content
     * @returns {NodeCloner} this
     */
    NodeCloner.prototype.text = function(valueorProperty) {
        this.$content = valueorProperty;
        if(typeof valueorProperty === 'function') {
            this.cloneNode = (data) => createTextNode(valueorProperty.apply(null, data));
            return this;
        }
        this.cloneNode = (data) => createTextNode(data[0][valueorProperty]);
        return this;
    };

    /**
     * Registers an attribute binding to be applied on each clone.
     *
     * @internal
     * @param {string} attrName - Attribute name
     * @param {{property: string, value: *}} value - Function receiving data and returning the attribute value
     * @returns {NodeCloner} this
     */
    NodeCloner.prototype.attr = function(attrName, value) {
        if(attrName === 'class') {
            this.$classes = this.$classes || {};
            this.$classes[value.property] = value.value;
            return this;
        }
        if(attrName === 'style') {
            this.$styles = this.$styles || {};
            this.$styles[value.property] = value.value;
            return this;
        }
        this.$attrs = this.$attrs || {};
        this.$attrs[attrName] = value.value;
        return this;
    };

    /**
     * Applies a binding to a DOM node via its NodeCloner, routing to the correct binding type.
     * Called internally by TemplateCloner's binder methods (text, style, class, attr, event).
     *
     * @internal
     * @param {Function|string} value - Binding callback or property name
     * @param {'value'|'style'|'class'|'attach'|string} targetType - Binding type determining which NodeCloner method to call
     * @param {HTMLElement} element - Target DOM element
     * @param {string} property - Attribute name or method name (used for 'attach' and 'attr' types)
     */
    const $hydrateFn = function(value, targetType, element, property) {
        element.nodeCloner = element.nodeCloner || new NodeCloner(element);
        if(targetType === 'value') {
            element.nodeCloner.text(value);
            return;
        }
        if(targetType === 'attach') {
            element.nodeCloner.attach(property, value);
            return;
        }
        element.nodeCloner.attr(targetType, { property, value });
    };

    /**
     * Creates a high-performance template cloner for repeated rendering of the same structure.
     * On the first call, builds the template by calling $fn with a binder object.
     * On subsequent calls, clones the compiled template and hydrates it with new data.
     * Used internally by ForEachArray and other list renderers.
     *
     * @constructor
     * @param {(binder: TemplateCloner) => HTMLElement} $fn - Function that builds the template using binder methods
     * @example
     * const cloner = new TemplateCloner((t) =>
     *   Div({},
     *     Span(t.text((item) => item.name)),
     *     Button({}, 'Delete').nd.onClick(t.event((item) => () => list.removeItem(item)))
     *   )
     * );
     * cloner.clone([item]); // returns a hydrated clone
     */
    function TemplateCloner($fn) {
        let $node = null;

        const assignClonerToNode = ($node) => {
            const childNodes = $node.childNodes;
            let containDynamicNode = !!$node.nodeCloner;
            const childNodesLength = childNodes.length;
            for(let i = 0; i < childNodesLength; i++) {
                const child = childNodes[i];
                if(child.nodeCloner) {
                    containDynamicNode = true;
                }
                const localContainDynamicNode = assignClonerToNode(child);
                if(localContainDynamicNode) {
                    containDynamicNode = true;
                }
            }

            if(!containDynamicNode) {
                $node.dynamicCloneNode = $node.cloneNode.bind($node, true);
            } else {
                if($node.nodeCloner) {
                    $node.nodeCloner.resolve();
                    $node.dynamicCloneNode = (data) => {
                        const clonedNode = $node.nodeCloner.cloneNode(data);
                        for(let i = 0; i < childNodesLength; i++) {
                            clonedNode.appendChild(childNodes[i].dynamicCloneNode(data));
                        }
                        return clonedNode;
                    };
                } else {
                    $node.dynamicCloneNode = (data) => {
                        const clonedNode = $node.cloneNode();
                        for(let i = 0; i < childNodesLength; i++) {
                            clonedNode.appendChild(childNodes[i].dynamicCloneNode(data));
                        }
                        return clonedNode;
                    };
                }
            }

            return containDynamicNode;
        };


        /**
         * Clones the compiled template and hydrates it with the given data.
         * On the first call, also compiles the template (builds and optimizes binding steps).
         *
         * @param {Array} data - Data array passed to all binding callbacks
         * @returns {HTMLElement} Cloned and hydrated DOM node
         */
        this.clone = (data) => {
            const binder = createTemplateCloner(this);
            $node = $fn(binder);
            if(!$node.nodeCloner) {
                $node.nodeCloner = new NodeCloner($node);
            }
            assignClonerToNode($node);
            this.clone = $node.dynamicCloneNode;
            return $node.dynamicCloneNode(data);
        };


        const createBinding = (hydrateFunction, targetType) => {
            return new TemplateBinding((element, property) => {
                $hydrateFn(hydrateFunction, targetType, element, property);
            });
        };

        /**
         * Creates a style binding — the result of fn(data) is applied as inline styles.
         *
         * @param {((...data: any[]) => Record<string, string>)} fn - Function returning a style object
         * @returns {TemplateBinding}
         */
        this.style = (fn) => {
            return createBinding(fn, 'style');
        };

        /**
         * Creates a class binding — the result of fn(data) is applied as a class map.
         *
         * @param {((...data: any[]) => Record<string, boolean>)} fn - Function returning a class map
         * @returns {TemplateBinding}
         */
        this.class = (fn) => {
            return createBinding(fn, 'class');
        };

        this.property = (propertyName) => {
            return this.value(propertyName);
        };

        /**
         * Creates a text/value binding — the result is set as text content or input value.
         * Alias: .text()
         *
         * @param {string|(((...data: any[]) => string))} callbackOrProperty - Property name (string) or callback returning the value
         * @returns {TemplateBinding}
         */
        this.value = (callbackOrProperty) => {
            return createBinding(callbackOrProperty, 'value');
        };

        /**
         * Alias for .value() — creates a text content binding.
         *
         * @param {string|(((...data: any[]) => string))} callbackOrProperty
         * @returns {TemplateBinding}
         */
        this.text = this.value;

        /**
         * Creates an attribute binding — the result of fn(data) is set as an attribute value.
         *
         * @param {((...data: any[]) => string)} fn - Function returning the attribute value
         * @returns {TemplateBinding}
         */
        this.attr = (fn) => {
            return createBinding(fn, 'attributes');
        };

        /**
         * Creates an event binding — fn(data) returns the event handler to attach.
         *
         * @param {((...data: any[]) => EventListener)} fn - Function returning the event callback
         * @returns {TemplateBinding}
         */
        this.attach = (fn) => {
            return createBinding(fn, 'attach');
        };

        this.callback = this.attach;
    }


    const createTemplateCloner = ($binder) => {
        return new Proxy($binder, {
            get(target, prop) {
                if(prop in target) {
                    return target[prop];
                }
                if (typeof prop === 'symbol') return target[prop];
                return target.value(prop);
            },
        });
    };

    function useCache(fn) {
        let $cache = null;

        let wrapper = (args) => {
            $cache = new TemplateCloner(fn);

            const node = $cache.clone(args);
            wrapper = $cache.clone;
            return node;
        };

        if(fn.length < 2) {
            return (...args) => {
                return wrapper(args);
            };
        }
        return (_, __, ...args) => {
            return wrapper([_, __, ...args]);
        };
    }

    /**
     * Creates a singleton view — a component that is instantiated only once,
     * then reused across multiple renders. Useful for performance-critical components
     * that are frequently shown/hidden or repeated in lists.
     *
     * @constructor
     * @param {(instance: SingletonView) => Node} $viewCreator - Function that builds the view once and returns the root node.
     * Receives the SingletonView instance so it can call .createSection().
     * @example
     * const Card = useSingleton((view) => {
     *   const nameSection = view.createSection('name');
     *   return Div({ class: 'card' }, nameSection);
     * });
     * Card([{ name: 'John' }]); // Renders once, reused on subsequent calls
     */
    function SingletonView($viewCreator) {
        let $cacheNode = null;
        let $components = null;


        /**
         * Renders the singleton view with the given data.
         * On the first call, create the view by calling $viewCreator.
         * On later calls, updates registered sections via their update functions.
         *
         * @param {Array} data - Array where data[0] is an object mapping section names to new content
         * @returns {Node} The cached root node
         */
        this.render = (data) => {
            if(!$cacheNode) {
                $cacheNode = $viewCreator(this);
            }
            if(!$components) return $cacheNode;

            const updates = data[0];
            if(updates && typeof updates === 'object') {
                for(const key in updates) {
                    if($components[key]) {
                        $components[key](updates[key]);
                    }
                }
            }
            return $cacheNode;
        };


        /**
         * Creates a named anchor section inside the singleton view.
         * The section can be updated later by passing new content through .render().
         *
         * @param {string} name - Unique section name used as the update key
         * @param {((content: *) => Node)?} [fn] - Optional transform function applied to new content before inserting
         * @returns {AnchorDocumentFragment} Anchor fragment to place inside the view's DOM
         * @example
         * const nameSection = view.createSection('name');
         * // Later: Card([{ name: 'Jane' }]); // replaces content in nameSection
         */
        this.createSection = (name, fn) => {
            $components = $components || {};
            const anchor = Anchor('Component ' + name);

            $components[name] = function(content) {
                anchor.removeChildren();
                if(!fn) {
                    anchor.append(content);
                    return;
                }
                anchor.appendChild(fn(content));
            };
            return anchor;
        };
    }


    /**
     * Creates a memoized factory that returns a SingletonView instance.
     * The singleton is created on the first call and reused for all subsequent calls.
     *
     * @param {(instance: SingletonView) => Node} fn - View creator function passed to SingletonView
     * @returns {(...args: any[]) => Node} Function that renders the singleton with the given data
     * @example
     * const Card = useSingleton((view) => {
     *   const title = view.createSection('title');
     *   return Div({}, title);
     * });
     * Card([{ title: 'Hello' }]);
     */
    function useSingleton(fn) {
        let $cache = null;

        return function(...args) {
            if(!$cache) {
                $cache = new SingletonView(fn);
            }
            return $cache.render(args);
        };
    }

    const cssPropertyAccumulator = function(initialValue = {}) {
        const data = Validator.isString(initialValue) ? initialValue.split(';').filter(Boolean) : initialValue;

        return {
            add(key, value) {
                if(Array.isArray(data)) {
                    data.push(key+':  '+value);
                    return;
                }
                if(Validator.isObject(key)) {
                    value = key;
                    for(const property in value) {
                        data[property] = value[property];
                    }
                    return;
                }
                data[key] = value;
            },
            value() {
                if(Array.isArray(data)) {
                    return data.join(';').concat(';');
                }
                return { ...data };
            },
        };
    };

    const classPropertyAccumulator = function(initialValue = []) {
        let data = Validator.isString(initialValue) ? initialValue.split(' ').filter(Boolean) : initialValue;

        return {
            add(key, value = true) {
                if(Validator.isJson(key)) {
                    for(const property in key) {
                        if(key[property]) {
                            data[property] = key[property];
                        }
                    }
                    return;
                }
                if(value != null || key.__$Observable) {
                    if(Array.isArray(data)) {
                        data = data.reduce((acc, item) => {
                            acc[item] = true;
                            return acc;
                        }, {});
                    }
                    if(key.__$Observable) {
                        const uniqueId = `obs-${Math.random().toString(36).substr(2, 9)}`;
                        data[uniqueId] = key;
                    }
                    else {
                        data[key] = value;
                    }
                    return;
                }
                if(Array.isArray(data)) {
                    data.push(key);
                    return;
                }
                data[key] = value;
            },
            value() {
                if(Array.isArray(data)) {
                    return data.join(' ');
                }
                return { ...data };
            },
        };
    };

    /**
     * Wraps a function so it executes at most once.
     * Later calls return the cached result without re-executing the function.
     *
     * @template T
     * @param {(...args: any[]) => T} fn - Function to wrap
     * @returns {(...args: any[]) => T} Memoized function
     * @example
     * const init = once(() => expensiveSetup());
     * init(); // runs setup
     * init(); // returns cached result
     */
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

    /**
     * Creates a lazy proxy that calls fn() once on first property access,
     * then returns properties from the cached result for all later accesses.
     *
     * @template T
     * @param {() => T} fn - Factory function to call once
     * @returns {T} Proxy to the lazily created object
     * @example
     * const store = autoOnce(() => createExpensiveStore());
     * store.count; // triggers createExpensiveStore() on first access
     * store.name; // uses a cached result
     */
    const autoOnce = (fn) => {
        let target = null;
        return new Proxy({}, {
            get: (_, key) => {
                if(target) {
                    return target[key];
                }
                target = fn();
                return target[key];
            },
        });
    };

    /**
     * Wraps a function with key-based memoization.
     * The first argument is used as the cache key; later arguments are passed to fn.
     *
     * @template T
     * @param {(...args: any[]) => T} fn - Function to memoize
     * @returns {(key: any, ...args: any[]) => T} Memoized function
     * @example
     * const getUser = memoize((id) => fetchUser(id));
     * getUser('user-1', 1); // fetches
     * getUser('user-1', 1); // returns cached
     */
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

    /**
     * Creates a proxy where each property access memorizes the result of calling fn with the property key.
     * If fn accepts arguments (fn.length > 0), the proxy returns a memoized function instead.
     *
     * @template T
     * @param {((key: string|symbol, ...args?: any[]) => T)} fn - Factory function
     * @returns {Record<string|symbol, T>} Proxy with per-key memoized results
     * @example
     * // fn with no args — result memoized by key
     * const icons = autoMemoize((name) => loadIcon(name));
     * icons.home; // calls loadIcon('home'), caches result
     * icons.home; // returns cached
     *
     * // fn with args — returns a memoized function per key
     * const formatters = autoMemoize((locale, value) => format(value, locale));
     * formatters.fr('hello'); // calls format('hello', 'fr'), caches under 'fr'
     */
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
                    };
                }
                const result = fn(key);
                cache.set(key, result);
                return result;
            },
        });
    };

    const WRITE_METHODS = [
        'use', 'get', 'create', 'createResettable', 'createComposed',
        'createPersistent', 'createPersistentResettable', 'delete', 'reset',
    ];

    const StoreFactory = function() {

        const $stores = new Map();
        const $followersCache = new Map();

        /**
         * Internal helper — retrieves a store entry or throws if not found.
         */
        const $getStoreOrThrow = (method, name) => {
            const item = $stores.get(name);
            if (!item) {
                DebugManager$2.error('Store', `Store.${method}('${name}') : store not found. Did you call Store.create('${name}') first?`);
                throw new NativeDocumentError(
                    `Store.${method}('${name}') : store not found.`,
                );
            }
            return item;
        };

        /**
         * Internal helper — blocks write operations on a read-only observer.
         */
        const $applyReadOnly = (observer, name, context) => {
            const readOnlyError = (method) => () => {
                DebugManager$2.error('Store', `Store.${context}('${name}') is read-only. '${method}()' is not allowed.`);
                throw new NativeDocumentError(
                    `Store.${context}('${name}') is read-only.`,
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
            if(Validator.isJson(value)) {
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
                    DebugManager$2.warn('Store', `Store.create('${name}') : a store with this name already exists. Use Store.get('${name}') to retrieve it.`);
                    throw new NativeDocumentError(
                        `Store.create('${name}') : a store with this name already exists.`,
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
                    DebugManager$2.warn('Store', `Store.createResettable('${name}') : a store with this name already exists.`);
                    throw new NativeDocumentError(
                        `Store.createResettable('${name}') : a store with this name already exists.`,
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
                    DebugManager$2.warn('Store', `Store.createComposed('${name}') : a store with this name already exists.`);
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : a store with this name already exists.`,
                    );
                }
                if (typeof computation !== 'function') {
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : computation must be a function.`,
                    );
                }
                if (!Array.isArray(dependencies) || dependencies.length === 0) {
                    throw new NativeDocumentError(
                        `Store.createComposed('${name}') : dependencies must be a non-empty array of store names.`,
                    );
                }

                // Resolve dependency observers
                const depObservers = dependencies.map(depName => {
                    if(typeof depName !== 'string') {
                        return depName;
                    }
                    const depItem = $stores.get(depName);
                    if (!depItem) {
                        DebugManager$2.error('Store', `Store.createComposed('${name}') : dependency '${depName}' not found. Create it first.`);
                        throw new NativeDocumentError(
                            `Store.createComposed('${name}') : dependency store '${depName}' not found.`,
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
                    DebugManager$2.error('Store', `Store.reset('${name}') : composed stores cannot be reset. Their value is derived from dependencies.`);
                    throw new NativeDocumentError(
                        `Store.reset('${name}') : composed stores cannot be reset.`,
                    );
                }
                if (!item.resettable) {
                    DebugManager$2.error('Store', `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`);
                    throw new NativeDocumentError(
                        `Store.reset('${name}') : this store is not resettable. Use Store.createResettable('${name}', value) instead of Store.create().`,
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
                    DebugManager$2.error('Store', `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`);
                    throw new NativeDocumentError(
                        `Store.use('${name}') : composed stores are read-only. Use Store.follow('${name}') instead.`,
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

                const originalSet = observerFollower.set.bind(observerFollower);
                const onStoreChange = value => originalSet(value);

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
                    DebugManager$2.warn('Store', `Store.get('${name}') : store not found.`);
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
                    DebugManager$2.warn('Store', `Store.delete('${name}') : store not found, nothing to delete.`);
                    return;
                }
                item.subscribers.forEach(follower => follower.destroy());
                item.subscribers.clear();
                item.observer.cleanup();
                $stores.delete(name);
                $followersCache.delete(name);
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
            },

            /**
             * Creates a store that is automatically persisted to localStorage.
             * On creation, the store is initialized with the value from localStorage
             * if it exists, otherwise falls back to the provided default value.
             * Every mutation is automatically saved to localStorage.
             *
             * @param {string} name - Store name
             * @param {*} value - Default value if nothing is found in localStorage
             * @param {string} [localstorage_key] - Custom localStorage key. Defaults to the store name.
             * @returns {ObservableItem}
             *
             * @example
             * const $theme = Store.createPersistent('theme', 'light');
             *
             * $theme.set('dark'); // saved to localStorage automatically
             *
             * // With a custom key
             * const $lang = Store.createPersistent('language', 'en', 'nd:lang');
             */
            createPersistent(name, value, localstorage_key) {
                localstorage_key = localstorage_key || name;
                const observer = this.create(name, $getFromStorage(localstorage_key, value));
                const saver = $saveToStorage(value);

                observer.subscribe((val) => saver(localstorage_key, val));
                return observer;
            },

            /**
             * Creates a resettable store that is automatically persisted to localStorage.
             * On creation, the store is initialized with the value from localStorage
             * if it exists, otherwise falls back to the provided default value.
             * Every mutation is automatically saved to localStorage.
             * Calling reset() restores the initial value AND removes the localStorage entry.
             *
             * @param {string} name - Store name
             * @param {*} value - Default value if nothing is found in localStorage
             * @param {string} [localstorage_key] - Custom localStorage key. Defaults to the store name.
             * @returns {ObservableItem}
             *
             * @example
             * const $filters = Store.createPersistentResettable('filters', { category: null, date: null });
             *
             * $filters.set({ category: 'news', date: '2024-01-01' }); // saved to localStorage
             * $filters.reset(); // restored to { category: null, date: null } + localStorage entry removed
             *
             * // With a custom key
             * const $prefs = Store.createPersistentResettable('preferences', { lang: 'en' }, 'nd:prefs');
             */
            createPersistentResettable(name, value, localstorage_key) {
                localstorage_key = localstorage_key || name;
                const observer = this.createResettable(name, $getFromStorage(localstorage_key, value));
                const saver = $saveToStorage(value);
                observer.subscribe((val) => saver(localstorage_key, val));

                const originalReset = observer.reset.bind(observer);
                observer.reset = () => {
                    LocalStorage.remove(localstorage_key);
                    originalReset();
                };

                return observer;
            },
            /**
             * Returns a read-only proxy of this store.
             * All write operations (use, get, create, createResettable, createComposed,
             * createPersistent, createPersistentResettable, delete, reset) will throw.
             * Property access returns a read-only follower via follow().
             *
             * The recommended pattern is to keep the original store private
             * and export only the protected version as the public contract.
             *
             * @returns {Proxy}
             *
             * @example
             * // store/user.store.js
             *
             * const PrivateUserStore = Store.group('user', (group) => {
             *     group.create('profile', null);
             *     group.create('role', 'viewer');
             *     group.create('token', null);
             * });
             *
             * // Only the read-only version is exported
             * export const UserStore = PrivateUserStore.protected();
             *
             * // --- In any other module ---
             *
             * import { UserStore } from './store/user.store.js';
             *
             * UserStore.profile // ✅ follower read-only
             * UserStore.follow('role') // ✅
             * UserStore.has('token') // ✅
             *
             * UserStore.use('profile') // ❌ throws — read-only store
             * UserStore.get('profile') // ❌ throws — read-only store
             * UserStore.create('x', 1) // ❌ throws — read-only store
             */
            protected() {
                return new Proxy($api, {
                    get(target, prop) {
                        if (typeof prop === 'symbol' || prop.startsWith('$')) {
                            return target[prop];
                        }
                        if (WRITE_METHODS.includes(prop)) {
                            return () => {
                                throw new NativeDocumentError(
                                    `Store.${prop}() is not allowed on a read-only store. Use the original store reference instead.`
                                );
                            };
                        }
                        if (target.has(prop)) {
                            return target.follow(prop);
                        }
                        return target[prop];
                    },
                    set() {
                        throw new NativeDocumentError('This store is read-only.');
                    },
                    deleteProperty() {
                        throw new NativeDocumentError('This store is read-only.');
                    },
                });
            },
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
                DebugManager$2.error('Store', `Forbidden: You cannot overwrite the store key '${String(prop)}'. Use .use('${String(prop)}').set(value) instead.`);
                throw new NativeDocumentError('Store structure is immutable. Use .set() on the observable.');
            },
            deleteProperty(target, prop) {
                throw new NativeDocumentError('Store keys cannot be deleted.');
            },
        });
    };

    const Store = StoreFactory();

    Store.create(
        'locale',
        (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en') || 'en'
    );

    const SELF_RENDER$1 = (item) => item;

    /**
     * Renders a list of items from an observable array or object, automatically updating when data changes.
     * Efficiently manages DOM updates by tracking items with keys.
     *
     * @param {ObservableItem<Array|Object>} data - Observable containing array or object to iterate over
     * @param {((item: *, index: null|ObservableItem) => NdChild)?} callback - Function that renders each item (item, index) => ValidChild
     * @param {(string|Function)?} [key] - Property name or function to generate unique keys for items
     * @param {Object?} [options={}] - Configuration options
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
        callback = callback || SELF_RENDER$1;
        const element = Anchor('ForEach');
        const blockEnd = element.endElement();
        element.startElement();

        const cache = new Map();
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
                const child = ElementCreator.getChild(callback(item, indexObserver));
                if(!child) {
                    throw new NativeDocumentError('ForEach child can\'t be null or undefined!');
                }
                cache.set(keyId, { keyId, isNew: true, child: new WeakRef(child), indexObserver});
            } catch (e) {
                DebugManager$2.error('ForEach', `Error creating element for key ${keyId}` , e);
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
            const fragment = document.createDocumentFragment();
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

    const CREATE_AND_CACHE_ACTIONS = new Set(['clear', 'push', 'unshift', 'replace']);

    const SELF_RENDER = (item) => item;

    /**
     * Renders items from an ObservableArray with optimized array-specific updates.
     * Provides index observables and handles array mutations efficiently.
     *
     * @param {ObservableArray} data - ObservableArray to iterate over
     * @param {((item: *, index: null|ObservableItem) => NdChild)?} callback - Function that renders each item (item, indexObservable) => ValidChild
     * @param {Object?} [configs={}] - Configuration options
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
        callback = callback || SELF_RENDER;
        const element = Anchor('ForEach Array', configs.isParentUniqueChild);
        const blockEnd = element.endElement();

        const cache = new Map();
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

        const removeCacheItem = (item, removeChild = true) => {
            const cacheItem = cache.get(item);
            if(!cacheItem) {
                return;
            }
            if(removeChild) {
                const child = cacheItem.child;
                child?.remove();
                cache.delete(item);
            }
            cacheItem.indexObserver?.cleanup();
        };

        const createAndCache = (item) => {
            const child = ElementCreator.getChild(callback(item, null));
            {
                if(!child) {
                    throw new NativeDocumentError('ForEachArray child can\'t be null or undefined!');
                }
            }
            cache.set(item, { child, indexObserver: null });
            return child;
        };

        let createWithIndexAndCache = (item, indexKey) => {
            const indexObserver = data.transform((items) =>  items.indexOf(item));
            const child = ElementCreator.getChild(callback(item, indexObserver));
            {
                if(!child) {
                    throw new NativeDocumentError('ForEachArray child can\'t be null or undefined!');
                }
            }
            cache.set(item, { child, indexObserver  });
            return child;
        };
        if(!data.__$Observable) {
            createWithIndexAndCache = (item, indexKey) => {
                const child = ElementCreator.getChild(callback(item, indexKey));
                {
                    if(!child) {
                        throw new NativeDocumentError('ForEachArray child can\'t be null or undefined!');
                    }
                }
                cache.set(item, { child, indexObserver: null  });
                return child;
            };
        }

        const getOrCreate = (item, indexKey) => {
            const cacheItem = cache.get(item);
            if(cacheItem) {
                cacheItem.indexObserver?.set(indexKey);
                return cacheItem.child;
            }
            return createAndCache(item);
        };

        let buildItem = createAndCache;
        const selectBuildStrategy = (action = null) => {
            if(CREATE_AND_CACHE_ACTIONS.has(action)) {
                buildItem = isIndexRequired ? createWithIndexAndCache : createAndCache;
                return;
            }
            buildItem = cache.size ? getOrCreate : (isIndexRequired ? createWithIndexAndCache : createAndCache);
        };


        let cleanCache;

        if(!isIndexRequired) {
            cleanCache = cache.clear.bind(cache);
        }
        else if(configs.shouldKeepItemsInCache) {
            cleanCache = () => {};
        } else {
            cleanCache = (items) => {
                for (const [itemAsKey, _] of cache.entries()) {
                    if(items && items.includes(itemAsKey)) {
                        continue;
                    }
                    removeCacheItem(itemAsKey, false);
                }
            };
        }

        const removeByItem = (item, fragment) => {
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

        let set = null;
        if(Array.isArray(data)) {
            set = () => {
                clear(data);
                element.appendChildRaw(Actions.toFragment(data));
            };
        }
        else {
            set = () => {
                const items = data.val();
                clear(items);
                element.appendChildRaw(Actions.toFragment(items));
            };
        }

        const Actions = {
            toFragment: (items) =>{
                const fragment = document.createDocumentFragment();
                for(let i = 0, length = items.length; i < length; i++) {
                    fragment.appendChild(buildItem(items[i], lastNumberOfItems));
                    lastNumberOfItems++;
                }
                return fragment;
            },
            add: (items) => {
                element.appendChildRaw(Actions.toFragment(items));
            },
            replace: (items) => {
                clear(items);
                element.appendChildRaw(Actions.toFragment(items));
            },
            set,
            reOrder: (items) => {
                let child = null;
                const fragment = document.createDocumentFragment();
                for(const item of items) {
                    child = getItemChild(item);
                    if(child) {
                        fragment.appendChild(child);
                    }
                }
                child = null;
                element.appendChildRaw(fragment);
            },
            removeOne: (element, index) => {
                removeCacheItem(element, true);
            },
            clear,
            populate: ([target, iteration, callback]) => {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < iteration; i++) {
                    const data = callback(i);
                    target.push(data);
                    fragment.append(buildItem(data, i));
                    lastNumberOfItems++;
                }
                element.appendChildRaw(fragment);
                fragment.replaceChildren();
            },
            unshift: (values) => {
                element.insertAtStartRaw(Actions.toFragment(values));
            },
            splice: (args, deleted) => {
                const [start, deleteCount, ...values] = args;
                let elementBeforeFirst = null;
                const garbageFragment = document.createDocumentFragment();

                if(deleted.length > 0) {
                    const firstItem = deleted[0];
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
                    const indexBefore =  (start - 1 >= 0) ? start - 1 : start;
                    const itemAtStart = data.at(indexBefore);
                    elementBeforeFirst = getItemChild(itemAtStart) || blockEnd.previousSibling;
                }
                garbageFragment.replaceChildren();

                if(values && values.length && elementBeforeFirst) {
                    element.insertBeforeRaw(Actions.toFragment(values), elementBeforeFirst.nextSibling);
                }

            },
            reverse: (_, reversed) => {
                Actions.reOrder(reversed);
            },
            sort: (_, sorted) => {
                Actions.reOrder(sorted);
            },
            remove: (_, deleted)=> {
                Actions.removeOne(deleted);
            },
            pop: (_, deleted) => {
                Actions.removeOne(deleted);
            },
            shift: (_, deleted) => {
                Actions.removeOne(deleted);
            },
            swap: (args, elements) => {
                const parent = element.getParent();

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
            },
        };
        Actions.merge = Actions.add;
        Actions.push = Actions.add;

        const buildContent = (items, _, operations = {}) => {
            selectBuildStrategy(operations.action);

            if(Actions[operations.action]) {
                Actions[operations.action](operations.args, operations.result);
            }
        };

        if(Array.isArray(data)) {
            buildContent(data, null, { action: 'set' });
            return element;
        }

        if(data.val().length) {
            buildContent(data.val(), null, { action: 'set' });
        }
        data.subscribe(buildContent);
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
        if(!Validator.isObservable(condition)) {
            if(typeof condition === 'boolean') {
                return condition ? ElementCreator.getChild(child) : null;
            }

            return DebugManager$2.warn('ShowIf', 'ShowIf : condition must be an Observable or boolean / '+comment, condition);
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

        condition.subscribe((value) => {
            if(value) {
                element.appendChild(getChildElement());
                return;
            }
            element.remove();
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
                    'help': 'Use observer.when(target) to create an ObservableWhenResult',
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
            ],
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
            throw new NativeDocumentError('Toggle : condition must be an Observable');
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
                $condition.set([...cache.keys()].at(-1) ?? '');
                delete values[key];
            },
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
            throw new NativeDocumentError('Toggle : condition must be an Observable');
        }

        return Match($condition.toBoolean(), {
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
            throw new NativeDocumentError('When : condition must be an Observable');
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
            },
        };
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
    const Form = HtmlElementWrapper('form', (el) => {

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

    function SvgElementWrapper(name) {
        let node = null;

        let createElement = (attr, children) => {
            node = document.createElementNS('http://www.w3.org/2000/svg', name);
            createElement = (attr, children) => {
                return createHtmlElement(node.cloneNode(), attr, children);
            };
            return createHtmlElement(node.cloneNode(), attr, children);
        };

        return (attr, children) => createElement(attr, children);
    }

    const SvgSvg                 = SvgElementWrapper('svg');
    const SvgCircle              = SvgElementWrapper('circle');
    const SvgRect                = SvgElementWrapper('rect');
    const SvgEllipse             = SvgElementWrapper('ellipse');
    const SvgLine                = SvgElementWrapper('line');
    const SvgPolyline            = SvgElementWrapper('polyline');
    const SvgPolygon             = SvgElementWrapper('polygon');
    const SvgPath                = SvgElementWrapper('path');
    const SvgText                = SvgElementWrapper('text');
    const SvgTSpan               = SvgElementWrapper('tspan');
    const SvgTextPath            = SvgElementWrapper('textPath');
    const SvgG                   = SvgElementWrapper('g');
    const SvgDefs                = SvgElementWrapper('defs');
    const SvgUse                 = SvgElementWrapper('use');
    const SvgSymbol              = SvgElementWrapper('symbol');
    const SvgClipPath            = SvgElementWrapper('clipPath');
    const SvgMask                = SvgElementWrapper('mask');
    const SvgMarker              = SvgElementWrapper('marker');
    const SvgPattern             = SvgElementWrapper('pattern');
    const SvgImage               = SvgElementWrapper('image');
    const SvgForeignObject       = SvgElementWrapper('foreignObject');
    const SvgSwitch              = SvgElementWrapper('switch');
    const SvgLinearGradient      = SvgElementWrapper('linearGradient');
    const SvgRadialGradient      = SvgElementWrapper('radialGradient');
    const SvgStop                = SvgElementWrapper('stop');
    const SvgFilter              = SvgElementWrapper('filter');
    const SvgFEBlend             = SvgElementWrapper('feBlend');
    const SvgFEColorMatrix       = SvgElementWrapper('feColorMatrix');
    const SvgFEComposite         = SvgElementWrapper('feComposite');
    const SvgFEFlood             = SvgElementWrapper('feFlood');
    const SvgFEGaussianBlur      = SvgElementWrapper('feGaussianBlur');
    const SvgFEMerge             = SvgElementWrapper('feMerge');
    const SvgFEMergeNode         = SvgElementWrapper('feMergeNode');
    const SvgFEOffset            = SvgElementWrapper('feOffset');
    const SvgFETurbulence        = SvgElementWrapper('feTurbulence');
    const SvgFEDisplacementMap   = SvgElementWrapper('feDisplacementMap');
    const SvgFEDiffuseLighting   = SvgElementWrapper('feDiffuseLighting');
    const SvgFESpecularLighting  = SvgElementWrapper('feSpecularLighting');
    const SvgFEDistantLight      = SvgElementWrapper('feDistantLight');
    const SvgFEPointLight        = SvgElementWrapper('fePointLight');
    const SvgFESpotLight         = SvgElementWrapper('feSpotLight');
    const SvgFEMorphology        = SvgElementWrapper('feMorphology');
    const SvgFEConvolveMatrix    = SvgElementWrapper('feConvolveMatrix');
    const SvgFEComponentTransfer = SvgElementWrapper('feComponentTransfer');
    const SvgFEFuncR             = SvgElementWrapper('feFuncR');
    const SvgFEFuncG             = SvgElementWrapper('feFuncG');
    const SvgFEFuncB             = SvgElementWrapper('feFuncB');
    const SvgFEFuncA             = SvgElementWrapper('feFuncA');
    const SvgAnimate             = SvgElementWrapper('animate');
    const SvgAnimateTransform    = SvgElementWrapper('animateTransform');
    const SvgAnimateMotion       = SvgElementWrapper('animateMotion');
    const SvgMPath               = SvgElementWrapper('mpath');
    const SvgSet                 = SvgElementWrapper('set');
    const SvgDesc                = SvgElementWrapper('desc');
    const SvgTitle               = SvgElementWrapper('title');
    const SvgMetadata            = SvgElementWrapper('metadata');
    const SvgView                = SvgElementWrapper('view');
    const SvgStyle               = SvgElementWrapper('style');
    const SvgScript              = SvgElementWrapper('script');

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
        SvgAnimate: SvgAnimate,
        SvgAnimateMotion: SvgAnimateMotion,
        SvgAnimateTransform: SvgAnimateTransform,
        SvgCircle: SvgCircle,
        SvgClipPath: SvgClipPath,
        SvgDefs: SvgDefs,
        SvgDesc: SvgDesc,
        SvgEllipse: SvgEllipse,
        SvgFEBlend: SvgFEBlend,
        SvgFEColorMatrix: SvgFEColorMatrix,
        SvgFEComponentTransfer: SvgFEComponentTransfer,
        SvgFEComposite: SvgFEComposite,
        SvgFEConvolveMatrix: SvgFEConvolveMatrix,
        SvgFEDiffuseLighting: SvgFEDiffuseLighting,
        SvgFEDisplacementMap: SvgFEDisplacementMap,
        SvgFEDistantLight: SvgFEDistantLight,
        SvgFEFlood: SvgFEFlood,
        SvgFEFuncA: SvgFEFuncA,
        SvgFEFuncB: SvgFEFuncB,
        SvgFEFuncG: SvgFEFuncG,
        SvgFEFuncR: SvgFEFuncR,
        SvgFEGaussianBlur: SvgFEGaussianBlur,
        SvgFEMerge: SvgFEMerge,
        SvgFEMergeNode: SvgFEMergeNode,
        SvgFEMorphology: SvgFEMorphology,
        SvgFEOffset: SvgFEOffset,
        SvgFEPointLight: SvgFEPointLight,
        SvgFESpecularLighting: SvgFESpecularLighting,
        SvgFESpotLight: SvgFESpotLight,
        SvgFETurbulence: SvgFETurbulence,
        SvgFilter: SvgFilter,
        SvgForeignObject: SvgForeignObject,
        SvgG: SvgG,
        SvgImage: SvgImage,
        SvgLine: SvgLine,
        SvgLinearGradient: SvgLinearGradient,
        SvgMPath: SvgMPath,
        SvgMarker: SvgMarker,
        SvgMask: SvgMask,
        SvgMetadata: SvgMetadata,
        SvgPath: SvgPath,
        SvgPattern: SvgPattern,
        SvgPolygon: SvgPolygon,
        SvgPolyline: SvgPolyline,
        SvgRadialGradient: SvgRadialGradient,
        SvgRect: SvgRect,
        SvgScript: SvgScript,
        SvgSet: SvgSet,
        SvgStop: SvgStop,
        SvgStyle: SvgStyle,
        SvgSvg: SvgSvg,
        SvgSwitch: SvgSwitch,
        SvgSymbol: SvgSymbol,
        SvgTSpan: SvgTSpan,
        SvgText: SvgText,
        SvgTextPath: SvgTextPath,
        SvgTitle: SvgTitle,
        SvgUse: SvgUse,
        SvgView: SvgView,
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
        id:       '[0-9]+',
        uuid:     '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
        slug:     '[a-z0-9]+(?:-[a-z0-9]+)*',
        hash:     '[a-f0-9]{32,64}',

        alpha:    '[a-zA-Z]+',
        alphanum: '[a-zA-Z0-9]+',
        string:   '[^/]+',
        any:      '.*',

        int:      '[0-9]+',
        float:    '[0-9]+\\.[0-9]+',
        number:   '[0-9]+(\\.[0-9]+)?',
        positive: '[1-9][0-9]*',

        locale:   '[a-z]{2}(-[A-Z]{2})?',
        lang:     '[a-z]{2}',

        token:    '[A-Za-z0-9_\\-]+',
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
        const $name = $options.name || null;

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
        },
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
                DebugManager$2.error('HistoryRouter', 'Error in pushState', e);
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
                DebugManager$2.error('HistoryRouter', 'Error in replaceState', e);
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
                    DebugManager$2.error('HistoryRouter', 'Error in popstate event', e);
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

        const $lifecycles = new Map();
        let $currentPath = null;

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
            $lastNodeInserted?.remove();
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
            const nodeToInsert = getNodeToInsert(node);

            const cachedLayout = $layoutCache.get(nodeToInsert);
            if(cachedLayout) {
                if(cachedLayout === $currentLayout) {
                    const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
                    removeLastNodeInserted();
                    $lastNodeInserted = nodeToInsert;
                    layoutAnchor.replaceContent(nodeToInsert);
                    return;
                }
                cleanContainer();
                $lastNodeInserted = nodeToInsert;
                $currentLayout = cachedLayout;
                const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
                layoutAnchor.replaceContent(nodeToInsert);
                container.appendChild($currentLayout);
                return;
            }
            cleanContainer();
            $lastNodeInserted = nodeToInsert;
            const anchor = getNodeAnchorForLayout(nodeToInsert, path);

            $currentLayout = ElementCreator.getChild(layout(anchor));
            $layoutCache.set(nodeToInsert, $currentLayout);
            container.appendChild($currentLayout);
        };

        const updateContainer = function(node, route, path) {
            const layout = route.layout();
            if(layout) {
                updateContainerByLayout(layout, node, route, path);
                return;
            }
            const nodeToInsert = getNodeToInsert(node);

            cleanContainer();
            container.appendChild(nodeToInsert);
            $lastNodeInserted = node;
        };

        const handleCurrentRouterState = function(state) {
            if(!state.route) {
                return;
            }

            const { route, params, query, path } = state;

            if($currentPath && $currentPath !== path) {
                $lifecycles.get($currentPath)?.onLeave?.();
            }

            if($cache.has(path)) {
                const cacheNode = $cache.get(path);
                updateContainer(cacheNode, route);

                $lifecycles.get(path)?.onEnter?.(params, query);
                $currentPath = path;

                return;
            }
            const pathLifecycles = {};
            $lifecycles.set(path, pathLifecycles);



            const Component = route.component();
            const node = Component({
                params,
                query,
                onEnter: (cb) => { pathLifecycles.onEnter = cb; },
                onLeave: (cb) => { pathLifecycles.onLeave = cb; },
            });
            $cache.set(path, node);
            updateContainer(node, route, path);

            pathLifecycles.onEnter?.(params, query);
            $currentPath = path;
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
                    DebugManager$2.warn('Route Listener', 'Error in listener:', e);
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
                layout: options?.layout || RouteGroupHelper.layout($groupTree),
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
            if(typeof target === 'string') {
                const route = $routesByName[target];
                if(route) {
                    return {
                        route,
                        params: [],
                        query: [],
                        path: route.url({ name: target }),
                    };
                }
            }
            if(Validator.isJson(target)) {
                const route = $routesByName[target.name];
                if(!route) {
                    throw new RouterError(`Route not found for name: ${target.name}`);
                }
                return {
                    route,
                    params: target.params,
                    query: target.query,
                    path: route.url({ ...target }),
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
            DebugManager$2.error('Router', 'Callback must be a function');
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

    Router.redirectTo = function(pathOrRouteName, params = null, name = null) {
        let target = pathOrRouteName;
        const router = Router.get(name);
        const route = router.resolve({ name: pathOrRouteName, params });
        if(route) {
            target = { name: pathOrRouteName, params};
        }
        return router.push(target);
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
            response: [],
        };

        this.interceptors = {
            response: (callback) => {
                $interceptors.response.push(callback);
            },
            request: (callback) => {
                $interceptors.request.push(callback);
            },
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
                    ...(options.headers || {}),
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
        classPropertyAccumulator: classPropertyAccumulator,
        cssPropertyAccumulator: cssPropertyAccumulator,
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
