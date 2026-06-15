import DebugManager from '../../core/utils/debug-manager';


const MemoryManager = (function() {

    let $nextObserverId = 0;
    const $observables = new Map();

    return {
        /**
         * Register an observable and return an id.
         *
         * @param {ObservableItem} observable
         * @param {Function} getListeners
         * @returns {number}
         */
        register(observable) {
            const id = ++$nextObserverId;
            $observables.set(id, new WeakRef(observable));
            return id;
        },
        unregister(id) {
            $observables.delete(id);
        },
        getObservableById(id) {
            const observable = $observables.get(id);
            if(!observable) {
                $observables.delete(id);
                return null;
            }
            return observable.deref();
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
        },
    };
}());

export default MemoryManager;