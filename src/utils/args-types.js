import Validator from "./validator";
import ArgTypesError from "../errors/ArgTypesError";
import NativeDocumentError from "../errors/NativeDocumentError";

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
export const ArgTypes = {
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
export const withValidation = (fn, argSchema, fnName = 'Function') => {
    if(!Validator.isArray(argSchema)) {
        throw new NativeDocumentError('withValidation : argSchema must be an array');
    }
    return function(...args) {
        validateArgs(args, argSchema, fn.name || fnName);
        return fn.apply(this, args);
    };
};