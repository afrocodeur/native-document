import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { Observable } from "../../core/data/Observable";
import {ElementCreator} from "../../core/wrappers/ElementCreator";
import {NDElement} from "../../core/wrappers/NDElement";
import DebugManager from "../../core/utils/debug-manager";
import HasFullPosition from "../$traits/has-position/HasFullPosition";

export default function Popover(content, props = {}) {
    if (!(this instanceof Popover)) {
        return new Popover(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        trigger: null,
        interaction: 'click',
        content,
        header: null,
        footer: null,
        isOpen: Observable(false),
        defaultOpen: false,
        modal: false,
        closeOnEscape: true,
        closeOnClickOutside: true,
        focusTrap: true,
        returnFocus: true,
        position: 'top',
        offset: 8,
        shift: {},
        arrow: true,
        data: null,
        renderContent: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        variant: null,
        matchTriggerWidth: null,
        matchTargetWidth: null,
        updatePositionOn: null,
        includeTriggerIntoGhost: true,
        props,
    };

    this.$element = null;

    if (this.$description.defaultOpen) {
        this.$description.isOpen.set(true);
    }
}

BaseComponent.extends(Popover);
BaseComponent.use(Popover, HasEventEmitter, HasFullPosition);

Popover.defaultTemplate = null;

Popover.use = function(template) {
    Popover.defaultTemplate = template;

    if(!NDElement.prototype.popover) {
        NDElement.prototype.popover = function(content, props) {
            this.ghostDom((content instanceof Popover)
                ? content.trigger(this.$element)
                : Popover(content, props).trigger(this.$element));
            return this;
        };
    }
    if(!BaseComponent.prototype.popover) {
        BaseComponent.prototype.popover = function(content, props) {
            this.postBuild(() => {
                if(content instanceof Popover) {
                    this.ghostDom(content.trigger(this.$element));
                } else {
                    this.ghostDom(Popover(content, props).trigger(this.$element));
                }
            })
            return this;
        };
    }

};



Popover.preset = function(name, callback) {
    if (Popover.prototype[name] || Popover[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Popover.`);
        return;
    }
    Popover[name] = (content, props) => callback(new Popover(content, props));
};

Popover.presets = function(presets) {
    for (const name in presets) {
        Popover.preset(name, presets[name]);
    }
};

Popover.prototype.trigger = function(trigger) {
    this.$description.trigger = ElementCreator.getChild(trigger);
    return this;
};

Popover.prototype.interaction = function(interaction) {
    this.$description.interaction = interaction;
};

Popover.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

Popover.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

Popover.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
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

Popover.prototype.offset = function(offset) {
    this.$description.offset = offset;
    return this;
};

Popover.prototype.arrow = function(arrow = true) {
    this.$description.arrow = arrow;
    return this;
};

Popover.prototype.shift = function(shift) {
    this.$description.shift = shift;
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

Popover.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Popover.prototype.primary = function() {
    this.$description.variant = 'primary';
    return this;
};

Popover.prototype.success = function() {
    this.$description.variant = 'success';
    return this;
};

Popover.prototype.warning = function() {
    this.$description.variant = 'warning';
    return this;
};

Popover.prototype.danger = function() {
    this.$description.variant = 'danger';
    return this;
};

Popover.prototype.info = function() {
    this.$description.variant = 'info';
    return this;
};
Popover.prototype.matchTriggerWidth = function() {
    this.$description.matchTriggerWidth = true;
    return this;
};
Popover.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};