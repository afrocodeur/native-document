import BaseComponent from "../BaseComponent";
import EventEmitter from "../../../src/core/utils/EventEmitter";
import {Validator} from "../../../index";

export default function Splitter(config = {}) {
    if(!(this instanceof Splitter)) {
        return new Splitter(config);
    }

    this.$description = {
        orientation: 'horizontal',
        panels: [],
        gutterSize: 8,
        render: null,
        ...config
    };

    this.$element = null;
}

BaseComponent.extends(Splitter, EventEmitter);

Splitter.defaultTemplate = null;

Splitter.use = function(template) {
    Splitter.defaultTemplate = template.splitter;
};

Splitter.prototype.dynamic = function(){
    this.$description.panels = $.array([]);
    return this;
};

Splitter.prototype.orientation = function(orientation) {
    this.$description.orientation = orientation;
    return this;
};

Splitter.prototype.horizontal = function() {
    this.$description.orientation = 'horizontal';
    return this;
};

Splitter.prototype.vertical = function() {
    this.$description.orientation = 'vertical';
    return this;
};

Splitter.prototype.gutterSize = function(gutterSize) {
    this.$description.gutterSize = gutterSize;
    return this;
};

Splitter.prototype.panel = function(panel) {
    this.$description.panels.push(panel);
    return this;
};

Splitter.prototype.panels = function(panels) {
    if(Validator.isObservable(this.$description.panels)) {
        this.$description.panels.set(panels);
        return this;
    }
    this.$description.panels = [];
    panels.forEach(panel => this.panel(panel));
    return this;
};


Splitter.prototype.removePanel = function(panel) {
    this.$description.panels.remove(panel);
    // TODO: remove the unnecessary gutter
    return this;
}

Splitter.prototype.onResize = function(handler) {
    this.on('resize', handler);
    return this;
};

Splitter.prototype.onPanelAdd = function(handler) {
    this.on('panelAdd', handler);
    return this;
};

Splitter.prototype.onPanelRemove = function(handler) {
    this.on('panelRemove', handler);
    return this;
};

Splitter.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};