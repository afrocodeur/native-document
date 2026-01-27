/**
 * Tooltip - Interface
 */

export default function Tooltip(target, content, config = {}) {
    if (!(this instanceof Tooltip)) {
        return new Tooltip(target, content, config);
    }

    this.$description = {
        title: null,
        content: null,
        position: 'top',
        trigger: 'hover',
        target: target,
        hideDelay: 0,
        arrow: true,
        interactive: true,
        variant: null,
        ...config,
    };
}

Tooltip.use = function(template) {};
Tooltip.defaultTemplate = null;

Tooltip.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};
Tooltip.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Tooltip.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};
Tooltip.prototype.top = function() {
    return this.position('top');
};
Tooltip.prototype.bottom = function() {
    return this.position('bottom');
};
Tooltip.prototype.left = function() {
    return this.position('left');
};
Tooltip.prototype.right = function() {
    return this.position('right');
};
Tooltip.prototype.auto = function() {
    return this.position('auto');
};

Tooltip.prototype.trigger = function(trigger, target = null) {
    this.$description.trigger = trigger;
    this.$description.target = target;
    return this;
};
Tooltip.prototype.showOnHover = function(target = null) {
    return this.trigger('hover', target);
};
Tooltip.prototype.showOnClick = function(target = null) {
    return this.trigger('click', target);
};
Tooltip.prototype.showOnFocus = function(target = null) {
    return this.trigger('focus', target);
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

Tooltip.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Tooltip.prototype.show = function() {};
Tooltip.prototype.hide = function() {};

Tooltip.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Tooltip.prototype.$build = function() {};
Tooltip.prototype.toNdElement = function() {};
