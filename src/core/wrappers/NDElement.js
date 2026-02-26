import DocumentObserver from "./DocumentObserver";
import PluginsManager from "../utils/plugins-manager";
import NativeDocumentError from "../errors/NativeDocumentError.js";
import DebugManager from "../utils/debug-manager.js";

export function NDElement(element) {
    this.$element = element;
    this.$observer = null;
    if(process.env.NODE_ENV === 'development') {
        PluginsManager.emit('NDElementCreated', element, this);
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

        let  $isUnmounting = false

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
    const children = Array.from($element.childNodes)
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
    if(process.env.NODE_ENV === 'development') {
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