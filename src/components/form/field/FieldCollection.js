import BaseComponent from "../../BaseComponent";
import HasEventEmitter from "../../../core/utils/HasEventEmitter";
import HasValidation from "../../$traits/has-validation/HasValidation";
import { $ } from "../../../core/data/Observable";
import Validator from "../../../core/utils/validator";
import NativeDocumentError from "../../../core/errors/NativeDocumentError";

export default function FieldCollection(name, props = {}) {
    if(!(this instanceof FieldCollection)) {
        return new FieldCollection(name, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        name: name,
        value: $.array([]),
        rules: [],
        fields: {},
        hasErrors: $(false),
        errors: $.array(),
        showErrors: $(true),
        defaultItem: null,
        fieldBuilder: null,
        renderItem: null,
        renderAdd: null,
        transition: null,
        props
    };

    this.$description.value.interceptMutations((items) =>
        items.map(item => Validator.isObservable(item) ? item : $.object(item))
    );
}

BaseComponent.extends(FieldCollection);
BaseComponent.use(FieldCollection, HasEventEmitter);
BaseComponent.use(FieldCollection, HasValidation);

FieldCollection.defaultTemplate = null;

FieldCollection.use = function(template) {
    FieldCollection.defaultTemplate = template;
};

FieldCollection.prototype.fields = function(fieldBuilder) {
    if(typeof fieldBuilder !== 'function') {
        throw new NativeDocumentError('FieldCollection.fields() expects a function');
    }
    this.$description.fieldBuilder = fieldBuilder;
    return this;
};

FieldCollection.prototype.data = function(defaultItem) {
    if(typeof defaultItem !== 'function') {
        throw new NativeDocumentError('FieldCollection.data() expects a factory function');
    }
    this.$description.defaultItem = defaultItem;
    return this;
};

FieldCollection.prototype.renderItem = function(fn) {
    this.$description.renderItem = fn;
    return this;
};

FieldCollection.prototype.renderAdd = function(fn) {
    this.$description.renderAdd = fn;
    return this;
};

FieldCollection.prototype.transition = function(transitionName) {
    this.$description.transition = transitionName;
    return this;
};

FieldCollection.prototype.model = function(observable) {
    if(Validator.isObservable(observable)) {
        this.$description.value = observable;
        this.$description.value.interceptMutations((items) =>
            items.map(item => Validator.isObservable(item) ? item : $.object(item))
        );
        return this;
    }
    this.$description.value.set(observable);
    return this;
};

FieldCollection.prototype.add = function() {
    if(!this.$description.fieldBuilder) {
        throw new NativeDocumentError('FieldCollection: fields() must be defined before add()');
    }
    const raw  = this.$description.defaultItem
        ? this.$description.defaultItem()
        : {};
    const item = Validator.isObservable(raw) ? raw : $.object(raw);

    this.$description.value.push(item);
    this.emit('add', item);
    return this;
};

FieldCollection.prototype.remove = function(item) {
    this.$description.value.removeItem(item);
    this.emit('remove', item);
    return this;
};

FieldCollection.prototype.clear = function() {
    this.$description.value.clear();
    return this;
};

FieldCollection.prototype.reset = function() {
    this.clear();
    return this;
};

FieldCollection.prototype.value = function() {
    return this.$description.value.map(item =>
        Validator.isObservable(item) ? item.val() : item
    );
};

FieldCollection.prototype.count = function() {
    return this.$description.value.val().length;
};

FieldCollection.prototype.isEmpty = function() {
    return this.$description.value.val().length === 0;
};

FieldCollection.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

FieldCollection.prototype.onAdd = function(handler) {
    this.on('add', handler);
    return this;
};

FieldCollection.prototype.onRemove = function(handler) {
    this.on('remove', handler);
    return this;
};

FieldCollection.prototype.min = function(minCount, message) {
    return this.addRule(
        (values) => ({
            valid:   values.length >= minCount,
            message: `Minimum ${minCount} item(s) required`,
        }),
        [],
        message
    );
};

FieldCollection.prototype.max = function(maxCount, message) {
    return this.addRule(
        (values) => ({
            valid:   values.length <= maxCount,
            message: `Maximum ${maxCount} item(s) allowed`,
        }),
        [],
        message
    );
};

// Override validate
FieldCollection.prototype.validate = function(allValues) {
    const errors     = [];
    const rowsValues = this.value();

    if(this.$description.rules) {
        for(const rule of this.$description.rules) {
            const result = rule.fn(rowsValues, allValues);
            if(!result.valid) {
                errors.push(rule.message || result.message);
            }
        }
    }

    this.$description.errors.set(errors);
    this.$description.hasErrors.set(errors.length > 0);

    return errors;
};