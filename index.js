export { default as HtmlElementWrapper, ElementCreator } from './src/wrappers/HtmlElementWrapper'

import './src/utils/prototypes.js';

export * from './src/utils/args-types';
export * from './src/data/Observable';
export * from './src/data/Store';
import * as elements from './elements';
import * as router from './router';

export { elements, router};
