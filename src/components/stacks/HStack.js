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
export default function HStack(content, props = {}) {
    if (!(this instanceof HStack)) {
        return new HStack(content, props);
    }

    Stack.call(this, content, props);
    this.$description.orientation = 'horizontal';
}

BaseComponent.extends(HStack,  Stack);

HStack.defaultTemplate = null;

/**
 * Registers the render template for HStack.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: HStack) => NdChild} template
 */
HStack.use = function(template) {
    HStack.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: HStack) => HStack} callback
 */
HStack.preset = function(name, callback) {
    if (HStack.prototype[name] || HStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in HStack.`);
        return;
    }
    HStack[name] = (content, props) => callback(new HStack(content, props));
};

/**
 * @param {Record<string, (s: HStack) => HStack>} presets
 */
HStack.presets = function(presets) {
    for (const name in presets) {
        HStack.preset(name, presets[name]);
    }
};