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
 * FileImagePreviewMode.use((description, instance) => {
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
export default function FileImagePreviewMode(props = {}) {
    if(!(this instanceof FileImagePreviewMode)) {
        return new FileImagePreviewMode(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        variant: 'hover-overlay',
        shape: 'circle',
        size: null,
        placeholderIcon: null,
        overlayIcon: null,
        editImageIcon: null,
        changeLabel: 'Change photo',
        removeLabel: 'Remove',
        renderAvatar: null,
        renderOverlay: null,
        renderActions: null,
        mode: 'avatar',
        ratio: null,
        previewSourceFrom: null,
        props,
    };
}

BaseComponent.extends(FileImagePreviewMode);
BaseComponent.use(FileImagePreviewMode, HasEventEmitter);

FileImagePreviewMode.defaultTemplate = null;

/**
 * Registers the render template for FileImagePreviewMode.
 * @param {(description: {
 *     variant: 'hover-overlay'|'corner-badge'|'action-buttons',
 *     shape: 'circle'|'square',
 *     size: number|string,
 *     placeholderIcon: NdChild|null,
 *     overlayIcon: NdChild|null,
 *     editImageIcon: NdChild|null,
 *     changeLabel: NdChild,
 *     removeLabel: NdChild,
 *     renderAvatar: ((desc: *, instance: FileImagePreviewMode) => NdChild)|null,
 *     renderOverlay: ((desc: *, instance: FileImagePreviewMode) => NdChild)|null,
 *     renderActions: ((desc: *, instance: FileImagePreviewMode) => NdChild)|null,
 *     props: GlobalAttributes
 * }, instance: FileImagePreviewMode) => NdChild} template
 */
FileImagePreviewMode.use = function(template) {
    FileImagePreviewMode.defaultTemplate = template;
};

/** @returns {this} */
FileImagePreviewMode.prototype.hoverOverlay = function() {
    this.$description.variant = 'hover-overlay';
    return this;
};

/** @returns {this} */
FileImagePreviewMode.prototype.cornerBadge = function() {
    this.$description.variant = 'corner-badge';
    return this;
};

/** @returns {this} */
FileImagePreviewMode.prototype.actionButtons = function() {
    this.$description.variant = 'action-buttons';
    return this;
};

/** @returns {this} */
FileImagePreviewMode.prototype.circle = function() {
    this.$description.shape = 'circle';
    return this;
};

/** @returns {this} */
FileImagePreviewMode.prototype.square = function() {
    this.$description.shape = 'square';
    return this;
};

/**
 * @param {number|string} size - Size in pixels or CSS value
 * @returns {this}
 */
FileImagePreviewMode.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileImagePreviewMode.prototype.placeholderIcon = function(icon) {
    this.$description.placeholderIcon = icon;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileImagePreviewMode.prototype.overlayIcon = function(icon) {
    this.$description.overlayIcon = icon;
    return this;
};

/**
 * @param {NdChild} icon
 * @returns {this}
 */
FileImagePreviewMode.prototype.editImageIcon = function(icon) {
    this.$description.editImageIcon = icon;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileImagePreviewMode.prototype.changeLabel = function(label) {
    this.$description.changeLabel = label;
    return this;
};

/**
 * @param {NdChild} label
 * @returns {this}
 */
FileImagePreviewMode.prototype.removeLabel = function(label) {
    this.$description.removeLabel = label;
    return this;
};

/**
 * @param {(desc: *, instance: FileImagePreviewMode) => NdChild} fn
 * @returns {this}
 */
FileImagePreviewMode.prototype.renderAvatar = function(fn) {
    this.$description.renderAvatar = fn;
    return this;
};

/**
 * @param {(desc: *, instance: FileImagePreviewMode) => NdChild} fn
 * @returns {this}
 */
FileImagePreviewMode.prototype.renderOverlay = function(fn) {
    this.$description.renderOverlay = fn;
    return this;
};

/**
 * @param {(desc: *, instance: FileImagePreviewMode) => NdChild} fn
 * @returns {this}
 */
FileImagePreviewMode.prototype.renderActions = function(fn) {
    this.$description.renderActions = fn;
    return this;
};

/**
 * Configures the component specifically for avatar preset (circular default).
 * @returns {this}
 */
FileImagePreviewMode.prototype.asAvatar = function() {
    this.size(100);
    this.$description.mode = 'avatar';
    return this;
};
/**
 * Configures the component specifically for banner/cover preset (square default).
 * @returns {this}
 */
FileImagePreviewMode.prototype.asCover = function() {
    this.$description.mode = 'cover';
    this.square();
    return this;
};

/**
 * Sets CSS aspect-ratio or ratio string (e.g. '16/9', '3/1', 1.77)
 * @param {string|number} ratio
 * @returns {this}
 */
FileImagePreviewMode.prototype.ratio = function(ratio) {
    this.$description.ratio = ratio;
    return this;
};

/**
 * Sets aspect ratio to 1:1 (Square).
 * Ideal for avatars, product thumbnails, or Instagram feed items.
 * @returns {this}
 */
FileImagePreviewMode.prototype.squareRatio = function() {
    this.$description.ratio = '1/1';
    return this;
};

/**
 * Sets aspect ratio to 16:9 (Widescreen).
 * Ideal for video previews, event covers, and standard web banners.
 * @returns {this}
 */
FileImagePreviewMode.prototype.widescreenRatio = function() {
    this.$description.ratio = '16/9';
    return this;
};

/**
 * Sets aspect ratio to an ultra-wide banner format (defaults to 3:1).
 * Ideal for profile headers (e.g., Twitter, LinkedIn) or hero banners.
 * @param {string} [customRatio='3/1'] - Custom ratio string if different from '3/1' (e.g., '4/1')
 * @returns {this}
 */
FileImagePreviewMode.prototype.bannerRatio = function(customRatio = '3/1') {
    this.$description.ratio = customRatio;
    return this;
};

/**
 * Sets aspect ratio to 4:3 (Landscape).
 * Ideal for traditional photography, blog thumbnails, or product cards.
 * @returns {this}
 */
FileImagePreviewMode.prototype.landscapeRatio = function() {
    this.$description.ratio = '4/3';
    return this;
};

/**
 * Sets aspect ratio to 9:16 (Story / Full Mobile).
 * Ideal for mobile-first vertical media (Instagram Stories, Reels, TikTok).
 * @returns {this}
 */
FileImagePreviewMode.prototype.storyRatio = function() {
    this.$description.ratio = '9/16';
    return this;
};

/**
 * Sets aspect ratio to 4:5 (Social Portrait).
 * Ideal for Instagram or Facebook feed posts optimized for mobile screen height.
 * @returns {this}
 */
FileImagePreviewMode.prototype.portraitRatio = function() {
    this.$description.ratio = '4/5';
    return this;
};

/**
 * @param {Observable} observable
 */
FileImagePreviewMode.prototype.previewSourceFrom = function(observable) {
    this.$description.previewSourceFrom = observable;
    return this;
};