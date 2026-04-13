import Stack from "./Stack";
import DebugManager from "../../core/utils/debug-manager";
import BaseComponent from "../BaseComponent";


export default function VStack(content, props = {}) {
    if (!(this instanceof VStack)) {
        return new VStack(content, props);
    }

    Stack.call(this, content, props);

    this.$description.orientation = 'vertical';
    this.$description.alignment = 'leading';
}
BaseComponent.extends(VStack, Stack);

VStack.defaultTemplate = null;
VStack.use = function(template) {
    VStack.defaultTemplate = template;
};

VStack.preset = function(name, callback) {
    if (VStack.prototype[name] || VStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in VStack.`);
        return;
    }
    VStack[name] = (content, props) => callback(new VStack(content, props));
};

VStack.presets = function(presets) {
    for (const name in presets) {
        VStack.preset(name, presets[name]);
    }
};