import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";

export default function Popover(config = {}) {
    if (!(this instanceof Popover)) {
        return new Popover(config);
    }

    this.$description = {
        trigger: null,
        content: null,
        header: null,
        footer: null,
        isOpen: $(false),
        defaultOpen: false,
        modal: false,
        closeOnEscape: true,
        closeOnClickOutside: true,
        focusTrap: true,
        returnFocus: true,
        position: 'bottom',
        offset: [0, 8],
        data: null,
        renderContent: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        ...config,
    };

    this.$element = null;

    if (this.$description.defaultOpen) {
        this.$description.isOpen.set(true);
    }
}

BaseComponent.extends(Popover, EventEmitter);

Popover.defaultTemplate = null;

Popover.use = function(template) {
    Popover.defaultTemplate = template.popover;
};

Popover.prototype.trigger = function(trigger) {
    if (trigger instanceof PopoverTrigger) {
        this.$description.trigger = trigger.toJSON();
    } else {
        this.$description.trigger = trigger;
    }
    return this;
};

Popover.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Popover.prototype.header = function(header) {
    this.$description.header = header;
    return this;
};

Popover.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

Popover.prototype.closeOnEscape = function(closeOnEscape = true) {
    this.$description.closeOnEscape = closeOnEscape;
    return this;
};

Popover.prototype.closeOnClickOutside = function(closeOnClickOutside = true) {
    this.$description.closeOnClickOutside = closeOnClickOutside;
    return this;
};

Popover.prototype.focusTrap = function(trap = true) {
    this.$description.focusTrap = trap;
    return this;
};

Popover.prototype.returnFocus = function(returnFocus = true) {
    this.$description.returnFocus = returnFocus;
    return this;
};

Popover.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

Popover.prototype.atTop = function() {
    return this.position('top');
};
Popover.prototype.atBottom = function() {
    return this.position('bottom');
};
Popover.prototype.atLeft = function() {
    return this.position('left');
};
Popover.prototype.atRight = function() {
    return this.position('right');
};
Popover.prototype.atTopStart = function() {
    return this.position('top-start');
};
Popover.prototype.atTopEnd = function() {
    return this.position('top-end');
};
Popover.prototype.atBottomStart = function() {
    return this.position('bottom-start');
};
Popover.prototype.atBottomEnd = function() {
    return this.position('bottom-end');
};

Popover.prototype.offset = function(skidding, distance) {
    this.$description.offset = [skidding, distance];
    return this;
};

Popover.prototype.bindOpen = function(observable) {
    this.$description.isOpen = observable;
    return this;
};

Popover.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

Popover.prototype.open = function() {
    this.$description.isOpen.set(true);
    this.emit('open');
    return this;
};

Popover.prototype.close = function() {
    this.$description.isOpen.set(false);
    this.emit('close');
    return this;
};

Popover.prototype.toggle = function() {
    this.$description.isOpen.val() ? this.close() : this.open();
    return this;
};

Popover.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

Popover.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Popover.prototype.renderTrigger = function(renderFn) {
    this.$description.renderTrigger = renderFn;
    return this;
};

Popover.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};

Popover.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

Popover.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};

Popover.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};