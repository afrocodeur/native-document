const DocumentObserver = {
    mounted: new WeakMap(),
    beforeUnmount: new WeakMap(),
    mountedSupposedSize: 0,
    unmounted: new WeakMap(),
    unmountedSupposedSize: 0,
    observer: null,

    executeMountedCallback(node) {
        const data = DocumentObserver.mounted.get(node);
        if(!data) {
            return;
        }
        data.inDom = true;
        if(!data.mounted) {
            return;
        }
        if(Array.isArray(data.mounted)) {
            for(const cb of data.mounted) {
                cb(node);
            }
            return;
        }
        data.mounted(node);
    },

    executeUnmountedCallback(node) {
        const data = DocumentObserver.unmounted.get(node);
        if(!data) {
            return;
        }
        data.inDom = false;
        if(!data.unmounted) {
            return;
        }

        let shouldRemove = false;
        if(Array.isArray(data.unmounted)) {
            for(const cb of data.unmounted) {
                if(cb(node) === true) {
                    shouldRemove = true;
                }
            }
        } else {
            shouldRemove = data.unmounted(node) === true;
        }

        if(shouldRemove) {
            data.disconnect();
            node.nd?.remove();
        }
    },

    checkMutation: function(mutationsList) {
        for(const mutation of mutationsList) {
            if(DocumentObserver.mountedSupposedSize > 0) {
                for(const node of mutation.addedNodes) {
                    DocumentObserver.executeMountedCallback(node);
                    if(!node.querySelectorAll) {
                        continue;
                    }
                    const children = node.querySelectorAll('[data--nd-mounted]');
                    for(const child of children) {
                        DocumentObserver.executeMountedCallback(child);
                    }
                }
            }

            if (DocumentObserver.unmountedSupposedSize > 0) {
                for (const node of mutation.removedNodes) {
                    DocumentObserver.executeUnmountedCallback(node);
                    if(!node.querySelectorAll) {
                        continue;
                    }
                    const children = node.querySelectorAll('[data--nd-unmounted]');
                    for(const child of children) {
                        DocumentObserver.executeUnmountedCallback(child);
                    }
                }
            }
        }
    },

    /**
     * @param {HTMLElement} element
     * @param {boolean} inDom
     * @returns {{ disconnect: Function, mounted: Function, unmounted: Function, off: Function }}
     */
    watch: function(element, inDom = false) {
        let mountedRegistered   = false;
        let unmountedRegistered = false;

        let data = {
            inDom,
            mounted: null,
            unmounted: null,
            disconnect: () => {
                if (mountedRegistered) {
                    DocumentObserver.mounted.delete(element);
                    DocumentObserver.mountedSupposedSize--;
                }
                if (unmountedRegistered) {
                    DocumentObserver.unmounted.delete(element);
                    DocumentObserver.unmountedSupposedSize--;
                }
                data = null;
            }
        };

        const addListener = (type, callback) => {
            if (!data[type]) {
                data[type] = callback;
                return;
            }
            if (!Array.isArray(data[type])) {
                data[type] = [data[type], callback];
                return;
            }
            data[type].push(callback);
        };

        const removeListener = (type, callback) => {
            if(!data?.[type]) {
                return;
            }
            if(Array.isArray(data[type])) {
                const index = data[type].indexOf(callback);
                if(index > -1) {
                    data[type].splice(index, 1);
                }
                if(data[type].length === 1) {
                    data[type] = data[type][0];
                }
                if(data[type].length === 0) {
                    data[type] = null;
                }
                return;
            }
            data[type] = null;
        };

        return {
            disconnect: () => data?.disconnect(),

            mounted: (callback) => {
                addListener('mounted', callback);
                DocumentObserver.mounted.set(element, data);
                if (!mountedRegistered) {
                    DocumentObserver.mountedSupposedSize++;
                    mountedRegistered = true;
                }
            },

            unmounted: (callback) => {
                addListener('unmounted', callback);
                DocumentObserver.unmounted.set(element, data);
                if (!unmountedRegistered) {
                    DocumentObserver.unmountedSupposedSize++;
                    unmountedRegistered = true;
                }
            },

            off: (type, callback) => {
                removeListener(type, callback);
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