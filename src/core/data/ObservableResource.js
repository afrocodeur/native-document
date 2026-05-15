import ObservableItem from "./ObservableItem";
import {debounce} from "../utils/helpers";

const STATE = {
    UNRESOLVED: 'unresolved',
    PENDING:    'pending',
    READY:      'ready',
    REFRESHING: 'refreshing',
    ERRORED:    'errored',
};

export default function ObservableResource(fn, deps, config) {
    this.$fn = (config.debounce > 0) ? debounce(fn, config.debounce) : fn;
    this.$dependencies = deps;
    this.$config = config;
    this.$controller  = null;
    this.$subscriptions        = [];

    this.data  = config.initial ?? new ObservableItem(null);
    this.error = new ObservableItem(null);
    this.state = new ObservableItem(STATE.UNRESOLVED);

    this.loading = ObservableItem.computed(
        (state) => state === STATE.PENDING || state === STATE.REFRESHING,
        [this.state]
    );

    if (config.auto) {
        if (deps.length > 0) {
            this.$watchDependencies();
            return;
        }
        this.fetch();
    }
}

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
            this.data.set(result);
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
            this.data.set(result);
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

ObservableResource.prototype.fetch = function() {
    this.$run(false);
    return this;
};

ObservableResource.prototype.refetch = function() {
    this.$run(true);
    return this;
};

ObservableResource.prototype.mutate = function(value) {
    this.data.set(value);
    this.state.set(STATE.READY);
    return this;
};

ObservableResource.prototype.destroy = function() {
    this.$abort();
    this.$subscriptions.forEach(unsub => unsub());
    this.$subscriptions = [];
};

ObservableResource.prototype.isReady = function() {
    return this.state.isEqualTo(STATE.READY);
};

ObservableResource.prototype.isPending = function() {
    return this.state.isEqualTo(STATE.PENDING);
};

ObservableResource.prototype.isRefreshing = function() {
    return this.state.isEqualTo(STATE.REFRESHING);
};

ObservableResource.prototype.isErrored = function() {
    return this.state.isEqualTo(STATE.ERRORED);
};

ObservableResource.prototype.isUnresolved = function() {
    return this.state.isEqualTo(STATE.UNRESOLVED);
};

ObservableResource.prototype.onSuccess = function(callback) {
    this.data.subscribe((value) => {
        if (this.state.val() === STATE.READY) {
            callback(value);
        }
    });
    return this;
};

ObservableResource.prototype.onError = function(callback) {
    this.error.subscribe((err) => {
        if (err !== null) {
            callback(err);
        }
    });
    return this;
};