import ObservableItem from "../../data/ObservableItem";
import {Observable} from "../../data/Observable";
import {createTextNode} from "../../wrappers/HtmlElementWrapper";
import Validator from "../../utils/validator";
import {throttle} from "../../utils/helpers.js";
import Anchor from "../anchor";
import DebugManager from "../../utils/debug-manager";


/**
 *
 * @param {*} item
 * @param {string|null} defaultKey
 * @param {?Function} key
 * @returns {*}
 */
const getKey = (item, defaultKey, key) => {
    if(Validator.isFunction(key)) return key(item, defaultKey);
    if(Validator.isObservable(item)) {
        const val = item.val();
        return (val && key) ? val[key] : defaultKey;
    }
    return item[key] ?? defaultKey;
}

/**
 *
 * @param {Map} cache
 * @param {Set} keyIds
 */
const cleanBlockByCache = (cache, keyIds) => {
    const toRemove = [];
    for(const [key, cacheItem] of cache.entries()) {
        if(keyIds.has(key)) {
            continue;
        }
        toRemove.push({ key, cacheItem });
    }
    if(toRemove.length === 0) {
        return;
    }
    toRemove.forEach(({ key, cacheItem }) => {
        cacheItem.child.remove();
        cacheItem.indexObserver.cleanup();
        cache.delete(key);
    });
}

/**
 *
 * @param {Array|Object|ObservableItem} data
 * @param {Function} callback
 * @param {?Function} key
 * @returns {DocumentFragment}
 */
export function ForEach(data, callback, key) {
    const element = new Anchor('ForEach');
    const blockEnd = element.endElement();
    const blockStart = element.startElement();

    let cache = new Map();
    const keyIds = new Set();

    const handleContentItem = (item, indexKey) => {
        const keyId = getKey(item, indexKey, key);

        if(cache.has(keyId)) {
            const cacheItem = cache.get(keyId);
            cacheItem.indexObserver.set(indexKey);
            cacheItem.isNew = false;
        }
        else {

            try {
                const indexObserver = Observable(indexKey);
                let child = callback(item, indexObserver);
                if(Validator.isStringOrObservable(child)) {
                    child = createTextNode(child);
                }
                cache.set(keyId, { isNew: true, child, indexObserver});
            } catch (e) {
                DebugManager.error('ForEach', `Error creating element for key ${keyId}` , e);
                throw e;
            }
        }
        return keyId;
    };

    const batchDOMUpdates = () => {
        const parent = blockEnd.parentNode;
        if(!parent) {
            return;
        }

        let previousElementSibling = blockStart;
        const elementsToInsert = [];
        const elementsToMove = [];
        let fragment = null;

        let saveFragment = (beforeTarget) => {
            if(fragment) {
                elementsToInsert.push({ child: fragment, before: beforeTarget });
                fragment = null;
            }
        };

        const keyIdsArray = Array.from(keyIds);
        for(let i = 0; i < keyIdsArray.length; i++) {
            const itemKey = keyIdsArray[i];
            const cacheItem = cache.get(itemKey);
            if(!cacheItem) {
                continue;
            }

            if(previousElementSibling && previousElementSibling.nextSibling === cacheItem.child) {
                previousElementSibling = cacheItem.child;
                saveFragment(cacheItem.child);
                continue;
            }
            if(cacheItem.isNew) {
                fragment = fragment || document.createDocumentFragment();
                fragment.append(cacheItem.child);
                cacheItem.isNew = false;
                continue;
            }
            saveFragment(cacheItem.child);
            const nextChild = cache.get(keyIdsArray[i + 1])?.child;
            if(nextChild) {
                if(cacheItem.child.nextSibling !== nextChild) {
                    elementsToMove.push({ child: cacheItem.child, before: nextChild });
                }
            }

            previousElementSibling = cacheItem.child;
        }
        saveFragment(blockEnd);

        elementsToInsert.forEach(({ child, before }) => {
            if(before) {
                parent.insertBefore(child, before);
            } else {
                element.appendChild(child);
            }
        });

        elementsToMove.forEach(({ child, before }) => {
            parent.insertBefore(child, before);
        })
        saveFragment = null;

    };

    const buildContent = () => {
        const items = (Validator.isObservable(data)) ? data.val() : data;
        keyIds.clear();
        if(Array.isArray(items)) {
            items.forEach((item, index) => keyIds.add(handleContentItem(item, index)));
        } else {
            for(const indexKey in items) {
                keyIds.add(handleContentItem(items[indexKey], indexKey));
            }
        }

        cleanBlockByCache(cache, keyIds);

        batchDOMUpdates();
    };

    buildContent();
    if(Validator.isObservable(data)) {
        data.subscribe(buildContent)
    }
    return element;
}