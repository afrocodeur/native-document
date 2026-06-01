import Validator from '../core/utils/validator';
import {Anchor} from '../../elements';
import {ElementCreator} from '../core/wrappers/ElementCreator';

/**
 *
 * @param {Router} router
 * @param {?HTMLElement} container
 */
export function RouterComponent(router, container) {

    const $cache = new Map();
    const $layoutCache = new WeakMap();
    const $routeInstanceAnchors = new WeakMap();
    let $currentLayout = null;

    let $lastNodeInserted  = null;

    const $lifecycles = new Map();
    let $currentPath = null;

    const getNodeAnchorForLayout = (node, path) => {
        const existingAnchor = $routeInstanceAnchors.get(node);
        if(existingAnchor) {
            return existingAnchor;
        }

        let anchor = node;
        if(!Validator.isAnchor(node)) {
            anchor = Anchor(path);
            anchor.appendChild(node);
        }
        $routeInstanceAnchors.set(node, anchor);
        return anchor;
    };

    const removeLastNodeInserted = () => {
        $lastNodeInserted?.remove();
    };

    const cleanContainer = () => {
        container.nodeValue = '';
        removeLastNodeInserted();

        if($currentLayout) {
            $currentLayout.remove();
        }
    };

    const getNodeToInsert = (node) => {
        let nodeToInsert = node;
        if(Validator.isNDElement(node)) {
            nodeToInsert = node.node();
        }
        return nodeToInsert;
    };

    const updateContainerByLayout = (layout, node, route, path) => {
        const nodeToInsert = getNodeToInsert(node);

        const cachedLayout = $layoutCache.get(nodeToInsert);
        if(cachedLayout) {
            if(cachedLayout === $currentLayout) {
                const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
                removeLastNodeInserted();
                $lastNodeInserted = nodeToInsert;
                layoutAnchor.replaceContent(nodeToInsert);
                return;
            }
            cleanContainer();
            $lastNodeInserted = nodeToInsert;
            $currentLayout = cachedLayout;
            const layoutAnchor = getNodeAnchorForLayout(nodeToInsert, path);
            layoutAnchor.replaceContent(nodeToInsert);
            container.appendChild($currentLayout);
            return;
        }
        cleanContainer();
        $lastNodeInserted = nodeToInsert;
        const anchor = getNodeAnchorForLayout(nodeToInsert, path);

        $currentLayout = ElementCreator.getChild(layout(anchor));
        $layoutCache.set(nodeToInsert, $currentLayout);
        container.appendChild($currentLayout);
    };

    const updateContainer = function(node, route, path) {
        const layout = route.layout();
        if(layout) {
            updateContainerByLayout(layout, node, route, path);
            return;
        }
        const nodeToInsert = getNodeToInsert(node);

        cleanContainer();
        container.appendChild(nodeToInsert);
        $lastNodeInserted = node;
    };

    const handleCurrentRouterState = function(state) {
        if(!state.route) {
            return;
        }

        const { route, params, query, path } = state;

        if($currentPath && $currentPath !== path) {
            $lifecycles.get($currentPath)?.onLeave?.();
        }

        if($cache.has(path)) {
            const cacheNode = $cache.get(path);
            updateContainer(cacheNode, route);

            $lifecycles.get(path)?.onEnter?.(params, query);
            $currentPath = path;

            return;
        }
        const pathLifecycles = {};
        $lifecycles.set(path, pathLifecycles);



        const Component = route.component();
        const node = Component({
            params,
            query,
            onEnter: (cb) => { pathLifecycles.onEnter = cb; },
            onLeave: (cb) => { pathLifecycles.onLeave = cb; },
        });
        $cache.set(path, node);
        updateContainer(node, route, path);

        pathLifecycles.onEnter?.(params, query);
        $currentPath = path;
    };

    router.subscribe(handleCurrentRouterState);

    handleCurrentRouterState(router.currentState());
    return container;
}