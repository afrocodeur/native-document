import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";


/**
 * Valid children types that can be rendered in the DOM
 * @typedef {HTMLElement|Text|DocumentFragment|string|Array<ValidChildren>} ValidChildren
 */

/**
 * Component for creating accordion interfaces with expandable/collapsible items
 * @param {{ items?: Array<AccordionItem>, multiple?: boolean, variant?: string, renderContent?: (field: Accordion) => HTMLElement }} config
 * @returns {Accordion}
 * @class
 */
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


/**
 * Sets the default template for all Accordion instances
 * @param {{accordion: (accordion: Accordion) => ValidChildren}} template - Template object containing accordion factory function
 */
Accordion.use = function(template) {
    Accordion.defaultTemplate = template.accordion;
};

/**
 * Adds an accordion item to the collection
 * @param {AccordionItem} accordionItem - The accordion item to add
 * @returns {Accordion}
 */
Accordion.prototype.item = function(accordionItem) {
    this.$description.items.push(accordionItem);
    return this;
};

/**
 * Sets the accordion items collection
 * @param {Array<AccordionItem>} items - Array of accordion items
 * @returns {Accordion}
 */
Accordion.prototype.items = function(items) {
    this.$description.items = items;
    return this;
};

/**
 * Alias for item method
 * @param {AccordionItem} accordionItem - The accordion item to add
 * @returns {Accordion}
 */
Accordion.prototype.addItem = Accordion.prototype.item;

/**
 * Removes an item by its id
 * @param {string} id - The id of the item to remove
 * @returns {Accordion}
 */
Accordion.prototype.removeItemById = function(id) {
    if (this.$description.items) {
        this.$description.items = this.$description.items.filter(item => item.id !== id);
    }
    return this;
};

/**
 * Removes items matching the filter function
 * @param {Function} filter - Filter function to determine which items to keep
 * @returns {Accordion}
 */
Accordion.prototype.remove = function(filter) {
    if (this.$description.items) {
        this.$description.items = this.$description.items.filter(filter);
    }
    return this;
};

/**
 * Enables or disables multiple items expansion
 * @param {boolean} [enabled=true] - Whether multiple items can be expanded simultaneously
 * @returns {Accordion}
 */
Accordion.prototype.multiple = function(enabled = true) {
    this.$description.multiple = enabled;
    return this;
};

/**
 * Sets the variant style for the accordion
 * @param {string} name - The variant name
 * @returns {Accordion}
 */
Accordion.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};

/**
 * Sets the accordion variant to 'bordered'
 * @returns {Accordion}
 */
Accordion.prototype.bordered = function() {
    return this.variant('bordered');
};

/**
 * Sets the accordion variant to 'separated'
 * @returns {Accordion}
 */
Accordion.prototype.separated = function() {
    return this.variant('separated');
};

/**
 * Sets the accordion variant to 'flush'
 * @returns {Accordion}
 */
Accordion.prototype.flush = function() {
    return this.variant('flush');
};

/**
 * Retrieves an accordion item by its key
 * @param {string} key - The key of the item to retrieve
 * @returns {AccordionItem|undefined}
 */
Accordion.prototype.getByKey = function(key) {
    return this.$description.items.find(item => item.key === key);
};

/**
 * Expands or collapses an accordion item by key
 * @param {string} key - The key of the item
 * @param {boolean} [state=true] - Whether to expand (true) or collapse (false)
 * @returns {Accordion}
 */
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

/**
 * Expands all accordion items
 * @returns {Accordion}
 */
Accordion.prototype.expandAll = function() {
    this.$description.items.forEach(item => item.expanded(true));
    return this;
};

/**
 * Collapses all accordion items
 * @returns {Accordion}
 */
Accordion.prototype.collapseAll = function() {
    this.$description.items.forEach(item => item.expanded(false));
    return this;
};

/**
 * Checks if an accordion item is expanded
 * @param {string} key - The key of the item to check
 * @returns {boolean|undefined}
 */
Accordion.prototype.isExpanded = function(key) {
    return this.getByKey(key)?.isExpanded?.();
};

/**
 * Registers a handler for the expand event
 * @param {Function} handler - The event handler
 * @returns {Accordion}
 */
Accordion.prototype.onExpand = function(handler) {
    this.on('expand', handler);
    return this;
};

/**
 * Registers a handler for the collapse event
 * @param {Function} handler - The event handler
 * @returns {Accordion}
 */
Accordion.prototype.onCollapse = function(handler) {
    this.on('collapse', handler);
    return this;
};

/**
 * Sets the content render function
 * @param {Function} renderFn - Function to render content
 * @returns {Accordion}
 */
Accordion.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * Builds the accordion component
 * @private
 */
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