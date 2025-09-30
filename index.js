export { default as HtmlElementWrapper, createTextNode } from './src/wrappers/HtmlElementWrapper'
export { ElementCreator } from './src/wrappers/ElementCreator';
export { NDElement } from './src/wrappers/NDElement';
export { TemplateCloner, useCache } from './src/wrappers/TemplateCloner';
export { default as PluginsManager } from './src/utils/plugins-manager';

import './src/utils/prototypes.js';

export * from './src/utils/property-accumulator';
export * from './src/utils/args-types';
export * as Validator from './src/utils/validator'
export * from './src/data/Observable';
export * from './src/data/observable-helpers/array';
export * from './src/data/observable-helpers/batch';
export * from './src/data/observable-helpers/object';
export * from './src/data/observable-helpers/computed';
export * from './src/data/Store';
import * as elements from './elements';
import * as router from './router';

export { elements, router};
