import {withValidation} from "./args-types.js";


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
}