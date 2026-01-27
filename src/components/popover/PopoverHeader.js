import BaseComponent from "@components/BaseComponent";

export default function PopoverHeader(content, config = {}) {
    if(!(this instanceof PopoverHeader)) {
        return new PopoverHeader(content, config);
    }

    this.$description = {
        content: content || null,
        showClose: false,
        data: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(PopoverHeader);

PopoverHeader.defaultTemplate = null;

PopoverHeader.use = function(template) {
    PopoverHeader.defaultTemplate = template.popoverHeader;
};

PopoverHeader.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

PopoverHeader.prototype.showClose = function(show = true) {
    this.$description.showClose = show;
    return this;
};

PopoverHeader.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

PopoverHeader.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
