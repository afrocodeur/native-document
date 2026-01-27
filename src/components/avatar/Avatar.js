import {Validator} from "@core";
import BaseComponent from "@components/BaseComponent";

export default function Avatar(source, config = {}) {
    if (!(this instanceof Avatar)) {
        return new Avatar(config);
    }

    this.$description = {
        src: Validator.isObservable(source) ? source : $(null),
        alt: null,
        name: null,
        initials: null,
        icon: null,
        size: 'medium',
        shape: 'circle',
        variant: null,
        color: null,
        textColor: null,
        status: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(Avatar);

Avatar.defaultTemplate = null;
Avatar.use = function(template) {};

Avatar.prototype.onError = function(handler) {};

Avatar.prototype.src = function(src) {
    this.$description.src.set(src);
    return this;
};
Avatar.prototype.alt = function(alt) {
    this.$description.alt = alt;
    return this;
};
Avatar.prototype.name = function(name) {
    this.$description.name = name;
    return this;
};
Avatar.prototype.initials = function(initials) {
    this.$description.initials = initials;
    return this;
};
Avatar.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * @param {string|int} size
 * @returns {Avatar}
 */
Avatar.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};
Avatar.prototype.extraSmall = function() {
    return this.size('extra-small');
};
Avatar.prototype.small = function() {
    return this.size('small');
};
Avatar.prototype.medium = function() {
    return this.size('medium');
};
Avatar.prototype.large = function() {
    return this.size('large');
};
Avatar.prototype.extraLarge = function() {
    return this.size('extra-large');
};

Avatar.prototype.shape = function(shape) {
    this.$description.shape = shape;
    return this;
};
Avatar.prototype.circle = function() {
    return this.shape('circle');
};
Avatar.prototype.square = function() {
    return this.shape('square');
};
Avatar.prototype.rounded = function() {
    return this.shape('rounded');
};

Avatar.prototype.variant = function(variant) {
    this.$description.variant = variant;
}; // 'primary' | 'secondary' | 'success' | etc.
Avatar.prototype.primary = function() {
    return this.variant('primary');
};
Avatar.prototype.secondary = function() {
    return this.variant('secondary');
};
Avatar.prototype.success = function() {
    return this.variant('success');
};
Avatar.prototype.danger = function() {
    return this.variant('danger');
};
Avatar.prototype.warning = function() {
    return this.variant('warning');
};
Avatar.prototype.info = function() {
    return this.variant('info');
}
Avatar.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};
Avatar.prototype.textColor = function(color) {
    this.$description.textColor = color;
    return this;
};

Avatar.prototype.status = function(status) {
    this.$description.status = status;
    return this;
};
Avatar.prototype.statusPosition = function(position) {
    this.$description.statusPosition = position;
}; // 'top-right' | 'bottom-right' | etc.
Avatar.prototype.statusAtTopEnd = function() {
    return this.statusPosition('top-end');
};
Avatar.prototype.statusAtBottomEnd = function() {
    return this.statusPosition('bottom-end');
};
Avatar.prototype.statusAtTopStart = function() {
    return this.statusPosition('top-start');
};
Avatar.prototype.statusAtBottomStart = function() {
    return this.statusPosition('bottom-start');
};

Avatar.prototype.showStatus = function(show = true) {
    this.$description.showStatus = show;
    return this;
};

// Badge
Avatar.prototype.badge = function(content) {
    this.$description.badge = content;
    return this;
};
Avatar.prototype.badgePosition = function(position) {
    this.$description.badgePosition = position;
    return this;
};
Avatar.prototype.badgeAtTopEnd = function() {
    return this.badgePosition('top-end');
};
Avatar.prototype.badgeAtBottomEnd = function() {
    return this.badgePosition('bottom-end');
};
Avatar.prototype.badgeAtTopStart = function() {
    return this.badgePosition('top-start');
};
Avatar.prototype.badgeAtBottomStart = function() {
    return this.badgePosition('bottom-start');
};


Avatar.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Avatar.prototype.$build = function() {

};
Avatar.prototype.toNdElement = function() {};
