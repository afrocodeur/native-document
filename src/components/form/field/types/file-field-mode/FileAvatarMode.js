import BaseComponent from '../../../../BaseComponent';
import HasEventEmitter from '../../../../../core/utils/HasEventEmitter';

/**
 * Avatar-style single file upload mode for FileField.
 * Displays a circular or square avatar with hover/badge/button interaction variants.
 * Ideal for profile picture uploads.
 * @example
 * new FileField('avatar')
 *     .mode('avatar');
 *
 * FileAvatarMode.use((description, instance) => {
 *     // description.variant — 'hover-overlay' | 'corner-badge' | 'action-buttons'
 *     // description.shape   — 'circle' | 'square'
 *     // description.size, description.placeholderIcon, description.overlayIcon,
 *     // description.editImageIcon, description.changeLabel, description.removeLabel,
 *     // description.renderAvatar, description.renderOverlay, description.renderActions
 *     return Div({ class: \`avatar-upload avatar-upload--\${description.variant}\`,
 *                  style: { width: description.size, height: description.size } });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
}

BaseComponent.extends(FileAvatarMode);
BaseComponent.use(FileAvatarMode, HasEventEmitter);

FileAvatarMode.defaultTemplate = null;

/**
 * Registers the render template for FileAvatarMode.
 * @param {(description: {
 *     variant: 'hover-overlay'|'corner-badge'|'action-buttons',
 *     shape: 'circle'|'square',
 *     size: number|string,
 *     placeholderIcon: NdChild|null,
 *     overlayIcon: NdChild|null,
 *     editImageIcon: NdChild|null,
 *     changeLabel: NdChild,
 *     removeLabel: NdChild,
 *     renderAvatar: ((desc: *, instance: FileAvatarMode) => NdChild)|null,
 *     renderOverlay: ((desc: *, instance: FileAvatarMode) => NdChild)|null,
 *     renderActions: ((desc: *, instance: FileAvatarMode) => NdChild)|null,
 *     props: GlobalAttributes
 * }, instance: FileAvatarMode) => NdChild} template
 */
FileAvatarMode.use = function(template) {
    FileAvatarMode.defaultTemplate = template;
};

/** @returns {this} */
FileAvatarMode.prototype.hoverOverlay = function() {
    this.$description.variant = 'hover-overlay';
    return this;
};

/** @returns {this} */
FileAvatarMode.prototype.cornerBadge = function() {
    this.$description.variant = 'corner-badge';
    return this;
};

/** @returns {this} */
FileAvatarMode.prototype.actionButtons = function() {
    this.$description.variant = 'action-buttons';
    return this;
};

/** @returns {this} */
FileAvatarMode.prototype.circle = function() {
    this.$description.shape = 'circle';
    return this;
};

/** @returns {this} */
FileAvatarMode.prototype.square = function() {
    this.$description.shape = 'square';
    return this;
};

/**
 * @param {number|string} size - Size in pixels or CSS value
 * @returns {this}
 */
FileAvatarMode.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileAvatarMode.prototype.placeholderIcon = function(icon) {
    this.$description.placeholderIcon = icon;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileAvatarMode.prototype.overlayIcon = function(icon) {
    this.$description.overlayIcon = icon;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileAvatarMode.prototype.editImageIcon = function(icon) {
    this.$description.editImageIcon = icon;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileAvatarMode.prototype.changeLabel = function(label) {
    this.$description.changeLabel = label;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileAvatarMode.prototype.removeLabel = function(label) {
    this.$description.removeLabel = label;
    return this;
};

/**
 * @param {(desc: *, instance: FileAvatarMode) => NdChild} fn
 * @returns {this}
 */
FileAvatarMode.prototype.renderAvatar = function(fn) {
    this.$description.renderAvatar = fn;
    return this;
};

/**
 * @param {(desc: *, instance: FileAvatarMode) => NdChild} fn
 * @returns {this}
 */
FileAvatarMode.prototype.renderOverlay = function(fn) {
    this.$description.renderOverlay = fn;
    return this;
};

/**
 * @param {(desc: *, instance: FileAvatarMode) => NdChild} fn
 * @returns {this}
 */
FileAvatarMode.prototype.renderActions = function(fn) {
    this.$description.renderActions = fn;
    return this;
};