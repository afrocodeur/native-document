import BaseComponent from "@components/BaseComponent";
import HasItems from "@components/$traits/HasItems";

export default function ListGroup(label, config = {}) {
    if(!(this instanceof ListGroup)) {
        return new ListGroup(label, config);
    }

    this.$description = {
        header: label || null,
        footer: null,
        items: [],
        inset: false,
        data: null,
        renderHeader: null,
        renderFooter: null,
        render: null,
        ...config
    };
}

BaseComponent.extends(ListGroup, HasItems);

ListGroup.defaultTemplate = null;

ListGroup.use = function(template) {
    ListGroup.defaultTemplate = template.listGroup;
};

ListGroup.prototype.header = function(header) {
    this.$description.header = header;
    return this;
};

ListGroup.prototype.title = function(title) {
    return this.header(title);
};

ListGroup.prototype.footer = function(footer) {
    this.$description.footer = footer;
    return this;
};

ListGroup.prototype.inset = function(inset = true) {
    this.$description.inset = inset;
    return this;
};

ListGroup.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

ListGroup.prototype.renderHeader = function(renderFn) {
    this.$description.renderHeader = renderFn;
    return this;
};

ListGroup.prototype.renderFooter = function(renderFn) {
    this.$description.renderFooter = renderFn;
    return this;
};


ListGroup.prototype.$build = function() {

};