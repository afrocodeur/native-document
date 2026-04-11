


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

AnchorWithSentinel.prototype.onConnected = function(callback) {
    this.$events.connected = callback;
    return this;
};

AnchorWithSentinel.prototype.onConnectedOnce = function(callback) {
    this.$events.connected = (parent) => {
        callback(parent);
        this.$observer.disconnect();
        this.$events.connectedOnce = null;
    };
};
