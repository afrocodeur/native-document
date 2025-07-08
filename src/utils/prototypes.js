import ObservableItem from "../data/ObservableItem";
import Validator from "./validator";


HTMLElement.prototype.attr = function(name, value) {
    if(value === undefined) return this.getAttribute(name);

    if(Validator.isObservable(value)) {
        value.subscribe(newValue => this.setAttribute(name, newValue));
        this.setAttribute(name, value.val());
        return this;
    }
    this.setAttribute(name, value);
    return this;
};