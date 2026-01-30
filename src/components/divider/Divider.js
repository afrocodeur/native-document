import BaseComponent from "../BaseComponent";

export default function Divider(config = {}) {
    if(!(this instanceof Divider)) {
        return new Divider(config);
    }

    this.$description = {
        orientation: 'horizontal',
        variant: 'solid',
        thickness: null,
        spacing: null,
        label: null,
        labelPosition: 'center',
        color: null,
        render: null,
        inset: null,
        indent: null,
        leading: null,
        trailing: null,
        ...config
    };
}

BaseComponent.extends(Divider);

Divider.defaultTemplate = null;

Divider.use = function(template) {
    Divider.defaultTemplate = template.divider;
};

Divider.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

Divider.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

Divider.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

Divider.prototype.variant = function(variant) {
    this.$description.variant = variant;
    return this;
};

Divider.prototype.solid = function() {
    this.$description.variant = 'solid';
    return this;
};

Divider.prototype.dashed = function() {
    this.$description.variant = 'dashed';
    return this;
};

Divider.prototype.dotted = function() {
    this.$description.variant = 'dotted';
    return this;
};

Divider.prototype.thickness = function(thickness) {
    this.$description.thickness = thickness;
    return this;
};

Divider.prototype.spacing = function(spacing) {
    this.$description.spacing = spacing;
    return this;
};

Divider.prototype.inset = function(inset) {
    this.$description.inset = inset;
    return this;
};
Divider.prototype.leading = function(leading) {
    this.$description.leading = leading;
    return this;
};

Divider.prototype.trailing = function(trailing) {
    this.$description.trailing = trailing;
    return this;
}

Divider.prototype.indent = function(leading, trailing) {
    this.leading(leading);
    this.trailing(trailing);
    return this;
};

Divider.prototype.label = function(label) {
    this.$description.label = label;
    return this;
};

Divider.prototype.labelPosition = function(position) {
    this.$description.labelPosition = position;
    return this;
};

Divider.prototype.labelAtLeading = function() {
    this.$description.labelPosition = 'leading';
    return this;
};

Divider.prototype.labelAtCenter = function() {
    this.$description.labelPosition = 'center';
    return this;
};

Divider.prototype.labelAtTrailing = function() {
    this.$description.labelPosition = 'trailing';
    return this;
};

Divider.prototype.color = function(color) {
    this.$description.color = color;
    return this;
};