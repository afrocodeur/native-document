import {withValidation} from "./args-types.js";


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
    return withValidation(this, args);
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
