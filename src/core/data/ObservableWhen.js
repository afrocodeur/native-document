
export const ObservableWhen = function(observer, value) {
    this.$target = value;
    this.$observer = observer;
};

ObservableWhen.prototype.__$isObservableWhen = true;

ObservableWhen.prototype.subscribe = function(callback) {
    return this.$observer.on(this.$target, callback);
};

ObservableWhen.prototype.val = function() {
    return this.$observer.$currentValue === this.$target;
};

ObservableWhen.prototype.isMath = function() {
    return this.$observer.$currentValue === this.$target;
};

ObservableWhen.prototype.isActive = function() {
    return this.$observer.$currentValue === this.$target;
};