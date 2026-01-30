import BaseComponent from "../BaseComponent";

export default function SplitterPanel(content, config = {}) {
    if(!(this instanceof SplitterPanel)) {
        return new SplitterPanel(content, config);
    }

    if (typeof content === 'object' && !content.tagName) {
        config = content;
        content = config.content || null;
    }

    this.$description = {
        content: content || null,
        size: null,
        minSize: null,
        maxSize: null,
        collapsible: false,
        collapsed: false,
        resizable: true,
        data: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(SplitterPanel, BaseComponent);

SplitterPanel.defaultTemplate = null;

SplitterPanel.use = function(template) {
    SplitterPanel.defaultTemplate = template.splitterPanel;
};

SplitterPanel.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

SplitterPanel.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

SplitterPanel.prototype.minSize = function(size) {
    this.$description.minSize = size;
    return this;
};

SplitterPanel.prototype.maxSize = function(size) {
    this.$description.maxSize = size;
    return this;
};

SplitterPanel.prototype.collapsible = function(collapsible = true) {
    this.$description.collapsible = collapsible;
    return this;
};

SplitterPanel.prototype.collapsed = function(collapsed = true) {
    this.$description.collapsed = collapsed;
    return this;
};

SplitterPanel.prototype.resizable = function(resizable = true) {
    this.$description.resizable = resizable;
    return this;
};

SplitterPanel.prototype.fixed = function() {
    return this.resizable(false);
};

SplitterPanel.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

SplitterPanel.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};