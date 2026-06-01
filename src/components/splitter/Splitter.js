import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import Validator from '../../core/utils/validator';
import SplitterPanel from './types/SplitterPanel';
import { $ } from '../../core/data/Observable';

/**
 * Resizable split-pane layout. Supports horizontal/vertical orientation, gutter size, collapsible panels, and dynamic panel management.
 *
 *
 * @example
 * const splitter = new Splitter()
 *     .horizontal()
 *     .gutterSize(6)
 *     .panel(Div('Left content'), { minSize: '200px' })
 *     .panel(Div('Right content'), { minSize: '300px' })
 *     .onResize((sizes) => console.log(sizes));
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Splitter(props = {}) {
    if(!(this instanceof Splitter)) {
        return new Splitter(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        orientation: 'horizontal',
        panels: [],
        gutterSize: 8,
        render: null,
        props,
    };

    this.$element = null;
}

BaseComponent.extends(Splitter);
BaseComponent.use(Splitter, HasEventEmitter);

Splitter.defaultTemplate = null;

/**
 * Registers the render template for Splitter.
 * @param {(description: {
 *     orientation: 'horizontal'|'vertical',
 *     panels: SplitterPanel[]|Observable<SplitterPanel[]>,
 *     gutterSize: number,
 *     render: ((desc: *, instance: Splitter) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: Splitter) => NdChild} template
 */
Splitter.use = function(template) {
    Splitter.defaultTemplate = template;
};

/**
 * @returns {this}
 */
Splitter.prototype.dynamic = function(){
    this.$description.panels = $.array([]);
    return this;
};

/**
 * @param {string} orientation
 * @returns {this}
 */
Splitter.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

/**
 * @returns {this}
 */
Splitter.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

/**
 * @returns {this}
 */
Splitter.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

/**
 * @param {number} gutterSize
 * @returns {this}
 */
Splitter.prototype.gutterSize = function(gutterSize) {
    this.$description.gutterSize = gutterSize;
    return this;
};

/**
 * @param {SplitterPanel|NdChild} content
 * @param {GlobalAttributes} [options={}]
 * @param {GlobalAttributes} [props={}]
 * @returns {this}
 */
Splitter.prototype.panel = function(content, options = {}, props = {}) {
    const panel = content instanceof SplitterPanel
        ? content
        : SplitterPanel(content).setDescription(options);
    this.$description.panels.push(panel);
    return this;
};

/**
 * @param {SplitterPanel[]} panels
 * @returns {this}
 */
Splitter.prototype.panels = function(panels) {
    if(Validator.isObservable(this.$description.panels)) {
        this.$description.panels.clear();
    } else {
        this.$description.panels = [];
    }
    panels.forEach(panel => this.panel(panel));
    return this;
};

/**
 * @param {SplitterPanel} panel
 * @returns {this}
 */
Splitter.prototype.removePanel = function(panel) {
    this.$description.panels.remove(panel);
    // TODO: remove the unnecessary gutter
    return this;
};

/**
 * @param {(sizes: number[]) => void} handler
 * @returns {this}
 */
Splitter.prototype.onResize = function(handler) {
    this.on('resize', handler);
    return this;
};

/**
 * @param {(panel: SplitterPanel) => void} handler
 * @returns {this}
 */
Splitter.prototype.onPanelAdd = function(handler) {
    this.on('panelAdd', handler);
    return this;
};

/**
 * @param {(panel: SplitterPanel) => void} handler
 * @returns {this}
 */
Splitter.prototype.onPanelRemove = function(handler) {
    this.on('panelRemove', handler);
    return this;
};