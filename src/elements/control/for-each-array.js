import Anchor from "../anchor";
import {Observable} from "../../data/Observable";
import Validator from "../../utils/validator";
import DebugManager from "../../utils/debug-manager";
import {getKey} from "../../utils/helpers";
import { ElementCreator } from "../../wrappers/ElementCreator";

export function ForEachArray(data, callback, key, configs = {}) {
    const element = new Anchor('ForEach Array');
    const blockEnd = element.endElement();
    const blockStart = element.startElement();

    let cache = new Map();
    let nodeCacheByElement = new WeakMap();
    let lastNumberOfItems = 0;

    const keysCache = new WeakMap();

    const clear = () => {
        element.removeChildren();
        cleanCache();
        lastNumberOfItems = 0;
    };
    const getItemKey = (item, indexKey) => {
        if(keysCache.has(item)) {
            return keysCache.get(item);
        }
        return getKey(item, indexKey, key);
    }

    const updateIndexObservers = (items, startFrom = 0) => {
        if(callback.length < 2) {
            return;
        }
        let index = startFrom;
        for(let i = startFrom, length = items?.length; i < length; i++) {
            const cacheItem = cache.get(getItemKey(items[i], i));
            if(!cacheItem) {
                continue;
            }
            cacheItem.indexObserver?.deref()?.set(index);
            index++;
        }
    };

    const removeCacheItem = (cacheItem, removeChild = true) => {
        if(!cacheItem) {
            return;
        }
        const child = cacheItem.child?.deref();
        cacheItem.indexObserver?.deref()?.cleanup();
        cacheItem.child = null;
        cacheItem.indexObserver = null;
        nodeCacheByElement.delete(cacheItem.item);
        keysCache.delete(cacheItem.item);
        cacheItem.item = null;
        if(removeChild) {
            child?.remove();
            cache.delete(cacheItem.keyId);
        }
    }

    const removeCacheItemByKey = (keyId, removeChild = true) => {
        removeCacheItem(cache.get(keyId), removeChild);
    };

    const cleanCache = () => {
        for (const [keyId, cacheItem] of cache.entries()) {
            removeCacheItem(cacheItem, false);
        }
        cache.clear();
    }

    const buildItem = (item, indexKey) => {
        const keyId = getItemKey(item, indexKey);

        if(cache.has(keyId)) {
            const cacheItem = cache.get(keyId);
            cacheItem.indexObserver?.deref()?.set(indexKey);
            cacheItem.isNew = false;
            const child = cacheItem.child?.deref();
            if(child) {
                return child;
            }
            cache.delete(keyId);
        }

        try {
            const indexObserver = callback.length >= 2 ? Observable(indexKey) : null;
            let child = ElementCreator.getChild(callback(item, indexObserver));
            cache.set(keyId, {
                keyId,
                isNew: true,
                item,
                child: new WeakRef(child),
                indexObserver: (indexObserver ? new WeakRef(indexObserver) : null)
            });
            keysCache.set(item, keyId);
            if(Validator.isObject(item)) {
                nodeCacheByElement.set(item, child);
            }
            return child;
        } catch (e) {
            DebugManager.error('ForEach', `Error creating element for key ${keyId}` , e);
            throw e;
        }
    };
    const getChildByKey = function(keyId, fragment) {
        const cacheItem = cache.get(keyId);
        if(!cacheItem) {
            return null;
        }
        const child = cacheItem.child?.deref();
        if(!child) {
            removeCacheItem(cacheItem, false);
            return null;
        }
        return child;
    };

    const removeByKey = function(keyId, fragment) {
        const cacheItem = cache.get(keyId);
        if(!cacheItem) {
            return null;
        }
        const child = cacheItem.child?.deref();
        if(!child) {
            return null;
        }

        if(fragment) {
            fragment.appendChild(child);
            return;
        }
        child.remove();
    }

    const Actions = {
        toFragment(items, startIndexFrom = 0){
            const fragment = document.createDocumentFragment();
            for(let i = 0, length = items.length; i < length; i++) {
                fragment.append(buildItem(items[i], lastNumberOfItems));
                lastNumberOfItems++;
            }
            return fragment;
        },
        add(items, delay = 0) {
            setTimeout(() => {
                element.appendElement(Actions.toFragment(items))
            }, delay);
        },
        replace(items) {
            clear();
            Actions.add(items);
        },
        reOrder(items) {
            let child = null;
            const fragment = document.createDocumentFragment();
            for(const item of items) {
                child = nodeCacheByElement.get(item);
                if(child) {
                    fragment.appendChild(child);
                }
            }
            child = null;
            element.appendElement(fragment, blockEnd);
        },
        removeOne(element, index) {
            let child = nodeCacheByElement.get(element);
            if(child) {
                child.remove();
                nodeCacheByElement.delete(element);
                removeCacheItemByKey(getItemKey(element, index));
            }
            child = null;
        },
        clear,
        merge(items) {
            Actions.add(items, 0);
        },
        push(items) {
            let delay = 0;
            if(configs.pushDelay) {
                delay = configs.pushDelay(items) ?? 0;
            }

            Actions.add(items, delay);
        },
        populate([target, iteration, callback]) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < iteration; i++) {
                const data = callback(i);
                target.push(data);
                fragment.append(buildItem(data, i));
                lastNumberOfItems++;
            }
            element.appendChild(fragment);
            fragment.replaceChildren();
        },
        unshift(values){
            element.insertBefore(Actions.toFragment(values), blockStart.nextSibling);
        },
        splice(args, deleted) {
            const [start, deleteCount, ...values] = args;
            let elementBeforeFirst = null;
            const garbageFragment = document.createDocumentFragment();

            if(deleted.length > 0) {
                let firstKey = getItemKey(deleted[0], start);
                if(deleted.length === 1) {
                    removeByKey(firstKey, garbageFragment);
                } else if(deleted.length > 1) {
                    const firstChildRemoved = getChildByKey(firstKey);
                    elementBeforeFirst = firstChildRemoved?.previousSibling;

                    for(let i = 0; i < deleted.length; i++) {
                        const keyId = getItemKey(deleted[i], start + i, key);
                        removeByKey(keyId, garbageFragment);
                    }
                }
            } else {
                elementBeforeFirst = blockEnd;
            }
            garbageFragment.replaceChildren();

            if(values && values.length && elementBeforeFirst) {
                element.insertBefore(Actions.toFragment(values), elementBeforeFirst.nextSibling);
            }

        },
        reverse(_, reversed) {
            Actions.reOrder(reversed);
        },
        sort(_, sorted) {
            Actions.reOrder(sorted);
        },
        remove(_, deleted) {
            Actions.removeOne(deleted);
        },
        pop(_, deleted) {
            Actions.removeOne(deleted);
        },
        shift(_, deleted) {
            Actions.removeOne(deleted);
        },
        swap(args, elements) {
            const parent = blockEnd.parentNode;

            let childA = nodeCacheByElement.get(elements[0]);
            let childB = nodeCacheByElement.get(elements[1]);
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

    const buildContent = (items, _, operations) => {
        if(operations?.action === 'populate') {
            Actions.populate(operations.args, operations.result);
        } else  {
            console.log(lastNumberOfItems);
            if(operations.action === 'clear' || !items.length) {
                if(lastNumberOfItems === 0) {
                    return;
                }
                clear();
            }

            if(!operations?.action) {
                if(lastNumberOfItems === 0) {
                    Actions.add(items);
                    return;
                }
                Actions.replace(items);
            }
            else if(Actions[operations.action]) {
                Actions[operations.action](operations.args, operations.result);
            }
        }

        console.log(items)
        updateIndexObservers(items, 0);
    };

    buildContent(data.val(), null, {action: null});
    if(Validator.isObservable(data)) {
        data.subscribe(buildContent);
    }

    return element;
}