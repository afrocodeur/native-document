import Anchor from "../../elements/anchor";
import {Observable} from "../../data/Observable";
import Validator from "../../utils/validator";
import { ElementCreator } from "../../wrappers/ElementCreator";
import NativeDocumentError from "../../errors/NativeDocumentError";

export function ForEachArray(data, callback, configs = {}) {
    const element = Anchor('ForEach Array');
    const blockEnd = element.endElement();
    const blockStart = element.startElement();

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

    const updateIndexObservers = (items, startFrom = 0) => {
        if(!isIndexRequired) {
            return;
        }
        let index = startFrom;
        for(let i = startFrom, length = items?.length; i < length; i++) {
            const cacheItem = cache.get(items[i]);
            if(!cacheItem) {
                continue;
            }
            cacheItem.indexObserver?.set(index);
            index++;
        }
    };

    const removeCacheItem = (item, removeChild = true) => {
        const cacheItem = cache.get(item);
        if(!cacheItem) {
            return;
        }
        if(removeChild) {
            const child = cacheItem.child;
            child?.remove();
            cache.delete(cacheItem.keyId);
        }
        cacheItem.indexObserver?.cleanup();
    };

    const cleanCache = (items) => {
        if(configs.shouldKeepItemsInCache) {
            return;
        }
        if(!isIndexRequired) {
            cache.clear();
            return;
        }
        for (const [itemAsKey, _] of cache.entries()) {
            if(items && items.contains(itemAsKey)) {
                continue;
            }
            removeCacheItem(itemAsKey, false);
        }
        cache.clear();
    }

    const buildItem = (item, indexKey) => {
        const cacheItem = cache.get(item);
        if(cacheItem) {
            cacheItem.indexObserver?.set(indexKey);
            const child = cacheItem.child;
            if(child) {
                return child;
            }
            cache.delete(item);
        }

        const indexObserver = isIndexRequired ? Observable(indexKey) : null;
        let child = ElementCreator.getChild(callback(item, indexObserver));
        if(child) {
            cache.set(item, {
                child,
                indexObserver
            });
            return child;
        }

        throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
    };

    const removeByItem = function(item, fragment) {
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
    }

    const Actions = {
        toFragment(items, startIndexFrom = 0){
            const fragment = document.createDocumentFragment();
            for(let i = 0, length = items.length; i < length; i++) {
                fragment.appendChild(buildItem(items[i], lastNumberOfItems));
                lastNumberOfItems++;
            }
            return fragment;
        },
        add(items, delay = 2) {
            element.appendElement(Actions.toFragment(items));
        },
        replace(items) {
            clear(items);
            Actions.add(items);
        },
        reOrder(items) {
            let child = null;
            const fragment = document.createDocumentFragment();
            for(const item of items) {
                child = getItemChild(item);
                if(child) {
                    fragment.appendChild(child);
                }
            }
            child = null;
            element.appendElement(fragment, blockEnd);
        },
        removeOne(element, index) {
            removeCacheItem(element, true);
        },
        clear,
        merge(items) {
            Actions.add(items);
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
                let firstItem = deleted[0];
                if(deleted.length === 1) {
                    removeByItem(firstItem, garbageFragment);
                } else if(deleted.length > 1) {
                    const firstChildRemoved = getItemChild(deleted[0]);
                    elementBeforeFirst = firstChildRemoved?.previousSibling;

                    for(let i = 0; i < deleted.length; i++) {
                        firstItem(deleted[i], garbageFragment);
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

    const buildContent = (items, _, operations) => {
        if(operations.action === 'clear' || !items.length) {
            if(lastNumberOfItems === 0) {
                return;
            }
            clear();
            return;
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

        updateIndexObservers(items, 0);
    };

    if(data.val().length) {
        buildContent(data.val(), null, {action: null});
    }
    if(Validator.isObservable(data)) {
        data.subscribe(buildContent);
    }

    return element;
}