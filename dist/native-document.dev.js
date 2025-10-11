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

    ObservableChecker.prototype.subscribe = function(callback) {
        const unSubscribe = this.observable.subscribe((value) => {
            callback && callback(this.checker(value));
        });
        this.unSubscriptions.push(unSubscribe);
        return unSubscribe;
    };

    ObservableChecker.prototype.check = function(callback) {
        return this.observable.check(() => callback(this.val()));
    };

    ObservableChecker.prototype.val = function() {
        return this.checker && this.checker(this.observable.val());
    };

    ObservableChecker.prototype.set = function(value) {
        return this.observable.set(value);
    };

    ObservableChecker.prototype.trigger = function() {
        return this.observable.trigger();
    };

    ObservableChecker.prototype.cleanup = function() {
        return this.observable.cleanup();
    };

    const PluginsManager = (function() {

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

    /**
     *
     * @param {*} value
     * @class ObservableItem
     */
    function ObservableItem(value) {
        this.$previousValue = null;
        this.$currentValue = value;
        this.$isCleanedUp = false;

        this.$listeners = null;
        this.$watchers = null;

        this.$memoryId = null;
        PluginsManager.emit('CreateObservable', this);
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
    const DEFAULT_OPERATIONS = {};
    const noneTrigger = function() {};
    ObservableItem.prototype.triggerFirstListener = function(operations) {
        this.$listeners[0](this.$currentValue, this.$previousValue, operations || {});
    };
    ObservableItem.prototype.triggerListeners = function(operations) {
        const $listeners = this.$listeners;
        const $previousValue = this.$previousValue;
        const $currentValue = this.$currentValue;

        operations = operations || DEFAULT_OPERATIONS;
        for(let i = 0, length = $listeners.length; i < length; i++) {
            $listeners[i]($currentValue, $previousValue, operations);
        }
    };

    const handleWatcherCallback = function(callbacks, value) {
        if(typeof callbacks === "function") {
            callbacks(value);
            return;
        }
        if (callbacks.set) {
            callbacks.set(value);
            return;
        }
        callbacks.forEach(callback => {
            callback.set ? callback.set(value) : callback(value);
        });
    };
    ObservableItem.prototype.triggerWatchers = function() {
        if(!this.$watchers) {
            return;
        }

        const $watchers = this.$watchers;
        const $previousValue = this.$previousValue;
        const $currentValue = this.$currentValue;

        if($watchers.has($currentValue)) {
            const $currentValueCallbacks = $watchers.get($currentValue);
            handleWatcherCallback($currentValueCallbacks, true);
        }
        if($watchers.has($previousValue)) {
            const $previousValueCallbacks = $watchers.get($previousValue);
            handleWatcherCallback($previousValueCallbacks, false);
        }
    };

    ObservableItem.prototype.triggerAll = function(operations) {
        this.triggerListeners(operations);
        this.triggerWatchers();
    };

    ObservableItem.prototype.triggerWatchersAndFirstListener = function(operations) {
        this.triggerListeners(operations);
        this.triggerWatchers();
    };

    ObservableItem.prototype.assocTrigger = function() {
        if(this.$watchers?.size && this.$listeners?.length) {
            this.trigger = (this.$listeners.length === 1) ? this.triggerWatchersAndFirstListener : this.triggerAll;
            return;
        }
        if(this.$listeners?.length) {
            this.trigger = (this.$listeners.length === 1) ? this.triggerFirstListener : this.triggerListeners;
            return;
        }
        if(this.$watchers?.size) {
            this.trigger = this.triggerWatchers;
            return;
        }
        this.trigger = noneTrigger;
    };
    ObservableItem.prototype.trigger = noneTrigger;

    /**
     * @param {*} data
     */
    ObservableItem.prototype.set = function(data) {
        const newValue = (typeof data === 'function') ? data(this.$currentValue) : data;
        if(this.$currentValue === newValue) {
            return;
        }
        this.$previousValue = this.$currentValue;
        this.$currentValue = newValue;
        PluginsManager.emit('ObservableBeforeChange', this);
        this.trigger();
        this.$previousValue = null;
        PluginsManager.emit('ObservableAfterChange', this);
    };

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

    ObservableItem.prototype.cleanup = function() {
        MemoryManager.unregister(this.$memoryId);
        this.disconnectAll();
        this.$isCleanedUp = true;
        delete this.$value;
    };

    /**
     *
     * @param {Function} callback
     * @param {any} target
     * @returns {(function(): void)}
     */
    ObservableItem.prototype.subscribe = function(callback, target = null) {
        this.$listeners = this.$listeners ?? [];
        if (this.$isCleanedUp) {
            DebugManager$1.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
            return () => {};
        }
        if (typeof callback !== 'function') {
            throw new NativeDocumentError('Callback must be a function');
        }

        this.$listeners.push(callback);
        this.assocTrigger();
        PluginsManager.emit('ObservableSubscribe', this, target);
        return () => {
            this.unsubscribe(callback);
            this.assocTrigger();
            PluginsManager.emit('ObservableUnsubscribe', this);
        };
    };

    ObservableItem.prototype.on = function(value, callback) {
        this.$watchers = this.$watchers ?? new Map();

        let watchValueList = this.$watchers.get(value);

        if(!watchValueList) {
            this.$watchers.set(value, callback);
        } else if(!Validator.isArray(watchValueList)) {
            watchValueList = [watchValueList];
            this.$watchers.set(value, watchValueList);
            return;
        } else {
            watchValueList.push(callback);
        }

        this.assocTrigger();
        return () => {
            const index = watchValueList.indexOf(callback);
            watchValueList?.splice(index, 1);
            if(watchValueList.size === 1) {
                this.$watchers.set(value, watchValueList[0]);
            }
            else if(watchValueList.size === 0) {
                this.$watchers?.delete(value);
                watchValueList = null;
            }
            this.assocTrigger();
        };
    };

    /**
     * Unsubscribe from an observable.
     * @param {Function} callback
     */
    ObservableItem.prototype.unsubscribe = function(callback) {
        const index = this.$listeners.indexOf(callback);
        if (index > -1) {
            this.$listeners.splice(index, 1);
        }
        this.assocTrigger();
    };

    /**
     * Create an Observable checker instance
     * @param callback
     * @returns {ObservableChecker}
     */
    ObservableItem.prototype.check = function(callback) {
        return new ObservableChecker(this, callback)
    };
    ObservableItem.prototype.get = ObservableItem.prototype.check;

    ObservableItem.prototype.when = function(value) {
        return {$target: value, $observer: this};
    };

    ObservableItem.prototype.toString = function() {
        if(!this.$memoryId) {
            MemoryManager.register(this);
        }
        return '{{#ObItem::(' +this.$memoryId+ ')}}';
    };
    ObservableItem.prototype.equals = function(other) {
        if(Validator.isObservable(other)) {
            return this.$currentValue === other.$currentValue;
        }
        return this.$currentValue === other;
    };

    ObservableItem.prototype.toggle = function() {
        this.set(!this.$currentValue);
    };

    /**
     *
     * @param {*} item
     * @param {string|null} defaultKey
     * @param {?Function} key
     * @returns {*}
     */
    const getKey = (item, defaultKey, key) => {
        if(Validator.isFunction(key)) return key(item, defaultKey);
        if(Validator.isObservable(item)) {
            const val = item.val();
            return (val && key) ? val[key] : defaultKey;
        }
        if(!Validator.isObject(item)) {
            return item;
        }
        return item[key]?.val?.() ??  item[key] ?? defaultKey;
    };

    const trim = function(str, char) {
        return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
    };

    const DocumentObserver = {
        mounted: new WeakMap(),
        mountedSupposedSize: 0,
        unmounted: new WeakMap(),
        unmountedSupposedSize: 0,
        observer: null,
        checkMutation: function(mutationsList) {
            for(const mutation of mutationsList) {
                if(DocumentObserver.mountedSupposedSize > 0 ) {
                    for(const node of mutation.addedNodes) {
                        const data = DocumentObserver.mounted.get(node);
                        if(!data) {
                            continue;
                        }
                        data.inDom = true;
                        data.mounted && data.mounted(node);
                    }
                }

                if(DocumentObserver.unmountedSupposedSize > 0 ) {
                    for(const node of mutation.removedNodes) {
                        const data = DocumentObserver.unmounted.get(node);
                        if(!data) {
                            continue;
                        }

                        data.inDom = false;
                        if(data.unmounted && data.unmounted(node) === true) {
                            data.disconnect();
                            node.nd?.remove();
                        }
                    }
                }
            }
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {boolean} inDom
         * @returns {{watch: (function(): Map<any, any>), disconnect: (function(): boolean), mounted: (function(*): Set<any>), unmounted: (function(*): Set<any>)}}
         */
        watch: function(element, inDom = false) {
            let data = {
                inDom,
                mounted: null,
                unmounted: null,
                disconnect: () => {
                    DocumentObserver.mounted.delete(element);
                    DocumentObserver.unmounted.delete(element);
                    DocumentObserver.mountedSupposedSize--;
                    DocumentObserver.unmountedSupposedSize--;
                    data = null;
                }
            };

            return {
                disconnect: data.disconnect,
                mounted: (callback) => {
                    data.mounted = callback;
                    DocumentObserver.mounted.set(element, data);
                    DocumentObserver.mountedSupposedSize++;
                },
                unmounted: (callback) => {
                    data.unmounted = callback;
                    DocumentObserver.unmounted.set(element, data);
                    DocumentObserver.unmountedSupposedSize++;
                }
            };
        }
    };

    DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
    DocumentObserver.observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

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

    function NDElement(element) {
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
    };

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
    };
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
    };

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

    const COMMON_NODE_TYPES = {
        ELEMENT: 1,
        TEXT: 3,
        COMMENT: 8,
        DOCUMENT_FRAGMENT: 11
    };

    const Validator = {
        isObservable(value) {
            return  value?.__$isObservable || value instanceof ObservableItem || value instanceof ObservableChecker;
        },
        isProxy(value) {
            return value?.__isProxy__
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
            return typeof value === 'object';
        },
        isJson(value) {
            return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor.name === 'Object';
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

    var validator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: Validator
    });

    function Anchor(name, isUniqueChild = false) {
        const element = document.createDocumentFragment();
        element.__Anchor__ = true;

        const anchorStart = document.createComment('Anchor Start : '+name);
        const anchorEnd = document.createComment('/ Anchor End '+name);

        element.appendChild(anchorStart);
        element.appendChild(anchorEnd);

        element.nativeInsertBefore = element.insertBefore;
        element.nativeAppendChild = element.appendChild;

        const isParentUniqueChild = (parent) => (isUniqueChild || (parent.firstChild === anchorStart && parent.lastChild === anchorEnd));

        const insertBefore = function(parent, child, target) {
            const childElement = Validator.isElement(child) ? child : ElementCreator.getChild(child);
            if(parent === element) {
                parent.nativeInsertBefore(childElement, target);
                return;
            }
            if(isParentUniqueChild(parent) && target === anchorEnd) {
                parent.append(childElement,  target);
                return;
            }
            parent.insertBefore(childElement, target);
        };

        element.appendElement = function(child, before = null) {
            const parentNode = anchorStart.parentNode;
            const targetBefore = before || anchorEnd;
            if(parentNode === element) {
                parentNode.nativeInsertBefore(child, targetBefore);
                return;
            }
            parentNode?.insertBefore(child, targetBefore);
        };

        element.appendChild = function(child, before = null) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                DebugManager$1.error('Anchor', 'Anchor : parent not found', child);
                return;
            }
            before = before ?? anchorEnd;
            insertBefore(parent, child, before);
        };
        element.append = function(...args ) {
            return element.appendChild(args);
        };

        element.removeChildren = function() {
            const parent = anchorEnd.parentNode;
            if(parent === element) {
                return;
            }
            if(isParentUniqueChild(parent)) {
                parent.replaceChildren(anchorStart, anchorEnd);
                return;
            }

            let itemToRemove = anchorStart.nextSibling, tempItem;
            const fragment = document.createDocumentFragment();
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                fragment.append(itemToRemove);
                itemToRemove =  tempItem;
            }
            fragment.replaceChildren();
        };
        element.remove = function() {
            const parent = anchorEnd.parentNode;
            if(parent === element) {
                return;
            }
            let itemToRemove = anchorStart.nextSibling, tempItem;
            while(itemToRemove && itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                element.nativeAppendChild(itemToRemove);
                itemToRemove = tempItem;
            }
        };

        element.removeWithAnchors = function() {
            element.removeChildren();
            anchorStart.remove();
            anchorEnd.remove();
        };

        element.replaceContent = function(child) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                return;
            }
            if(isParentUniqueChild(parent)) {
                parent.replaceChildren(anchorStart, child, anchorEnd);
                return;
            }
            element.removeChildren();
            parent.insertBefore(child, anchorEnd);
        };

        element.insertBefore = function(child, anchor = null) {
            element.appendChild(child, anchor);
        };


        element.endElement = function() {
            return anchorEnd;
        };

        element.startElement = function() {
            return anchorStart;
        };
        element.restore = function() {
            element.appendChild(element);
        };
        element.clear = element.remove;
        element.detach = element.remove;

        element.getByIndex = function(index) {
            let currentNode = anchorStart;
            for(let i = 0; i <= index; i++) {
                if(!currentNode.nextSibling) {
                    return null;
                }
                currentNode = currentNode.nextSibling;
            }
            return currentNode !== anchorStart ? currentNode : null;
        };

        return element;
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

    const BOOLEAN_ATTRIBUTES = ['checked', 'selected', 'disabled', 'readonly', 'required', 'autofocus', 'multiple', 'autocomplete', 'hidden', 'contenteditable', 'spellcheck', 'translate', 'draggable', 'async', 'defer', 'autoplay', 'controls', 'loop', 'muted', 'download', 'reversed', 'open', 'default', 'formnovalidate', 'novalidate', 'scoped', 'itemscope', 'allowfullscreen', 'allowpaymentrequest', 'playsinline'];

    /**
     *
     * @param {*} value
     * @returns {ObservableItem}
     * @constructor
     */
    function Observable(value) {
        return new ObservableItem(value);
    }

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

    function toggleElementClass(element, className, shouldAdd) {
        element.classes.toggle(className, shouldAdd);
    }
    function toggleElementStyle(element, styleName, newValue) {
        element.style[styleName] = newValue;
    }
    function updateInputFromObserver(element, attributeName, newValue) {
        if(Validator.isBoolean(newValue)) {
            element[attributeName] = newValue;
            return;
        }
        element[attributeName] = newValue === element.value;
    }
    function updateObserverFromInput(element, attributeName, defaultValue, value) {
        if(Validator.isBoolean(defaultValue)) {
            value.set(element[attributeName]);
            return;
        }
        value.set(element.value);
    }
    /**
     *
     * @param {HTMLElement} element
     * @param {Object} data
     */
    function bindClassAttribute(element, data) {
        for(let className in data) {
            const value = data[className];
            if(Validator.isObservable(value)) {
                element.classes.toggle(className, value.val());
                value.subscribe(toggleElementClass.bind(null, element, className));
                continue;
            }
            if(value.$observer) {
                element.classes.toggle(className, value.$observer.val() === value.$target);
                value.$observer.on(value.$target, toggleElementClass.bind(null, element, className));
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
        for(let styleName in data) {
            const value = data[styleName];
            if(Validator.isObservable(value)) {
                element.style[styleName] = value.val();
                value.subscribe(toggleElementStyle.bind(null, element, styleName));
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
        const defaultValue = Validator.isObservable(value) ? value.val() : value;
        if(Validator.isBoolean(defaultValue)) {
            element[attributeName] = defaultValue;
        }
        else {
            element[attributeName] = defaultValue === element.value;
        }
        if(Validator.isObservable(value)) {
            if(['checked'].includes(attributeName)) {
                element.addEventListener('input', updateObserverFromInput.bind(null, element, attributeName, defaultValue));
            }
            value.subscribe(updateInputFromObserver.bind(null, element, attributeName));
        }
    }


    /**
     *
     * @param {HTMLElement} element
     * @param {string} attributeName
     * @param {Observable} value
     */
    function bindAttributeWithObservable(element, attributeName, value) {
        const applyValue = (newValue) => {
            if(attributeName === 'value') {
                element.value = newValue;
                return;
            }
            element.setAttribute(attributeName, newValue);
        };
        applyValue(value.val());
        value.subscribe(applyValue);

        if(attributeName === 'value') {
            element.addEventListener('input', () => value.set(element.value));
        }
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} attributes
     */
    function AttributesWrapper(element, attributes) {

        Validator.validateAttributes(attributes);

        if(!Validator.isObject(attributes)) {
            throw new NativeDocumentError('Attributes must be an object');
        }

        for(let key in attributes) {
            const attributeName = key.toLowerCase();
            let value = attributes[attributeName];
            if(value === null || value === undefined) {
                continue;
            }
            if(Validator.isString(value)) {
                value = value.resolveObservableTemplate ? value.resolveObservableTemplate() : value;
                if(Validator.isString(value)) {
                    element.setAttribute(attributeName, value);
                    continue;
                }
                const observables = value.filter(item => Validator.isObservable(item));
                value = Observable.computed(() => {
                    return value.map(item => Validator.isObservable(item) ? item.val() : item).join(' ') || ' ';
                }, observables);
            }
            if(attributeName === 'class' && Validator.isObject(value)) {
                bindClassAttribute(element, value);
                continue;
            }
            if(attributeName === 'style' && Validator.isObject(value)) {
                bindStyleAttribute(element, value);
                continue;
            }
            if(BOOLEAN_ATTRIBUTES.includes(attributeName)) {
                bindBooleanAttribute(element, attributeName, value);
                continue;
            }
            if(Validator.isObservable(value)) {
                bindAttributeWithObservable(element, attributeName, value);
                continue;
            }
            if(value.$hydrate) {
                value.$hydrate(element, attributeName);
                continue;
            }
            element.setAttribute(attributeName, value);

        }
        return element;
    }

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
                if($nodeCache.has(name)) {
                    return $nodeCache.get(name).cloneNode();
                }
                const node = document.createElement(name);
                $nodeCache.set(name, node);
                return node.cloneNode();
            }
            return new Anchor('Fragment');
        },
        /**
         *
         * @param {*} children
         * @param {HTMLElement|DocumentFragment} parent
         */
        processChildren(children, parent) {
            if(children === null) return;
            PluginsManager.emit('BeforeProcessChildren', parent);
            if(!Array.isArray(children)) {
                let child = this.getChild(children);
                if(child) {
                    parent.appendChild(child);
                }
            }
            else {
                for(let i = 0, length = children.length; i < length; i++) {
                    let child = this.getChild(children[i]);
                    if (child === null) continue;
                    parent.appendChild(child);
                }
            }

            PluginsManager.emit('AfterProcessChildren', parent);
        },
        getChild(child) {
            if(child === null) {
                return null;
            }
            if(Validator.isString(child)) {
                child = child.resolveObservableTemplate ? child.resolveObservableTemplate() : child;
                if(Validator.isString(child)) {
                    return ElementCreator.createStaticTextNode(null, child);
                }
            }
            if (Validator.isElement(child)) {
                return child;
            }
            if (Validator.isObservable(child)) {
                return ElementCreator.createObservableNode(null, child);
            }
            if(Validator.isNDElement(child)) {
                return child.$element ?? child.$build?.() ?? null;
            }
            if(Validator.isArray(child)) {
                const fragment = document.createDocumentFragment();
                for(let i = 0, length = child.length; i < length; i++) {
                    fragment.appendChild(this.getChild(child[i]));
                }
                return fragment;
            }
            if(Validator.isFunction(child)) {
                PluginsManager.emit('BeforeProcessComponent', child);
                return this.getChild(child());
            }
            if(child?.$hydrate) {
                return ElementCreator.createHydratableNode(null, child);
            }
            return ElementCreator.createStaticTextNode(null, child);
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {Object} attributes
         */
        processAttributes(element, attributes) {
            if(Validator.isFragment(element)) return;
            if (attributes) {
                AttributesWrapper(element, attributes);
            }
        },
        /**
         *
         * @param {HTMLElement} element
         * @param {Object} attributes
         * @param {?Function} customWrapper
         * @returns {HTMLElement|DocumentFragment}
         */
        setup(element, attributes, customWrapper) {
            PluginsManager.emit('Setup', element, attributes, customWrapper);
            return element;
        }
    };

    Object.defineProperty(HTMLElement.prototype, 'nd', {
        configurable: true,
        get() {
            return new NDElement(this);
        }
    });

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
        if(!Validator.isJson(props) || props?.$hydrate) {
            const temp = children;
            children = props;
            props = temp;
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

        if(attributes) {
            ElementCreator.processAttributes(finalElement, attributes);
        }
        if(children) {
            ElementCreator.processChildren(children, finalElement);
        }

        return ElementCreator.setup(finalElement, attributes, customWrapper);
    }

    /**
     *
     * @param {string} name
     * @param {?Function} customWrapper
     * @returns {Function}
     */
    function HtmlElementWrapper(name, customWrapper) {
        return createHtmlElement.bind(null, name.toLowerCase(), customWrapper);
    }

    const cloneBindingsDataCache = new WeakMap();


    const bindAttributes = (node, bindDingData, data) => {
        let attributes = null;
        if(bindDingData.attributes) {
            attributes = attributes || {};
            for (const attr in bindDingData.attributes) {
                attributes[attr] = bindDingData.attributes[attr](...data);
            }
        }

        if(bindDingData.classes) {
            attributes = attributes || {};
            attributes.class = {};
            for (const className in bindDingData.classes) {
                attributes.class[className] = bindDingData.classes[className](...data);
            }
        }

        if(bindDingData.styles) {
            attributes = attributes || {};
            attributes.style = {};
            for (const property in bindDingData.styles) {
                attributes.style[property] = bindDingData.styles[property](...data);
            }
        }

        if(attributes) {
            ElementCreator.processAttributes(node, attributes);
            return true;
        }

        return null;
    };

    const $hydrateFn = function(hydrateFunction, target, element, property) {
        if(!cloneBindingsDataCache.has(element)) {
            // { classes, styles, attributes, value, attach }
            cloneBindingsDataCache.set(element, {});
        }
        const hydrationState = cloneBindingsDataCache.get(element);
        if(target === 'value') {
            hydrationState.value = hydrateFunction;
            return;
        }
        if(target === 'attach') {
            hydrationState.attach = hydrateFunction;
            return;
        }
        hydrationState[target] = hydrationState[target] || {};
        hydrationState[target][property] = hydrateFunction;
    };

    const bindAttachMethods = function(node, bindDingData, data) {
        if(!bindDingData.attach) {
            return null;
        }
        bindDingData.attach(node, ...data);
    };

    function TemplateCloner($fn) {
        let $node = null;
        let $hasBindingData = false;

        const clone = (node, data) => {
            const bindDingData = cloneBindingsDataCache.get(node);
            if(node.nodeType === 3) {
                if(bindDingData && bindDingData.value) {
                    return bindDingData.value(data);
                }
                return node.cloneNode(true);
            }
            const nodeCloned = node.cloneNode(node.fullCloneNode);
            if(bindDingData) {
                bindAttributes(nodeCloned, bindDingData, data);
                bindAttachMethods(nodeCloned, bindDingData, data);
            }
            if(node.fullCloneNode) {
                return nodeCloned;
            }
            const childNodes = node.childNodes;
            for(let i = 0, length = childNodes.length; i < length; i++) {
                const childNode = childNodes[i];
                const childNodeCloned = clone(childNode, data);
                nodeCloned.appendChild(childNodeCloned);
            }
            return nodeCloned;
        };

        this.clone = (data) => {
            if(!$node) {
                $node = $fn(this);
                if(!$hasBindingData) {
                    const nodeCloned = $node.cloneNode(true);
                    nodeCloned.fullCloneNode = true;
                    return nodeCloned;
                }
            }
            if(!$hasBindingData) {
                return $node.cloneNode(true);
            }
            return clone($node, data);
        };


        const createBinding = (hydrateFunction, target) => {
            return {
                $hydrate : (element, property) => {
                    $hasBindingData = true;
                    $hydrateFn(hydrateFunction, target, element, property);
                },
            }
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
                return createBinding(function(data) {
                    const firstArgument = data[0];
                    return createTextNode(firstArgument[callbackOrProperty]);
                }, 'value');
            }
            return createBinding(function(data) {
                return createTextNode(callbackOrProperty(...data));
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
            const anchor = new Anchor('Component '+name);

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

    Function.prototype.args = function(...args) {
        return exports.withValidation(this, args);
    };

    Function.prototype.cached = function(...args) {
        let $cache = null;
        let  getCache = function(){ return $cache; };
        return () => {
            if(!$cache) {
                $cache = this.apply(this, args);
                if($cache.cloneNode) {
                    getCache = function() { return $cache.cloneNode(true); };
                } else if($cache.$element) {
                    getCache = function() { return new NDElement($cache.$element.cloneNode(true)); };
                }
            }
            return getCache();
        };
    };

    Function.prototype.errorBoundary = function(callback) {
        return (...args)  => {
            try {
                return this.apply(this, args);
            } catch(e) {
                return callback(e);
            }
        };
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

    const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

    /**
     *
     * @param {Array} target
     * @returns {ObservableItem}
     */
    Observable.array = function(target) {
        if(!Array.isArray(target)) {
            throw new NativeDocumentError('Observable.array : target must be an array');
        }
        const observer = Observable(target);

        PluginsManager.emit('CreateObservableArray', observer);

        methods.forEach((method) => {
            observer[method] = function(...values) {
                const result = observer.val()[method](...values);
                observer.trigger({ action: method, args: values, result });
                return result;
            };
        });

        observer.clear = function() {
            observer.val().length = 0;
            observer.trigger({ action: 'clear' });
            return true;
        };

        observer.merge = function(values) {
            observer.$value.push(...values);
            observer.trigger({ action: 'merge',  args: values });
        };

        observer.populateAndRender = function(iteration, callback) {
            observer.trigger({ action: 'populate', args: [observer.val(), iteration, callback] });
        };

        observer.removeItem = function(item) {
            const indexOfItem = observer.val().indexOf(item);
            return observer.remove(indexOfItem);
        };

        observer.remove = function(index) {
            const deleted = observer.val().splice(index, 1);
            if(deleted.length === 0) {
                return [];
            }
            observer.trigger({ action: 'remove', args: [index], result: deleted[0] });
            return deleted;
        };

        observer.swap = function(indexA, indexB) {
            const value = observer.val();
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
            observer.trigger({ action: 'swap', args: [indexA, indexB], result: [elementA, elementB] });
            return true;
        };

        observer.length = function() {
            return observer.val().length;
        };

        /**
         *
         * @param {Function} condition
         * @returns {number}
         */
        observer.count = (condition) => {
            let count = 0;
            observer.val().forEach((item, index) => {
                if(condition(item, index)) {
                    count++;
                }
            });
            return count;
        };
        observer.isEmpty = function() {
            return observer.val().length === 0;
        };

        const overrideMethods = ['map', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'concat', 'includes', 'indexOf'];
        overrideMethods.forEach((method) => {
            observer[method] = (...args) => {
                return observer.val()[method](...args);
            };
        });

        return observer;
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
     *
     * @param {Object} initialValue
     * @returns {Proxy}
     */
    Observable.init = function(initialValue) {
        const data = {};
        for(const key in initialValue) {
            const itemValue = initialValue[key];
            if(Array.isArray(itemValue)) {
                data[key] = Observable.array(itemValue);
                continue;
            }
            data[key] = Observable(itemValue);
        }

        const $val = function() {
            const result = {};
            for(const key in data) {
                const dataItem = data[key];
                if(Validator.isObservable(dataItem)) {
                    result[key] = dataItem.val();
                } else if(Validator.isProxy(dataItem)) {
                    result[key] = dataItem.$value;
                } else {
                    result[key] = dataItem;
                }
            }
            return result;
        };
        const $clone = function() {
            return Observable.init($val());
        };
        const $updateWith = function(values) {
            Observable.update(proxy, values);
        };

        const proxy = new Proxy(data, {
            get(target, property) {
                if(property === '__isProxy__') {
                    return true;
                }
                if(property === '$value') {
                    return $val();
                }
                if(property === '$clone') {
                    return $clone;
                }
                if(property === '$observables') {
                    return Object.values(target);
                }
                if(property === '$updateWith') {
                    return $updateWith;
                }
                if(target[property] !== undefined) {
                    return target[property];
                }
                return undefined;
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


    Observable.update = function($target, data) {
        if(Validator.isProxy(data)) {
            data = data.$value;
        }
        for(const key in data) {
            const targetItem = $target[key];
            const newValue = data[key];

            if(Validator.isObservable(targetItem)) {
                if(Validator.isArray(newValue)) {
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
     *
     * @param {Function} callback
     * @param {Array|Function} dependencies
     * @returns {ObservableItem}
     */
    Observable.computed = function(callback, dependencies = []) {
        const initialValue = callback();
        const observable = new ObservableItem(initialValue);
        const updatedValue = () => observable.set(callback());

        PluginsManager.emit('CreateObservableComputed', observable, dependencies);

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

    const Store = (function() {

        const $stores = new Map();

        return {
            /**
             * Create a new state follower and return it.
             * @param {string} name
             * @returns {ObservableItem}
             */
            use(name) {
                const {observer: originalObserver, subscribers } = $stores.get(name);
                const observerFollower = Observable(originalObserver.val());
                const unSubscriber = originalObserver.subscribe(value => observerFollower.set(value));
                const updaterUnsubscriber = observerFollower.subscribe(value => originalObserver.set(value));
                observerFollower.destroy = () => {
                    unSubscriber();
                    updaterUnsubscriber();
                    observerFollower.cleanup();
                };
                subscribers.add(observerFollower);

                return observerFollower;
            },
            /**
             * @param {string} name
             * @returns {ObservableItem}
             */
            follow(name) {
                return this.use(name);
            },
            /**
             * Create a new state and return the observer.
             * @param {string} name
             * @param {*} value
             * @returns {ObservableItem}
             */
            create(name, value) {
                const observer = Observable(value);
                $stores.set(name, { observer, subscribers: new Set()});
                return observer;
            },
            /**
             * Get the observer for a state.
             * @param {string} name
             * @returns {null|ObservableItem}
             */
            get(name) {
                const item = $stores.get(name);
                return item ? item.observer : null;
            },
            /**
             *
             * @param {string} name
             * @returns {{observer: ObservableItem, subscribers: Set}}
             */
            getWithSubscribers(name) {
                return $stores.get(name);
            },
            /**
             * Delete a state.
             * @param {string} name
             */
            delete(name) {
                const item = $stores.get(name);
                if(!item) return;
                item.observer.cleanup();
                item.subscribers.forEach(follower => follower.destroy());
                item.observer.clear();
            }
        };
    }());

    /**
     *
     * @param {Array|Object|ObservableItem} data
     * @param {Function} callback
     * @param {?Function|?string} key
     * @param {{shouldKeepItemsInCache: boolean}?} configs
     * @returns {DocumentFragment}
     */
    function ForEach(data, callback, key, { shouldKeepItemsInCache = false } = {}) {
        const element = new Anchor('ForEach');
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
                    parent.removeChild(child);
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
                if(!child || Validator.isFragment(child)) {
                    throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
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

    function ForEachArray(data, callback, key, configs = {}) {
        const element = new Anchor('ForEach Array');
        const blockEnd = element.endElement();
        const blockStart = element.startElement();

        let cache = new Map();
        let lastNumberOfItems = 0;
        const isIndexRequired = callback.length >= 2;

        const keysCache = new WeakMap();

        const clear = () => {
            element.removeChildren();
            cleanCache();
            lastNumberOfItems = 0;
        };
        const getItemKey = (item, indexKey) => {
            if(keysCache.has(item)) {
                return keysCache.get(item);
            }
            return getKey(item, indexKey, key);
        };
        const getItemChild = (item) => {
            return getChildByKey(getItemKey(item));
        };

        const updateIndexObservers = (items, startFrom = 0) => {
            if(!isIndexRequired) {
                return;
            }
            let index = startFrom;
            for(let i = startFrom, length = items?.length; i < length; i++) {
                const cacheItem = cache.get(getItemKey(items[i], i));
                if(!cacheItem) {
                    continue;
                }
                cacheItem.indexObserver?.deref()?.set(index);
                index++;
            }
        };

        const removeCacheItem = (cacheItem, removeChild = true) => {
            if(!cacheItem) {
                return;
            }
            if(removeChild) {
                const child = cacheItem.child;
                child?.remove();
                cache.delete(cacheItem.keyId);
            }
            cacheItem.indexObserver?.deref()?.cleanup();
        };

        const removeCacheItemByKey = (keyId, removeChild = true) => {
            removeCacheItem(cache.get(keyId), removeChild);
        };

        const cleanCache = () => {
            if(configs.shouldKeepItemsInCache) {
                return;
            }
            if(!isIndexRequired) {
                cache.clear();
                return;
            }
            for (const [keyId, cacheItem] of cache.entries()) {
                removeCacheItem(cacheItem, false);
            }
            cache.clear();
        };

        const buildItem = (item, indexKey) => {
            const keyId = getItemKey(item, indexKey);

            if(cache.has(keyId)) {
                const cacheItem = cache.get(keyId);
                cacheItem.indexObserver?.deref()?.set(indexKey);
                const child = cacheItem.child;
                if(child) {
                    return child;
                }
                cache.delete(keyId);
            }

            const indexObserver = isIndexRequired ? Observable(indexKey) : null;
            let child = ElementCreator.getChild(callback(item, indexObserver));
            if(!child || Validator.isFragment(child)) {
                throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
            }
            cache.set(keyId, {
                keyId,
                child: child,
                indexObserver: (indexObserver ? new WeakRef(indexObserver) : null)
            });
            keysCache.set(item, keyId);
            return child;
        };
        const getChildByKey = function(keyId) {
            const cacheItem = cache.get(keyId);
            if(!cacheItem) {
                return null;
            }
            const child = cacheItem.child;
            if(!child) {
                removeCacheItem(cacheItem, false);
                return null;
            }
            return child;
        };

        const removeByKey = function(keyId, fragment) {
            const cacheItem = cache.get(keyId);
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
                const fragment = Actions.toFragment(items);
                setTimeout(() => {
                    element.appendElement(fragment);
                }, delay);
            },
            replace(items) {
                clear();
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
                removeCacheItemByKey(getItemKey(element, index), true);
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
                    let firstKey = getItemKey(deleted[0], start);
                    if(deleted.length === 1) {
                        removeByKey(firstKey, garbageFragment);
                    } else if(deleted.length > 1) {
                        const firstChildRemoved = getChildByKey(firstKey);
                        elementBeforeFirst = firstChildRemoved?.previousSibling;

                        for(let i = 0; i < deleted.length; i++) {
                            const keyId = getItemKey(deleted[i], start + i);
                            removeByKey(keyId, garbageFragment);
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
            if(operations.action === 'clear' || !items.length) {
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
     * Show the element if the condition is true
     *
     * @param {ObservableItem|ObservableChecker} condition
     * @param {*} child
     * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
     * @returns {DocumentFragment}
     */
    const ShowIf = function(condition, child, { comment = null, shouldKeepInCache = true} = {}) {
        if(!(Validator.isObservable(condition))) {
            return DebugManager$1.warn('ShowIf', "ShowIf : condition must be an Observable / "+comment, condition);
        }
        const element = new Anchor('Show if : '+(comment || ''));

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
     * Hide the element if the condition is true
     * @param {ObservableItem|ObservableChecker} condition
     * @param child
     * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
     * @returns {DocumentFragment}
     */
    const HideIf = function(condition, child, configs) {
        const hideCondition = Observable(!condition.val());
        condition.subscribe(value => hideCondition.set(!value));

        return ShowIf(hideCondition, child, configs);
    };

    /**
     * Hide the element if the condition is false
     *
     * @param {ObservableItem|ObservableChecker} condition
     * @param {*} child
     * @param {{comment?: string|null, shouldKeepInCache?: Boolean}} configs
     * @returns {DocumentFragment}
     */
    const HideIfNot = function(condition, child, configs) {
        return ShowIf(condition, child, configs);
    };

    /**
     *
     * @param {ObservableItem|ObservableChecker} $condition
     * @param {{[key]: *}} values
     * @param {Boolean} shouldKeepInCache
     * @returns {DocumentFragment}
     */
    const Match = function($condition, values, shouldKeepInCache = true) {

        if(!Validator.isObservable($condition)) {
            throw new NativeDocumentError("Toggle : condition must be an Observable");
        }

        const anchor = new Anchor('Match');
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

        return anchor;
    };


    /**
     *
     * @param {ObservableItem|ObservableChecker} $condition
     * @param {*} onTrue
     * @param {*} onFalse
     * @returns {DocumentFragment}
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
     *
     * @param {ObservableItem|ObservableChecker} $condition
     * @returns {{show: Function, otherwise: (((*) => {}):DocumentFragment)}
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
            }
        }
    };

    const Div = HtmlElementWrapper('div');
    const Span = HtmlElementWrapper('span');
    const Label = HtmlElementWrapper('label');
    const P = HtmlElementWrapper('p');
    const Paragraph = P;
    const Strong = HtmlElementWrapper('strong');
    const H1 = HtmlElementWrapper('h1');
    const H2 = HtmlElementWrapper('h2');
    const H3 = HtmlElementWrapper('h3');
    const H4 = HtmlElementWrapper('h4');
    const H5 = HtmlElementWrapper('h5');
    const H6 = HtmlElementWrapper('h6');

    const Br = HtmlElementWrapper('br');

    const Link$1 = HtmlElementWrapper('a');
    const Pre = HtmlElementWrapper('pre');
    const Code = HtmlElementWrapper('code');
    const Blockquote = HtmlElementWrapper('blockquote');
    const Hr = HtmlElementWrapper('hr');
    const Em = HtmlElementWrapper('em');
    const Small = HtmlElementWrapper('small');
    const Mark = HtmlElementWrapper('mark');
    const Del = HtmlElementWrapper('del');
    const Ins = HtmlElementWrapper('ins');
    const Sub = HtmlElementWrapper('sub');
    const Sup = HtmlElementWrapper('sup');
    const Abbr = HtmlElementWrapper('abbr');
    const Cite = HtmlElementWrapper('cite');
    const Quote = HtmlElementWrapper('q');

    const Dl = HtmlElementWrapper('dl');
    const Dt = HtmlElementWrapper('dt');
    const Dd = HtmlElementWrapper('dd');

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

    const Input = HtmlElementWrapper('input');

    const TextArea = HtmlElementWrapper('textarea');
    const TextInput = TextArea;

    const Select = HtmlElementWrapper('select');
    const FieldSet = HtmlElementWrapper('fieldset', );
    const Option = HtmlElementWrapper('option');
    const Legend = HtmlElementWrapper('legend');
    const Datalist = HtmlElementWrapper('datalist');
    const Output = HtmlElementWrapper('output');
    const Progress = HtmlElementWrapper('progress');
    const Meter = HtmlElementWrapper('meter');

    const ReadonlyInput = (attributes) => Input({ readonly: true, ...attributes });
    const HiddenInput = (attributes) => Input({type: 'hidden', ...attributes });
    const FileInput = (attributes) => Input({ type: 'file', ...attributes });
    const PasswordInput = (attributes) => Input({ type: 'password', ...attributes });
    const Checkbox = (attributes) => Input({ type: 'checkbox', ...attributes });
    const Radio = (attributes) => Input({ type: 'radio', ...attributes });

    const RangeInput = (attributes) => Input({ type: 'range', ...attributes });
    const ColorInput = (attributes) => Input({ type: 'color', ...attributes });
    const DateInput = (attributes) => Input({ type: 'date', ...attributes });
    const TimeInput = (attributes) => Input({ type: 'time', ...attributes });
    const DateTimeInput = (attributes) => Input({ type: 'datetime-local', ...attributes });
    const WeekInput = (attributes) => Input({ type: 'week', ...attributes });
    const MonthInput = (attributes) => Input({ type: 'month', ...attributes });
    const SearchInput = (attributes) => Input({ type: 'search', ...attributes });
    const TelInput = (attributes) => Input({ type: 'tel', ...attributes });
    const UrlInput = (attributes) => Input({ type: 'url', ...attributes });
    const EmailInput = (attributes) => Input({ type: 'email', ...attributes });
    const NumberInput = (attributes) => Input({ type: 'number', ...attributes });


    const Button = HtmlElementWrapper('button');
    const SimpleButton = (child, attributes) => Button(child, { type: 'button', ...attributes });
    const SubmitButton = (child, attributes) => Button(child, { type: 'submit', ...attributes });

    const Main = HtmlElementWrapper('main');
    const Section = HtmlElementWrapper('section');
    const Article = HtmlElementWrapper('article');
    const Aside = HtmlElementWrapper('aside');
    const Nav = HtmlElementWrapper('nav');
    const Figure = HtmlElementWrapper('figure');
    const FigCaption = HtmlElementWrapper('figcaption');

    const Header = HtmlElementWrapper('header');
    const Footer = HtmlElementWrapper('footer');

    const BaseImage = HtmlElementWrapper('img');
    const Img = function(src, attributes) {
        return BaseImage({ src, ...attributes });
    };

    /**
     *
     * @param {string} src
     * @param {string|null} defaultImage
     * @param {Object} attributes
     * @param {?Function} callback
     * @returns {Image}
     */
    const AsyncImg = function(src, defaultImage, attributes, callback) {
        const image = Img(defaultImage || src, attributes);
        const img = new Image();
        img.onload = () => {
            Validator.isFunction(callback) && callback(null, image);
            image.src = src;
        };
        img.onerror = () => {
            Validator.isFunction(callback) && callback(new NativeDocumentError('Image not found'));
        };
        if(Validator.isObservable(src)) {
            src.subscribe(newSrc => {
                img.src = newSrc;
            });
        }
        img.src = src;
        return image;
    };

    /**
     *
     * @param {string} src
     * @param {Object} attributes
     * @returns {Image}
     */
    const LazyImg = function(src, attributes) {
        return Img(src, { ...attributes, loading: 'lazy' });
    };

    const Details = HtmlElementWrapper('details');
    const Summary = HtmlElementWrapper('summary');
    const Dialog = HtmlElementWrapper('dialog');
    const Menu = HtmlElementWrapper('menu');

    const OrderedList = HtmlElementWrapper('ol');
    const UnorderedList = HtmlElementWrapper('ul');
    const ListItem = HtmlElementWrapper('li');

    const Li = ListItem;
    const Ol = OrderedList;
    const Ul = UnorderedList;

    const Audio = HtmlElementWrapper('audio');
    const Video = HtmlElementWrapper('video');
    const Source = HtmlElementWrapper('source');
    const Track = HtmlElementWrapper('track');
    const Canvas = HtmlElementWrapper('canvas');
    const Svg = HtmlElementWrapper('svg');

    const Time = HtmlElementWrapper('time');
    const Data = HtmlElementWrapper('data');
    const Address = HtmlElementWrapper('address');
    const Kbd = HtmlElementWrapper('kbd');
    const Samp = HtmlElementWrapper('samp');
    const Var = HtmlElementWrapper('var');
    const Wbr = HtmlElementWrapper('wbr');

    const Caption = HtmlElementWrapper('caption');
    const Table = HtmlElementWrapper('table');
    const THead = HtmlElementWrapper('thead');
    const TFoot = HtmlElementWrapper('tfoot');
    const TBody = HtmlElementWrapper('tbody');
    const Tr = HtmlElementWrapper('tr');
    const TRow = Tr;
    const Th = HtmlElementWrapper('th');
    const THeadCell = Th;
    const TFootCell = Th;
    const Td = HtmlElementWrapper('td');
    const TBodyCell = Td;

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
     *
     * @param {string} $path
     * @param {Function} $component
     * @param {{name:?string, middlewares:Function[], shouldRebuild:Boolean, with: Object }}$options
     * @class
     */
    function Route($path, $component, $options = {}) {

        $path = '/'+trim($path, '/');

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
            return $groupTree[$groupTree.length-1]?.options?.layout || null;
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

        const updateContainer = function(node, route) {
            container.innerHTML = '';
            const layout = route.layout();
            if(layout) {
                container.appendChild(layout(node));
                return;
            }
            container.appendChild(node);
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
            updateContainer(node, route);
        };

        router.subscribe(handleCurrentRouterState);

        handleCurrentRouterState(router.currentState());
        return container;
    }

    const DEFAULT_ROUTER_NAME = 'default';

    /**
     *
     * @param {{mode: 'memory'|'history'|'hash'}} $options
     * @constructor
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
         *
         * @param {string} suffix
         * @param {{ middlewares: Function[], name: string}} options
         * @param {Function} callback
         * @returns {this}
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
     *
     * @param {{mode: 'memory'|'history'|'hash', name?:string, entry?: string}} options
     * @param {Function} callback
     * @param {Element} container
     */
    Router.create = function(options, callback) {
        if(!Validator.isFunction(callback)) {
            DebugManager$1.error('Router', 'Callback must be a function', e);
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
        const target = to || href;
        if(Validator.isString(target)) {
            const router = Router.get();
            return Link$1({ ...attributes, href: target}, children).nd.onPreventClick(() => {
                router.push(target);
            });
        }
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

    exports.ElementCreator = ElementCreator;
    exports.HtmlElementWrapper = HtmlElementWrapper;
    exports.NDElement = NDElement;
    exports.Observable = Observable;
    exports.PluginsManager = PluginsManager;
    exports.SingletonView = SingletonView;
    exports.Store = Store;
    exports.TemplateCloner = TemplateCloner;
    exports.Validator = validator;
    exports.classPropertyAccumulator = classPropertyAccumulator;
    exports.createTextNode = createTextNode;
    exports.cssPropertyAccumulator = cssPropertyAccumulator;
    exports.elements = elements;
    exports.normalizeComponentArgs = normalizeComponentArgs;
    exports.router = router;
    exports.useCache = useCache;
    exports.useSingleton = useSingleton;

    return exports;

})({});
//# sourceMappingURL=native-document.dev.js.map
