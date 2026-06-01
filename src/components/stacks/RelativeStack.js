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
export default function RelativeStack(content, props = {}) {
    if(!(this instanceof RelativeStack)) {
        return new RelativeStack(content, props);
    }
    PositionStack.call(this, content, props);
    this.$description.position = 'relative';
}

BaseComponent.extends(RelativeStack, PositionStack);

RelativeStack.defaultTemplate = null;

/**
 * Registers the render template for RelativeStack.
 * @param {(description: {
 *     [key: string]: *
 * }, instance: RelativeStack) => NdChild} template
 */
RelativeStack.use = function(template) {
    RelativeStack.defaultTemplate = template;
};

/**
 * @param {string} name
 * @param {(s: RelativeStack) => RelativeStack} callback
 */
RelativeStack.preset = function(name, callback) {
    if(RelativeStack.prototype[name] || RelativeStack[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in RelativeStack.`);
        return;
    }
    RelativeStack[name] = (content, props) => callback(new RelativeStack(content, props));
};

/**
 * @param {Record<string, (s: RelativeStack) => RelativeStack>} presets
 */
RelativeStack.presets = function(presets) {
    for(const name in presets) {
        RelativeStack.preset(name, presets[name]);
    }
};