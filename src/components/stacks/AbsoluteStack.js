import BaseComponent from '../BaseComponent';
import PositionStack from './PositionStack';
import DebugManager from '../../core/utils/debug-manager';

/**
 *
 *
 * @constructor
 * @param {NdChild} content
 * @param {GlobalAttributes} [props={}]
 */
export default function AbsoluteStack(content, props = {}) {
    if(!(this instanceof AbsoluteStack)) {
        return new AbsoluteStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'absolute';
}

BaseComponent.extends(AbsoluteStack, PositionStack);

AbsoluteStack.defaultTemplate = null;

/**
 * Registers the render template for AbsoluteStack.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: AbsoluteStack) => NdChild} template
 */
AbsoluteStack.use = function(template) {
    AbsoluteStack.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: AbsoluteStack) => AbsoluteStack} callback
 */
AbsoluteStack.preset = function(name, callback) {
    if(AbsoluteStack.prototype[name] || AbsoluteStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in AbsoluteStack.`);
        return;
    }
    AbsoluteStack[name] = (content, props) => callback(new AbsoluteStack(content, props));
};

/**
 * @param {Record<string, (s: AbsoluteStack) => AbsoluteStack>} presets
 */
AbsoluteStack.presets = function(presets) {
    for(const name in presets) {
        AbsoluteStack.preset(name, presets[name]);
    }
};