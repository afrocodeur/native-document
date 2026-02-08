

export function CallbackHandler(callback) {

    if(!(this instanceof CallbackHandler)) {
        return new CallbackHandler(callback);
    }

    const $contextSore = new WeakMap();

    this.set = (target, context) => {
        $contextSore.set(target, context);
    };

    this.callback = function() {
        const context = $contextSore.get(this);
        if(context) {
            callback(context, ...arguments);
        }
    };
}