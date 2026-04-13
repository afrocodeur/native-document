import BaseComponent from "../BaseComponent";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import {Validator} from "../../../index";
import SplitterPanel from "./SplitterPanel";

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
        props
    };

    this.$element = null;
}

BaseComponent.extends(Splitter);
BaseComponent.use(Splitter, HasEventEmitter);

Splitter.defaultTemplate = null;

Splitter.use = function(template) {
    Splitter.defaultTemplate = template;
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

Splitter.prototype.panel = function(content, options = {}, props = {}) {
    const panel = content instanceof SplitterPanel
        ? content
        : SplitterPanel(content).setDescription(options);
    this.$description.panels.push(panel);
    return this;
};

Splitter.prototype.panels = function(panels) {
    if(Validator.isObservable(this.$description.panels)) {
        this.$description.panels.clear();
    } else {
        this.$description.panels = [];
    }
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