import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { Observable } from "../../core/data/Observable";
import {NDElement} from "../../core/wrappers/NDElement";
import HasDraggable from "../$traits/has-draggable/HasDraggable";
import HasResizable from "../$traits/has-resizable/HasResizable";
import DebugManager from "../../core/utils/debug-manager";

/**
 * Dialog overlay with header, content, and footer slots. Supports draggable, resizable, scroll lock, focus trap, and close-on-backdrop/escape.
 *
 *
 * @example
 * const modal = new Modal(Div('Modal body content'))
 *     .title(Span('Confirm deletion'))
 *     .footer(HStack(cancelBtn, confirmBtn))
 *     .size('medium')
 *     .centered()
 *     .closeOnEscape(true)
 *     .closable(true)
 *     .focusTrap(true)
 *     .onOpen(() => console.log('opened'))
 *     .onClose(() => console.log('closed'));
 *
 * // Attach to trigger
 * const triggerEl = modal.trigger(Button(Span('Open')));
 *
 * Modal.use((description, instance) => {
 *     return Div(
 *         { class: 'modal' },
 *         description.title,
 *         description.content,
 *         description.footer
 *     );
 * });
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function Modal(content, props = {}) {
    if(!(this instanceof Modal)) {
        return new Modal(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        centered: true,
        scrollable: false,
        title: null,
        content,
        footer: null,
        size: null,
        closeOnBackdrop: true,
        closeOnEscape: true,
        closable: true,
        layout: null,
        fullscreen: false,
        draggable: false,
        dragByHeader: true,
        resizable: false,
        resizableOptions: { size: {} },
        focusTrap: true,
        lockScroll: true,
        isOpen: Observable(false),
        variant: null,
        props
    };
}

BaseComponent.extends(Modal);
BaseComponent.use(Modal, HasEventEmitter, HasDraggable, HasResizable);

// Theming
Modal.defaultTemplate = null;

/**
 * Registers the render template for Modal.
 * @param {(description: {
 *     centered: boolean,
 *     scrollable: boolean,
 *     title: NdChild|null,
 *     content: NdChild,
 *     footer: NdChild|null,
 *     size: 'small'|'medium'|'large'|'extra-large'|'fullscreen'|null,
 *     closeOnBackdrop: boolean,
 *     closeOnEscape: boolean,
 *     closable: boolean,
 *     layout: ((desc: *, instance: Modal) => NdChild)|null,
 *     fullscreen: boolean,
 *     draggable: boolean,
 *     dragByHeader: boolean,
 *     resizable: boolean,
 *     focusTrap: boolean,
 *     lockScroll: boolean,
 *     isOpen: Observable<boolean>,
 *     variant: string|null,
 *     props: GlobalAttributes,
 * }, instance: Modal) => NdChild} template
 */
Modal.use = function(template) {
    Modal.defaultTemplate = template;

    if(!NDElement.prototype.modal) {
        NDElement.prototype.modal = function(content, props) {
            const modal = (content instanceof Modal) ? content : Modal(content, props);
            modal.toNdElement();
            this.onClick(() => modal.open());
            return this;
        };
    }
    if(!BaseComponent.prototype.modal) {
        BaseComponent.prototype.modal = function(content, props) {
            this.postBuild(() => {
                const modal = (content instanceof Modal) ? content : Modal(content, props);
                modal.toNdElement();
                this.nd.onClick(() => modal.open());
            });
            return this;
        };
    }
};

/**
 * @param {HTMLElement|NDElement} trigger
 * @returns {HTMLElement|NDElement}
 */
Modal.prototype.trigger = function(trigger) {
    this.toNdElement();
    trigger.nd.onClick(() => this.open());
    return trigger;
};

/**
 * @param {string} name
 * @param {(m: Modal) => Modal} callback
 */
Modal.preset = function(name, callback) {
    if (Modal.prototype[name] || Modal[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Modal.`);
        return;
    }
    Modal[name] = (content, props) => callback(new Modal(content, props));
};

/**
 * @param {Record<string, (m: Modal) => Modal>} presets
 */
Modal.presets = function(presets) {
    for (const name in presets) {
        Modal.preset(name, presets[name]);
    }
};

/**
 * @returns {void}
 */
Modal.prototype.open = function() {
    this.emit('beforeOpen');
    this.$description.isOpen.set(true);
    this.emit('open');
};

/**
 * @returns {void}
 */
Modal.prototype.close = function() {
    this.emit('beforeClose');
    this.$description.isOpen.set(false);
    this.emit('close');
};

/**
 * @returns {boolean}
 */
Modal.prototype.isOpen = function() {
    return this.$description.isOpen.val();
};

/**
 * @returns {boolean}
 */
Modal.prototype.isClose = function() {
    return !this.isOpen();
};

// Configuration
/**
 * @param {NdChild} title
 * @returns {this}
 */
Modal.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
Modal.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {NdChild} footer
 * @returns {this}
 */
Modal.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

/**
 * @param {'small'|'medium'|'large'|'extra-large'|'fullscreen'} size
 * @returns {this}
 */
Modal.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @returns {this}
 */
Modal.prototype.small = function() {
    return this.size('small');
};

/**
 * @returns {this}
 */
Modal.prototype.medium = function() {
    return this.size('medium');
};

/**
 * @returns {this}
 */
Modal.prototype.large = function() {
    return this.size('large');
};

/**
 * @returns {this}
 */
Modal.prototype.extraLarge = function() {
    return this.size('extra-large');
};

/**
 * @returns {this}
 */
Modal.prototype.fullscreen = function() {
    return this.size('fullscreen');
};

/**
 * @returns {this}
 */
Modal.prototype.centered = function() {
    this.$description.centered = true;
    return this;
};

/**
 * @param {boolean} scrollable
 * @returns {this}
 */
Modal.prototype.scrollable = function(scrollable = true) {
    this.$description.scrollable = scrollable;
    return this;
};

/**
 * @param {boolean} enabled
 * @returns {this}
 */
Modal.prototype.closeOnBackdrop = function(enabled = true) {
    this.$description.closeOnBackdrop = enabled;
    return this;
};

/**
 * @param {boolean} enabled
 * @returns {this}
 */
Modal.prototype.closeOnEscape = function(enabled = true) {
    this.$description.closeOnEscape = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
Modal.prototype.closable = function(enabled = true) {
    this.$description.closable = enabled;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onBeforeOpen = function(handler) {
    this.on('beforeOpen', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onBeforeClose = function(handler) {
    this.on('beforeClose', handler);
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Modal.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Modal.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Modal.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} layoutFn
 * @returns {this}
 */
Modal.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

Modal.prototype.fullscreen = function(fullscreen = true) {
    this.$description.fullscreen = fullscreen;
    return this;
};

/**
 * @returns {this}
 */
Modal.prototype.draggable = function() {
    this.$description.draggable = true;
    return this;
};

/**
 * @returns {this}
 */
Modal.prototype.dragByHeader = function() {
    this.$description.dragByHeader = true;
    return this;
};

/**
 * @param {{ directions?: string[], size?: { minWidth?: number, maxWidth?: number, minHeight?: number, maxHeight?: number } }} [options={}]
 * @returns {this}
 */
Modal.prototype.resizable = function(options = {}) {
    this.$description.resizable = true;
    for(const key in options) {
        this.$description.resizableOptions[key] = options[key];
    }
    return this;
};

/**
 * @param {string[]} directions
 * @returns {this}
 */
Modal.prototype.resizeDirections = function(directions) {
    this.$description.resizableOptions.directions = directions;
    return this;
};

/**
 * @param {*} minWidth
 * @returns {this}
 */
Modal.prototype.minWidth = function(minWidth) {
    this.$description.resizableOptions.size.minWidth = minWidth;
    return this;
};

/**
 * @param {*} maxWidth
 * @returns {this}
 */
Modal.prototype.maxWidth = function(maxWidth) {
    this.$description.resizableOptions.size.maxWidth = maxWidth;
    return this;
};

/**
 * @param {*} minHeight
 * @returns {this}
 */
Modal.prototype.minHeight = function(minHeight) {
    this.$description.resizableOptions.size.minHeight = minHeight;
    return this;
};

/**
 * @param {*} maxHeight
 * @returns {this}
 */
Modal.prototype.maxHeight = function(maxHeight) {
    this.$description.resizableOptions.size.maxHeight = maxHeight;
    return this;
};

/**
 * @param {*} focusTrap
 * @returns {this}
 */
Modal.prototype.focusTrap = function(focusTrap = true) {
    this.$description.focusTrap = focusTrap;
    return this;
};

/**
 * @param {*} lockScroll
 * @returns {this}
 */
Modal.prototype.lockScroll = function(lockScroll = true) {
    this.$description.lockScroll = lockScroll;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onDragStart = function(handler) {
    this.on('onDragStart', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onDrag = function(handler) {
    this.on('onDrag', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onDragEnd = function(handler) {
    this.on('onDragEnd', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onResizeStart = function(handler) {
    this.on('onResizeStart', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onResize = function(handler) {
    this.on('onResize', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
Modal.prototype.onResizeEnd = function(handler) {
    this.on('onResizeEnd', handler);
    return this;
};