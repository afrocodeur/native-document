import Stack from "./Stack";
import DebugManager from "../../core/utils/debug-manager";
import BaseComponent from "../BaseComponent";

export default function HStack(content, props = {}) {
    if (!(this instanceof HStack)) {
        return new HStack(content, props);
    }

    Stack.call(this, content, props);
    this.$description.orientation = 'horizontal';
}

BaseComponent.extends(HStack,  Stack);

HStack.defaultTemplate = null;
HStack.use = function(template) {
    HStack.defaultTemplate = template;
};

HStack.preset = function(name, callback) {
    if (HStack.prototype[name] || HStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in HStack.`);
        return;
    }
    HStack[name] = (content, props) => callback(new HStack(content, props));
};

HStack.presets = function(presets) {
    for (const name in presets) {
        HStack.preset(name, presets[name]);
    }
};