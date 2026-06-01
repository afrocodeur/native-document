import ObservableItem from './ObservableItem';
import {debounce} from '../utils/helpers';

const STATE = {
    UNRESOLVED: 'unresolved',
    PENDING:    'pending',
    READY:      'ready',
    REFRESHING: 'refreshing',
    ERRORED:    'errored',
};

/**
 * Reactive async data fetcher with built-in state management.
 * Tracks loading, ready, refreshing, and error states automatically.
 * Use Observable.resource() rather than instantiating directly.
 *
 * @constructor
 * @param {(...depValues: any[], signal?: AbortSignal) => Promise<*>} fn - Async function to fetch data. Receives dependency values as arguments. If its arity exceeds the number of dependencies, an AbortSignal is passed as the last argument.
 * @param {ObservableItem[]} deps - Observable dependencies — resource re-fetches when any changes
 * @param {{ auto?: boolean, lazy?: boolean, debounce?: number, into?: ObservableItem, apply?: Function }} config - Configuration
 * @param {boolean} [config.auto=false] - If true, fetch runs automatically on creation (or when deps change)
 * @param {boolean} [config.lazy=false] - If true with deps, does not fetch immediately — waits for first dep change
 * @param {number} [config.debounce=0] - Debounce delay in ms for dependency-triggered re-fetches
 * @param {ObservableItem} [config.into] - Observable to write results into instead of creating a new one
 * @param {Function} [config.apply] - Custom function to apply the result to this.data
 * @example
 * const userId = Observable(1);
 * const user = Observable.resource(
 *   async (id, signal) => fetch(`/api/users/${id}`, { signal }).then(r => r.json()),
 *   [userId],
 *   { auto: true }
 * );
 */
export default function ObservableResource(fn, deps, config) {
    this.$fn = (config.debounce > 0) ? debounce(fn, config.debounce) : fn;
    this.$dependencies = deps;
    this.$config = config;
    this.$controller  = null;
    this.$subscriptions        = [];

    this.data  = config.into ?? new ObservableItem(null);
    this.error = new ObservableItem(null);
    this.state = new ObservableItem(STATE.UNRESOLVED);

    this.loading = ObservableItem.computed(
        (state) => state === STATE.PENDING || state === STATE.REFRESHING,
        [this.state],
    );

    if (config.auto) {
        if (deps.length > 0) {
            this.$watchDependencies();
            return;
        }
        this.fetch();
    }
}

ObservableResource.prototype.$applyResult = function(result) {
    if(this.$config.apply) {
        this.$config.apply(result, this.data);
        return;
    }
    this.data.set(result);
};

ObservableResource.prototype.$abort = function() {
    if (this.$controller) {
        this.$controller.abort();
        this.$controller = null;
    }
};

ObservableResource.prototype.$runWithAbortController = function(isRefetch = false) {
    this.$abort();

    this.$controller = new AbortController();
    const signal = this.$controller.signal;

    const hasData = this.data.val() !== null;
    const nextState = isRefetch && hasData ? STATE.REFRESHING : STATE.PENDING;

    this.error.set(null);
    this.state.set(nextState);

    const depValues = this.$dependencies.map(dep => dep.val());
    const args = [...depValues, signal];

    Promise.resolve(this.$fn(...args))
        .then(result => {
            if (signal.aborted) {
                return;
            }
            this.$applyResult(result);
            this.error.set(null);
            this.state.set(STATE.READY);
            this.$controller = null;
        })
        .catch(err => {
            if (signal.aborted) {
                return;
            }
            this.error.set(err);
            this.state.set(STATE.ERRORED);
            this.$controller = null;
        });
};
ObservableResource.prototype.$runWithoutAbortController = function(isRefetch = false) {
    const hasData = this.data.val() !== null;
    const nextState = isRefetch && hasData ? STATE.REFRESHING : STATE.PENDING;

    this.error.set(null);
    this.state.set(nextState);

    const args = this.$dependencies.map(dep => dep.val());

    Promise.resolve(this.$fn(...args))
        .then(result => {
            this.$applyResult(result);
            this.error.set(null);
            this.state.set(STATE.READY);
        })
        .catch(err => {
            this.error.set(err);
            this.state.set(STATE.ERRORED);
        });
};

ObservableResource.prototype.$run = function(isRefetch = false) {
    const needsSignal = this.$fn.length > this.$dependencies.length;
    if(needsSignal) {
        this.$run = this.$runWithAbortController;
        return this.$runWithAbortController(isRefetch);
    }
    this.$run = this.$runWithoutAbortController;

    return this.$run(isRefetch);
};

ObservableResource.prototype.$watchDependencies = function() {
    this.$subscriptions.forEach(unsub => unsub());
    this.$subscriptions = [];

    this.$dependencies.forEach(dep => {
        const callback = () => this.$run(true);
        dep.subscribe(callback);
        this.$subscriptions.push(() => dep.unsubscribe(callback));
    });
    if (!this.$config.lazy) {
        this.$run(false);
    }
};

/**
 * Sets a custom function to apply fetched results to this.data.
 * Useful when the raw response needs transformation before storing.
 *
 * @param {(result: *, data: ObservableItem) => void} fn - Function receiving the result and the data observable
 * @returns {this}
 * @example
 * resource.apply((result, data) => data.set(result.items));
 */
ObservableResource.prototype.apply = function(fn) {
    this.$config.apply = fn;
    return this;
};

/**
 * Redirects fetched results into an existing ObservableItem instead of the default internal one.
 * Updates both this.data reference and config.into.
 *
 * @param {ObservableItem} $observable - Target observable to write results into
 * @returns {this}
 * @example
 * const items = Observable([]);
 * resource.into(items);
 */
ObservableResource.prototype.into = function($observable) {
    this.$config.into = $observable;
    this.data = $observable;
    return this;
};

/**
 * Triggers a fresh fetch (state transitions to 'pending').
 * Use when no prior data exists or when a full reload is needed.
 *
 * @returns {this}
 */
ObservableResource.prototype.fetch = function() {
    this.$run(false);
    return this;
};

/**
 * Triggers a re-fetch (state transitions to 'refreshing' if data already exists).
 * Use when you want to reload while keeping the previous data visible.
 *
 * @returns {this}
 */
ObservableResource.prototype.refetch = function() {
    this.$run(true);
    return this;
};

/**
 * Manually sets the data value and marks the state as 'ready'.
 * Useful for optimistic updates or seeding initial data without a network call.
 *
 * @param {*} value - New value to set on this.data
 * @returns {this}
 * @example
 * resource.mutate([...resource.data.val(), newItem]);
 */
ObservableResource.prototype.mutate = function(value) {
    this.data.set(value);
    this.state.set(STATE.READY);
    return this;
};

/**
 * Cancels any pending request, unsubscribes from all dependencies, and clears subscriptions.
 * Call this when the component using this resource is unmounted.
 *
 * @returns {void}
 */
ObservableResource.prototype.destroy = function() {
    this.$abort();
    this.$subscriptions.forEach(unsub => unsub());
    this.$subscriptions = [];
};

/**
 * Returns a derived observable that emits true when the state is 'ready'.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableResource.prototype.isReady = function() {
    return this.state.isEqualTo(STATE.READY);
};

/**
 * Returns a derived observable that emits true when the state is 'pending' (initial load).
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableResource.prototype.isPending = function() {
    return this.state.isEqualTo(STATE.PENDING);
};

/**
 * Returns a derived observable that emits true when the state is 'refreshing' (reload with existing data).
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableResource.prototype.isRefreshing = function() {
    return this.state.isEqualTo(STATE.REFRESHING);
};

/**
 * Returns a derived observable that emits true when the state is 'errored'.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableResource.prototype.isErrored = function() {
    return this.state.isEqualTo(STATE.ERRORED);
};

/**
 * Returns a derived observable that emits true when no fetch has been triggered yet.
 *
 * @returns {ObservableChecker<boolean>}
 */
ObservableResource.prototype.isUnresolved = function() {
    return this.state.isEqualTo(STATE.UNRESOLVED);
};

/**
 * Registers a callback that is called every time a fetch completes successfully.
 *
 * @param {(value: *) => void} callback - Called with the fetched data value
 * @returns {this}
 * @example
 * resource.onSuccess((data) => console.log('Loaded:', data));
 */
ObservableResource.prototype.onSuccess = function(callback) {
    this.data.subscribe((value) => {
        if (this.state.val() === STATE.READY) {
            callback(value);
        }
    });
    return this;
};

/**
 * Registers a callback called every time a fetch fails.
 *
 * @param {(error: Error) => void} callback - Called with the error object
 * @returns {this}
 * @example
 * resource.onError((err) => console.error('Failed:', err.message));
 */
ObservableResource.prototype.onError = function(callback) {
    this.error.subscribe((err) => {
        if (err !== null) {
            callback(err);
        }
    });
    return this;
};