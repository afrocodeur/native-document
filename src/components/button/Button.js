import BaseComponent from "@components/BaseComponent";
import { Button as NativeButton } from "@elements";

export default function Button(label, config = {}) {
    if(!(this instanceof Button)) {
        return new Button(label, config);
    }

    BaseComponent.call(this, config);

    this.$description = {
        label: label,
        type: null,
        variant: null,
        size: null,
        icon: null,
        iconPosition: null,
        loading: null,
        disabled: null,
        template: null,
        block: null,
        borderRadiusType: null,
        outline: null,
    };

    this.$element = null;
}

Button.defaultTemplate = null;
Button.defaultLoaderTemplate = null;

Button.use = function(template = {}) {
    Button.defaultTemplate = template.button;
    Button.defaultLoaderTemplate = template.loader;
};

BaseComponent.extends(Button);

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

Button.prototype.icon = function(icon, iconPosition = 'left') {
    this.$description.icon = icon;
    this.$description.iconPosition = iconPosition;
    return this;
};

Button.prototype.iconAtLeft = function(position) {
    return this.iconPosition('left');
};
Button.prototype.iconAtRight = function(position) {
    return this.iconPosition('right');
};
Button.prototype.iconAtTop = function() {
    return this.iconPosition('top');
};

Button.prototype.iconAtBottom = function() {
    return this.iconPosition('bottom');
};

Button.prototype.iconOnly = function() {
    return this;
};

Button.prototype.loading = function(loading = true) {
    this.$description.loading = loading;
    return this;
}

Button.prototype.disable = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

Button.prototype.enable = function() {
    return this.disable(false);
};

Button.prototype.render = function(renderFunction) {
    this.$description.render = renderFunction;
    return this;
};

Button.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};
Button.prototype.circle = function() {
    this.$description.borderRadiusType = 'circle';
    return this;
};
Button.prototype.pill = function() {
    this.$description.shape = 'circle';
    return this;
};
Button.prototype.smooth = function() {
    this.$description.shape = 'smooth';
    return this;
};
Button.prototype.block = function() {
    this.$description.block = true;
    return this;
};

Button.prototype.$build = function() {
    if(this.$element) {
        return this.$element;
    }
    const renderFn = this.$description.render || Button.defaultTemplate;

    if(typeof renderFn === 'function') {
        this.$element = renderFn(this);
    }
    else {
        const props = {};
        this.$element = NativeButton(props, this.$description.label);
    }
    return this.$element;
};

Button.prototype.node = function() {
    return this.$build();
};

Button.prototype.toNdElement = function() {
    return this.$build();
};