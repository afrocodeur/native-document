import Validator from "@src/core/utils/validator";

/**
 *
 * @param {Router} router
 * @param {?HTMLElement} container
 */
export function RouterComponent(router, container) {

    const $cache = new Map();
    let $lastNodeInserted  = null;

    const updateContainer = function(node, route) {
        container.innerHTML = '';
        let nodeToInsert = node;
        const layout = route.layout();
        if(Validator.isNDElement(node)) {
            nodeToInsert = node.node();
        }
        if(layout) {
            container.appendChild(layout(nodeToInsert));
            return;
        }
        if(Validator.isAnchor($lastNodeInserted)) {
            $lastNodeInserted.remove();
        }
        container.appendChild(nodeToInsert);
        $lastNodeInserted = node;
    };

    const handleCurrentRouterState = function(state) {
        if(!state.route) {
            return;
        }
        const { route, params, query, path } = state;
        if($cache.has(path)) {
            const cacheNode = $cache.get(path);
            updateContainer(cacheNode, route);
            return;
        }
        const Component = route.component();
        const node = Component({ params, query });
        $cache.set(path, node);
        updateContainer(node, route);
    };

    router.subscribe(handleCurrentRouterState);

    handleCurrentRouterState(router.currentState());
    return container;
}