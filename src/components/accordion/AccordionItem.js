import { $ } from '@core';
import BaseComponent from "@components/BaseComponent";

export default function AccordionItem(config = {}) {
    if(!(this instanceof AccordionItem)){
        return new AccordionItem()
    }

    this.$description = {
        id: null,
        title: null,
        icon: null,
        collapsible: true,
        content: null,
        renderHeader: null,
        renderContent: null,
        render: null,
        expanded: $(false),
        disabled: false,
        ...config
    };
}

BaseComponent.extends(AccordionItem);

Object.defineProperty(AccordionItem.prototype, 'id', {
    get() {
        this.$description.id;
    }
});

AccordionItem.prototype.identifyBy = function(id) {
    this.$description.id = id;
    return this;
};

AccordionItem.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

AccordionItem.prototype.title = function(title) {
    this.$description.title = title;
    return this;
};

AccordionItem.prototype.icon = function(icon) {
    this.$description.icon = icon;
    return this;
};

AccordionItem.prototype.showIndicator = function(show = true) {
    this.$description.showIndicator = show;
    return this;
}

AccordionItem.prototype.collapsible = function(collapsible = true) {
    this.$description.collapsible = collapsible;
    return this;
};

AccordionItem.prototype.expanded = function(expanded = true) {
    this.$description.expanded.set(expanded);
    if (this.$description.expanded.val()) {
        this.emit('expand');
    } else {
        this.emit('collapse');
    }
    return this;
};

AccordionItem.prototype.toggle = function() {
    return this.expanded(!this.$description.expanded.val());
};

AccordionItem.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

AccordionItem.prototype.isExpanded = function() {
    return this.$description.expanded.val();
};
AccordionItem.prototype.onExpand = function(handler) {
    this.on('expand', handler );
    return this;
};

AccordionItem.prototype.onCollapse = function(handler) {
    this.on('collapse', handler);
    return this;
};

AccordionItem.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

AccordionItem.prototype.renderContent = function(renderFn) {
    this.$description.renderContent = renderFn;
};

AccordionItem.prototype.renderIndicator = function(renderFn) {
    this.$description.renderIndicator = renderFn;
    return this;
};

AccordionItem.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
}

AccordionItem.prototype.$build = function() {

};

AccordionItem.prototype.toNdElement = function() {

}