import BaseComponent from "../BaseComponent";
import PositionStack from "./PositionStack";
import DebugManager from "../../core/utils/debug-manager";

export default function FixedStack(content, props = {}) {
    if(!(this instanceof FixedStack)) {
        return new FixedStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'fixed';
}

BaseComponent.extends(FixedStack, PositionStack);

FixedStack.defaultTemplate = null;

FixedStack.use = function(template) {
    FixedStack.defaultTemplate = template;
};

FixedStack.preset = function(name, callback) {
    if(FixedStack.prototype[name] || FixedStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in FixedStack.`);
        return;
    }
    FixedStack[name] = (content, props) => callback(new FixedStack(content, props));
};

FixedStack.presets = function(presets) {
    for(const name in presets) {
        FixedStack.preset(name, presets[name]);
    }
};