import {withValidation} from "./args-types.js";
import {Observable} from "../data/Observable";
import Validator from "./validator";


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
}