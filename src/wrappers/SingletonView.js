import Anchor from "../elements/anchor";


export function SingletonView($viewCreator) {
    let $cacheNode = null;
    let $components = null;

    this.render = (data) => {
        if(!$cacheNode) {
            $cacheNode = $viewCreator(this);
        }
        if(!$components) {
            return $cacheNode;
        }
        for(const index in $components) {
            const updater = $components[index];
            updater(...data);
        }
        return $cacheNode;
    };

    this.createSection = (name, fn) => {
        $components = $components || {};
        const anchor = new Anchor('Component '+name);

        $components[name] = function(...args) {
            anchor.removeChildren();
            if(!fn) {
                anchor.append(args);
                return;
            }
            anchor.appendChild(fn(...args));
        };
        return anchor;
    };
}


export function useSingleton(fn) {
    let $cache = null;

    return function(...args) {
        if(!$cache) {
            $cache = new SingletonView(fn);
        }
        return $cache.render(args);
    };
}