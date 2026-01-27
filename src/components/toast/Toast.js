import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";

export default function Toast(message, config = {}) {
    if (!(this instanceof Toast)) {
        return new Toast(message, config);
    }

    this.$description = {
        type: null,
        title: null,
        content: null,
        icon: null,
        showIcon: true,
        duration: 3000,
        closable: true,
        pauseOnHover: true,
        position: 'top-right',
        actions: [],
        render: null,
        ...config
    };
}

BaseComponent.extends(Toast, EventEmitter);

Toast.use = function(template) {};
Toast.defaultTemplate = null;

// Types
Toast.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};
Toast.prototype.info = function() {
    return this.type('info');
};
Toast.prototype.success = function() {
    return this.type('success');
};
Toast.prototype.warning = function() {
    return this.type('warning');
};
Toast.prototype.error = function() {
    return this.type('error');
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
Toast.prototype.atTopStart = function() {
    return this.position('top-start');
};

Toast.prototype.atTopEnd = function() {
    return this.position('top-end');
};
Toast.prototype.atBottomStart = function() {
    return this.position('bottom-start');
};
Toast.prototype.atBottomEnd = function() {
    return this.position('bottom-end');
};
Toast.prototype.atTopCenter = function() {
    return this.position('top-center');
};
Toast.prototype.atBottomCenter = function() {
    return this.position('bottom-center');
};

Toast.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};
Toast.prototype.action = function(label, handler) {
    this.$description.actions.push({ label, handler });
    return this;
};

Toast.prototype.close = function() {};
Toast.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};

Toast.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Toast.prototype.$build = function() {

};
Toast.prototype.toNdElement = function() {};
