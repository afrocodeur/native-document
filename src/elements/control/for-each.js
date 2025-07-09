import ObservableItem from "../../data/ObservableItem";
import {Observable} from "../../data/Observable";
import {createTextNode} from "../../wrappers/HtmlElementWrapper";
import Validator from "../../utils/validator";
import {throttle} from "../../utils/helpers.js";


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
    for(const [key, {child}] of cache.entries()) {
        if(keyIds.has(key)) {
            continue;
        }
        child.remove();
    }
}

/**
 *
 * @param {Array|Object|ObservableItem} data
 * @param {Function} callback
 * @param {?Function} key
 * @returns {DocumentFragment}
 */
export function ForEach(data, callback, key) {
    const element = document.createDocumentFragment();
    const blockStart = document.createComment('Foreach start');
    const blockEnd = document.createComment('Foreach end');

    element.appendChild(blockStart);
    element.appendChild(blockEnd);

    let cache = new Map();

    const handleContentItem = (item, indexKey) => {
        const keyId = getKey(item, indexKey, key);

        if(cache.has(keyId)) {
            cache.get(keyId).indexObserver.set(indexKey);
        }
        else {
            const indexObserver = Observable(indexKey);
            let child = callback(item, indexObserver);
            if(Validator.isStringOrObservable(child)) {
                child = createTextNode(child);
            }
            cache.set(keyId, { child, indexObserver});
        }
        return keyId;
    }
    const keyIds = new Set();

    const buildContent = () => {
        const items = (Validator.isObservable(data)) ? data.val() : data;
        const parent = blockEnd.parentNode;
        if(!parent) {
            return;
        }
        keyIds.clear();
        if(Array.isArray(items)) {
            items.forEach((item, index) => keyIds.add(handleContentItem(item, index)));
        } else {
            for(const indexKey in items) {
                keyIds.add(handleContentItem(items[indexKey], indexKey));
            }
        }

        cleanBlockByCache(cache, keyIds);
        let nextElementSibling = blockEnd;
        for(const item of [...keyIds].reverse()) {
            const { child } = cache.get(item);
            if(child) {
                if(nextElementSibling && nextElementSibling.previousSibling === child) {
                    nextElementSibling = child;
                    continue;
                }
                parent.insertBefore(child, nextElementSibling);
                nextElementSibling = child;
            }
        }
    };

    buildContent();
    if(Validator.isObservable(data)) {
        data.subscribe(throttle((newValue, oldValue) => {
            buildContent(newValue, oldValue);
        }, 50, { debounce: true }))
    }
    return element;
}