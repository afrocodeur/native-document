
/**
 * Creates an augmented DocumentFragment with comment sentinel nodes and a MutationObserver
 * that fires when the fragment is inserted into the live DOM.
 * Used as the base for Anchor — not intended for direct use in application code.
 *
 * @internal
 * @constructor
 * @param {string} name - Debug label used in comment node text content
 * @returns {AnchorWithSentinel} Augmented DocumentFragment instance
 */
export default function AnchorWithSentinel(name) {
    const instance = Reflect.construct(DocumentFragment, [], AnchorWithSentinel);
    const sentinel = document.createComment((name || '') + ' Anchor Sentinel');
    const anchorStart = document.createComment('Anchor Start : '+name);
    const anchorEnd = document.createComment('/ Anchor End '+name);
    const events = {};

    instance.append(anchorStart, sentinel, anchorEnd);

    const observer = new MutationObserver(() => {
        if (sentinel.parentNode !== instance && !(sentinel.parentNode instanceof DocumentFragment)) {
            events.connected && events.connected(sentinel.parentNode);
        }
    });

    observer.observe(document, { childList: true, subtree: true });


    instance.$sentinel = sentinel;
    instance.$start = anchorStart;
    instance.$end = anchorEnd;
    instance.$observer = observer;
    instance.$events = events;

    return instance;
}

AnchorWithSentinel.prototype = Object.create(DocumentFragment.prototype);
AnchorWithSentinel.prototype.constructor = AnchorWithSentinel;

/**
 * Registers a callback to call every time the sentinel is connected to the live DOM.
 * The callback receives the parent node as its argument.
 *
 * @param {(parent: Node) => void} callback - Called each time the fragment is inserted
 * @returns {this}
 */
AnchorWithSentinel.prototype.onConnected = function(callback) {
    this.$events.connected = callback;
    return this;
};

/**
 * Registers a callback to call the first time the sentinel is connected to the live DOM.
 * After the first connection, the MutationObserver is disconnected automatically.
 *
 * @param {(parent: Node) => void} callback - Called once on first insertion
 */
AnchorWithSentinel.prototype.onConnectedOnce = function(callback) {
    this.$events.connected = (parent) => {
        callback(parent);
        this.$observer.disconnect();
        this.$events.connectedOnce = null;
    };
};
