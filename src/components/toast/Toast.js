import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import {Observable} from "../../core/data/Observable";

export default function Toast(content, props = {}) {
    if (!(this instanceof Toast)) {
        return new Toast(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        visibility: Observable(true),
        type: null,
        title: null,
        content,
        icon: null,
        showIcon: true,
        duration: 5000,
        closable: true,
        pauseOnHover: true,
        position: 'top-trailing',
        actions: [],
        render: null,
        props
    };
}

BaseComponent.extends(Toast);
BaseComponent.use(Toast, HasEventEmitter);

Toast.defaultTemplate = null;
Toast.use = function(template) {
    Toast.defaultTemplate = template;
};

// Types
Toast.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};
Toast.prototype.info = function() {
    this.$description.type = 'info';
    return this;
};
Toast.prototype.success = function() {
    this.$description.type = 'success';
    return this;
};
Toast.prototype.warning = function() {
    this.$description.type = 'warning';
    return this;
};
Toast.prototype.error = function() {
    this.$description.type = 'error';
    return this;
};


Toast.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};
Toast.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Toast.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};
Toast.prototype.showIcon = function(show = true) {
    this.$description.showIcon = show;
    return this;
};

// Behavior
Toast.prototype.duration = function(ms) {
    this.$description.duration = ms;
    return this;
};
Toast.prototype.closable = function(closable = true) {
    this.$description.closable = closable;
    return this;
};
Toast.prototype.pauseOnHover = function(pauseOnHover = true) {
    this.$description.pauseOnHover = pauseOnHover;
    return this;
};

// Position
Toast.prototype.position = function(position) {
    this.$description.position = position;
    return this;
};

Toast.prototype.atTopLeading = function() {
    return this.position('top-leading');
};

Toast.prototype.atTopTrailing = function() {
    return this.position('top-trailing');
};
Toast.prototype.atBottomLeading = function() {
    return this.position('bottom-leading');
};
Toast.prototype.atBottomTrailing = function() {
    return this.position('bottom-trailing');
};
Toast.prototype.atTopCenter = function() {
    return this.position('top-center');
};
Toast.prototype.atBottomCenter = function() {
    return this.position('bottom-center');
};

Toast.prototype.action = function(label, handler, variant = null) {
    handler = handler || (() => this.close());
    this.$description.actions.push({ label, handler, variant });
    return this;
};

Toast.prototype.close = function() {
    this.$description.visibility?.set(false);
    this.emit('close');
};

Toast.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Toast.prototype.show = BaseComponent.prototype.toNdElement;