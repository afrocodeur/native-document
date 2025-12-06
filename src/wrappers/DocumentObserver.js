import {debounce} from "../utils/helpers";

const DocumentObserver = {
    mounted: new WeakMap(),
    mountedSupposedSize: 0,
    unmounted: new WeakMap(),
    unmountedSupposedSize: 0,
    observer: null,
    checkMutation: function(mutationsList) {
        let i = 0;
        for(const mutation of mutationsList) {
            if(DocumentObserver.mountedSupposedSize > 0 ) {
                for(const node of mutation.addedNodes) {
                    const data = DocumentObserver.mounted.get(node);
                    if(!data) {
                        continue;
                    }
                    data.inDom = true;
                    data.mounted && data.mounted(node);
                }
            }

            if(DocumentObserver.unmountedSupposedSize > 0 ) {
                for(const node of mutation.removedNodes) {
                    const data = DocumentObserver.unmounted.get(node);
                    if(!data) {
                        continue;
                    }

                    data.inDom = false;
                    if(data.unmounted && data.unmounted(node) === true) {
                        data.disconnect();
                        node.nd?.remove();
                    }
                }
            }
        }
    },
    /**
     *
     * @param {HTMLElement} element
     * @param {boolean} inDom
     * @returns {{watch: (function(): Map<any, any>), disconnect: (function(): boolean), mounted: (function(*): Set<any>), unmounted: (function(*): Set<any>)}}
     */
    watch: function(element, inDom = false) {
        let data = {
            inDom,
            mounted: null,
            unmounted: null,
            disconnect: () => {
                DocumentObserver.mounted.delete(element);
                DocumentObserver.unmounted.delete(element);
                DocumentObserver.mountedSupposedSize--;
                DocumentObserver.unmountedSupposedSize--;
                data = null;
            }
        };

        return {
            disconnect: data.disconnect,
            mounted: (callback) => {
                data.mounted = callback;
                DocumentObserver.mounted.set(element, data);
                DocumentObserver.mountedSupposedSize++;
            },
            unmounted: (callback) => {
                data.unmounted = callback;
                DocumentObserver.unmounted.set(element, data);
                DocumentObserver.unmountedSupposedSize++;
            }
        };
    }
};

DocumentObserver.observer = new MutationObserver(DocumentObserver.checkMutation);
DocumentObserver.observer.observe(document.body, {
    childList: true,
    subtree: true,
});
export default DocumentObserver;