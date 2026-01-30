import BaseComponent from "../BaseComponent";

export default function Card(config = {}) {
    if(!(this instanceof Card)) {
        return new Card(config);
    }
    this.$description = {
        ...config
    };
};

BaseComponent.extends(Card);

Card.defaultTemplate = null;

Card.use = function(template) {};

Card.prototype.title = function(title) {
    return this;
};
Card.prototype.subtitle = function(title) {
    return this;
};
Card.prototype.image = function(src, position = 'top') {
    return this;
};
Card.prototype.content = function(content) {
    return this;
};

// Appearance
Card.prototype.variant = function(name) {
    return this;
};
Card.prototype.outlined = function() {
    return this;
};
Card.prototype.elevated = function() {
    return this;
};
Card.prototype.flat = function() {
    return this;
};

// Behavior
Card.prototype.clickable = function(handler) {
    return this;
};
Card.prototype.hoverable = function() {
    return this;
};
Card.prototype.loading = function(isLoading = true) {
    return this;
};

// Layout
Card.prototype.horizontal = function() {
    return this;
};

// Events
Card.prototype.onClick = function(handler) {
    return this;
};
Card.prototype.onHover = function(handler) {
    return this;
};

Card.prototype.clearActions = function() {
    this.$description.actions = [];
    return this;
};

Card.prototype.action = function(label, callback) {
    this.$description.actions.push({ label, callback });
    return this;
};

Card.prototype.renderImage = function(renderFn) {
    this.$description.renderImage = renderFn;
    return this;
};
Card.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};
Card.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
    return this;
};
Card.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};
Card.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

Card.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

Card.prototype.$build = function() {

};
Card.prototype.toNdElement = function() {
    return this;
};