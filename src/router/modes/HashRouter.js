

export default function HashRouter() {

    const $history = [];
    let $currentIndex = 0;

    /**
     *
     * @param {number} delta
     */
    const go = (delta) => {
        const index = $currentIndex + delta;
        if(!$history[index]) {
            return;
        }
        $currentIndex = index;
        const { route, params, query, path } = $history[index];
        setHash(path);
    };

    const canGoBack = function() {
        return $currentIndex > 0;
    };
    const canGoForward = function() {
        return $currentIndex < $history.length - 1;
    };

    /**
     *
     * @param {string} path
     */
    const setHash = (path) => {
        window.location.replace(`${window.location.pathname}${window.location.search}#${path}`);
    }

    const getCurrentHash = () => window.location.hash.slice(1);

    /**
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.push = function(target) {
        const { route, params, query, path } = this.resolve(target);
        if(path === getCurrentHash()) {
            return;
        }
        $history.splice($currentIndex + 1);
        $history.push({ route, params, query, path });
        $currentIndex++;
        setHash(path);
    };
    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.replace = function(target) {
        const { route, params, query, path } = this.resolve(target);
        if(path === getCurrentHash()) {
            return;
        }
        $history[$currentIndex] = { route, params, query, path };
    };
    this.forward = function() {
        return canGoForward() && go(1);
    };
    this.back = function() {
        return canGoBack() && go(-1);
    };

    /**
     * @param {string} defaultPath
     */
    this.init = function(defaultPath) {
        window.addEventListener('hashchange', () => {
            const { route, params, query, path } = this.resolve(getCurrentHash());
            this.handleRouteChange(route, params, query, path);
        });
        const { route, params, query, path } = this.resolve(defaultPath || getCurrentHash());
        $history.push({ route, params, query, path });
        $currentIndex = 0;
        this.handleRouteChange(route, params, query, path);
    }
};