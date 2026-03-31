import {Route} from "./Route.js";
import Validator from "../core/utils/validator.js";
import RouterError from "./errors/RouterError.js";
import {RouteGroupHelper} from "./RouteGroupHelper.js";
import {trim} from "../core/utils/helpers.js";
import HashRouter from "./modes/HashRouter.js";
import HistoryRouter from "./modes/HistoryRouter.js";
import MemoryRouter from "./modes/MemoryRouter.js";
import DebugManager from "../core/utils/debug-manager.js";
import {RouterComponent} from "./RouterComponent.js";

export const DEFAULT_ROUTER_NAME = 'default';

/**
 *
 * @param {{mode: 'memory'|'history'|'hash'}} $options
 * @class
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
     * @param {{name:?string, middlewares:Function[], shouldRebuild:Boolean, with: Object, layout: Function }} options
     * @returns {this}
     */
    this.add = function(path, component, options) {
        const route = new Route(RouteGroupHelper.fullPath($groupTree, path), component, {
            ...options,
            middlewares: RouteGroupHelper.fullMiddlewares($groupTree, options?.middlewares || []),
            name: options?.name ? RouteGroupHelper.fullName($groupTree, options.name) : null,
            layout: options?.layout || RouteGroupHelper.layout($groupTree)
        });
        $routes.push(route);
        if(route.name()) {
            $routesByName[route.name()] = route;
        }
        return this;
    };

    /**
     * Groups routes under a common path prefix with shared options.
     *
     * @param {string} suffix - Path prefix to prepend to all routes in the group
     * @param {Object} options - Group configuration options
     * @param {Function[]} [options.middlewares] - Middlewares applied to all routes in group
     * @param {string} [options.name] - Name prefix for all routes in group
     * @param {Function} [options.layout] - Layout component for all routes in group
     * @param {Function} callback - Function that defines routes within the group
     * @returns {this} Router instance for chaining
     * @example
     * router.group('/admin', { middlewares: [authMiddleware], layout: AdminLayout }, () => {
     *   router.add('/users', UsersPage, { name: 'users' });
     *   router.add('/settings', SettingsPage, { name: 'settings' });
     * });
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

        return { route: routeFound, params, query: queryParams, path: target };
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
 * Creates and initializes a new router instance.
 *
 * @param {Object} options - Router configuration
 * @param {'memory'|'history'|'hash'} options.mode - Routing mode
 * @param {string} [options.name] - Router name for multi-router apps
 * @param {string} [options.entry] - Initial route path
 * @param {Function} callback - Setup function that receives the router instance
 * @returns {Router} The configured router instance with mount() method
 * @example
 * const router = Router.create({ mode: 'history' }, (r) => {
 *   r.add('/home', HomePage, { name: 'home' });
 *   r.add('/about', AboutPage, { name: 'about' });
 * });
 * router.mount('#app');
 */
Router.create = function(options, callback) {
    if(!Validator.isFunction(callback)) {
        DebugManager.error('Router', 'Callback must be a function');
        throw new RouterError('Callback must be a function');
    }
    const router = new Router(options);
    Router.routers[options.name || DEFAULT_ROUTER_NAME] = router;
    callback(router);

    router.init(options.entry);

    router.mount = function(container) {
        if(Validator.isString(container)) {
            const mountContainer = document.querySelector(container);
            if(!mountContainer) {
                throw new RouterError(`Container not found for selector: ${container}`);
            }
            container = mountContainer;
        } else if(!Validator.isElement(container)) {
            throw new RouterError('Container must be a string or an Element');
        }

        return RouterComponent(router, container);
    };

    return router;
};

Router.get = function(name) {
    const router = Router.routers[name || DEFAULT_ROUTER_NAME];
    if(!router) {
        throw new RouterError(`Router not found for name: ${name}`);
    }
    return router;
};

Router.push = function(target, name = null) {
    return Router.get(name).push(target);
};

Router.replace = function(target, name = null) {
    return Router.get(name).replace(target);
};

Router.forward = function(name = null) {
    return Router.get(name).forward();
};
Router.back = function(name = null) {
    return Router.get(name).back();
};

Router.redirectTo = function(pathOrRouteName, params = null, name = null) {
    let target = pathOrRouteName;
    const router = Router.get(name);
    const route = router.resolve({ name: pathOrRouteName, params });
    if(route) {
        target = { name: pathOrRouteName, params}
    }
    console.log(target);
    return router.push(target);
};
