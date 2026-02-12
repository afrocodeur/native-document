import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";

/**
 * Component for displaying alert messages with various styles and variants
 * @param {ValidChildren} message - The alert message content
 * @param {{ title?: ValidChildren, content?: ValidChildren, outline?: boolean, style?: string, variant?: string, closable?: boolean, autoDismiss?: number, icon?: ValidChildren, showIcon?: boolean }} config - Configuration object
 * @class
 */
export default function Alert(message, config = {}) {
    if(!(this instanceof Alert)) {
        return new Alert(message, config);
    }
    this.$description = {
        title: null,
        content: message,
        outline: null,
        style: null,
        variant: 'info',
        closable: false,
        autoDismiss: null,
        icon: null,
        showIcon: true,
        ...config
    };
}

Alert.defaultTemplate = null;
Alert.defaultTitleTemplate = null;
Alert.defaultButtonsTemplate = null;
Alert.defaultContentTemplate = null;

/**
 * Sets the default template for all Alert instances
 * @param {{alert: (alert: Alert) => ValidChildren, alertContent: (alert: Alert) => ValidChildren, alertButtons: (alert: Alert) => ValidChildren, alertTitle: (alert: Alert) => ValidChildren}} template - Template object containing alert factory function
 */
Alert.use = function(template) {
    Alert.defaultTemplate = template.alert;
    Alert.defaultTitleTemplate = template.alertTitle;
    Alert.defaultButtonsTemplate = template.alertButtons;
    Alert.defaultContentTemplate = template.alertContent;
};

BaseComponent.extends(Alert, EventEmitter);

/**
 * Sets the variant style for the alert
 * @param {string} variant - The variant name (info, success, warning, error, danger)
 * @returns {Alert}
 */
Alert.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * Sets the alert variant to 'info'
 * @returns {Alert}
 */
Alert.prototype.info = function() {
    return this.variant('info');
};

/**
 * Sets the alert variant to 'success'
 * @returns {Alert}
 */
Alert.prototype.success = function() {
    return this.variant('success');
};

/**
 * Sets the alert variant to 'warning'
 * @returns {Alert}
 */
Alert.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * Sets the alert variant to 'error'
 * @returns {Alert}
 */
Alert.prototype.error = function() {
    return this.variant('error');
};

/**
 * Sets the alert variant to 'danger'
 * @returns {Alert}
 */
Alert.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * Sets the style type for the alert
 * @param {string} style - The style name (filled, bordered, outline)
 * @returns {Alert}
 */
Alert.prototype.style = function(style) {
    this.$description.style = style;
    return this;
};

/**
 * Sets the alert style to 'filled'
 * @returns {Alert}
 */
Alert.prototype.filled = function() {
    return this.style('filled');
};

/**
 * Sets the alert style to 'bordered'
 * @returns {Alert}
 */
Alert.prototype.bordered = function() {
    return this.style('bordered');
};

/**
 * Sets the alert style to 'outline'
 * @param {boolean} [outline=true] - Whether to use outline style
 * @returns {Alert}
 */
Alert.prototype.outline = function(outline = true) {
    return this.style('outline');
};

/**
 * Sets the title of the alert
 * @param {ValidChildren} title - The title content
 * @returns {Alert}
 */
Alert.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * Sets the content of the alert
 * @param {ValidChildren} content - The content to display
 * @returns {Alert}
 */
Alert.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * Sets the title render function
 * @param {Function} callback - Function to render the title
 * @returns {Alert}
 */
Alert.prototype.renderTitle = function(callback) {
    this.$description.renderTitle = callback;
    return this;
};

/**
 * Sets the content render function
 * @param {Function} callback - Function to render the content
 * @returns {Alert}
 */
Alert.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};

/**
 * Clears all actions from the alert
 * @returns {Alert}
 */
Alert.prototype.renderFooter = function(callback) {
    this.$description.renderFooter = callback;
    return this;
};

/**
 * Adds an action button to the alert
 * @param {string} label - The button label
 * @param {Function} handler - The click handler
 * @returns {Alert}
 */
Alert.prototype.clearActions = function(label, handler) {
    this.$description.actions = [];
    return this;
};

/**
 * Adds an action button to the alert
 * @param {string} label - The button label
 * @param {Function} handler - The click handler
 * @returns {Alert}
 */
Alert.prototype.action = function(label, handler) {
    this.$description.actions.push({label, handler});
    return this;
};

/**
 * Sets the layout function for the alert
 * @param {Function} layoutFn - Function to layout the alert
 * @returns {Alert}
 */
Alert.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

/**
 * Sets the icon for the alert
 * @param {ValidChildren} icon - The icon to display
 * @returns {Alert}
 */
Alert.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * Shows or hides the icon
 * @param {boolean} [show=true] - Whether to show the icon
 * @returns {Alert}
 */
Alert.prototype.showIcon = function(show = true) {
    this.$description.showIcon = show;
};

/**
 * Sets whether the alert can be closed
 * @param {boolean} [closable=true] - Whether the alert is closable
 * @returns {Alert}
 */
Alert.prototype.closable = function(closable = true) {
    this.$description.closable = closable;
    return this;
};

/**
 * Sets whether the alert is dismissible (alias for closable)
 * @param {boolean} [dismissible=true] - Whether the alert is dismissible
 * @returns {Alert}
 */
Alert.prototype.dismissible = function(dismissible = true) {
    return this.closable(dismissible);
};

/**
 * Sets auto-dismiss delay for the alert
 * @param {number} delay - Delay in milliseconds before auto-dismissing
 * @returns {Alert}
 */
Alert.prototype.autoDismiss = function(delay) {
    this.$description.autoDismiss = delay;
    return this;
};

/**
 * Closes the alert
 */
Alert.prototype.close = function() {

};

/**
 * Shows the alert
 */
Alert.prototype.show = function() {

};

/**
 * Hides the alert
 */
Alert.prototype.hide = function() {

};

/**
 * Registers a handler for the close event
 * @param {(element: Alert) => void} handler - The event handler
 * @returns {Alert}
 */
Alert.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * Registers a handler for the show event
 * @param {(element: Alert) => void} handler - The event handler
 * @returns {Alert}
 */
Alert.prototype.onShow = function(handler) {
    this.on('show', handler);
    return this;
};

/**
 * Sets the render function for the entire alert
 * @param {(alert: Alert, sections: {title: ValidChildren, content: ValidChildren, footer: ValidChildren, icon: ValidChildren}) => ValidChildren} renderFn - Function to render the alert
 * @returns {Alert}
 */
Alert.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Alert.prototype.$build = function() {

};

Alert.prototype.toNdElement = function() {};
