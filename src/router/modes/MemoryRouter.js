
export default function MemoryRouter() {
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
        this.handleRouteChange(route, params, query, path);
    };

    const canGoBack = function() {
        return $currentIndex > 0;
    };
    const canGoForward = function() {
        return $currentIndex < $history.length - 1;
    };

    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.push = function(target) {
        const { route, params, query, path} = this.resolve(target);
        if($history[$currentIndex] && $history[$currentIndex].path === path) {
            return;
        }
        $history.splice($currentIndex + 1);
        $history.push({ route, params, query, path });
        $currentIndex++;
        this.handleRouteChange(route, params, query, path);
    };

    /**
     *
     * @param {string|{name:string,params?:Object, query?:Object }} target
     */
    this.replace = function(target) {
        const { route, params, query, path} = this.resolve(target);
        $history[$currentIndex] = { route, params, query, path };
        this.handleRouteChange(route, params, query, path);
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
        const currentPath = defaultPath || (window.location.pathname + window.location.search);
        const { route, params, query, path } = this.resolve(currentPath);
        $history.push({ route, params, query, path });
        $currentIndex = 0;

        this.handleRouteChange(route, params, query, path);
    }
};