import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import { $ } from "../../../index";
import DebugManager from "../../core/utils/debug-manager";

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
}

BaseComponent.extends(Breadcrumb);
BaseComponent.use(Breadcrumb, HasEventEmitter);

Breadcrumb.defaultTemplate = null;
Breadcrumb.use = function(template) {
    Breadcrumb.defaultTemplate = template;
};

Breadcrumb.preset = function(name, callback) {
    if (Breadcrumb.prototype[name] || Breadcrumb[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Breadcrumb.`);
        return;
    }
    Breadcrumb[name] = (props) => callback(new Breadcrumb(props));
};

Breadcrumb.presets = function(presets) {
    for (const name in presets) {
        Breadcrumb.preset(name, presets[name]);
    }
};

Breadcrumb.prototype.bind = function(source) {
    this.$description.items = source.__$Observable ? source : $.array(source);
    return this;
};

Breadcrumb.prototype.item = function(label, href, value) {
    this.$description.items.push({ label, href, value: value || href });
    return this;
};
Breadcrumb.prototype.items = function(items) {
    this.$description.items = [];
    for(const item of items) {
        this.item(item.label, item.href, item.value);
    }
    return this;
};

Breadcrumb.prototype.removeItem = function(index) {
    this.$description.items.splice(index, 1);
};

Breadcrumb.prototype.separator = function(separator) {
    this.$description.separator = separator;
    return this;
};


Breadcrumb.prototype.onItemClick = function(handler) {
    this.on('clickItem', handler);
    return this;
};

// Render
Breadcrumb.prototype.renderSeparator = function(renderFn) {
    this.$description.renderSeparator = renderFn;
    return this;
};
Breadcrumb.prototype.renderItem = function(renderFn) {
    this.$description.renderItem = renderFn;
    return this;
};