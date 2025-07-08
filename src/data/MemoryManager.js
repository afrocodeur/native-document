import DebugManager from "../utils/debug-manager";


const MemoryManager = (function() {

    let $nexObserverId = 0;
    const $observables = new Map();
    const $registry = new FinalizationRegistry((heldValue) => {
        DebugManager.log('MemoryManager', '🧹 Auto-cleanup observable:', heldValue);
        heldValue.listeners.splice(0);
    })

    return {
        /**
         * Register an observable and return an id.
         *
         * @param {ObservableItem} observable
         * @param {Function[]} listeners
         * @returns {number}
         */
        register(observable, listeners) {
            const id = ++$nexObserverId;
            const heldValue = {
                id: id,
                listeners
            };
            $registry.register(observable, heldValue);
            $observables.set(id, new WeakRef(observable));
            return id;
        },
        cleanup() {
            for (const [_, weakObservableRef] of $observables) {
                const observable = weakObservableRef.deref();
                if (observable) {
                    observable.cleanup();
                }
            }
            $observables.clear();
        },
        /**
         * Clean observables that are not referenced anymore.
         * @param {number} threshold
         */
        cleanObservables(threshold) {
            if($observables.size < threshold) return;
            let cleanedCount = 0;
            for (const [id, weakObservableRef] of $observables) {
                if (!weakObservableRef.deref()) {
                    $observables.delete(id);
                    cleanedCount++;
                }
            }
            if (cleanedCount > 0) {
                DebugManager.log('Memory Auto Clean', `🧹 Cleaned ${cleanedCount} orphaned observables`);
            }
        }
    };
}());

export default MemoryManager;