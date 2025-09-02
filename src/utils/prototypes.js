import {withValidation} from "./args-types.js";
import {Observable} from "../data/Observable";
import Validator from "./validator";
import {NDElement} from "../wrappers/NDElement";


Function.prototype.args = function(...args) {
    return withValidation(this, args);
};

Function.prototype.cached = function(...args) {
    let $cache = null;
    let  getCache = function(){ return $cache; };
    return () => {
        if(!$cache) {
            $cache = this.apply(this, args);
            if($cache.cloneNode) {
                getCache = function() { return $cache.cloneNode(true); };
            } else if($cache.$element) {
                getCache = function() { return new NDElement($cache.$element.cloneNode(true)); };
            }
        }
        return getCache();
    };
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
        return this.valueOf();
    }
    return this.split(/(\{\{#ObItem::\([0-9]+\)\}\})/g).filter(Boolean).map((value) => {
        if(!Validator.containsObservableReference(value)) {
            return value;
        }
        const [_, id] = value.match(/\{\{#ObItem::\(([0-9]+)\)\}\}/);
        return Observable.getById(id);
    });
}