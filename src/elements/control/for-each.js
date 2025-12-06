import {Observable} from "../../data/Observable";
import Validator from "../../utils/validator";
import Anchor from "../anchor";
import DebugManager from "../../utils/debug-manager";
import {getKey} from "../../utils/helpers";
import { ElementCreator } from "../../wrappers/ElementCreator";
import NativeDocumentError from "../../errors/NativeDocumentError";

/**
 *
 * @param {Array|Object|ObservableItem} data
 * @param {Function} callback
 * @param {?Function|?string} key
 * @param {{shouldKeepItemsInCache: boolean}?} configs
 * @returns {DocumentFragment}
 */
export function ForEach(data, callback, key, { shouldKeepItemsInCache = false } = {}) {
    const element = new Anchor('ForEach');
    const blockEnd = element.endElement();
    const blockStart = element.startElement();

    let cache = new Map();
    let lastKeyOrder = null;
    const keyIds = new Set();

    const clear = () => {
        element.removeChildren();
        cleanCache();
    };

    const cleanCache = (parent) => {
        if(shouldKeepItemsInCache) {
            return;
        }
        for(const [keyId, cacheItem] of cache.entries()) {
            if(keyIds.has(keyId)) {
                continue;
            }
            const child = cacheItem.child?.deref();
            if(parent && child) {
                parent.removeChild(child);
            }
            cacheItem.indexObserver?.cleanup();
            cacheItem.child = null;
            cacheItem.indexObserver = null;
            cache.delete(cacheItem.keyId);
            lastKeyOrder && lastKeyOrder.delete(cacheItem.keyId);
        }
    };

    const handleContentItem = (item, indexKey) => {
        const keyId = getKey(item, indexKey, key);

        if(cache.has(keyId)) {
            const cacheItem = cache.get(keyId);
            cacheItem.indexObserver?.set(indexKey);
            cacheItem.isNew = false;
            if(cacheItem.child?.deref()) {
                return keyId;
            }
            cache.delete(keyId);
        }

        try {
            const indexObserver = callback.length >= 2 ? Observable(indexKey) : null;
            let child = ElementCreator.getChild(callback(item, indexObserver));
            if(!child || Validator.isFragment(child)) {
                throw new NativeDocumentError("ForEachArray child can't be null or undefined!");
            }
            cache.set(keyId, { keyId, isNew: true, child: new WeakRef(child), indexObserver});
        } catch (e) {
            DebugManager.error('ForEach', `Error creating element for key ${keyId}` , e);
            throw e;
        }
        return keyId;
    };

    const batchDOMUpdates = (parent) => {
        const fragment = document.createDocumentFragment();
        for(const itemKey of keyIds) {
            const cacheItem = cache.get(itemKey);
            if(!cacheItem) {
                continue;
            }
            const child = cacheItem.child?.deref();
            child && fragment.appendChild(child);
        }
        parent.insertBefore(fragment, blockEnd);
    }

    const diffingDOMUpdates = (parent) => {
        const operations = [];
        let fragment = document.createDocumentFragment();
        const newKeys = Array.from(keyIds);
        const oldKeys = Array.from(lastKeyOrder);

        let currentPosition = blockStart;

        for(const index in newKeys) {
            const itemKey = newKeys[index];
            const cacheItem = cache.get(itemKey);
            if(!cacheItem) {
                continue;
            }
            const child = cacheItem.child.deref();
            if(!child) {
                continue;
            }
            fragment.appendChild(child);
        }
        element.replaceContent(fragment);
    };

    const buildContent = () => {
        const parent = blockEnd.parentNode;
        if(!parent) {
            return;
        }

        const items = (Validator.isObservable(data)) ? data.val() : data;
        keyIds.clear();
        if(Array.isArray(items)) {
            for(let i = 0, length = items.length; i < length; i++) {
                const keyId = handleContentItem(items[i], i);
                keyIds.add(keyId);
            }
        } else {
            for(const indexKey in items) {
                const keyId = handleContentItem(items[indexKey], indexKey);
                keyIds.add(keyId);
            }
        }

        if(keyIds.size === 0) {
            clear();
            lastKeyOrder?.clear();
            return;
        }

        cleanCache(parent);
        if(!lastKeyOrder || lastKeyOrder.size === 0) {
            batchDOMUpdates(parent);
        } else {
            diffingDOMUpdates(parent);
        }
        lastKeyOrder?.clear();
        lastKeyOrder = new Set([...keyIds]);
    };

    buildContent();
    if(Validator.isObservable(data)) {
        data.subscribe(buildContent)
    }
    return element;
}
