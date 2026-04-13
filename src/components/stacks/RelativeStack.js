import BaseComponent from "../BaseComponent";
import PositionStack from "./PositionStack";
import DebugManager from "../../core/utils/debug-manager";

export default function RelativeStack(content, props = {}) {
    if(!(this instanceof RelativeStack)) {
        return new RelativeStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'relative';
}

BaseComponent.extends(RelativeStack, PositionStack);

RelativeStack.defaultTemplate = null;

RelativeStack.use = function(template) {
    RelativeStack.defaultTemplate = template;
};

RelativeStack.preset = function(name, callback) {
    if(RelativeStack.prototype[name] || RelativeStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in RelativeStack.`);
        return;
    }
    RelativeStack[name] = (content, props) => callback(new RelativeStack(content, props));
};

RelativeStack.presets = function(presets) {
    for(const name in presets) {
        RelativeStack.preset(name, presets[name]);
    }
};