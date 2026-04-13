import BaseComponent from "../../../../BaseComponent";
import HasEventEmitter from "../../../../../core/utils/HasEventEmitter";

export default function FileAvatarMode(props = {}) {
    if(!(this instanceof FileAvatarMode)) {
        return new FileAvatarMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        variant: 'hover-overlay',
        shape: 'circle',
        size: 100,
        placeholderIcon: null,
        overlayIcon: null,
        editImageIcon: null,
        changeLabel: 'Change photo',
        removeLabel: 'Remove',
        renderAvatar: null,
        renderOverlay: null,
        renderActions: null,
        props
    };
}

BaseComponent.extends(FileAvatarMode);
BaseComponent.use(FileAvatarMode, HasEventEmitter);

FileAvatarMode.defaultTemplate = null;

FileAvatarMode.use = function(template) {
    FileAvatarMode.defaultTemplate = template;
};

FileAvatarMode.prototype.hoverOverlay = function() {
    this.$description.variant = 'hover-overlay';
    return this;
};

FileAvatarMode.prototype.cornerBadge = function() {
    this.$description.variant = 'corner-badge';
    return this;
};

FileAvatarMode.prototype.actionButtons = function() {
    this.$description.variant = 'action-buttons';
    return this;
};

FileAvatarMode.prototype.circle = function() {
    this.$description.shape = 'circle';
    return this;
};

FileAvatarMode.prototype.square = function() {
    this.$description.shape = 'square';
    return this;
};

FileAvatarMode.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

FileAvatarMode.prototype.placeholderIcon = function(icon) {
    this.$description.placeholderIcon = icon;
    return this;
};

FileAvatarMode.prototype.overlayIcon = function(icon) {
    this.$description.overlayIcon = icon;
    return this;
};

FileAvatarMode.prototype.editImageIcon = function(icon) {
    this.$description.editImageIcon = icon;
    return this;
};

FileAvatarMode.prototype.changeLabel = function(label) {
    this.$description.changeLabel = label;
    return this;
};

FileAvatarMode.prototype.removeLabel = function(label) {
    this.$description.removeLabel = label;
    return this;
};

FileAvatarMode.prototype.renderAvatar = function(fn) {
    this.$description.renderAvatar = fn;
    return this;
};

FileAvatarMode.prototype.renderOverlay = function(fn) {
    this.$description.renderOverlay = fn;
    return this;
};

FileAvatarMode.prototype.renderActions = function(fn) {
    this.$description.renderActions = fn;
    return this;
};