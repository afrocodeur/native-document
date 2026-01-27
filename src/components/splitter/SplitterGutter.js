

export default function SplitterGutter(leftPanel, rightPanel, config = {}) {
    if(!(this instanceof SplitterGutter)) {
        return new SplitterGutter(config);
    }

    this.$description = {
        leftPanel: leftPanel || null,
        rightPanel: rightPanel || null,
        orientation: config.orientation || 'horizontal',
        cursor: config.orientation === 'vertical' ? 'row-resize' : 'col-resize',
        size: 8,
        isDragging: $(false)
    }
}

SplitterGutter.defaultTemplate = null;

SplitterGutter.use = function(template) {
    SplitterGutter.defaultTemplate = template.splitterGutter;
};

SplitterGutter.prototype.panels = function(leftPanel, rightPanel) {
    this.$description.leftPanel = leftPanel;
    this.$description.rightPanel = rightPanel;
    return this;
};

SplitterGutter.prototype.leftPanel = function(leftPanel) {
    this.$description.leftPanel = leftPanel;
    return this;
};
SplitterGutter.prototype.rightPanel = function(rightPanel) {
    this.$description.rightPanel = rightPanel;
    return this;
};

SplitterGutter.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

SplitterGutter.prototype.onDragStart = function(handler) {
    this.on('dragStart', handler);
    return this;
};

SplitterGutter.prototype.onDrag = function(handler) {
    this.on('drag', handler);
    return this;
};

SplitterGutter.prototype.onDragEnd = function(handler) {
    this.on('dragEnd', handler);
    return this;
};