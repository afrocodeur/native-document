import BaseComponent from "../../BaseComponent";
import HasEventEmitter from "../../../core/utils/HasEventEmitter";
import HasValidation from "../../$traits/has-validation/HasValidation";
import { $ } from "../../../core/data/Observable";
import Validator from "../../../core/utils/validator";
import NativeDocumentError from "../../../core/errors/NativeDocumentError";

/**
 * Repeatable field group. Allows adding/removing instances dynamically with validation rules on the collection (min/max count).
 *
 *
 * @example
 * const phones = new FieldCollection('phones')
 *     .fields((fields, index) =>
 *         new Field(\`phones[\${index}]\`, 'tel').label(Span(\`Phone \${index + 1}\`))
 *     )
 *     .renderAdd(() => Button(Span('+ Add phone')))
 *     .min(1, 'At least one phone is required')
 *     .max(5, 'Maximum 5 phones allowed');
 *
 * @constructor
 * @param {string} [name]
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * Registers the render template for FieldCollection.
 * @param {(description: {
 *     name: string,
 *     value: Observable<*[]>,
 *     hasErrors: Observable<boolean>,
 *     errors: Observable<string[]>,
 *     defaultItem: *,
 *     fieldBuilder: ((fields: FieldCollection, index: number) => NdChild)|null,
 *     renderItem: ((item: *, index: number) => NdChild)|null,
 *     renderAdd: (() => NdChild)|null,
 *     transition: string|null,
 *     props: GlobalAttributes,
 * }, instance: FieldCollection) => NdChild} template
 */
FieldCollection.use = function(template) {
    FieldCollection.defaultTemplate = template;
};

/**
 * @param {(fields: FieldCollection, index: number) => NdChild} fieldBuilder
 * @returns {this}
 */
FieldCollection.prototype.fields = function(fieldBuilder) {
    if(typeof fieldBuilder !== 'function') {
        throw new NativeDocumentError('FieldCollection.fields() expects a function');
    }
    this.$description.fieldBuilder = fieldBuilder;
    return this;
};

/**
 * @param {*} defaultItem
 * @returns {this}
 */
FieldCollection.prototype.data = function(defaultItem) {
    if(typeof defaultItem !== 'function') {
        throw new NativeDocumentError('FieldCollection.data() expects a factory function');
    }
    this.$description.defaultItem = defaultItem;
    return this;
};

/**
 * @param {(item: *, index: number) => NdChild} fn
 * @returns {this}
 */
FieldCollection.prototype.renderItem = function(fn) {
    this.$description.renderItem = fn;
    return this;
};

/**
 * @param {() => NdChild} fn
 * @returns {this}
 */
FieldCollection.prototype.renderAdd = function(fn) {
    this.$description.renderAdd = fn;
    return this;
};

/**
 * @param {string} transitionName
 * @returns {this}
 */
FieldCollection.prototype.transition = function(transitionName) {
    this.$description.transition = transitionName;
    return this;
};

/**
 * @param {Observable<*[]>} observable
 * @returns {this}
 */
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

/**
 * @returns {this}
 */
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

/**
 * @param {*} item
 * @returns {this}
 */
FieldCollection.prototype.remove = function(item) {
    this.$description.value.removeItem(item);
    this.emit('remove', item);
    return this;
};

/**
 * @returns {this}
 */
FieldCollection.prototype.clear = function() {
    this.$description.value.clear();
    return this;
};

/**
 * @returns {this}
 */
FieldCollection.prototype.reset = function() {
    this.clear();
    return this;
};

/**
 * @returns {*[]}
 */
FieldCollection.prototype.value = function() {
    return this.$description.value.map(item =>
        Validator.isObservable(item) ? item.val() : item
    );
};

/**
 * @returns {number}
 */
FieldCollection.prototype.count = function() {
    return this.$description.value.val().length;
};

/**
 * @returns {boolean}
 */
FieldCollection.prototype.isEmpty = function() {
    return this.$description.value.val().length === 0;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
FieldCollection.prototype.onChange = function(handler) {
    this.on('change', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
FieldCollection.prototype.onAdd = function(handler) {
    this.on('add', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
FieldCollection.prototype.onRemove = function(handler) {
    this.on('remove', handler);
    return this;
};

/**
 * @param {number} minCount
 * @param {string} [message]
 * @returns {this}
 */
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

/**
 * @param {number} maxCount
 * @param {string} [message]
 * @returns {this}
 */
FieldCollection.prototype.max = function(maxCount, message) {
    return this.addRule(
        (values) => ({
            valid:   values.length <= maxCount,
            message: `Maximum ${maxCount} item(s) allowed`,
        }),
        [],
        message,
    );
};

// Override validate
/**
 * @param {*} [allValues]
 * @returns {{ key: string, errors: string[] }}
 */
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