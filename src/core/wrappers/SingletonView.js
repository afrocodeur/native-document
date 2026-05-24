import Anchor from "../elements/anchor/anchor";


export function SingletonView($viewCreator) {
    let $cacheNode = null;
    let $components = null;

    this.render = (data) => {
        if(!$cacheNode) {
            $cacheNode = $viewCreator(this);
        }
        if(!$components) return $cacheNode;

        const updates = data[0];
        if(updates && typeof updates === 'object') {
            for(const key in updates) {
                if($components[key]) {
                    $components[key](updates[key]);
                }
            }
        }
        return $cacheNode;
    };

    this.createSection = (name, fn) => {
        $components = $components || {};
        const anchor = Anchor('Component ' + name);

        $components[name] = function(content) {
            anchor.removeChildren();
            if(!fn) {
                anchor.append(content);
                return;
            }
            anchor.appendChild(fn(content));
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