import Anchor from '../elements/anchor/anchor';

/**
 * Creates a singleton view — a component that is instantiated only once,
 * then reused across multiple renders. Useful for performance-critical components
 * that are frequently shown/hidden or repeated in lists.
 *
 * @constructor
 * @param {(instance: SingletonView) => Node} $viewCreator - Function that builds the view once and returns the root node.
 * Receives the SingletonView instance so it can call .createSection().
 * @example
 * const Card = useSingleton((view) => {
 *   const nameSection = view.createSection('name');
 *   return Div({ class: 'card' }, nameSection);
 * });
 * Card([{ name: 'John' }]); // Renders once, reused on subsequent calls
 */
export function SingletonView($viewCreator) {
    let $cacheNode = null;
    let $components = null;


    /**
     * Renders the singleton view with the given data.
     * On the first call, create the view by calling $viewCreator.
     * On later calls, updates registered sections via their update functions.
     *
     * @param {Array} data - Array where data[0] is an object mapping section names to new content
     * @returns {Node} The cached root node
     */
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


    /**
     * Creates a named anchor section inside the singleton view.
     * The section can be updated later by passing new content through .render().
     *
     * @param {string} name - Unique section name used as the update key
     * @param {((content: *) => Node)?} [fn] - Optional transform function applied to new content before inserting
     * @returns {AnchorDocumentFragment} Anchor fragment to place inside the view's DOM
     * @example
     * const nameSection = view.createSection('name');
     * // Later: Card([{ name: 'Jane' }]); // replaces content in nameSection
     */
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


/**
 * Creates a memoized factory that returns a SingletonView instance.
 * The singleton is created on the first call and reused for all subsequent calls.
 *
 * @param {(instance: SingletonView) => Node} fn - View creator function passed to SingletonView
 * @returns {(...args: any[]) => Node} Function that renders the singleton with the given data
 * @example
 * const Card = useSingleton((view) => {
 *   const title = view.createSection('title');
 *   return Div({}, title);
 * });
 * Card([{ title: 'Hello' }]);
 */
export function useSingleton(fn) {
    let $cache = null;

    return function(...args) {
        if(!$cache) {
            $cache = new SingletonView(fn);
        }
        return $cache.render(args);
    };
}