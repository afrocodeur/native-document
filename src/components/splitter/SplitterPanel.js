import BaseComponent from "../BaseComponent";
import { $ } from '../../core/data/Observable';

export default function SplitterPanel(content, props = {}) {
    if(!(this instanceof SplitterPanel)) {
        return new SplitterPanel(content, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        orientation: 'horizontal',
        content: content || null,
        size: $(null),
        minSize: null,
        maxSize: null,
        collapsible: false,
        collapsed: false,
        resizable: true,
        data: null,
        render: null,
        props
    };
}

BaseComponent.extends(SplitterPanel);

SplitterPanel.defaultTemplate = null;

SplitterPanel.use = function(template) {
    SplitterPanel.defaultTemplate = template;
};

SplitterPanel.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

SplitterPanel.prototype.size = function(size) {
    this.$description.size.set(size);
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