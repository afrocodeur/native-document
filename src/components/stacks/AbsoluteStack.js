import BaseComponent from "../BaseComponent";
import PositionStack from "./PositionStack";
import DebugManager from "../../core/utils/debug-manager";

export default function AbsoluteStack(content, props = {}) {
    if(!(this instanceof AbsoluteStack)) {
        return new AbsoluteStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'absolute';
}

BaseComponent.extends(AbsoluteStack, PositionStack);

AbsoluteStack.defaultTemplate = null;

AbsoluteStack.use = function(template) {
    AbsoluteStack.defaultTemplate = template;
};

AbsoluteStack.preset = function(name, callback) {
    if(AbsoluteStack.prototype[name] || AbsoluteStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in AbsoluteStack.`);
        return;
    }
    AbsoluteStack[name] = (content, props) => callback(new AbsoluteStack(content, props));
};

AbsoluteStack.presets = function(presets) {
    for(const name in presets) {
        AbsoluteStack.preset(name, presets[name]);
    }
};