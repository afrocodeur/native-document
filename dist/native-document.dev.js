var NativeDocument = (function (exports) {
    'use strict';

    function eventWrapper(element, name, callback) {
        element.addEventListener(name, callback);
        return element;
    }

    /**
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    function HtmlElementEventsWrapper(element) {

        if(!element.nd) {
            element.nd = {};
        }

        /**
         * @param {Object<string,Function>} events
         */
        element.nd.on = function(events) {
            for(const event in events) {
                const callback = events[event];
                eventWrapper(element, event, callback);
            }
            return element;
        };
        element.nd.on.prevent = function(events) {
            for(const event in events) {
                const callback = events[event];
                eventWrapper(element, event, (event) => {
                    event.preventDefault();
                    callback && callback(event);
                    return element;
                });
            }
            return element;
        };
        const events = {
            click: (callback) => eventWrapper(element, 'click', callback),
            focus: (callback) => eventWrapper(element, 'focus', callback),
            blur: (callback) => eventWrapper(element, 'blur', callback),
            input: (callback) => eventWrapper(element, 'input', callback),
            change: (callback) => eventWrapper(element, 'change', callback),
            keyup: (callback) => eventWrapper(element, 'keyup', callback),
            keydown: (callback) => eventWrapper(element, 'keydown', callback),
            beforeInput: (callback) => eventWrapper(element, 'beforeinput', callback),
            mouseOver: (callback) => eventWrapper(element, 'mouseover', callback),
            mouseOut: (callback) => eventWrapper(element, 'mouseout', callback),
            mouseDown: (callback) => eventWrapper(element, 'mousedown', callback),
            mouseUp: (callback) => eventWrapper(element, 'mouseup', callback),
            mouseMove: (callback) => eventWrapper(element, 'mousemove', callback),
            hover: (mouseInCallback, mouseOutCallback) => {
                element.addEventListener('mouseover', mouseInCallback);
                element.addEventListener('mouseout', mouseOutCallback);
            },
            dropped: (callback) => eventWrapper(element, 'drop', callback),
            submit: (callback) => eventWrapper(element, 'submit', callback),
            dragEnd: (callback) => eventWrapper(element, 'dragend', callback),
            dragStart: (callback) => eventWrapper(element, 'dragstart', callback),
            drop: (callback) => eventWrapper(element, 'drop', callback),
            dragOver: (callback) => eventWrapper(element, 'dragover', callback),
            dragEnter: (callback) => eventWrapper(element, 'dragenter', callback),
            dragLeave: (callback) => eventWrapper(element, 'dragleave', callback),
        };
        for(let event in events) {
            element.nd.on[event] = events[event];
            element.nd.on.prevent[event] = function(callback) {
                eventWrapper(element, event.toLowerCase(), (event) => {
                    event.preventDefault();
                    callback && callback(event);
                });
                return element;
            };
        }

        return element;
    }

    const DebugManager = {
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

    const MemoryManager = (function() {

        let $nexObserverId = 0;
        const $observables = new Map();
        let $registry = null;
        try {
            $registry = new FinalizationRegistry((heldValue) => {
                DebugManager.log('MemoryManager', '🧹 Auto-cleanup observable:', heldValue);
                heldValue.listeners.splice(0);
            });
        } catch (e) {
            DebugManager.warn('MemoryManager', 'FinalizationRegistry not supported, observables will not be cleaned automatically');
        }

        return {
            /**
             * Register an observable and return an id.
             *
             * @param {ObservableItem} observable
             * @param {Function[]} listeners
             * @returns {number}
             */
            register(observable, listeners) {
                const id = ++$nexObserverId;
                const heldValue = {
                    id: id,
                    listeners
                };
                if($registry) {
                    $registry.register(observable, heldValue);
                }
                $observables.set(id, new WeakRef(observable));
                return id;
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
                    DebugManager.log('Memory Auto Clean', `🧹 Cleaned ${cleanedCount} orphaned observables`);
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

        this.subscribe = function(callback) {
            return $observable.subscribe((value) => {
                callback && callback($checker(value));
            });
        };

        this.val = function() {
            return $checker && $checker($observable.val());
        };
        this.check = function(callback) {
            return $observable.check(() => callback(this.val()));
        };

        this.set = function(value) {
            return $observable.set(value);
        };
        this.trigger = function() {
            return $observable.trigger();
        };

        this.cleanup = function() {
            return $observable.cleanup();
        };
    }

    /**
     *
     * @param {*} value
     * @class ObservableItem
     */
    function ObservableItem(value) {
        if (value === undefined) {
            throw new NativeDocumentError('ObservableItem requires an initial value');
        }
        if(value instanceof ObservableItem) {
            throw new NativeDocumentError('ObservableItem cannot be an Observable');
        }

        const $initialValue = (typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value;

        let $previousValue = value;
        let $currentValue = value;
        let $isCleanedUp = false;

        const $listeners = [];

        const $memoryId = MemoryManager.register(this, $listeners);

        this.trigger = () => {
            $listeners.forEach(listener => {
                try {
                    listener($currentValue, $previousValue);
                } catch (error) {
                    DebugManager.error('Listener Undefined', 'Error in observable listener:', error);
                    this.unsubscribe(listener);
                }
            });

        };

        this.originalValue = () => $initialValue;

        /**
         * @param {*} data
         */
        this.set = (data) => {
            const newValue = (typeof data === 'function') ? data($currentValue) : data;
            if($currentValue === newValue) {
                return;
            }
            $previousValue = $currentValue;
            $currentValue = newValue;
            this.trigger();
        };

        this.val = () => $currentValue;

        this.cleanup = function() {
            $listeners.splice(0);
            $isCleanedUp = true;
        };

        /**
         *
         * @param {Function} callback
         * @returns {(function(): void)}
         */
        this.subscribe = (callback) => {
            if ($isCleanedUp) {
                DebugManager.warn('Observable subscription', '⚠️ Attempted to subscribe to a cleaned up observable.');
                return () => {};
            }
            if (typeof callback !== 'function') {
                throw new NativeDocumentError('Callback must be a function');
            }

            $listeners.push(callback);
            return () => this.unsubscribe(callback);
        };

        /**
         * Unsubscribe from an observable.
         * @param {Function} callback
         */
        this.unsubscribe = (callback) => {
            const index = $listeners.indexOf(callback);
            if (index > -1) {
                $listeners.splice(index, 1);
            }
        };

        /**
         * Create an Observable checker instance
         * @param callback
         * @returns {ObservableChecker}
         */
        this.check = function(callback) {
            return new ObservableChecker(this, callback)
        };

        const $object = this;
        Object.defineProperty($object, '$value', {
            get() {
                return $object.val();
            },
            set(value) {
                $object.set(value);
                return $object;
            }
        });

        this.toString = function() {
            return   '{{#ObItem::(' +$memoryId+ ')}}';
        };

    }

    const Validator = {
        isObservable(value) {
            return value instanceof ObservableItem || value instanceof ObservableChecker;
        },
        isProxy(value) {
            return value?.__isProxy__
        },
        isObservableChecker(value) {
            return value instanceof ObservableChecker;
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
            return typeof value === 'object' && value !== null && value.constructor.name === 'Object' && !Array.isArray(value);
        },
        isElement(value) {
            return value instanceof HTMLElement || value instanceof DocumentFragment  || value instanceof Text;
        },
        isFragment(value) {
            return value instanceof DocumentFragment;
        },
        isStringOrObservable(value) {
            return this.isString(value) || this.isObservable(value);
        },

        isValidChild(child) {
            return child === null ||
                this.isElement(child) ||
                this.isObservable(child) ||
                ['string', 'number', 'boolean'].includes(typeof child);
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
        validateAttributes(attributes) {
            if (!attributes || typeof attributes !== 'object') {
                return attributes;
            }

            const reserved = [];
            const foundReserved = Object.keys(attributes).filter(key => reserved.includes(key));

            if (foundReserved.length > 0) {
                DebugManager.warn('Validator', `Reserved attributes found: ${foundReserved.join(', ')}`);
            }

            return attributes;
        },

        validateEventCallback(callback) {
            if (typeof callback !== 'function') {
                throw new NativeDocumentError('Event callback must be a function');
            }
        }
    };

    const BOOLEAN_ATTRIBUTES = ['checked', 'selected', 'disabled', 'readonly', 'required', 'autofocus', 'multiple', 'autocomplete', 'hidden', 'contenteditable', 'spellcheck', 'translate', 'draggable', 'async', 'defer', 'autoplay', 'controls', 'loop', 'muted', 'download', 'reversed', 'open', 'default', 'formnovalidate', 'novalidate', 'scoped', 'itemscope', 'allowfullscreen', 'allowpaymentrequest', 'playsinline'];

    /**
     *
     * @param {Function} fn
     * @param {number} delay
     * @param {{leading?:Boolean, trailing?:Boolean, debounce?:Boolean}}options
     * @returns {(function(...[*]): void)|*}
     */
    const throttle = function(fn, delay, options = {}) {
        let timer = null;
        let lastExecTime = 0;
        const { leading = true, trailing = true, debounce = false } = options;

        return  function(...args) {
            const now = Date.now();
            if (debounce) {
                // debounce mode: reset the timer for each call
                clearTimeout(timer);
                timer = setTimeout(() => fn.apply(this, args), delay);
                return;
            }
            if (leading && now - lastExecTime >= delay) {
                fn.apply(this, args);
                lastExecTime = now;
            }
            if (trailing && !timer) {
                timer = setTimeout(() => {
                    fn.apply(this, args);
                    lastExecTime = Date.now();
                    timer = null;
                }, delay - (now - lastExecTime));
            }
        }
    };

    const trim = function(str, char) {
        return str.replace(new RegExp(`^[${char}]+|[${char}]+$`, 'g'), '');
    };

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
     * @param {Function} callback
     * @param {Array|Function} dependencies
     * @returns {ObservableItem}
     */
    Observable.computed = function(callback, dependencies = []) {
        const initialValue = callback();
        const observable = new ObservableItem(initialValue);
        const updatedValue = () => observable.set(callback());

        if(Validator.isFunction(dependencies)) {
            if(!Validator.isObservable(dependencies.$observer)) {
                throw new NativeDocumentError('Observable.computed : dependencies must be valid batch function');
            }
            dependencies.$observer.subscribe(updatedValue);
            return observable;
        }

        dependencies.forEach(dependency => dependency.subscribe(updatedValue));

        return observable;
    };

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
     * Get the value of an observable or an object of observables.
     * @param {ObservableItem|Object<ObservableItem>} object
     * @returns {{}|*|null}
     */
    Observable.value = function(data) {
        if(Validator.isObservable(data)) {
            return data.val();
        }
        if(Validator.isProxy(data)) {
            return data.$val();
        }
        if(Validator.isArray(data)) {
            const result = [];
            data.forEach(item => {
                result.push(Observable.value(item));
            });
            return result;
        }
        return data;
    };

    /**
     *
     * @param {Object} value
     * @returns {Proxy}
     */
    Observable.init = function(value) {
        const data = {};
        for(const key in value) {
            const itemValue = value[key];
            if(Validator.isJson(itemValue)) {
                data[key] = Observable.init(itemValue);
                continue;
            }
            else if(Validator.isArray(itemValue)) {
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
                    result[key] = dataItem.$val();
                } else {
                    result[key] = dataItem;
                }
            }
            return result;
        };
        const $clone = function() {

        };

        return new Proxy(data, {
            get(target, property) {
                if(property === '__isProxy__') {
                    return true;
                }
                if(property === '$val') {
                    return $val;
                }
                if(property === '$clone') {
                    return $clone;
                }
                if(target[property] !== undefined) {
                    return target[property];
                }
                return undefined;
            },
            set(target, prop, newValue) {
                if(target[prop] !== undefined) {
                    target[prop].set(newValue);
                }
            }
        })
    };

    Observable.object = Observable.init;
    Observable.json = Observable.init;
    Observable.update = function($target, data) {
        for(const key in data) {
            const targetItem = $target[key];
            const newValue = data[key];

            if(Validator.isObservable(targetItem)) {
                if(Validator.isArray(newValue)) {
                    Observable.update(targetItem, newValue);
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

        const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

        methods.forEach((method) => {
            observer[method] = function(...values) {
                const target = observer.val();
                const result = target[method].apply(target, arguments);
                observer.trigger();
                return result;
            };
        });

        const overrideMethods = ['map', 'filter', 'reduce', 'some', 'every', 'find'];
        overrideMethods.forEach((method) => {
            observer[method] = function(callback) {
                return observer.val()[method](callback);
            };
        });

        return observer;
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
     * @param {string} className
     * @param {string} value
     */
    const toggleClassItem = function(element, className, value) {
        if(value) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    };

    /**
     *
     * @param {HTMLElement} element
     * @param {Object} data
     */
    function bindClassAttribute(element, data) {
        for(let className in data) {
            const value = data[className];
            if(Validator.isObservable(value)) {
                toggleClassItem(element, className, value.val());
                value.subscribe(newValue => toggleClassItem(element, className, newValue));
                continue;
            }
            toggleClassItem(element, className, value);
        }
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
                value.subscribe(newValue => {
                    element.style[styleName] = newValue;
                });
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
                element.addEventListener('input', () => {
                    if(Validator.isBoolean(defaultValue)) {
                        value.set(element[attributeName]);
                        return;
                    }
                    value.set(element.value);
                });
            }
            value.subscribe(newValue => {
                if(Validator.isBoolean(newValue)) {
                    element[attributeName] = newValue;
                    return;
                }
                element[attributeName] = newValue === element.value;
            });
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
        value.subscribe(applyValue);
        applyValue(value.val());

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
            if(Validator.isString(value) && Validator.isFunction(value.resolveObservableTemplate)) {
                value = value.resolveObservableTemplate();
                if(Validator.isArray(value)) {
                    const observables = value.filter(item => Validator.isObservable(item));
                    value = Observable.computed(() => {
                        return value.map(item => Validator.isObservable(item) ? item.val() : item).join(' ') || ' ';
                    }, observables);
                }
            }
            if(BOOLEAN_ATTRIBUTES.includes(attributeName)) {
                bindBooleanAttribute(element, attributeName, value);
                continue;
            }
            if(Validator.isObservable(value)) {
                bindAttributeWithObservable(element, attributeName, value);
                continue;
            }
            if(attributeName === 'class' && Validator.isJson(value)) {
                bindClassAttribute(element, value);
                continue;
            }
            if(attributeName === 'style' && Validator.isJson(value)) {
                bindStyleAttribute(element, value);
                continue;
            }
            element.setAttribute(attributeName, value);
        }
        return element;
    }

    const DocumentObserver = {
        elements: new Map(),
        observer: null,
        checkMutation: throttle(function() {
            for(const [element, data] of DocumentObserver.elements.entries()) {
                const isCurrentlyInDom = document.body.contains(element);
                if(isCurrentlyInDom && !data.inDom) {
                    data.inDom = true;
                    data.mounted.forEach(callback => callback(element));
                } else if(!isCurrentlyInDom && data.inDom) {
                    data.inDom = false;
                    data.unmounted.forEach(callback => callback(element));
                }
            }
        }, 10, { debounce: true }),
        /**
         *
         * @param {HTMLElement} element
         * @returns {{watch: (function(): Map<any, any>), disconnect: (function(): boolean), mounted: (function(*): Set<any>), unmounted: (function(*): Set<any>)}}
         */
        watch: function(element) {
            let data = {};
            if(DocumentObserver.elements.has(element)) {
                data = DocumentObserver.elements.get(element);
            } else {
                const inDom = document.body.contains(element);
                data = {
                    inDom,
                    mounted: new Set(),
                    unmounted: new Set(),
                };
                DocumentObserver.elements.set(element, data);
            }

            return {
                watch: () => DocumentObserver.elements.set(element, data),
                disconnect: () => DocumentObserver.elements.delete(element),
                mounted: (callback) => data.mounted.add(callback),
                unmounted: (callback) => data.unmounted.add(callback)
            };
        }
    };

    DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
    DocumentObserver.observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    const getChildAsNode = (child) => {
        if(Validator.isFunction(child)) {
            return getChildAsNode(child());
        }
        if(Validator.isElement(child)) {
            return child;
        }
        return createTextNode(child)
    };

    function Anchor(name) {
        const element = document.createDocumentFragment();

        const anchorStart = document.createComment('Anchor Start : '+name);
        const anchorEnd = document.createComment('/ Anchor End '+name);

        element.appendChild(anchorStart);
        element.appendChild(anchorEnd);

        element.nativeInsertBefore = element.insertBefore;
        element.nativeAppendChild = element.appendChild;

        const insertBefore = function(parent, child, target) {
            if(parent === element) {
                parent.nativeInsertBefore(getChildAsNode(child), target);
                return;
            }
            parent.insertBefore(getChildAsNode(child), target);
        };

        element.appendChild = function(child, before = null) {
            const parent = anchorEnd.parentNode;
            if(!parent) {
                DebugManager.error('Anchor', 'Anchor : parent not found', child);
                return;
            }
            before = before ?? anchorEnd;
            if(Validator.isArray(child)) {
                child.forEach((element) => {
                    insertBefore(parent, element, before);
                });
                return element;
            }
            insertBefore(parent, child, before);
        };

        element.remove = function(trueRemove) {
            if(anchorEnd.parentNode === element) {
                return;
            }
            let itemToRemove = anchorStart.nextSibling, tempItem;
            while(itemToRemove !== anchorEnd) {
                tempItem = itemToRemove.nextSibling;
                trueRemove ? itemToRemove.remove() : element.nativeAppendChild(itemToRemove);
                itemToRemove = tempItem;
            }
            if(trueRemove) {
                anchorEnd.remove();
                anchorStart.remove();
            }
        };

        element.insertBefore = function(child, anchor = null) {
            element.appendChild(child, anchor);
        };

        element.clear = function() {
            element.remove();
        };

        element.endElement = function() {
            return anchorEnd;
        };
        element.startElement = function() {
            return anchorStart;
        };

        return element;
    }

    const pluginsManager = (function() {

        const $plugins = [];

        return {
            list : () => $plugins,
            add : (plugin) => $plugins.push(plugin)
        };
    }());

    /**
     *
     * @param {HTMLElement|DocumentFragment} parent
     * @param {ObservableItem} observable
     * @returns {Text}
     */
    const createObservableNode = function(parent, observable) {
        const text = document.createTextNode('');
        observable.subscribe(value => text.textContent = String(value));
        text.textContent = observable.val();
        parent && parent.appendChild(text);
        return text;
    };

    /**
     *
     * @param {HTMLElement|DocumentFragment} parent
     * @param {*} value
     * @returns {Text}
     */
    const createStaticTextNode = function(parent, value) {
        const text = document.createTextNode('');
        text.textContent = String(value);
        parent && parent.appendChild(text);
        return text;
    };

    /**
     *
     * @param {HTMLElement} element
     */
    const addUtilsMethods = function(element) {
        element.nd.wrap = (callback) => {
            if(!Validator.isFunction(callback)) {
                throw new NativeDocumentError('Callback must be a function');
            }
            callback && callback(element);
            return element;
        };
        element.nd.ref = (target, name) => {
            target[name] = element;
            return element;
        };

        let $observer = null;

        element.nd.appendChild = function(child) {
            if(Validator.isArray(child)) {
                ElementCreator.processChildren(child, element);
                return;
            }
            if(Validator.isFunction(child)) {
                child = child();
                ElementCreator.processChildren(child(), element);
            }
            if(Validator.isElement(child)) {
                ElementCreator.processChildren(child, element);
            }
        };

        element.nd.lifecycle = function(states) {
            $observer = $observer || DocumentObserver.watch(element);

            states.mounted && $observer.mounted(states.mounted);
            states.unmounted && $observer.unmounted(states.unmounted);
            return element;
        };

        element.nd.mounted = (callback) => {
            $observer = $observer || DocumentObserver.watch(element);
            $observer.mounted(callback);
            return element;
        };
        element.nd.unmounted = (callback) => {
            $observer = $observer || DocumentObserver.watch(element);
            $observer.unmounted(callback);
            return element;
        };
    };

    /**
     *
     * @param {*} value
     * @returns {Text}
     */
    const createTextNode = function(value) {
        return (Validator.isObservable(value))
            ? createObservableNode(null, value)
            : createStaticTextNode(null, value);
    };

    const ElementCreator = {
        /**
         *
         * @param {string} name
         * @returns {HTMLElement|DocumentFragment}
         */
        createElement(name)  {
            return name ? document.createElement(name) : new Anchor('Fragment');
        },
        /**
         *
         * @param {*} children
         * @param {HTMLElement|DocumentFragment} parent
         */
        processChildren(children, parent) {
            if(children === null) return;
            const childrenArray = Array.isArray(children) ? children : [children];
            childrenArray.forEach(child => {
                if (child === null) return;
                if(Validator.isString(child) && Validator.isFunction(child.resolveObservableTemplate)) {
                    child = child.resolveObservableTemplate();
                }
                if(Validator.isFunction(child)) {
                    this.processChildren(child(), parent);
                    return;
                }
                if(Validator.isArray(child)) {
                    this.processChildren(child, parent);
                    return;
                }
                if (Validator.isElement(child)) {
                    parent.appendChild(child);
                    return;
                }
                if (Validator.isObservable(child)) {
                    createObservableNode(parent, child);
                    return;
                }
                if (child) {
                    createStaticTextNode(parent, child);
                }
            });
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
            element.nd = {};
            HtmlElementEventsWrapper(element);
            const item = (typeof customWrapper === 'function') ? customWrapper(element) : element;
            addUtilsMethods(item);

            pluginsManager.list().forEach(plugin => {
                plugin?.element?.setup && plugin.element.setup(item, attributes);
            });

            return item;
        }
    };

    /**
     *
     * @param {string} name
     * @param {?Function} customWrapper
     * @returns {Function}
     */
    function HtmlElementWrapper(name, customWrapper) {
        const $tagName = name.toLowerCase().trim();

        const builder = function(attributes, children = null) {
            try {
                if(Validator.isValidChildren(attributes)) {
                    const tempChildren = children;
                    children = attributes;
                    attributes = tempChildren;
                }
                const element = ElementCreator.createElement($tagName);

                ElementCreator.processAttributes(element, attributes);
                ElementCreator.processChildren(children, element);

                return ElementCreator.setup(element, attributes, customWrapper);
            } catch (error) {
                DebugManager.error('ElementCreation', `Error creating ${$tagName}`, error);
            }
        };

        builder.hold = (children, attributes) => (() => builder(children, attributes));

        return builder;
    }

    class ArgTypesError extends Error {
        constructor(message, errors) {
            super(`${message}\n\n${errors.join("\n")}\n\n`);
        }
    }

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
    const ArgTypes = {
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
    const withValidation = (fn, argSchema, fnName = 'Function') => {
        if(!Validator.isArray(argSchema)) {
            throw new NativeDocumentError('withValidation : argSchema must be an array');
        }
        return function(...args) {
            validateArgs(args, argSchema, fn.name || fnName);
            return fn.apply(this, args);
        };
    };

    Function.prototype.args = function(...args) {
        return withValidation(this, args);
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
            return this;
        }
        return this.split(/(\{\{#ObItem::\([0-9]+\)\}\})/g).filter(Boolean).map((value) => {
            if(!Validator.containsObservableReference(value)) {
                return value;
            }
            const [_, id] = value.match(/\{\{#ObItem::\(([0-9]+)\)\}\}/);
            return Observable.getById(id);
        });
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
        return item[key] ?? defaultKey;
    };

    /**
     *
     * @param {Map} cache
     * @param {Set} keyIds
     */
    const cleanBlockByCache = (cache, keyIds) => {
        for(const [key, {child}] of cache.entries()) {
            if(keyIds.has(key)) {
                continue;
            }
            child.remove();
        }
    };

    /**
     *
     * @param {Array|Object|ObservableItem} data
     * @param {Function} callback
     * @param {?Function} key
     * @returns {DocumentFragment}
     */
    function ForEach(data, callback, key) {
        const element = new Anchor('ForEach');
        const blockEnd = element.endElement();

        let cache = new Map();

        const handleContentItem = (item, indexKey) => {
            const keyId = getKey(item, indexKey, key);

            if(cache.has(keyId)) {
                cache.get(keyId).indexObserver.set(indexKey);
            }
            else {
                const indexObserver = Observable(indexKey);
                let child = callback(item, indexObserver);
                if(Validator.isStringOrObservable(child)) {
                    child = createTextNode(child);
                }
                cache.set(keyId, { child, indexObserver});
            }
            return keyId;
        };
        const keyIds = new Set();

        const buildContent = () => {
            const items = (Validator.isObservable(data)) ? data.val() : data;
            const parent = blockEnd.parentNode;
            if(!parent) {
                return;
            }
            keyIds.clear();
            if(Array.isArray(items)) {
                items.forEach((item, index) => keyIds.add(handleContentItem(item, index)));
            } else {
                for(const indexKey in items) {
                    keyIds.add(handleContentItem(items[indexKey], indexKey));
                }
            }

            cleanBlockByCache(cache, keyIds);
            let nextElementSibling = blockEnd;
            for(const item of [...keyIds].reverse()) {
                const { child } = cache.get(item);
                if(child) {
                    if(nextElementSibling && nextElementSibling.previousSibling === child) {
                        nextElementSibling = child;
                        continue;
                    }
                    parent.insertBefore(child, nextElementSibling);
                    nextElementSibling = child;
                }
            }
        };

        buildContent();
        if(Validator.isObservable(data)) {
            data.subscribe(throttle((newValue, oldValue) => {
                buildContent();
            }, 50, { debounce: true }));
        }
        return element;
    }

    /**
     * Show the element if the condition is true
     *
     * @param {ObservableItem|ObservableChecker} condition
     * @param {*} child
     * @param {string|null} comment
     * @returns {DocumentFragment}
     */
    const ShowIf = function(condition, child, comment = null) {
        if(!(Validator.isObservable(condition))) {
            return DebugManager.warn('ShowIf', "ShowIf : condition must be an Observable / "+comment, condition);
        }
        const element = new Anchor('Show if : '+(comment || ''));

        let childElement = null;
        const getChildElement = () => {
            if(childElement) {
                return childElement;
            }
            if(typeof child === 'function') {
                childElement = child();
            }
            else {
                childElement = child;
            }
            if(Validator.isStringOrObservable(childElement)) {
                childElement = createTextNode(childElement);
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
     * @param comment
     * @returns {DocumentFragment}
     */
    const HideIf = function(condition, child, comment) {

        const hideCondition = Observable(!condition.val());
        condition.subscribe(value => hideCondition.set(!value));

        return ShowIf(hideCondition, child, comment);
    };

    /**
     * Hide the element if the condition is false
     *
     * @param {ObservableItem|ObservableChecker} condition
     * @param {*} child
     * @param {string|null} comment
     * @returns {DocumentFragment}
     */
    const HideIfNot = function(condition, child, comment) {
        return ShowIf(condition, child, comment);
    };

    /**
     *
     * @param {ObservableItem|ObservableChecker} $condition
     * @param {{[key]: *}} values
     * @returns {DocumentFragment}
     */
    const Match = function($condition, values) {

        if(!Validator.isObservable($condition)) {
            throw new NativeDocumentError("Toggle : condition must be an Observable");
        }

        const anchor = new Anchor();
        const cache = new Map();

        const getItem = function(key) {
            if(cache.has(key)) {
                return cache.get(key);
            }
            let item = values[key];
            if(!item) {
                return null;
            }
            if(Validator.isFunction(item)) {
                item = item();
            }
            cache.set(key, item);
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
                el.on.submit((e) => {
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
        UnorderedList: UnorderedList,
        UrlInput: UrlInput,
        Var: Var,
        Video: Video,
        Wbr: Wbr,
        WeekInput: WeekInput,
        When: When
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
                DebugManager.error('HistoryRouter', 'Error in pushState', e);
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
                DebugManager.error('HistoryRouter', 'Error in replaceState', e);
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
                    DebugManager.error('HistoryRouter', 'Error in popstate event', e);
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

        const updateContainer = function(node) {
            container.innerHTML = '';
            container.appendChild(node);
        };

        const handleCurrentRouterState = function(state) {
            if(!state.route) {
                return;
            }
            const { route, params, query, path } = state;
            if($cache.has(path)) {
                const cacheNode = $cache.get(path);
                updateContainer(cacheNode);
                return;
            }
            const Component = route.component();
            const node = Component({ params, query });
            $cache.set(path, node);
            updateContainer(node);
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
                    DebugManager.warn('Route Listener', 'Error in listener:', e);
                }
            }
        };

        this.routes = () => [...$routes];
        this.currentState = () => ({ ...$currentState });

        /**
         *
         * @param {string} path
         * @param {Function} component
         * @param {{name:?string, middlewares:Function[], shouldRebuild:Boolean, with: Object }} options
         * @returns {this}
         */
        this.add = function(path, component, options) {
            const route = new Route(RouteGroupHelper.fullPath($groupTree, path), component, {
                ...options,
                middlewares: RouteGroupHelper.fullMiddlewares($groupTree, options?.middlewares || []),
                name: options?.name ? RouteGroupHelper.fullName($groupTree, options.name) : null,
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
            DebugManager.error('Router', 'Callback must be a function', e);
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
            return Link$1({ ...attributes, href: target}, children).nd.on.prevent.click(() => {
                router.push(target);
            });
        }
        const routerName = target.router || DEFAULT_ROUTER_NAME;
        const router = Router.get(routerName);
        console.log(routerName);
        if(!router) {
            throw new RouterError('Router not found "'+routerName+'" for link "'+target.name+'"');
        }
        const url = router.generateUrl(target.name, target.params, target.query);
        return Link$1({ ...attributes, href: url }, children).nd.on.prevent.click(() => {
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

    exports.ArgTypes = ArgTypes;
    exports.ElementCreator = ElementCreator;
    exports.HtmlElementWrapper = HtmlElementWrapper;
    exports.Observable = Observable;
    exports.Store = Store;
    exports.elements = elements;
    exports.router = router;
    exports.withValidation = withValidation;

    return exports;

})({});
