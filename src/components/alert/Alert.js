import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DebugManager from "../../core/utils/debug-manager";

/**
 * Contextual feedback alert. Supports variants (info, success, warning, error), icons, closable/auto-dismiss, and action buttons.
 *
 *
 * @example
 * const alert = new Alert(Span('Operation completed successfully.'))
 *     .variant('success')
 *     .showIcon(true)
 *     .closable(true)
 *     .autoDismiss(5000)
 *     .action('Undo', () => console.log('undo'))
 *     .onClose(() => console.log('closed'));
 *
 * Alert.use((description, instance) => {
 *     // description.content, description.variant, description.actions...
 *     return Div({ class: \`alert alert--\${description.variant}\` }, description.content);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Alert(content, props = {}) {
    if(!(this instanceof Alert)) {
        return new Alert(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        title: null,
        content,
        outline: null,
        appearance: null,
        variant: 'info',
        closable: false,
        autoDismiss: null,
        icon: null,
        showIcon: true,
        actions: [],
        props,
    };
}

Alert.defaultTemplate = null;

/**
 * Registers the render template for Alert.
 * @param {(description: {
 *     title: NdChild|null,
 *     content: NdChild,
 *     outline: boolean|null,
 *     appearance: 'filled'|'bordered'|null,
 *     variant: 'info'|'success'|'warning'|'error'|'danger'|string,
 *     closable: boolean,
 *     autoDismiss: number|null,
 *     icon: NdChild|null,
 *     showIcon: boolean,
 *     actions: Array<{ label: NdChild, handler: Function|null, variant: string|null }>,
 *     props: GlobalAttributes,
 * }, instance: Alert) => NdChild} template
 */
Alert.use = function(template) {
    Alert.defaultTemplate = template;
};

BaseComponent.extends(Alert);
BaseComponent.use(Alert, HasEventEmitter);

/**
 * @param {string} name
 * @param {(a: Alert) => Alert} callback
 */
Alert.preset = function(name, callback) {
    if (Alert.prototype[name] || Alert[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Alert.`);
        return;
    }
    Alert[name] = (content, props) => callback(new Alert(content, props));
};

/**
 * @param {Record<string, (a: Alert) => Alert>} presets
 */
Alert.presets = function(presets) {
    for (const name in presets) {
        Alert.preset(name, presets[name]);
    }
};

/**
 * Sets the variant style for the alert
 * @param {string} variant - The variant name (info, success, warning, error, danger)
 * @returns {this}
 */
Alert.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

/**
 * Sets the alert variant to 'info'
 * @returns {this}
 */
Alert.prototype.info = function() {
    return this.variant('info');
};

/**
 * Sets the alert variant to 'success'
 * @returns {this}
 */
Alert.prototype.success = function() {
    return this.variant('success');
};

/**
 * Sets the alert variant to 'warning'
 * @returns {this}
 */
Alert.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * Sets the alert variant to 'error'
 * @returns {this}
 */
Alert.prototype.error = function() {
    return this.variant('error');
};

/**
 * Sets the alert variant to 'danger'
 * @returns {this}
 */
Alert.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * Sets the appearance type for the alert
 * @param {string} appearance - The style name (filled, bordered, outline)
 * @returns {this}
 */
Alert.prototype.appearance = function(appearance) {
    this.$description.appearance = appearance;
    return this;
};

/**
 * Sets the alert appearance to 'filled'
 * @returns {this}
 */
Alert.prototype.filled = function() {
    return this.appearance('filled');
};

/**
 * Sets the alert appearance to 'bordered'
 * @returns {this}
 */
Alert.prototype.bordered = function() {
    return this.appearance('bordered');
};

/**
 * Sets the alert appearance to 'outline'
 * @param {boolean} [outline=true] - Whether to use outline style
 * @returns {this}
 */
Alert.prototype.outline = function(outline = true) {
    return this.appearance('outline');
};

/**
 * Sets the title of the alert
 * @param {ValidChildren} title - The title content
 * @returns {this}
 */
Alert.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * Sets the content of the alert
 * @param {ValidChildren} content - The content to display
 * @returns {this}
 */
Alert.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * Sets the title render function
 * @param {Function} callback - Function to render the title
 * @returns {this}
 */
Alert.prototype.renderTitle = function(callback) {
    this.$description.renderTitle = callback;
    return this;
};

/**
 * Sets the content render function
 * @param {Function} callback - Function to render the content
 * @returns {this}
 */
Alert.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};

/**
 * Clears all actions from the alert
 * @returns {this}
 */
Alert.prototype.renderFooter = function(callback) {
    this.$description.renderFooter = callback;
    return this;
};

/**
 * @returns {this}
 */
Alert.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};

/**
 * Adds an action button to the alert
 * @param {string} label - The button label
 * @param {Function} handler - The click handler
 * @param {?string} variant - The button variant style
 * @returns {this}
 */
Alert.prototype.action = function(label, handler, variant = null) {
    handler = handler || ((_, instance) => instance.hide());
    this.$description.actions.push({ label, handler, variant });
    return this;
};

/**
 * Sets the layout function for the alert
 * @param {Function} layoutFn - Function to layout the alert
 * @returns {this}
 */
Alert.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

/**
 * Sets the icon for the alert
 * @param {ValidChildren} icon - The icon to display
 * @returns {this}
 */
Alert.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * Shows or hides the icon
 * @param {boolean} [show=true] - Whether to show the icon
 * @returns {this}
 */
Alert.prototype.showIcon = function(show = true) {
    this.$description.showIcon = show;
};

/**
 * Sets whether the alert can be closed
 * @param {boolean} [closable=true] - Whether the alert is closable
 * @returns {this}
 */
Alert.prototype.closable = function(closable = true) {
    this.$description.closable = !!closable;
    if(closable) {
        this.showIf(closable);
    }
    return this;
};

/**
 * Sets whether the alert is dismissible (alias for closable)
 * @param {boolean} [dismissible=true] - Whether the alert is dismissible
 * @returns {this}
 */
Alert.prototype.dismissible = function(dismissible = true) {
    return this.closable(dismissible);
};

/**
 * Sets auto-dismiss delay for the alert
 * @param {number} delay - Delay in milliseconds before auto-dismissing
 * @returns {this}
 */
Alert.prototype.autoDismiss = function(delay) {
    this.$description.autoDismiss = delay;
    return this;
};

/**
 * Closes the alert
 */
Alert.prototype.close = function() {
    this.$description.showIf?.set(false);
    this.emit('hide');
};

/**
 * Shows the alert
 */
Alert.prototype.show = function() {
    this.$description.showIf?.set(true);
    this.emit('show');
};

/**
 * Hides the alert
 */
Alert.prototype.hide = Alert.prototype.close;

/**
 * Registers a handler for the close event
 * @param {(element: Alert) => void} handler - The event handler
 * @returns {this}
 */
Alert.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * Registers a handler for the show event
 * @param {(element: Alert) => void} handler - The event handler
 * @returns {this}
 */
Alert.prototype.onShow = function(handler) {
    this.on('show', handler);
    return this;
};
