import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import AccordionItem from './types/AccordionItem';

/**
 * Collapsible accordion component. Manages a list of AccordionItem instances with expand/collapse behaviour.
 *
 *
 * @example
 * const accordion = new Accordion()
 *     .item('Section 1', Div('Content of section 1'))
 *     .item('Section 2', Div('Content of section 2'))
 *     .multiple(true)
 *     .variant('bordered');
 *
 * Accordion.use((description, instance) => {
 *     // description.$items, description.multiple, description.variant...
 *     return Div({ class: 'my-accordion' }, description.items);
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Accordion(props = {}) {
    if (!(this instanceof Accordion)) {
        return new Accordion(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        items: [],
        multiple: null,
        variant: null,
        renderContent: null,
        renderIndicator: null,
        props,
    };
}

BaseComponent.extends(Accordion);
BaseComponent.use(Accordion, HasEventEmitter);

Accordion.defaultTemplate = null;

/**
 * Registers the render template for Accordion.
 * @param {(description: {
 *     items: AccordionItem[],
 *     multiple: boolean|null,
 *     variant: string|null,
 *     renderContent: ((desc: *, instance: Accordion) => NdChild)|null,
 *     renderIndicator: ((desc: *, instance: Accordion) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Accordion) => NdChild} template
 */
Accordion.use = function(template) {
    Accordion.defaultTemplate = template;
};


/**
 * @param {NdChild|AccordionItem} title
 * @param {NdChild} [content]
 * @param {GlobalAttributes|((item: AccordionItem) => void)} [options]
 * @returns {this}
 */
Accordion.prototype.item = function(title, content, options) {
    let item = null;

    if(title instanceof AccordionItem) {
        item = title;
    }
    else {
        const config = typeof options === 'object' ? options : {};
        item = new AccordionItem(config);
        item.title(title);
        item.content(content);
        item.setDescription(config);
    }

    if(typeof options === 'function') {
        options(item);
    }

    this.$description.items.push(item);
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
 * Sets the indicator render function
 * @param {Function} renderFn - Function to render the indicator
 * @returns {AccordionItem}
 */
Accordion.prototype.renderIndicator = function(renderFn) {
    this.$description.renderIndicator = renderFn;
    return this;
};