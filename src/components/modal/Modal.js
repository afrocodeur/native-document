import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";


export default function Modal(config = {}) {
    if(!(this instanceof Modal)) {
        return new Modal(config);
    }

    this.$description = {
        centered: true,
        scrollable: false,
        title: null,
        content: null,
        footer: null,
        size: null,
        closeOnBackdrop: true,
        closeOnEscape: true,
        closable: true,
        layout: null,
        ...config
    };
}

BaseComponent.extends(Modal, EventEmitter);

// Theming
Modal.defaultLayout = null;
// Modal.defaultBackdrop = null;
Modal.defaultOverlay = null;
Modal.defaultHeaderTemplate = null;
Modal.defaultContentTemplate = null;
Modal.defaultFooterTemplate = null;
Modal.use = function(template) {};


Modal.prototype.open = function() {};
Modal.prototype.close = function() {};
Modal.prototype.isOpen = function() {};
Modal.prototype.isClose = function() {};

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
Modal.prototype.scrollable = function() {
    this.$description.scrollable = true;
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

Modal.prototype.$buildHeader = function() {

};

Modal.prototype.$buildContent = function() {

};

Modal.prototype.$buildFooter = function() {

};

Modal.prototype.$build = function() {

};

Modal.prototype.toNdElement = function() {

};