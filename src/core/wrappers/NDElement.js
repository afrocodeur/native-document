import DocumentObserver from "./DocumentObserver";
import PluginsManager from "@src/core/utils/plugins-manager";
import NativeDocumentError from "@src/core/errors/NativeDocumentError.js";
import DebugManager from "@src/core/utils/debug-manager.js";

export function NDElement(element) {
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

NDElement.prototype.attach = function(methodName, bindingHydrator) {
    bindingHydrator.$hydrate(this.$element, methodName);
    return this.$element;
};


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
}

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
        if (!methods.hasOwnProperty(name)) {
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

    PluginsManager.emit('NDElementExtended', methods);

    return NDElement;
};