import BaseComponent from '../BaseComponent';
import { $ } from '../../core/data/Observable';

/**
 * A resizable panel inside a Splitter. Configures size constraints and collapsed/collapsible state.
 *
 *
 * @example
 * const panel = new SplitterPanel(Div('Panel content'))
 *     .size('30%')
 *     .minSize('150px')
 *     .maxSize('60%')
 *     .collapsible(true)
 *     .collapsed(false);
 *
 * @constructor
 * @param {NdChild} [content]
 * @param {GlobalAttributes} [props={}]
 */
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
        props,
    };
}

BaseComponent.extends(SplitterPanel);

SplitterPanel.defaultTemplate = null;

/**
 * Registers the render template for SplitterPanel.
 * @param {(description: {
 *     orientation: 'horizontal'|'vertical',
 *     content: NdChild|null,
 *     size: Observable<string|number|null>,
 *     minSize: string|number|null,
 *     maxSize: string|number|null,
 *     collapsible: boolean,
 *     collapsed: boolean,
 *     resizable: boolean,
 *     data: *|null,
 *     render: ((desc: *, instance: SplitterPanel) => NdChild)|null,
 *     props: GlobalAttributes,
 * }, instance: SplitterPanel) => NdChild} template
 */
SplitterPanel.use = function(template) {
    SplitterPanel.defaultTemplate = template;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
SplitterPanel.prototype.content = function(content) {
    this.$description.content = content;
    return this;
};

/**
 * @param {number} size
 * @returns {this}
 */
SplitterPanel.prototype.size = function(size) {
    this.$description.size.set(size);
    return this;
};

/**
 * @param {number} size
 * @returns {this}
 */
SplitterPanel.prototype.minSize = function(size) {
    this.$description.minSize = size;
    return this;
};

/**
 * @param {number} size
 * @returns {this}
 */
SplitterPanel.prototype.maxSize = function(size) {
    this.$description.maxSize = size;
    return this;
};

/**
 * @param {boolean} [collapsible]
 * @returns {this}
 */
SplitterPanel.prototype.collapsible = function(collapsible = true) {
    this.$description.collapsible = collapsible;
    return this;
};

/**
 * @param {*} [collapsed]
 * @returns {this}
 */
SplitterPanel.prototype.collapsed = function(collapsed = true) {
    this.$description.collapsed = collapsed;
    return this;
};

/**
 * @param {*} [resizable]
 * @returns {this}
 */
SplitterPanel.prototype.resizable = function(resizable = true) {
    this.$description.resizable = resizable;
    return this;
};

/**
 * @returns {this}
 */
SplitterPanel.prototype.fixed = function() {
    return this.resizable(false);
};

/**
 * @param {*} data
 * @returns {this}
 */
SplitterPanel.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};