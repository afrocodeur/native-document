import {throttle} from "../utils/helpers";

const DocumentObserver = {
    elements: new Map(),
    observer: null,
    checkMutation: throttle(function() {
        for(const [element, data] of DocumentObserver.elements.entries()) {
            const isCurrentlyInDom = document.body.contains(element);
            if(isCurrentlyInDom && !data.inDom) {
                data.inDom = true;
                data.mounted.forEach(callback => callback(element));
            } else if(!isCurrentlyInDom && data.inDom) {
                data.inDom = false;
                data.unmounted.forEach(callback => callback(element));
            }
        }
    }, 10, { debounce: true }),
    /**
     *
     * @param {HTMLElement} element
     * @returns {{watch: (function(): Map<any, any>), disconnect: (function(): boolean), mounted: (function(*): Set<any>), unmounted: (function(*): Set<any>)}}
     */
    watch: function(element) {
        let data = {};
        if(DocumentObserver.elements.has(element)) {
            data = DocumentObserver.elements.get(element);
        } else {
            const inDom = document.body.contains(element);
            data = {
                inDom,
                mounted: new Set(),
                unmounted: new Set(),
            };
            DocumentObserver.elements.set(element, data);
        }

        return {
            watch: () => DocumentObserver.elements.set(element, data),
            disconnect: () => DocumentObserver.elements.delete(element),
            mounted: (callback) => data.mounted.add(callback),
            unmounted: (callback) => data.unmounted.add(callback)
        };
    }
};

DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
DocumentObserver.observer.observe(document.body, {
    childList: true,
    subtree: true,
});
export default DocumentObserver;