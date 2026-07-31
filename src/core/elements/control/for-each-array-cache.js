

export default function ForEachArrayCache(isIndexesRequired) {
    this.$nodes = new Map();
    this.$indexes = isIndexesRequired ? new Map() : null;

    this.has = this.$nodes.has.bind(this.$nodes);

    this.keys = function() {
        return Array.from(this.$nodes.keys());
    };

    this.entries = this.$nodes.entries.bind(this.$nodes);

    if(isIndexesRequired) {
        this.delete = function(item) {
            this.$nodes.get(item)?.nd.destroy();
            this.$nodes.delete(item);
            this.$indexes.delete(item);
        };

        this.set = function(item, child, index) {
            this.$nodes.set(item, child);
            this.$indexes.set(item, index);
        };

        this.clear = function() {
            for(const [_, node] in this.$nodes.entries()) {
                node.nd.destroy();
            }
            this.$nodes.clear();
            this.$indexes.clear();
        };

        this.get = function(item) {
            return {
                child: this.$nodes.get(item),
                indexObserver: this.$indexes.get(item),
            };
        };
    } else {

        this.delete = (item) => {
            this.$nodes.get(item)?.nd.destroy();
            this.$nodes.delete(item);
        };
        this.set = this.$nodes.set.bind(this.$nodes);
        this.clear = function() {
            for(const [_, node] in this.$nodes.entries()) {
                node.nd.destroy();
            }
            this.$nodes.clear();
        };

        this.get = function(item) {
            return { child: this.$nodes.get(item), indexObserver: null };
        };
    }

}

