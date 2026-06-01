import Stack from './types/Stack';
import DebugManager from '../../core/utils/debug-manager';
import BaseComponent from '../BaseComponent';

/**
 *
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
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

/**
 * Registers the render template for VStack.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: VStack) => NdChild} template
 */
VStack.use = function(template) {
    VStack.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: VStack) => VStack} callback
 */
VStack.preset = function(name, callback) {
    if (VStack.prototype[name] || VStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in VStack.`);
        return;
    }
    VStack[name] = (content, props) => callback(new VStack(content, props));
};

/**
 * @param {Record<string, (s: VStack) => VStack>} presets
 */
VStack.presets = function(presets) {
    for (const name in presets) {
        VStack.preset(name, presets[name]);
    }
};