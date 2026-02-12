import {trim} from "../core/utils/helpers.js";

export const RouteParamPatterns = {

};

/**
 * Creates a new Route instance.
 *
 * @param {string} $path - URL pattern with optional parameters (e.g., '/user/{id:number}')
 * @param {Function} $component - Component function that returns HTMLElement or DocumentFragment
 * @param {Object} [$options={}] - Route configuration options
 * @param {string} [$options.name] - Unique name for the route (used for navigation)
 * @param {Function[]} [$options.middlewares] - Array of middleware functions
 * @param {boolean} [$options.shouldRebuild] - Whether to rebuild component on each navigation
 * @param {Object} [$options.with] - Custom parameter validation patterns
 * @param {Function} [$options.layout] - Layout component wrapper function
 */
export function Route($path, $component, $options = {}) {

    $path = '/'+trim($path, '/').replace(/\/+/, '/');

    let $pattern = null;
    let $name = $options.name || null;

    const $middlewares = $options.middlewares || [];
    const $shouldRebuild = $options.shouldRebuild || false;
    const $paramsValidators = $options.with || {};
    const $layout = $options.layout  || null;

    const $params = {};
    const $paramsNames = [];


    const paramsExtractor = (description) => {
        if(!description) return null;
        const [name, type] = description.split(':');

        let pattern = $paramsValidators[name];
        if(!pattern && type) {
            pattern = RouteParamPatterns[type];
        }
        if(!pattern) {
            pattern = '[^/]+';
        }

        pattern = pattern.replace('(', '(?:');

        return { name, pattern: `(${pattern})` };
    };

    const getPattern = () => {
        if($pattern) {
            return $pattern;
        }

        const patternDescription = $path.replace(/\{(.*?)}/ig, (block, definition) => {
            const description = paramsExtractor(definition);
            if(!description || !description.pattern) return block;
            $params[description.name] = description.pattern;
            $paramsNames.push(description.name);
            return description.pattern;
        });

        $pattern = new RegExp('^'+patternDescription+'$');
        return $pattern;
    };

    this.name = () => $name;
    this.component = () => $component;
    this.middlewares = () => $middlewares;
    this.shouldRebuild = () => $shouldRebuild;
    this.path = () => $path;
    this.layout = () => $layout;

    /**
     *
     * @param {string} path
     */
    this.match = function(path) {
        path = '/'+trim(path, '/');
        const match = getPattern().exec(path);
        if(!match) return false;
        const params = {};

        getPattern().exec(path).forEach((value, index) => {
            if(index < 1) return;
            const name = $paramsNames[index - 1];
            params[name] = value;
        });

        return params;
    };
    /**
     * @param {{params: ?Object, query: ?Object, basePath: ?string}} configs
     */
    this.url = function(configs) {
        const path = $path.replace(/\{(.*?)}/ig, (block, definition) => {
            const description = paramsExtractor(definition);
            if(configs.params && configs.params[description.name]) {
                return configs.params[description.name];
            }
            throw new Error(`Missing parameter '${description.name}'`);
        });

        const queryString = (typeof configs.query === 'object') ? (new URLSearchParams(configs.query)).toString() : null;
        return (configs.basePath ? configs.basePath : '') + (queryString ? `${path}?${queryString}` : path);
    }
}