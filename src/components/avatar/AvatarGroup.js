import BaseComponent from '../BaseComponent';

/**
 * Renders a group of overlapping Avatar components with a "+N" overflow indicator.
 *
 *
 * @example
 * const group = new AvatarGroup()
 *     .items([
 *         new Avatar('user1.jpg').name('Alice'),
 *         new Avatar('user2.jpg').name('Bob'),
 *         new Avatar('user3.jpg').name('Carol'),
 *     ])
 *     .max(3)
 *     .overlap(8)
 *     .onMoreClick((count) => console.log(\`\${count} more users\`));
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function AvatarGroup(props = {}) {
    if(!(this instanceof AvatarGroup)) {
        return new AvatarGroup(props);
    }

    this.$description = {
        items: [],
        overlap: 0,
        max: 0,
        onMoreClick: null,
        props,
    };

};

BaseComponent.extends(AvatarGroup);

AvatarGroup.defaultTemplate = null;

/**
 * Registers the render template for AvatarGroup.
 * @param {(description: {
 *     items: Avatar[],
 *     overlap: number,
 *     max: number,
 *     onMoreClick: ((count: number) => void)|null,
 *     props: GlobalAttributes,
 * }, instance: AvatarGroup) => NdChild} template
 */
AvatarGroup.use = function(template) {
    AvatarGroup.defaultTemplate = template;
};

/**
 * @param {Avatar[]} items
 * @returns {this}
 */
AvatarGroup.prototype.items = function(items) {
    this.$description.items = items;
    return this;
};

/**
 * @param {Avatar} item
 * @returns {this}
 */
AvatarGroup.prototype.item = function(item) {
    this.$description.items.push(item);
    return this;
};

/**
 * @param {number} value
 * @returns {this}
 */
AvatarGroup.prototype.overlap = function(value) {
    this.$description.overlap = value;
    return this;
};

/**
 * @param {number} max
 * @returns {this}
 */
AvatarGroup.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

/**
 * @param {(count: number) => void} handler
 * @returns {this}
 */
AvatarGroup.prototype.onMoreClick = function(handler) {
    this.$description.onMoreClick = handler;
    return this;
};