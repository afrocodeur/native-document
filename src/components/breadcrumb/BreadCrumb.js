import BaseComponent from '../BaseComponent';
import HasEventEmitter from '../../core/utils/HasEventEmitter';
import { $ } from '../../core/data/Observable';
import DebugManager from '../../core/utils/debug-manager';

/**
 *
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function Breadcrumb(props = {}) {
    if (!(this instanceof Breadcrumb)) {
        return new Breadcrumb(props);
    }

    this.$description = {
        separator: null,
        items: $.array([]),
        renderSeparator: null,
        renderItem: null,
        props,
    };
    this.aria = {
        'role': 'navigation',
        'aria-label': 'Breadcrumb'
    };
}

BaseComponent.extends(Breadcrumb);
BaseComponent.use(Breadcrumb, HasEventEmitter);

Breadcrumb.defaultTemplate = null;

/**
 * Registers the render template for Breadcrumb.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: Breadcrumb) => NdChild} template
 */
Breadcrumb.use = function(template) {
    Breadcrumb.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(b: Breadcrumb) => Breadcrumb} callback
 */
Breadcrumb.preset = function(name, callback) {
    if (Breadcrumb.prototype[name] || Breadcrumb[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Breadcrumb.`);
        return;
    }
    Breadcrumb[name] = (props) => callback(new Breadcrumb(props));
};

/**
 * @param {Record<string, (b: Breadcrumb) => Breadcrumb>} presets
 */
Breadcrumb.presets = function(presets) {
    for (const name in presets) {
        Breadcrumb.preset(name, presets[name]);
    }
};

/**
 * @param {Observable<Array<{ label: NdChild, href?: string, value?: * }>>|Array<*>} source
 * @returns {this}
 */
Breadcrumb.prototype.bind = function(source) {
    this.$description.items = source.__$Observable ? source : $.array(source);
    return this;
};

/**
 * @param {NdChild} label
 * @param {string} [href]
 * @param {*} [value]
 * @returns {this}
 */
Breadcrumb.prototype.item = function(label, href, value) {
    this.$description.items.push({ label, href, value: value || href });
    return this;
};

/**
 * @param {{ label: NdChild, href?: string, value?: * }[]} items
 * @returns {this}
 */
Breadcrumb.prototype.items = function(items) {
    this.$description.items = [];
    for(const item of items) {
        this.item(item.label, item.href, item.value);
    }
    return this;
};

/**
 * @param {number} index
 * @returns {this}
 */
Breadcrumb.prototype.removeItem = function(index) {
    this.$description.items.splice(index, 1);
};

/**
 * @param {NdChild} separator
 * @returns {this}
 */
Breadcrumb.prototype.separator = function(separator) {
    this.$description.separator = separator;
    return this;
};

/**
 * @param {(item: { label: NdChild, href?: string, value?: * }, event: MouseEvent) => void} handler
 * @returns {this}
 */
Breadcrumb.prototype.onItemClick = function(handler) {
    this.on('clickItem', handler);
    return this;
};

// Render

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Breadcrumb.prototype.renderSeparator = function(renderFn) {
    this.$description.renderSeparator = renderFn;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
Breadcrumb.prototype.renderItem = function(renderFn) {
    this.$description.renderItem = renderFn;
    return this;
};