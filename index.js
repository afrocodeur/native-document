export { default as HtmlElementWrapper } from './src/wrappers/HtmlElementWrapper'
export { ElementCreator } from './src/wrappers/ElementCreator'

import './src/utils/prototypes.js';

export * from './src/utils/plugins-manager';
export * from './src/utils/args-types';
export * from './src/utils/validator'
export * from './src/data/Observable';
export * from './src/data/observable-helpers/array';
export * from './src/data/observable-helpers/batch';
export * from './src/data/observable-helpers/object';
export * from './src/data/observable-helpers/computed';
export * from './src/data/Store';
import * as elements from './elements';
import * as router from './router';

export { elements, router};
