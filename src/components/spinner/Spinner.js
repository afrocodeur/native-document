import BaseComponent from "../BaseComponent";
import DebugManager from "../../core/utils/debug-manager";

export default function Spinner(props = {}) {
    if (!(this instanceof Spinner)) {
        return new Spinner(props);
    }

    this.$description = {
        type: 'circle',
        variant: 'primary',
        color: null,
        size: 'small',
        label: null,
        labelPosition: null,
        overlay: null,
        backdrop: null,
        render: null,
        speed: 'normal',
        fullScreenOverlay: null,
        props
    };
}

Spinner.defaultTemplate = null;
Spinner.use = function(template) {
    Spinner.defaultTemplate = template;
};

BaseComponent.extends(Spinner);

Spinner.preset = function(name, callback) {
    if (Spinner.prototype[name] || Spinner[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Spinner.`);
        return;
    }
    Spinner[name] = (props) => callback(new Spinner(props));
};

Spinner.presets = function(presets) {
    for (const name in presets) {
        Spinner.preset(name, presets[name]);
    }
};

Spinner.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

Spinner.prototype.circle = function() {
    return this.type('circle');
};
Spinner.prototype.dots = function() {
    return this.type('dots');
};
Spinner.prototype.bars = function() {
    return this.type('bars');
};
Spinner.prototype.pulse = function() {
    return this.type('pulse');
};
Spinner.prototype.ring = function() {
    return this.type('ring');
};

/**
 * @param {string|int} size
 * @returns {Spinner}
 */
Spinner.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Spinner.prototype.extraSmall = function() {
    return this.size('extra-small');
};
Spinner.prototype.small = function() {
    return this.size('small');
};
Spinner.prototype.medium = function() {
    return this.size('medium');
};
Spinner.prototype.large = function() {
    return this.size('large');
};
Spinner.prototype.extraLarge = function() {
    return this.size('extra-large');
};

Spinner.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};
Spinner.prototype.primary = function() {
    return this.variant('primary');
};
Spinner.prototype.secondary = function() {
    return this.variant('secondary');
};
Spinner.prototype.success = function() {
    return this.variant('success');
};
Spinner.prototype.danger = function() {
    return this.variant('danger');
};
Spinner.prototype.warning = function() {
    return this.variant('warning');
}
Spinner.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};

Spinner.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};
Spinner.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};
Spinner.prototype.labelAtTop = function() {
    return this.labelPosition('top');
};
Spinner.prototype.labelAtBottom = function() {
    return this.labelPosition('bottom');
};
Spinner.prototype.labelAtLeft = function() {
    return this.labelPosition('left');
};
Spinner.prototype.labelAtRight = function() {
    return this.labelPosition('right');
};

Spinner.prototype.overlay = function(enabled = true) {
    this.$description.overlay = enabled;
    return this;
};
Spinner.prototype.fullscreen = function() {
    this.$description.fullScreenOverlay = true;
    return this.overlay(true);
};
Spinner.prototype.backdrop = function(enabled = true) {
    this.$description.overlay = true;
    this.$description.backdrop = enabled;
    return this;
};

/**
 *
 * @param {string|int} speed
 * @returns {Spinner}
 */
Spinner.prototype.speed = function(speed) {
    this.$description.speed = speed;
    return this;
};
Spinner.prototype.slow = function() {
    return this.speed('slow');
};
Spinner.prototype.normal = function() {
    return this.speed('normal');
};
Spinner.prototype.fast = function() {
    return this.speed('fast');
};
Spinner.prototype.loading = function(isLoading) {
    this.showIf(isLoading);
    return this;
};
Spinner.prototype.bind = Spinner.prototype.loading;

Spinner.prototype.show = function() {
    this.$description.loading?.set(true);
};
Spinner.prototype.hide = function() {
    this.$description.loading?.set(false);
};