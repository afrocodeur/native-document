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
export default function FixedStack(content, props = {}) {
    if(!(this instanceof FixedStack)) {
        return new FixedStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'fixed';
    this.aria = {};
}

BaseComponent.extends(FixedStack, PositionStack);

FixedStack.defaultTemplate = null;

/**
 * Registers the render template for FixedStack.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: FixedStack) => NdChild} template
 */
FixedStack.use = function(template) {
    FixedStack.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: FixedStack) => FixedStack} callback
 */
FixedStack.preset = function(name, callback) {
    if(FixedStack.prototype[name] || FixedStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in FixedStack.`);
        return;
    }
    FixedStack[name] = (content, props) => callback(new FixedStack(content, props));
};

/**
 * @param {Record<string, (s: FixedStack) => FixedStack>} presets
 */
FixedStack.presets = function(presets) {
    for(const name in presets) {
        FixedStack.preset(name, presets[name]);
    }
};