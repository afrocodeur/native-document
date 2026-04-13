import BaseComponent from "../BaseComponent";
import DebugManager from "../../core/utils/debug-manager";

export default function Button(label, props = {}) {
    if(!(this instanceof Button)) {
        return new Button(label, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        label: label,
        type: null,
        variant: null,
        size: null,
        icon: null,
        iconPosition: 'left',
        loading: null,
        disabled: null,
        template: null,
        block: null,
        borderRadiusType: null,
        outline: null,
        props
    };

    this.$element = null;
}

Button.defaultTemplate = null;

Button.use = function(template = {}) {
    Button.defaultTemplate = template;
};

BaseComponent.extends(Button);

Button.preset = function(name, callback) {
    if (Button.prototype[name] || Button[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Button.`);
        return;
    }
    Button[name] = (label, props) => callback(new Button(label, props));
};

Button.presets = function(presets) {
    for (const name in presets) {
        Button.preset(name, presets[name]);
    }
};

Button.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};

Button.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};
Button.prototype.primary = function() {
    return this.variant('primary');
};
Button.prototype.secondary = function() {
    return this.variant('secondary');
};
Button.prototype.danger = function() {
    return this.variant('danger');
};
Button.prototype.success = function() {
    return this.variant('success');
};
Button.prototype.warning = function() {
    return this.variant('warning');
};
Button.prototype.ghost = function() {
    return this.variant('ghost');
};
Button.prototype.link = function() {
    return this.variant('link');
};
Button.prototype.outline = function() {
    this.$description.outline = true;
    return this;
};

Button.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Button.prototype.small = function() {
    return this.size('small');
};
Button.prototype.large = function() {
    return this.size('large');
};
Button.prototype.medium = function() {
    return this.size('medium');
};

Button.prototype.icon = function(icon, iconPosition = 'leading') {
    this.$description.icon = icon;
    this.$description.iconPosition = iconPosition;
    return this;
};

Button.prototype.iconAtLeading = function() {
    this.$description.iconPosition = 'leading';
    return this;
};

Button.prototype.iconAtTrailing = function() {
    this.$description.iconPosition = 'trailing';
    return this;
};
Button.prototype.iconAtTop = function() {
    this.$description.iconPosition = 'top';
    return this;
};

Button.prototype.iconAtBottom = function() {
    this.$description.iconPosition = 'bottom';
    return this;
};

Button.prototype.iconOnly = function() {
    this.$description.iconOnly = true;
    return this;
};

Button.prototype.loading = function(loading = true) {
    this.$description.loading = BaseComponent.obs(loading);
    return this;
}

Button.prototype.disabled = function(disabled = true) {
    this.$description.disabled = BaseComponent.obs(disabled);
    return this;
};

Button.prototype.render = function(renderFunction) {
    this.$description.render = renderFunction;
    return this;
};

Button.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};
Button.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};
Button.prototype.circle = function() {
    this.$description.borderRadiusType = 'circle';
    return this;
};
Button.prototype.smooth = function() {
    this.$description.borderRadiusType = 'smooth';
    return this;
};
Button.prototype.block = function() {
    this.$description.block = true;
    return this;
};
