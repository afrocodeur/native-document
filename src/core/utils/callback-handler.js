

/**
 * Associates a shared callback with per-target context objects.
 * Useful when the same event handler needs to behave differently depending on which element triggered it,
 * without creating a new function closure per element (e.g.: in TemplateCloner).
 *
 * @constructor
 * @param {(context: *, ...args: any[]) => void} callback - Handler receiving the stored context followed by event arguments
 * @example
 * const handler = CallbackHandler((item, event) => list.removeItem(item));
 * handler.set(buttonElement, todoItem);
 * buttonElement.addEventListener('click', handler.callback);
 * // When clicked, calls callback(todoItem, event)
 */
export function CallbackHandler(callback) {

    if(!(this instanceof CallbackHandler)) {
        return new CallbackHandler(callback);
    }

    const $contextSore = new WeakMap();

    /**
     * Associates a context value with a specific target (usually a DOM element).
     * The context is retrieved and passed to the callback when .callback is invoked on that target.
     *
     * @param {object} target - The target object (usually an HTMLElement) used as the WeakMap key
     * @param {*} context - The context value to store for this target
     */
    this.set = (target, context) => {
        $contextSore.set(target, context);
    };

    /**
     * Event handler function to attach to DOM elements.
     * When called, look up the context stored for `this` (the element) and invoke the callback.
     * Designed to be passed directly to addEventListener.
     *
     * @type {EventListener}
     * @example
     * element.addEventListener('click', handler.callback);
     */
    this.callback = function() {
        const context = $contextSore.get(this);
        if(context) {
            callback(context, ...arguments);
        }
    };
}