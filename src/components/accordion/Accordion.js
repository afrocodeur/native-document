import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";

export default function Accordion(config = {}) {
    if (!(this instanceof Accordion)) {
        return new Accordion(config);
    }

    this.$description = {
        items: [],
        multiple: null,
        variant: null,
        renderContent: null,
        ...config
    };
}

BaseComponent.extends(Accordion, EventEmitter);

Accordion.defaultTemplate = null;

Accordion.use = function(template) {};

Accordion.prototype.item = function(accordionItem) {
    this.$description.items.push(accordionItem);
    return this;
};

Accordion.prototype.items = function(items) {
    this.$description.items = items;
    return this;
};

Accordion.prototype.addItem = Accordion.prototype.item;

Accordion.prototype.removeItemById = function(id) {
    if (this.$description.items) {
        this.$description.items = this.$description.items.filter(item => item.id !== id);
    }
    return this;
};

Accordion.prototype.removeItem = function(item) {
    if (this.$description.items) {
        this.$description.items = this.$description.items.filter(item);
    }
    return this;
};


Accordion.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

Accordion.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

Accordion.prototype.bordered = function() {
    return this.variant('bordered');
};

Accordion.prototype.separated = function() {
    return this.variant('separated');
};

Accordion.prototype.flush = function() {
    return this.variant('flush');
};

Accordion.prototype.getByKey = function(key) {
    return this.$description.items.find(item => item.key === key);
};

Accordion.prototype.expanded = function(key, state = true) {
    const item = this.getByKey(key);
    if(item) {
        if (state && !this.$description.multiple) {
            this.collapseAll();
        }
        item.expanded(state);
        this.emit(state ? 'expand' : 'collapse', key, state);
    }
    return this;
};

Accordion.prototype.expandAll = function() {
    this.$description.items.forEach(item => item.expanded(true));
    return this;
};

Accordion.prototype.collapseAll = function() {
    this.$description.items.forEach(item => item.expanded(false));
    return this;
};

Accordion.prototype.isExpanded = function(key) {
    return this.getByKey(key)?.isExpanded?.();
};

Accordion.prototype.onExpand = function(handler) {
    this.on('expand', handler);
    return this;
};

Accordion.prototype.onCollapse = function(handler) {
    this.on('collapse', handler);
    return this;
};

Accordion.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

Accordion.prototype.$build = function() {
    // TODO: Implementation
    // this.$description.items.forEach(item => {
    //     item.onExpand(() => {
    //         if (!this.$description.multiple) {
    //             this.$description.items
    //                 .filter(i => i !== item)
    //                 .forEach(i => i.expanded(false));
    //         }
    //     });
    // });
};

Accordion.prototype.toNdElement = function() {
    return this.$build();
};