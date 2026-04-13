import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { $ } from '../../../index';


export default function SplitterGutter(leftPanel, rightPanel, props = {}) {
    if(!(this instanceof SplitterGutter)) {
        return new SplitterGutter(leftPanel, rightPanel, props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        leftPanel: leftPanel || null,
        rightPanel: rightPanel || null,
        orientation: 'horizontal',
        cursor: 'col-resize',
        size: 2,
        isDragging: $(false),
        props
    };
}

BaseComponent.extends(SplitterGutter);
BaseComponent.use(SplitterGutter, HasEventEmitter);

SplitterGutter.defaultTemplate = null;

SplitterGutter.use = function(template) {
    SplitterGutter.defaultTemplate = template;
};

SplitterGutter.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    this.$description.cursor = 'row-resize';
    return this;
};

SplitterGutter.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    this.$description.cursor = 'col-resize';
    return this;
}

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