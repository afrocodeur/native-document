import {Observable} from "./Observable";

export const Store = (function() {

    const $stores = new Map();

    return {
        /**
         * Create a new state follower and return it.
         * @param {string} name
         * @returns {ObservableItem}
         */
        use(name) {
            const {observer: originalObserver, subscribers } = $stores.get(name);
            const observerFollower = Observable(originalObserver.val());
            const unSubscriber = originalObserver.subscribe(value => observerFollower.set(value));
            const updaterUnsubscriber = observerFollower.subscribe(value => originalObserver.set(value));
            observerFollower.destroy = () => {
                unSubscriber();
                updaterUnsubscriber();
                observerFollower.cleanup();
            };
            subscribers.add(observerFollower);

            return observerFollower;
        },
        /**
         * @param {string} name
         * @returns {ObservableItem}
         */
        follow(name) {
            return this.use(name);
        },
        /**
         * Create a new state and return the observer.
         * @param {string} name
         * @param {*} value
         * @returns {ObservableItem}
         */
        create(name, value) {
            const observer = Observable(value);
            $stores.set(name, { observer, subscribers: new Set()});
            return observer;
        },
        /**
         * Get the observer for a state.
         * @param {string} name
         * @returns {null|ObservableItem}
         */
        get(name) {
            const item = $stores.get(name);
            return item ? item.observer : null;
        },
        /**
         *
         * @param {string} name
         * @returns {{observer: ObservableItem, subscribers: Set}}
         */
        getWithSubscribers(name) {
            return $stores.get(name);
        },
        /**
         * Delete a state.
         * @param {string} name
         */
        delete(name) {
            const item = $stores.get(name);
            if(!item) return;
            item.observer.cleanup();
            item.subscribers.forEach(follower => follower.destroy());
            item.observer.clear();
        }
    };
}());