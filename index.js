export { default as HtmlElementWrapper, createTextNode } from './src/core/wrappers/HtmlElementWrapper'
export { ElementCreator } from './src/core/wrappers/ElementCreator';
export { NDElement } from './src/core/wrappers/NDElement';
export { TemplateCloner, useCache } from './src/core/wrappers/TemplateCloner';
export { SingletonView, useSingleton } from './src/core/wrappers/SingletonView';
export { default as PluginsManager } from './src/core/utils/plugins-manager';
export { default as Validator } from './src/core/utils/validator';

import './src/core/utils/prototypes.js';

export * from './src/core/utils/property-accumulator';
export * from './src/core/utils/args-types';
export * from './src/core/utils/memoize';
export * from './src/core/data/Observable';
export * from './src/core/data/observable-helpers/array';
export * from './src/core/data/observable-helpers/batch';
export * from './src/core/data/observable-helpers/object';
export * from './src/core/data/observable-helpers/computed';
export * from './src/core/data/Store';

import * as elements from './elements';
import * as router from './router';
import * as utils from './utils';

export { elements, router, utils };
