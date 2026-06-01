import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { $ } from '../../core/data/Observable';

/**
 * The drag handle between two SplitterPanel instances.
 *
 *
 * @example
 * const gutter = new SplitterGutter(leftPanel, rightPanel)
 *     .horizontal()
 *     .size(8)
 *     .onDragStart(() => console.log('drag start'));
 *
 * @constructor
 * @param {SplitterPanel} [leftPanel]
 * @param {SplitterPanel} [rightPanel]
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * Registers the render template for SplitterGutter.
 * @param {(description: {
 *     leftPanel: SplitterPanel|null,
 *     rightPanel: SplitterPanel|null,
 *     orientation: 'horizontal'|'vertical',
 *     cursor: string,
 *     size: number,
 *     isDragging: Observable<boolean>,
 *     props: GlobalAttributes,
 * }, instance: SplitterGutter) => NdChild} template
 */
SplitterGutter.use = function(template) {
    SplitterGutter.defaultTemplate = template;
};

/**
 * @returns {this}
 */
SplitterGutter.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    this.$description.cursor = 'row-resize';
    return this;
};

/**
 * @returns {this}
 */
SplitterGutter.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    this.$description.cursor = 'col-resize';
    return this;
};

/**
 * @param {SplitterPanel} leftPanel
 * @param {SplitterPanel} rightPanel
 * @returns {this}
 */
SplitterGutter.prototype.panels = function(leftPanel, rightPanel) {
    this.$description.leftPanel = leftPanel;
    this.$description.rightPanel = rightPanel;
    return this;
};

/**
 * @param {SplitterPanel} leftPanel
 * @returns {this}
 */
SplitterGutter.prototype.leftPanel = function(leftPanel) {
    this.$description.leftPanel = leftPanel;
    return this;
};

/**
 * @param {SplitterPanel} rightPanel
 * @returns {this}
 */
SplitterGutter.prototype.rightPanel = function(rightPanel) {
    this.$description.rightPanel = rightPanel;
    return this;
};

/**
 * @param {number} size
 * @returns {this}
 */
SplitterGutter.prototype.size = function(size) {
    this.$description.size = size;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
SplitterGutter.prototype.onDragStart = function(handler) {
    this.on('dragStart', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
SplitterGutter.prototype.onDrag = function(handler) {
    this.on('drag', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
SplitterGutter.prototype.onDragEnd = function(handler) {
    this.on('dragEnd', handler);
    return this;
};