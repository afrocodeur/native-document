import RouterError from '../../errors/RouterError';
import DebugManager from "../../utils/debug-manager.js";

export default function HistoryRouter() {

    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.push = function(target) {
        try {
            const { route, path, params, query } = this.resolve(target);
            if(window.history.state && window.history.state.path === path) {
                return;
            }
            window.history.pushState({ name: route.name(), params, path}, route.name() || path , path);
            this.handleRouteChange(route, params, query, path);
        } catch (e) {
            DebugManager.error('HistoryRouter', 'Error in pushState', e);
        }
    };
    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.replace = function(target) {
        const { route, path, params } = this.resolve(target);
        try {
            window.history.replaceState({ name: route.name(), params, path}, route.name() || path , path);
            this.handleRouteChange(route, params, {}, path);
        } catch(e) {
            DebugManager.error('HistoryRouter', 'Error in replaceState', e);
        }
    };
    this.forward = function() {
        window.history.forward();
    };

    this.back = function() {
        window.history.back();
    };

    /**
     * @param {string} defaultPath
     */
    this.init = function(defaultPath) {
        window.addEventListener('popstate', (event) => {
            try {
                if(!event.state || !event.state.path) {
                    return;
                }
                const statePath = event.state.path;
                const {route, params, query, path} = this.resolve(statePath);
                if(!route) {
                    return;
                }
                this.handleRouteChange(route, params, query, path);
            } catch(e) {
                DebugManager.error('HistoryRouter', 'Error in popstate event', e);
            }
        });
        const { route, params, query, path } = this.resolve(defaultPath || (window.location.pathname+window.location.search));
        this.handleRouteChange(route, params, query, path);
    }

};