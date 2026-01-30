import BaseComponent from "../BaseComponent";

export default function PopoverFooter(content, config = {}) {
    if(!(this instanceof PopoverFooter)) {
        return new PopoverFooter(content, config);
    }

    this.$description = {
        content: content || null,
        data: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(PopoverFooter);

PopoverFooter.defaultTemplate = null;

PopoverFooter.use = function(template) {
    PopoverFooter.defaultTemplate = template.popoverFooter;
};

PopoverFooter.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

PopoverFooter.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

PopoverFooter.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};
