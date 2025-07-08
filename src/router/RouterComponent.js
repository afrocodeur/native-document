/**
 *
 * @param {Router} router
 * @param {?HTMLElement} container
 */
export function RouterComponent(router, container) {

    const $cache = new Map();

    const updateContainer = function(node) {
        container.innerHTML = '';
        container.appendChild(node);
    };

    const handleCurrentRouterState = function(state) {
        if(!state.route) {
            return;
        }
        const { route, params, query, path } = state;
        if($cache.has(path)) {
            const cacheNode = $cache.get(path);
            console.log(cacheNode);
            updateContainer(cacheNode);
            return;
        }
        const Component = route.component()
        const node = Component({ params, query });
        $cache.set(path, node);
        updateContainer(node);
    };

    router.subscribe(handleCurrentRouterState);

    handleCurrentRouterState(router.currentState());
    return container;
}