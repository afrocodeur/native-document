import ObservableItem from "../data/ObservableItem";
import DebugManager from "./debug-manager";
import NativeDocumentError from "../errors/NativeDocumentError";
import ObservableChecker from "../data/ObservableChecker";
import {NDElement} from "../wrappers/NDElement";

const COMMON_NODE_TYPES = {
    ELEMENT: 1,
    TEXT: 3,
    COMMENT: 8,
    DOCUMENT: 9,
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
if(process.env.NODE_ENV === 'development') {
    Validator.validateAttributes = function(attributes) {
        if (!attributes || typeof attributes !== 'object') {
            return attributes;
        }

        const reserved = [];
        const foundReserved = Object.keys(attributes).filter(key => reserved.includes(key));

        if (foundReserved.length > 0) {
            DebugManager.warn('Validator', `Reserved attributes found: ${foundReserved.join(', ')}`);
        }

        return attributes;
    };
}

export default Validator;