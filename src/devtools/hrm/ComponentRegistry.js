import {Anchor} from "../../../elements.js";

const ComponentRegistry = (function() {
    const registry = new Map();

    const wrapper = function(id, factory, metadata, registryItem) {
        const factoryName = factory.name;

        return function(...args) {
            const firstParam = args[0];
            if(firstParam?.__instance) {
                const instance = firstParam.__instance;
                const newInstance = factory(...instance.context.args, instance);
                instance.anchor.setContent(newInstance);
                return;
            }
            const anchor = Anchor(factoryName);
            const instance = {
                anchor,
                context: {
                    args,
                    states: new Map()
                }
            };
            const factoryInstance = factory(...args, instance);
            anchor.setContent(factoryInstance);
            registryItem.instances.add(instance);
            return anchor;
        };
    }

    return {
        /**
         * @param {string} id
         * @param {Function} factory
         * @param {Object} metadata
         */
        register(id, factory, metadata = {}) {
            if (!registry.has(id)) {
                registry.set(id, {
                    factory,
                    instances: new Set(),
                    metadata,
                    states: {},
                    version: 0
                });
            }
            return wrapper(id, factory, metadata, registry.get(id));
        },
        update(id, newFactory) {
            const component = registry.get(id);
            if(!component) {
                console.warn(`[HMR] Component ${id} not found`);
                return;
            }
            console.log(`[HMR] Updating ${component.instances.size} instance(s) of ${id}`);
            const oldFactory = component.factory;
            component.factory = newFactory;
            component.version++;
            const instances = Array.from(component.instances);
            for (const instance of instances) {
                try {
                    this.updateInstance(instance, newFactory);
                } catch (error) {
                    console.error('[HMR] Update failed:', error);
                    // Rollback
                    component.factory = oldFactory;
                    component.version--;
                    throw error;
                }
            }
        },
        updateInstance(instance, newFactory) {
            return newFactory({ __instance: instance });
        },
    };
}());

export default ComponentRegistry;