import DocumentObserver from './DocumentObserver';
import PluginsManager from '../utils/plugins-manager';
import NativeDocumentError from '../errors/NativeDocumentError.js';
import DebugManager from '../utils/debug-manager.js';
import attributesWrapper, {
    bindAttributeWithObservable,
    bindClassAttribute,
    bindStyleAttribute,
} from './AttributesWrapper';

/**
 * Wraps an HTMLElement with NativeDocument's reactivity and lifecycle API.
 * Created automatically by HtmlElementWrapper — not intended to be instantiated directly.
 *
 * @constructor
 * @param {HTMLElement} element - The underlying HTML element to wrap
 */
export function NDElement(element) {
    this.$element = element;
    this.$attachements = null;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('NDElementCreated', element, this);
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
    if(process.env.NODE_ENV === 'development') {
        if (!this.$localExtensions) {
            this.$localExtensions = new Map();
        }
    }

    for (const name in methods) {
        const method = methods[name];

        if (typeof method !== 'function') {
            DebugManager.warn(`⚠️ extends(): "${name}" is not a function, skipping`);
            continue;
        }
        if(process.env.NODE_ENV === 'development') {
            if (this[name] && !this.$localExtensions.has(name)) {
                DebugManager.warn('NDElement.extend', `Method "${name}" already exists and will be overwritten`);
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
    attributesWrapper(this.$element, attrs);
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
            DebugManager.warn('NDElement.extend', `"${name}" is not a function, skipping`);
            continue;
        }

        if (protectedMethods.has(name)) {
            DebugManager.error('NDElement.extend', `Cannot override protected method "${name}"`);
            throw new NativeDocumentError(`Cannot override protected method "${name}"`);
        }

        if (NDElement.prototype[name]) {
            DebugManager.warn('NDElement.extend', `Overwriting existing prototype method "${name}"`);
        }

        NDElement.prototype[name] = method;
    }
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('NDElementExtended', methods);
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