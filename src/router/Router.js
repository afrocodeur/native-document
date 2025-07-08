import {Route} from "./Route.js";
import Validator from "../utils/validator.js";
import RouterError from "../errors/RouterError.js";
import {RouteGroupHelper} from "./RouteGroupHelper.js";
import {trim} from "../utils/helpers.js";
import HashRouter from "./modes/HashRouter.js";
import HistoryRouter from "./modes/HistoryRouter.js";
import MemoryRouter from "./modes/MemoryRouter.js";
import DebugManager from "../utils/debug-manager.js";
import {RouterComponent} from "./RouterComponent.js";

/**
 *
 * @param {{mode: 'memory'|'history'|'hash'}} $options
 * @constructor
 */
export default function Router($options = {}) {

    /** @type {Route[]} */
    const $routes = [];
    /** @type {{[string]: Route}} */
    const $routesByName = {};
    const $groupTree = [];
    const $listeners = [];
    const $currentState = { route: null, params: null, query: null, path: null, hash: null };

    if($options.mode === 'hash') {
        HashRouter.apply(this, []);
    } else if($options.mode === 'history') {
        HistoryRouter.apply(this, []);
    } else if($options.mode === 'memory') {
        MemoryRouter.apply(this, []);
    } else {
        throw new RouterError('Invalid router mode '+$options.mode);
    }

    const trigger = function(request, next) {
        for(const listener of $listeners) {
            try {
                listener(request);
                next && next(request);
            } catch (e) {
                DebugManager.warn('Route Listener', 'Error in listener:', e);
            }
        }
    }

    this.routes = () => [...$routes];
    this.currentState = () => ({ ...$currentState });

    /**
     *
     * @param {string} path
     * @param {Function} component
     * @param {{name:?string, middlewares:Function[], shouldRebuild:Boolean, with: Object }} options
     * @returns {this}
     */
    this.add = function(path, component, options) {
        const route = new Route(RouteGroupHelper.fullPath($groupTree, path), component, {
            ...options,
            middlewares: RouteGroupHelper.fullMiddlewares($groupTree, options.middlewares),
            name: options.name ? RouteGroupHelper.fullName($groupTree, options.name) : null,
        });
        $routes.push(route);
        if(route.name()) {
            $routesByName[route.name()] = route;
        }
        return this;
    };

    /**
     *
     * @param {string} suffix
     * @param {{ middlewares: Function[], name: string}} options
     * @param {Function} callback
     * @returns {this}
     */
    this.group = function(suffix, options, callback) {
        if(!Validator.isFunction(callback)) {
            throw new RouterError('Callback must be a function');
        }
        $groupTree.push({suffix, options});
        callback();
        $groupTree.pop();
        return this;
    };

    /**
     *
     * @param {string} name
     * @param {Object}params
     * @param {Object} query
     * @returns {*}
     */
    this.generateUrl = function(name, params = {}, query = {}) {
        const route = $routesByName[name];
        if(!route) {
            throw new RouterError(`Route not found for name: ${name}`);
        }
        return route.url({ params, query });
    };

    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     * @returns {{route:Route, params:Object, query:Object, path:string}}
     */
    this.resolve = function(target) {
        if(Validator.isJson(target)) {
            const route = $routesByName[target.name];
            if(!route) {
                throw new RouterError(`Route not found for name: ${target.name}`);
            }
            return {
                route,
                params: target.params,
                query: target.query,
                path: route.url({ ...target })
            };
        }

        const [urlPath, urlQuery] = target.split('?');
        const path = '/'+trim(urlPath, '/');
        let routeFound = null, params;

        for(const route of $routes) {
            params = route.match(path);
            if(params) {
                routeFound = route;
                break;
            }
        }
        if(!routeFound) {
            throw new RouterError(`Route not found for url: ${urlPath}`);
        }
        const queryParams = {};
        if(urlQuery) {
            const queries = new URLSearchParams(urlQuery).entries();
            for (const [key, value] of queries) {
                queryParams[key] = value;
            }
        }

        return { route: routeFound, params, query: queryParams, path };
    };

    /**
     *
     * @param {Function} listener
     * @returns {(function(): void)|*}
     */
    this.subscribe = function(listener) {
        if(!Validator.isFunction(listener)) {
            throw new RouterError('Listener must be a function');
        }
        $listeners.push(listener);
        return () => {
            $listeners.splice($listeners.indexOf(listener), 1);
        };
    };

    /**
     *
     * @param {Route} route
     * @param {Object} params
     * @param {Object} query
     * @param {string} path
     */
    this.handleRouteChange = function(route, params, query, path) {
        $currentState.route = route;
        $currentState.params = params;
        $currentState.query = query;
        $currentState.path = path;

        const middlewares = [...route.middlewares(), trigger];
        let currentIndex = 0;
        const request = { ...$currentState };

        const next = (editableRequest) => {
            currentIndex++;
            if(currentIndex >= middlewares.length) {
                return;
            }
            return middlewares[currentIndex](editableRequest || request, next);
        };
        return middlewares[currentIndex](request, next);
    };

}

Router.routers = {};

/**
 *
 * @param {{mode: 'memory'|'history'|'hash', name:string, entry: string}} options
 * @param {Function} callback
 * @param {Element} container
 */
Router.create = function(options, callback) {
    if(!Validator.isFunction(callback)) {
        DebugManager.error('Router', 'Callback must be a function', e);
        throw new RouterError('Callback must be a function');
    }
    const router = new Router(options);
    callback(router);
    Router.routers[options.name || 'default'] = router;

    router.init(options.entry);

    return {
        mount: (container) => {
            if(Validator.isString(container)) {
                const mountContainer = document.querySelector(container);
                if(!mountContainer) {
                    throw new RouterError(`Container not found for selector: ${container}`);
                }
                container = mountContainer;
            } else if(!Validator.isElement(container)) {
                throw new RouterError('Container must be a string or an Element');
            }

            RouterComponent(router, container);
        }
    };
};

Router.get = function(name) {
    return Router.routers[name];
};
