import ObservableItem from "../data/ObservableItem";
import DebugManager from "./debug-manager";
import NativeDocumentError from "../errors/NativeDocumentError";
import ObservableChecker from "../data/ObservableChecker";

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
    containsObservables(data) {
        if(!data) {
            return false;
        }
        return Validator.isObject(data)
            && Object.values(data).some(value => Validator.isObservable(value));
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

export default Validator;