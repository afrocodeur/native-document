import {resolveParams} from "../../form/utils";
import BaseComponent from "../../BaseComponent";
import {Validation} from "../../form/validation/Validation";

export default function HasValidation() {}

HasValidation.prototype.required = function(message) {
    this.$description.rules.push({
        fn:      Validation.required,
        message: message || `${this.$description.label || this.$description.name} is required`
    });
    return this;
};

HasValidation.prototype.custom = function(validatorFn, message) {
    this.$description.rules.push({
        validate: validatorFn,
        message:  message || 'Validation failed'
    });
    return this;
};

HasValidation.prototype.addRule = function(validationFn, params, message) {
    this.$description.rules.push({
        fn:      validationFn,
        params:  params || [],
        message
    });
    return this;
};

HasValidation.prototype.requiredIf = function(condition, message) {
    return this.addRule(Validation.requiredIf, [condition], message);
};

HasValidation.prototype.clearErrorOn = function(event) {
    this.$description.clearErrorOn = event;
    return this;
};

HasValidation.prototype.validateOn = function(event) {
    this.$description.validateOn = event;
    return this;
};

HasValidation.prototype.showErrors = function(show = true) {
    this.$description.showErrors = BaseComponent.obs(show);
    return this;
};

HasValidation.prototype.hideErrors = function() {
    this.$description.showErrors.set(false);
    return this;
};

HasValidation.prototype.setError = function(error) {
    this.$description.errors?.set?.(error);
    return this;
};

HasValidation.prototype.validate = function(allValues = {}) {
    if(!this.$description.rules || this.$description.rules.length === 0) {
        this.$description.errors.clear();
        this.$description.hasErrors.set(false);
        return {key: this.$description.key, errors: []};
    }

    const errors = [];
    const value  = this.value();

    for(const rule of this.$description.rules) {
        const paramsResolved = resolveParams(rule, allValues);
        const validateFn     = rule.validate || rule.fn;
        const rawResult      = validateFn(value, ...paramsResolved, allValues);
        const result         = typeof rawResult === 'boolean' ? {valid: rawResult} : rawResult;

        if(!result.valid) {
            errors.push(rule.message || result.message);
        }
    }

    this.$description.errors.set(errors);
    this.$description.hasErrors.set(errors.length > 0);

    return {key: this.$description.key, errors};
};