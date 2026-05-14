import {withValidation} from "./args-types.js";


DocumentFragment.prototype.__IS_FRAGMENT = true;

Function.prototype.args = function(...args) {
    return withValidation(this, args);
};

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
