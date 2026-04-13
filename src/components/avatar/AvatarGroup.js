import BaseComponent from "../BaseComponent";


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
AvatarGroup.use = function(template) {
    AvatarGroup.defaultTemplate = template;
};

AvatarGroup.prototype.items = function(items) {
    this.$description.items = items;
    return this;
};

AvatarGroup.prototype.item = function(item) {
    this.$description.items.push(item);
    return this;
};

AvatarGroup.prototype.overlap = function(value) {
    this.$description.overlap = value;
    return this;
};

AvatarGroup.prototype.max = function(max) {
    this.$description.max = max;
    return this;
};

AvatarGroup.prototype.onMoreClick = function(handler) {
    this.$description.onMoreClick = handler;
    return this;
};