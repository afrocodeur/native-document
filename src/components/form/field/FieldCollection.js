import { Observable as $, Validator } from "../../../../index";
import NativeDocumentError from "../../../../src/core/errors/NativeDocumentError";
import {Validation} from "../validation/Validation";
import {resolveParams} from "../utils";
import BaseComponent from "../../BaseComponent";

export default function FieldCollection(name, config) {
    if(!(this instanceof FieldCollection)) {
        return new FieldCollection(name, config);
    }
    this.$description = {
        name: name,
        defaultItem: null,
        value: (config?.data && Validator.isObservable(config.data))
            ? config.data
            : $.array(config?.data || []),
        rules: null,
        layout: null,
        template: null,
        ...config
    };

    this.$items = null;
    this.$currentRefId = 0;
}

BaseComponent.extends(FieldCollection);

FieldCollection.defaultLayoutTemplate = null;
FieldCollection.defaultTemplate = null;

FieldCollection.use = function(template) {
    FieldCollection.defaultTemplate = template.fieldCollection;
    FieldCollection.defaultLayoutTemplate = template.fieldCollectionLayout;
};


const setFieldValue = (field, name, proxyData) => {
    const value = field.$model();

    const data = proxyData[name];
    if(value != null) {
        value.set(data);
        return;
    }
    if(Validator.isObservable(data)) {
        field.model(data);
        return;
    }
    if(typeof field.checked === 'function') {
        field.checked(data);
        return;
    }
    field.value(data);
};

Object.defineProperty(FieldCollection.prototype, 'items', {
    get() { return this.$items; }
});

FieldCollection.prototype.data = function(data) {
    this.$description.defaultItem = data;
    return this;
};

FieldCollection.prototype.isEmpty = function() {
    return this.$description.value.val().length === 0;
};

FieldCollection.prototype.count = function() {
    return this.$description.value.val().length;
};

FieldCollection.prototype.addRule = function(validationFn, params, message) {
    this.$description.rules = this.$description.rules || [];
    this.$description.rules.push({
        fn: validationFn,
        params: params || [],
        message
    });
    return this;
};

FieldCollection.prototype.fields = function(fieldBuilder) {
    if(typeof fieldBuilder !== "function") {
        throw new NativeDocumentError('Field builder must be a function');
    }
    this.$fieldBuilder = fieldBuilder;
    return this;
};

FieldCollection.prototype.template = function(template) {
    if(typeof template !== "function") {
        throw new NativeDocumentError('Template must be a function');
    }
    this.$description.template = function(item, index) {
        const fields = this.items.get(item).fields;
        return template.call(this, item, index,  { collection: this, fields });
    };
    return this;
};

FieldCollection.prototype.add = function(...args) {
    if (!this.$fieldBuilder) {
        throw new NativeDocumentError('Field builder not defined');
    }

    const defaultItem = this.$description.defaultItem;
    let defaultItemData = (typeof defaultItem === 'function' ? defaultItem(...args) : defaultItem) || '';
    defaultItemData = Validator.isObservable(defaultItemData)
        ? defaultItemData
        : Validator.isObject(defaultItemData)
            ? $.init(defaultItemData)
            : $(defaultItemData);

    this.$items = this.$items || new WeakMap();

    const refId = this.$currentRefId++;
    const createdFields = this.$fieldBuilder(refId, defaultItemData);
    let fields = {};
    if(Array.isArray(createdFields)) {
        createdFields.forEach(field => {
            const name = field.$description.name.split('.').pop();
            setFieldValue(field, name, defaultItemData);
            fields[name] = field;
        });
    } else {
        Object.entries(createdFields).forEach(([name, field]) => {
            setFieldValue(field, name, defaultItemData);
            fields[name] = field;
        })
    }

    this.$items.set(defaultItemData, {
        refId,
        fields
    });

    this.$description.value.push(defaultItemData);
    return this;

};

FieldCollection.prototype.remove = function(item) {
    this.$description.value.removeItem(item);
    this.$items?.delete(item);
    return this;
};

FieldCollection.prototype.clear = function() {
    this.$description.value.forEach((item) => {
        this.$items.delete(item);
    })
    this.$description.value.clear();
};

FieldCollection.prototype.model = function(newValue) {
    if(Validator.isObservable(newValue)) {
        this.$description.value?.cleanup?.();
        this.$description.value = newValue;
        return this;
    }
    this.$description.value.set(newValue);
    return this;
};

FieldCollection.prototype.value = function() {
    return this.$description.value.map((item) => {
        return Validator.isObservable(item) ? item.val() : item;
    });
};

FieldCollection.prototype.validate = function(allValues) {
    const errors = [];
    const rowsValues = [];

    if(this.$items) {
        this.$description.value.forEach((dataItem) => {
            const row = this.$items.get(dataItem);
            const fields = Object.entries(row.fields);
            const itemValue = dataItem.val();
            rowsValues.push(itemValue);

            for(const [_, field] of fields) {
                const fieldErrors = field.validate({ ...itemValue, $parent: allValues });
                if(fieldErrors && fieldErrors.length) {
                    errors.push(fieldErrors);
                }
            }
        });
    }

    if(this.$description.rules) {
        for(const rule of this.$description.rules) {
            const paramsResolved = resolveParams(rule, allValues);
            console.log({ rule, paramsResolved });
            const result = rule.fn(rowsValues, ...paramsResolved, allValues);

            if (!result.valid) {
                errors.push(rule.message || result.message);
            }
        }
    }

    return errors;
};

FieldCollection.prototype.min = function(minCount, message) {
    if (typeof minCount !== 'number' || minCount < 0) {
        throw new NativeDocumentError('min() expects a positive number');
    }

    this.addRule(
        (values) => {
            const isValid = values.length >= minCount;
            return {
                valid: isValid,
                message: `Minimum ${minCount} item(s) required`
            };
        },
        [],
        message || `${this.$description.name} must have at least ${minCount} item(s)`
    );

    return this;
};

FieldCollection.prototype.max = function(maxCount, message) {
    if (typeof maxCount !== 'number' || maxCount < 0) {
        throw new NativeDocumentError('max() expects a positive number');
    }

    this.addRule(
        (values) => {
            const isValid = values.length <= maxCount;
            return {
                valid: isValid,
                message: `Maximum ${maxCount} item(s) allowed`
            };
        },
        [],
        message || `${this.$description.name} must have at most ${maxCount} item(s)`
    );

    return this;
};

FieldCollection.prototype.required = function(message = '') {
    this.addRule(Validation.required, [], message || this.name+' is required');
    return this;
};

FieldCollection.prototype.reset = function() {
    this.clear();
    return this;
};

FieldCollection.prototype.layout = function(layout) {
    if(typeof layout !== 'function') {
        throw new NativeDocumentError(this.name+' FieldCollection Layout must be a function');
    }
    this.$description.layout = layout;
    return this;
};


FieldCollection.prototype.$build = function() {
    const layout = this.$description.layout || FieldCollection.defaultLayoutTemplate;
    if (!layout) {
        throw new NativeDocumentError(`Layout not defined for collection "${this.$description.name}"`);
    }

    const template = this.$description.template || FieldCollection.defaultTemplate;

    return layout({
        collection: this,
        data: this.$description.value,
        Template: template ? template.bind(this) : null
    });
};