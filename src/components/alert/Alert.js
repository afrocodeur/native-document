import BaseComponent from "@components/BaseComponent";
import EventEmitter from "@src/core/utils/EventEmitter";

export default function Alert(message, config = {}) {
    if(!(this instanceof Alert)) {
        return new Alert(message, config);
    }
    this.$description = {
        title: null,
        content: null,
        outline: null,
        style: null,
        variant: 'info',
        closable: false,
        autoDismiss: null,
        icon: null,
        showIcon: true,
        ...config
    };
}

Alert.defaultTemplate = null;
Alert.defaultTitleTemplate = null;
Alert.defaultButtonsTemplate = null;
Alert.defaultContentTemplate = null;

Alert.use = function(template) {};

BaseComponent.extends(Alert, EventEmitter);

Alert.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Alert.prototype.info = function() {
    return this.variant('info');
};
Alert.prototype.success = function() {
    return this.variant('success');
};
Alert.prototype.warning = function() {
    return this.variant('warning');
};
Alert.prototype.error = function() {
    return this.variant('error');
};
Alert.prototype.danger = function() {
    return this.variant('danger');
};

Alert.prototype.style = function(style) {
    this.$description.style = style;
    return this;
};
Alert.prototype.filled = function() {
    return this.style('filled');
};
Alert.prototype.bordered = function() {
    return this.style('bordered');
};
Alert.prototype.outline = function(outline = true) {
    return this.style('outline');
};

Alert.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};
Alert.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

Alert.prototype.renderTitle = function(callback) {
    this.$description.renderTitle = callback;
    return this;
};
Alert.prototype.renderContent = function(callback) {
    this.$description.renderContent = callback;
    return this;
};
Alert.prototype.renderFooter = function(callback) {
    this.$description.renderFooter = callback;
    return this;
};

Alert.prototype.clearActions = function(label, handler) {
    this.$description.actions = [];
    return this;
};

Alert.prototype.action = function(label, handler) {
    this.$description.actions.push({label, handler});
    return this;
};

Alert.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

Alert.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

Alert.prototype.showIcon = function(show = true) {
    this.$description.showIcon = show;
};

Alert.prototype.closable = function(closable = true) {
    this.$description.closable = closable;
    return this;
};

Alert.prototype.dismissible = function(dismissible = true) {
    return this.closable(dismissible);
};
Alert.prototype.autoDismiss = function(delay) {
    this.$description.autoDismiss = delay;
    return this;
};



Alert.prototype.close = function() {

};

Alert.prototype.show = function() {

};

Alert.prototype.hide = function() {

};

Alert.prototype.onClose = function(handler) {
    this.on('close', handler);
    return this;
};
Alert.prototype.onShow = function(handler) {
    this.on('show', handler);
    return this;
};

Alert.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
Alert.prototype.$build = function() {

};
Alert.prototype.toNdElement = function() {};
