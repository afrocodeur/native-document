import { $ } from '../../core/data/Observable';
import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";

/**
 * Represents an individual item within an Accordion component
 * @param {{ id?: string|number, title?: string, icon?: string, collapsible?: boolean, content?: ValidChildren, renderHeader?: Function, renderContent?: Function, render?: Function, expanded?: Observable<boolean>, disabled?: boolean }} config - Configuration object
 * @class
 */
export default function AccordionItem(props = {}) {
    if(!(this instanceof AccordionItem)){
        return new AccordionItem()
    }

    BaseComponent.call(this, props);

    this.$description = {
        id: null,
        title: null,
        icon: null,
        collapsible: true,
        content: null,
        renderHeader: null,
        renderIndicator: null,
        renderContent: null,
        render: null,
        expanded: $(false),
        disabled: $(false),
        props
    };
}

BaseComponent.extends(AccordionItem);
BaseComponent.use(AccordionItem, HasEventEmitter);

AccordionItem.defaultTemplate = null;
AccordionItem.use = function(template) {
    AccordionItem.defaultTemplate = template;
};

/**
 * Gets the id of the accordion item
 * @type {string}
 */
Object.defineProperty(AccordionItem.prototype, 'id', {
    get() {
        return this.$description.id;
    }
});

/**
 * Sets the identifier for the accordion item
 * @param {string|number} id - The unique identifier
 * @returns {AccordionItem}
 */
AccordionItem.prototype.identifyBy = function(id) {
    this.$description.id = id;
    return this;
};

/**
 * Sets the content of the accordion item
 * @param {ValidChildren} content - The content to display
 * @returns {AccordionItem}
 */
AccordionItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * Sets the title of the accordion item
 * @param {ValidChildren} title
 * @returns {AccordionItem}
 */
AccordionItem.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * Sets the icon for the accordion item
 * @param {ValidChildren} icon - The icon identifier or element
 * @returns {AccordionItem}
 */
AccordionItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * Shows or hides the expansion indicator
 * @param {boolean} [show=true] - Whether to show the indicator
 * @returns {AccordionItem}
 */
AccordionItem.prototype.showIndicator = function(show = true) {
    this.$description.showIndicator = show;
    return this;
}

/**
 * Sets whether the item can be collapsed
 * @param {boolean} [collapsible=true] - Whether the item is collapsible
 * @returns {AccordionItem}
 */
AccordionItem.prototype.collapsible = function(collapsible = true) {
    this.$description.collapsible = collapsible;
    return this;
};

/**
 * Expands or collapses the accordion item
 * @param {boolean} [expanded=true] - Whether to expand the item
 * @returns {AccordionItem}
 */
AccordionItem.prototype.expanded = function(expanded = true) {
    this.$description.expanded.set(expanded);
    if (this.$description.expanded.val()) {
        this.emit('expand');
    } else {
        this.emit('collapse');
    }
    return this;
};

/**
 * Toggles the expanded state of the accordion item
 * @returns {AccordionItem}
 */
AccordionItem.prototype.toggle = function() {
    return this.expanded(!this.$description.expanded.val());
};


/**
 * Sets the disabled state of the accordion item
 * @param {boolean} [disabled=true] - Whether the item is disabled
 * @returns {AccordionItem}
 */
AccordionItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled.set(disabled);
    return this;
};

/**
 * Checks if the accordion item is currently expanded
 * @returns {boolean}
 */
AccordionItem.prototype.isExpanded = function() {
    return this.$description.expanded.val();
};

/**
 * Registers a handler for the expand event
 * @param {Function} handler - The event handler
 * @returns {AccordionItem}
 */
AccordionItem.prototype.onExpand = function(handler) {
    this.on('expand', handler );
    return this;
};

/**
 * Registers a handler for the collapse event
 * @param {Function} handler - The event handler
 * @returns {AccordionItem}
 */
AccordionItem.prototype.onCollapse = function(handler) {
    this.on('collapse', handler);
    return this;
};

/**
 * Sets the header render function
 * @param {Function} renderFn - Function to render the header
 * @returns {AccordionItem}
 */
AccordionItem.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * Sets the content render function
 * @param {Function} renderFn - Function to render the content
 * @returns {AccordionItem}
 */
AccordionItem.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * Sets the indicator render function
 * @param {Function} renderFn - Function to render the indicator
 * @returns {AccordionItem}
 */
AccordionItem.prototype.renderIndicator = function(renderFn) {
    this.$description.renderIndicator = renderFn;
    return this;
};

