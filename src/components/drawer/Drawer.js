import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import DebugManager from '../../core/utils/debug-manager';

/**
 * Side panel that slides in from an edge of the screen, with an overlay behind it.
 * Supports position (left, right, top, bottom), size, closable, footer actions,
 * and open/close lifecycle events.
 *
 *
 * @example
 * const drawer = new Drawer(Div('Drawer body content'))
 *     .title('Create ticket')
 *     .subtitle('This ticket will be visible for sale immediately')
 *     .position('right')
 *     .size('400px')
 *     .closable(true)
 *     .overlay(true)
 *     .action('Cancel', (_, instance) => instance.close())
 *     .action('Create ticket', () => console.log('create'), 'primary')
 *     .onClose(() => console.log('closed'));
 *
 * Drawer.use((description, instance) => {
 *     // description.content, description.position, description.actions...
 *     return Div({ class: `drawer drawer--${description.position}` }, description.content);
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Drawer(content = null, props = {}) {
    if(!(this instanceof Drawer)) {
        return new Drawer(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        title: null,
        subtitle: null,
        content,
        position: 'right',
        size: '400px',
        overlay: true,
        closeOnOverlayClick: true,
        closable: true,
        actions: [],
        renderContent: null,
        renderFooter: null,
        renderHeader: null,
        backdrop: true,
        isOpen: null,
        props,
    };
    this.aria = {
        'role': 'dialog',
        'aria-modal': 'true',
        'aria-hidden': 'true',
    };
}

Drawer.defaultTemplate = null;

/**
 * Registers the render template for Drawer.
 * @param {(description: {
 *     title: NdChild|null,
 *     subtitle: NdChild|null,
 *     content: NdChild,
 *     position: 'left'|'right'|'top'|'bottom',
 *     size: string,
 *     overlay: boolean,
 *     closeOnOverlayClick: boolean,
 *     closable: boolean,
 *     actions: Array<{ label: NdChild, handler: Function|null, variant: string|null }>,
 *     props: GlobalAttributes,
 * }, instance: Drawer) => NdChild} template
 */
Drawer.use = function(template) {
    Drawer.defaultTemplate = template;
};

BaseComponent.extends(Drawer);
BaseComponent.use(Drawer, HasEventEmitter);

/**
 * @param {string} name
 * @param {(d: Drawer) => Drawer} callback
 */
Drawer.preset = function(name, callback) {
    if (Drawer.prototype[name] || Drawer[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Drawer.`);
        return;
    }
    Drawer[name] = (content, props) => callback(new Drawer(content, props));
};

/**
 * @param {Record<string, (d: Drawer) => Drawer>} presets
 */
Drawer.presets = function(presets) {
    for (const name in presets) {
        Drawer.preset(name, presets[name]);
    }
};

/**
 * Sets which edge the drawer slides in from
 * @param {'left'|'right'|'top'|'bottom'} position
 * @returns {this}
 */
Drawer.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

/**
 * Sets the drawer to slide in from the left
 * @returns {this}
 */
Drawer.prototype.atLeft = function() {
    return this.position('left');
};

/**
 * Sets the drawer to slide in from the right
 * @returns {this}
 */
Drawer.prototype.atRight = function() {
    return this.position('right');
};

/**
 * Sets the drawer to slide in from the top
 * @returns {this}
 */
Drawer.prototype.atTop = function() {
    return this.position('top');
};

/**
 * Sets the drawer to slide in from the bottom
 * @returns {this}
 */
Drawer.prototype.atBottom = function() {
    return this.position('bottom');
};

/**
 * Sets the width (for left/right) or height (for top/bottom) of the drawer
 * @param {string} size - e.g. '400px', '30%'
 * @returns {this}
 */
Drawer.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * Sets the title of the drawer header
 * @param {ValidChildren} title
 * @returns {this}
 */
Drawer.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * Sets the subtitle shown under the title
 * @param {ValidChildren} subtitle
 * @returns {this}
 */
Drawer.prototype.subtitle = function(subtitle) {
    this.$description.subtitle = subtitle;
    return this;
};

/**
 * Sets the content of the drawer
 * @param {ValidChildren} content
 * @returns {this}
 */
Drawer.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * Sets the content render function
 * @param {Function} callback
 * @returns {this}
 */
Drawer.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};

/**
 * Sets the footer render function (defaults to the action buttons row)
 * @param {Function} callback
 * @returns {this}
 */
Drawer.prototype.renderFooter = function(callback) {
    this.$description.renderFooter = callback;
    return this;
};


/**
 * Sets the header render function (defaults titl, subtitle and close button)
 * @param {Function} callback
 * @returns {this}
 */
Drawer.prototype.renderHeader = function(callback) {
    this.$description.renderHeader = callback;
};

/**
 * Whether to render a dimmed overlay behind the drawer
 * @param {boolean} [overlay=true]
 * @returns {this}
 */
Drawer.prototype.overlay = function(overlay = true) {
    this.$description.overlay = !!overlay;
    return this;
};

/**
 * @param {Boolean} backdrop
 * @return {this}
 */
Drawer.prototype.overlay = function(backdrop = true) {
    this.$description.backdrop = !!backdrop;
    return this;
};

/**
 * Whether clicking the overlay closes the drawer
 * @param {boolean} [closeOnOverlayClick=true]
 * @returns {this}
 */
Drawer.prototype.closeOnOverlayClick = function(closeOnOverlayClick = true) {
    this.$description.closeOnOverlayClick = !!closeOnOverlayClick;
    return this;
};

/**
 * Whether the drawer shows a close (x) button and can be dismissed
 * @param {boolean} [closable=true]
 * @returns {this}
 */
Drawer.prototype.closable = function(closable = true) {
    this.$description.closable = !!closable;
    if(closable) {
        this.showIf(closable);
    }
    return this;
};

/**
 * @param {Observable} observable
 * @return {Drawer}
 */
Drawer.prototype.isOpen = function(observable) {
    this.$description.isOpen = observable;
    observable.subscribe((isOpen) => {
        this.emit(isOpen ? 'open' : 'close');
    });
    return this;
};

/**
 * Clears all footer action buttons
 * @returns {this}
 */
Drawer.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};

/**
 * Adds an action button to the drawer footer
 * @param {string} label - The button label
 * @param {Function} handler - The click handler
 * @param {?string} variant - The button variant style (e.g. 'primary', 'secondary')
 * @returns {this}
 */
Drawer.prototype.action = function(label, handler, variant = null) {
    handler = handler || ((_, instance) => instance.close());
    this.$description.actions.push({ label, handler, variant });
    return this;
};

/**
 * Opens the drawer
 */
Drawer.prototype.open = function() {
    if(this.$description.isOpen.val() === true) {
        return;
    }
    this.$description.isOpen.set(true);
};

/**
 * Closes the drawer
 */
Drawer.prototype.close = function() {
    if(this.$description.isOpen.val() === false) {
        return;
    }
    this.$description.isOpen.set(false);
};

/**
 * Alias for open()
 */
Drawer.prototype.show = Drawer.prototype.open;

/**
 * Alias for close()
 */
Drawer.prototype.hide = Drawer.prototype.close;

/**
 * Registers a handler for the open event
 * @param {(instance: Drawer) => void} handler
 * @returns {this}
 */
Drawer.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

/**
 * Registers a handler for the close event
 * @param {(instance: Drawer) => void} handler
 * @returns {this}
 */
Drawer.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};