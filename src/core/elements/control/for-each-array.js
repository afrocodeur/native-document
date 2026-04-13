import Anchor from "../anchor/anchor";
import { ElementCreator } from "../../wrappers/ElementCreator";
import NativeDocumentError from "../../errors/NativeDocumentError";


const CREATE_AND_CACHE_ACTIONS = new Set(['clear', 'push', 'unshift', 'replace']);

const SELF_RENDER = (item) => item;

/**
 * Renders items from an ObservableArray with optimized array-specific updates.
 * Provides index observables and handles array mutations efficiently.
 *
 * @param {ObservableArray} data - ObservableArray to iterate over
 * @param {((item: *, index: null|ObservableItem) => NdChild)?} callback - Function that renders each item (item, indexObservable) => ValidChild
 * @param {Object?} [configs={}] - Configuration options
 * @param {boolean} [configs.shouldKeepItemsInCache] - Whether to cache rendered items
 * @param {boolean} [configs.isParentUniqueChild] - When it's the only child of the parent
 * @returns {AnchorDocumentFragment} Fragment managing the list rendering
 * @example
 * const items = Observable.array([1, 2, 3]);
 * ForEachArray(items, (item, index) =>
 *   Div({}, `Item ${item} at index ${index.val()}`)
 * );
 *
 * items.push(4); // Automatically updates DOM
 */
export function ForEachArray(data, callback, configs = {}) {
    callback = callback || SELF_RENDER;
    const element = Anchor('ForEach Array', configs.isParentUniqueChild);
    const blockEnd = element.endElement();

    let cache = new Map();
    let lastNumberOfItems = 0;
    const isIndexRequired = callback.length >= 2;

    const clear = (items) => {
        element.removeChildren();
        cleanCache(items);
        lastNumberOfItems = 0;
    };

    const getItemChild = (item) => {
        return cache.get(item)?.child;
    };

    const removeCacheItem = (item, removeChild = true) => {
        const cacheItem = cache.get(item);
        if(!cacheItem) {
            return;
        }
        if(removeChild) {
            const child = cacheItem.child;
            child?.remove();
            cache.delete(item);
        }
        cacheItem.indexObserver?.cleanup();
    };

    const createAndCache = (item) => {
        const child = ElementCreator.getChild(callback(item, null));
        if(process.env.NODE_ENV === 'development') {
            if(!child) {
                throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
            }
        }
        cache.set(item, { child, indexObserver: null });
        return child;
    };

    let createWithIndexAndCache = (item, indexKey) => {
        const indexObserver = data.transform((items) =>  items.indexOf(item));
        const child = ElementCreator.getChild(callback(item, indexObserver));
        if(process.env.NODE_ENV === 'development') {
            if(!child) {
                throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
            }
        }
        cache.set(item, { child, indexObserver  });
        return child;
    };
    if(!data.__$Observable) {
        createWithIndexAndCache = (item, indexKey) => {
            const child = ElementCreator.getChild(callback(item, indexKey));
            if(process.env.NODE_ENV === 'development') {
                if(!child) {
                    throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
                }
            }
            cache.set(item, { child, indexObserver: null  });
            return child;
        };
    }

    const getOrCreate = (item, indexKey) => {
        const cacheItem = cache.get(item);
        if(cacheItem) {
            cacheItem.indexObserver?.set(indexKey);
            return cacheItem.child;
        }
        return createAndCache(item, indexKey);
    };

    let buildItem = createAndCache;
    const selectBuildStrategy = (action = null) => {
        if(CREATE_AND_CACHE_ACTIONS.has(action)) {
            buildItem = isIndexRequired ? createWithIndexAndCache : createAndCache;
            return;
        }
        buildItem = cache.size ? getOrCreate : (isIndexRequired ? createWithIndexAndCache : createAndCache);
    };


    let cleanCache;

    if(!isIndexRequired) {
        cleanCache = cache.clear.bind(cache);
    }
    else if(configs.shouldKeepItemsInCache) {
        cleanCache = () => {};
    } else {
        cleanCache = (items) => {
            for (const [itemAsKey, _] of cache.entries()) {
                if(items && items.includes(itemAsKey)) {
                    continue;
                }
                removeCacheItem(itemAsKey, false);
            }
        };
    }

    const removeByItem = (item, fragment) => {
        const cacheItem = cache.get(item);
        if(!cacheItem) {
            return null;
        }
        const child = cacheItem.child;
        if(!child) {
            return null;
        }

        if(fragment) {
            fragment.appendChild(child);
            return;
        }
        child.remove();
    };

    let set = null;
    if(Array.isArray(data)) {
        set = () => {
            clear(data);
            element.appendChildRaw(Actions.toFragment(data));
        };
    }
    else {
        set = () => {
            const items = data.val();
            clear(items);
            element.appendChildRaw(Actions.toFragment(items));
        };
    }

    const Actions = {
        toFragment: (items) =>{
            const fragment = document.createDocumentFragment();
            for(let i = 0, length = items.length; i < length; i++) {
                fragment.appendChild(buildItem(items[i], lastNumberOfItems));
                lastNumberOfItems++;
            }
            return fragment;
        },
        add: (items) => {
            element.appendChildRaw(Actions.toFragment(items));
        },
        replace: (items) => {
            clear(items);
            element.appendChildRaw(Actions.toFragment(items));
        },
        set,
        reOrder: (items) => {
            let child = null;
            const fragment = document.createDocumentFragment();
            for(const item of items) {
                child = getItemChild(item);
                if(child) {
                    fragment.appendChild(child);
                }
            }
            child = null;
            element.appendElementRaw(fragment);
        },
        removeOne: (element, index) => {
            removeCacheItem(element, true);
        },
        clear,
        populate: ([target, iteration, callback]) => {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < iteration; i++) {
                const data = callback(i);
                target.push(data);
                fragment.append(buildItem(data, i));
                lastNumberOfItems++;
            }
            element.appendChildRaw(fragment);
            fragment.replaceChildren();
        },
        unshift: (values) => {
            element.insertAtStartRaw(Actions.toFragment(values));
        },
        splice: (args, deleted) => {
            const [start, deleteCount, ...values] = args;
            let elementBeforeFirst = null;
            const garbageFragment = document.createDocumentFragment();

            if(deleted.length > 0) {
                let firstItem = deleted[0];
                if(deleted.length === 1) {
                    removeByItem(firstItem, garbageFragment);
                } else if(deleted.length > 1) {
                    const firstChildRemoved = getItemChild(deleted[0]);
                    elementBeforeFirst = firstChildRemoved?.previousSibling;

                    for(let i = 0; i < deleted.length; i++) {
                        removeByItem(deleted[i], garbageFragment);
                    }
                }
            } else {
                const indexBefore =  (start - 1 >= 0) ? start - 1 : start;
                const itemAtStart = data.at(indexBefore);
                elementBeforeFirst = getItemChild(itemAtStart) || blockEnd.previousSibling;
            }
            garbageFragment.replaceChildren();

            if(values && values.length && elementBeforeFirst) {
                element.insertBeforeRaw(Actions.toFragment(values), elementBeforeFirst.nextSibling);
            }

        },
        reverse: (_, reversed) => {
            Actions.reOrder(reversed);
        },
        sort: (_, sorted) => {
            Actions.reOrder(sorted);
        },
        remove: (_, deleted)=> {
            Actions.removeOne(deleted);
        },
        pop: (_, deleted) => {
            Actions.removeOne(deleted);
        },
        shift: (_, deleted) => {
            Actions.removeOne(deleted);
        },
        swap: (args, elements) => {
            const parent = element.getParent();

            let childA = getItemChild(elements[0]);
            let childB = getItemChild(elements[1]);
            if(!childA || !childB) {
                return;
            }

            const childBNext = childB.nextSibling;
            parent.insertBefore(childB, childA);
            parent.insertBefore(childA, childBNext);
            childA = null;
            childB = null;
        }
    };
    Actions.merge = Actions.add;
    Actions.push = Actions.add;

    const buildContent = (items, _, operations = {}) => {
        selectBuildStrategy(operations.action);

        if(Actions[operations.action]) {
            Actions[operations.action](operations.args, operations.result);
        }
    };

    if(Array.isArray(data)) {
        buildContent(data, null, { action: 'set' });
        return element;
    }

    if(data.val().length) {
        buildContent(data.val(), null, { action: 'set' });
    }
    data.subscribe(buildContent);
    return element;
}