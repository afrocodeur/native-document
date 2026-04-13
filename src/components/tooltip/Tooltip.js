/**
 * Tooltip - Interface
 */
import {Observable} from "../../../index";
import {NDElement} from "../../core/wrappers/NDElement";
import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DebugManager from "../../core/utils/debug-manager";

export default function Tooltip(content, props = {}) {
    if (!(this instanceof Tooltip)) {
        return new Tooltip(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        trigger: null,
        interaction: 'hover',
        content,
        position: 'top',
        title: null,
        isOpen: Observable(false),
        offset: 8,
        shift: {},
        hideDelay: 0,
        arrow: true,
        interactive: true,
        variant: null,
        updatePositionOn: null,
        props,
    };
}

BaseComponent.extends(Tooltip);
BaseComponent.use(Tooltip, HasEventEmitter);

Tooltip.defaultTemplate = null;

Tooltip.use = function(template) {
    Tooltip.defaultTemplate = template;
    if(!NDElement.prototype.tooltip) {
        NDElement.prototype.tooltip = function(content, props) {
            this.ghostDom((content instanceof Tooltip)
                ? content.trigger(this.$element)
                : Tooltip(content, props).trigger(this.$element));
            return this;
        };
    }
    if(!BaseComponent.prototype.tooltip) {
        BaseComponent.prototype.tooltip = function(content, props) {
            this.postBuild(() => {
                if(content instanceof Tooltip) {
                    this.ghostDom(content.trigger(this.$element));
                } else {
                    this.ghostDom(Tooltip(content, props).trigger(this.$element));
                }
            });
            return this;
        };
    }
};

Tooltip.preset = function(name, callback) {
    if (Tooltip.prototype[name] || Tooltip[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Tooltip.`);
        return;
    }
    Tooltip[name] = (content, props) => callback(new Tooltip(content, props));
};

Tooltip.presets = function(presets) {
    for (const name in presets) {
        Tooltip.preset(name, presets[name]);
    }
};

Tooltip.prototype.trigger = function(trigger) {
    this.$description.trigger = trigger;
    return this;
};

Tooltip.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};
Tooltip.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};
Tooltip.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Tooltip.prototype.primary = function() {
    this.$description.variant = 'primary';
    return this;
};

Tooltip.prototype.success = function() {
    this.$description.variant = 'success';
    return this;
};

Tooltip.prototype.warning = function() {
    this.$description.variant = 'warning';
    return this;
};

Tooltip.prototype.danger = function() {
    this.$description.variant = 'danger';
    return this;
};

Tooltip.prototype.info = function() {
    this.$description.variant = 'info';
    return this;
};

Tooltip.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};
Tooltip.prototype.atTop = function() {
    this.$description.position = 'top';
    return this;
};
Tooltip.prototype.atBottom = function() {
    this.$description.position = 'bottom';
    return this;
};
Tooltip.prototype.atLeft = function() {
    this.$description.position = 'left';
    return this;
};
Tooltip.prototype.atRight = function() {
    this.$description.position = 'right';
    return this;
};

Tooltip.prototype.onClicked = function() {
    this.$description.interaction = 'click';
    return this;
};

Tooltip.prototype.onHovered = function() {
    this.$description.interaction = 'hover';
    return this;
};

Tooltip.prototype.onFocused = function() {
    this.$description.interaction = 'focus';
    return this;
};

Tooltip.prototype.hideDelay = function(ms) {
    this.$description.hideDelay = ms;
    return this;
};
Tooltip.prototype.arrow = function(enabled = true) {
    this.$description.arrow = enabled;
    return this;
};
Tooltip.prototype.interactive = function(isInteractive = true) {
    this.$description.interactive = isInteractive;
    return this;
}

Tooltip.prototype.open = function() {
    this.$description.isOpen.set(true);
    this.emit('open');
    return this;
};

Tooltip.prototype.close = function() {
    this.$description.isOpen.set(false);
    this.emit('close');
    return this;
};

Tooltip.prototype.toggle = function() {
    this.$description.isOpen.val() ? this.close() : this.open();
    return this;
};

Tooltip.prototype.onOpen = function(handler) {
    this.on('open', handler);
    return this;
};

Tooltip.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Tooltip.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Tooltip.prototype.offset = function(offset) {
    this.$description.offset = offset;
    return this;
};

Tooltip.prototype.shift = function(shift) {
    this.$description.shift = shift;
    return this;
};

Tooltip.prototype.updatePositionOn = function(updatePositionOn) {
    this.$description.updatePositionOn = updatePositionOn;
    return this;
};
