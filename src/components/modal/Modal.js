import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { Observable } from "../../core/data/Observable";
import {NDElement} from "../../core/wrappers/NDElement";
import HasDraggable from "../$traits/has-draggable/HasDraggable";
import HasResizable from "../$traits/has-resizable/HasResizable";
import DebugManager from "../../core/utils/debug-manager";


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
        }
    }
};

Modal.prototype.trigger = function(trigger) {
    this.toNdElement();
    trigger.nd.onClick(() => this.open());
    return trigger;
};

Modal.preset = function(name, callback) {
    if (Modal.prototype[name] || Modal[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Modal.`);
        return;
    }
    Modal[name] = (content, props) => callback(new Modal(content, props));
};

Modal.presets = function(presets) {
    for (const name in presets) {
        Modal.preset(name, presets[name]);
    }
};


Modal.prototype.open = function() {
    this.emit('beforeOpen');
    this.$description.isOpen.set(true);
    this.emit('open');
};
Modal.prototype.close = function() {
    this.emit('beforeClose');
    this.$description.isOpen.set(false);
    this.emit('close');
};
Modal.prototype.isOpen = function() {
    return this.$description.isOpen.val();
};
Modal.prototype.isClose = function() {
    return !this.isOpen();
};

// Configuration
Modal.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};
Modal.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};
Modal.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

Modal.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Modal.prototype.small = function() {
    return this.size('small');
};
Modal.prototype.medium = function() {
    return this.size('medium');
};
Modal.prototype.large = function() {
    return this.size('large');
};
Modal.prototype.extraLarge = function() {
    return this.size('extra-large');
};
Modal.prototype.fullscreen = function() {
    return this.size('fullscreen');
};

Modal.prototype.centered = function() {
    this.$description.centered = true;
    return this;
};
Modal.prototype.scrollable = function(scrollable = true) {
    this.$description.scrollable = scrollable;
    return this;
};


Modal.prototype.closeOnBackdrop = function(enabled = true) {
    this.$description.closeOnBackdrop = enabled;
    return this;
};
Modal.prototype.closeOnEscape = function(enabled = true) {
    this.$description.closeOnEscape = enabled;
    return this;
};
Modal.prototype.closable = function(enabled = true) {
    this.$description.closable = enabled;
    return this;
};


Modal.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};
Modal.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};
Modal.prototype.onBeforeOpen = function(handler) {
    this.on('beforeOpen', handler);
    return this;
};
Modal.prototype.onBeforeClose = function(handler) {
    this.on('beforeClose', handler);
    return this;
};

Modal.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn
    return this;
};
Modal.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn
    return this;
};
Modal.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn
    return this;
};

Modal.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

Modal.prototype.fullscreen = function(fullscreen = true) {
    this.$description.fullscreen = fullscreen;
    return this;
};

Modal.prototype.draggable = function() {
    this.$description.draggable = true;
    return this;
};
Modal.prototype.dragByHeader = function() {
    this.$description.dragByHeader = true;
    return this;
};

Modal.prototype.resizable = function(options = {}) {
    this.$description.resizable = true;
    for(const key in options) {
        this.$description.resizableOptions[key] = options[key];
    }
    return this;
};
Modal.prototype.resizeDirections = function(directions) {
    this.$description.resizableOptions.directions = directions;
    return this;
};

Modal.prototype.minWidth = function(minWidth) {
    this.$description.resizableOptions.size.minWidth = minWidth;
    return this;
};

Modal.prototype.maxWidth = function(maxWidth) {
    this.$description.resizableOptions.size.maxWidth = maxWidth;
    return this;
};

Modal.prototype.minHeight = function(minHeight) {
    this.$description.resizableOptions.size.minHeight = minHeight;
    return this;
};

Modal.prototype.maxHeight = function(maxHeight) {
    this.$description.resizableOptions.size.maxHeight = maxHeight;
    return this;
};

Modal.prototype.focusTrap = function(focusTrap = true) {
    this.$description.focusTrap = focusTrap;
    return this;
};

Modal.prototype.lockScroll = function(lockScroll = true) {
    this.$description.lockScroll = lockScroll;
    return this;
};

Modal.prototype.onDragStart = function(handler) {
    this.on('onDragStart', handler);
    return this;
};

Modal.prototype.onDrag = function(handler) {
    this.on('onDrag', handler);
    return this;
};

Modal.prototype.onDragEnd = function(handler) {
    this.on('onDragEnd', handler);
    return this;
};
Modal.prototype.onResizeStart = function(handler) {
    this.on('onResizeStart', handler);
    return this;
};

Modal.prototype.onResize = function(handler) {
    this.on('onResize', handler);
    return this;
};

Modal.prototype.onResizeEnd = function(handler) {
    this.on('onResizeEnd', handler);
    return this;
};