import {Validator} from "../../../index";
import BaseComponent from "../BaseComponent";

/**
 * Component for displaying user avatars with images, initials, or icons
 * @param {Observable<string>|string} source - The avatar source (image URL or observable)
 * @param {{ src?: Observable<string>|string, alt?: string, name?: string, initials?: string, icon?: ValidChildren, size?: string|number, shape?: string, variant?: string, color?: string, textColor?: string, status?: string, render?: Function }} config - Configuration object
 * @class
 */
export default function Avatar(source, config = {}) {
    if (!(this instanceof Avatar)) {
        return new Avatar(source, config);
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

/**
 * Sets the default template for all Avatar instances
 * @param {{avatar: (avatar: Avatar) => ValidChildren}} template - Template object containing avatar factory function
 */
Avatar.use = function(template) {
    Avatar.defaultTemplate = template.avatar;
};

/**
 * Registers a handler for the error event
 * @param {(error: Error, avatar: Avatar) => void} handler - The event handler
 * @returns {Avatar}
 */
Avatar.prototype.onError = function(handler) {};

/**
 * Sets the source URL for the avatar image
 * @param {string} src - The image source URL
 * @returns {Avatar}
 */
Avatar.prototype.src = function(src) {
    this.$description.src.set(src);
    return this;
};

/**
 * Sets the alt text for the avatar image
 * @param {string} alt - The alt text
 * @returns {Avatar}
 */
Avatar.prototype.alt = function(alt) {
    this.$description.alt = alt;
    return this;
};

/**
 * Sets the name associated with the avatar
 * @param {string} name - The name
 * @returns {Avatar}
 */
Avatar.prototype.name = function(name) {
    this.$description.name = name;
    return this;
};

/**
 * Sets the initials to display
 * @param {string} initials - The initials text
 * @returns {Avatar}
 */
Avatar.prototype.initials = function(initials) {
    this.$description.initials = initials;
    return this;
};

/**
 * Sets the icon for the avatar
 * @param {ValidChildren} icon - The icon to display
 * @returns {Avatar}
 */
Avatar.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

/**
 * Sets the size of the avatar
 * @param {string|number} size - The size value (preset name or custom value)
 * @returns {Avatar}
 */
Avatar.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * Sets the avatar size to 'extra-small'
 * @returns {Avatar}
 */
Avatar.prototype.extraSmall = function() {
    return this.size('extra-small');
};

/**
 * Sets the avatar size to 'small'
 * @returns {Avatar}
 */
Avatar.prototype.small = function() {
    return this.size('small');
};

/**
 * Sets the avatar size to 'medium'
 * @returns {Avatar}
 */
Avatar.prototype.medium = function() {
    return this.size('medium');
};

/**
 * Sets the avatar size to 'large'
 * @returns {Avatar}
 */
Avatar.prototype.large = function() {
    return this.size('large');
};

/**
 * Sets the avatar size to 'extra-large'
 * @returns {Avatar}
 */
Avatar.prototype.extraLarge = function() {
    return this.size('extra-large');
};

/**
 * Sets the shape of the avatar
 * @param {string} shape - The shape name (circle, square, rounded)
 * @returns {Avatar}
 */
Avatar.prototype.shape = function(shape) {
    this.$description.shape = shape;
    return this;
};

/**
 * Sets the avatar shape to 'circle'
 * @returns {Avatar}
 */
Avatar.prototype.circle = function() {
    return this.shape('circle');
};

/**
 * Sets the avatar shape to 'square'
 * @returns {Avatar}
 */
Avatar.prototype.square = function() {
    return this.shape('square');
};

/**
 * Sets the avatar shape to 'rounded'
 * @returns {Avatar}
 */
Avatar.prototype.rounded = function() {
    return this.shape('rounded');
};

/**
 * Sets the variant style for the avatar
 * @param {string} variant - The variant name (primary, secondary, success, danger, warning, info)
 * @returns {Avatar}
 */
Avatar.prototype.variant = function(variant) {
    this.$description.variant = variant;
}; // 'primary' | 'secondary' | 'success' | etc.

/**
 * Sets the avatar variant to 'primary'
 * @returns {Avatar}
 */
Avatar.prototype.primary = function() {
    return this.variant('primary');
};

/**
 * Sets the avatar variant to 'secondary'
 * @returns {Avatar}
 */
Avatar.prototype.secondary = function() {
    return this.variant('secondary');
};

/**
 * Sets the avatar variant to 'success'
 * @returns {Avatar}
 */
Avatar.prototype.success = function() {
    return this.variant('success');
};

/**
 * Sets the avatar variant to 'danger'
 * @returns {Avatar}
 */
Avatar.prototype.danger = function() {
    return this.variant('danger');
};

/**
 * Sets the avatar variant to 'warning'
 * @returns {Avatar}
 */
Avatar.prototype.warning = function() {
    return this.variant('warning');
};

/**
 * Sets the avatar variant to 'info'
 * @returns {Avatar}
 */
Avatar.prototype.info = function() {
    return this.variant('info');
}

/**
 * Sets the background color of the avatar
 * @param {string} color - The color value
 * @returns {Avatar}
 */
Avatar.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};

/**
 * Sets the text color of the avatar
 * @param {string} color - The color value
 * @returns {Avatar}
 */
Avatar.prototype.textColor = function(color) {
    this.$description.textColor = color;
    return this;
};

/**
 * Sets the status indicator for the avatar
 * @param {string} status - The status value
 * @returns {Avatar}
 */
Avatar.prototype.status = function(status) {
    this.$description.status = status;
    return this;
};

/**
 * Sets the position of the status indicator
 * @param {string} position - The position (top-right, bottom-right, top-left, bottom-left)
 * @returns {Avatar}
 */
Avatar.prototype.statusPosition = function(position) {
    this.$description.statusPosition = position;
}; // 'top-right' | 'bottom-right' | etc.

/**
 * Positions the status indicator at top-leading
 * @returns {Avatar}
 */
Avatar.prototype.statusAtTopLeading = function() {
    return this.statusPosition('top-leading');
};

/**
 * Positions the status indicator at bottom-leading
 * @returns {Avatar}
 */
Avatar.prototype.statusAtBottomLeading = function() {
    return this.statusPosition('bottom-leading');
};

/**
 * Positions the status indicator at top-trailing
 * @returns {Avatar}
 */
Avatar.prototype.statusAtTopTrailing = function() {
    return this.statusPosition('top-trailing');
};

/**
 * Positions the status indicator at bottom-trailing
 * @returns {Avatar}
 */
Avatar.prototype.statusAtBottomTrailing = function() {
    return this.statusPosition('bottom-trailing');
};

/**
 * Shows or hides the status indicator
 * @param {boolean} [show=true] - Whether to show the status
 * @returns {Avatar}
 */
Avatar.prototype.showStatus = function(show = true) {
    this.$description.showStatus = show;
    return this;
};

/**
 * Sets the badge content for the avatar
 * @param {ValidChildren} content - The badge content
 * @returns {Avatar}
 */
Avatar.prototype.badge = function(content) {
    this.$description.badge = content;
    return this;
};

/**
 * Sets the position of the badge
 * @param {string} position - The position (top-leading, bottom-leading, top-trailing, bottom-trailing)
 * @returns {Avatar}
 */
Avatar.prototype.badgePosition = function(position) {
    this.$description.badgePosition = position;
    return this;
};

/**
 * Positions the badge at top-leading
 * @returns {Avatar}
 */
Avatar.prototype.badgeAtTopLeading = function() {
    return this.badgePosition('top-leading');
};

/**
 * Positions the badge at bottom-leading
 * @returns {Avatar}
 */
Avatar.prototype.badgeAtBottomLeading = function() {
    return this.badgePosition('bottom-leading');
};

/**
 * Positions the badge at top-trailing
 * @returns {Avatar}
 */
Avatar.prototype.badgeAtTopTrailing = function() {
    return this.badgePosition('top-trailing');
};

/**
 * Positions the badge at bottom-trailing
 * @returns {Avatar}
 */
Avatar.prototype.badgeAtBottomTrailing = function() {
    return this.badgePosition('bottom-trailing');
};

/**
 * Sets the render function for the entire avatar
 * @param {(avatar: Avatar, sections: {image: ValidChildren, initials: ValidChildren, icon: ValidChildren, status: ValidChildren, badge: ValidChildren}) => ValidChildren} renderFn - Function to render the avatar
 * @returns {Avatar}
 */
Avatar.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};

/**
 * Builds the avatar component
 * @private
 */
Avatar.prototype.$build = function() {

};

