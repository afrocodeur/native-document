
export default function Skeleton(type = 'rect', config = {}) {
    if (!(this instanceof Skeleton)) {
        return new Skeleton(config);
    }
    this.$description = {
        type,
        lines: null,
        width: null,
        height: null,
        loading: null,
        repeat: null,
        ...config
    };
}

Skeleton.defaultTemplate = null;

Skeleton.use = function(template) {};

Skeleton.prototype.type = function(type) {
    this.$description.type = type;
    return this;
};
Skeleton.prototype.text = function(lines = 1) {
    this.$description.lines = lines;
    return this.type('text');
};
Skeleton.prototype.circle = function() {
    return this.type('circle');
};
Skeleton.prototype.rect = function() {
    return this.type('rect');
};
Skeleton.prototype.avatar = function() {
    return this.type('avatar');
};
Skeleton.prototype.image = function() {
    return this.type('image');
};

Skeleton.prototype.width = function(width) {
    this.$description.width = width;
    return this;
};
Skeleton.prototype.height = function(height) {
    this.$description.height = height;
    return this;
};
Skeleton.prototype.size = function(width, height) {
    this.width(width);
    this.height(height);
    return this;
};

Skeleton.prototype.variant = function(name) {
    this.$description.variant = name;
    return this;
};
Skeleton.prototype.wave = function() {
    return this.variant('wave');
};
Skeleton.prototype.pulse = function() {
    return this.variant('pulse');
};
Skeleton.prototype.rounded = function() {};

Skeleton.prototype.loading = function(isLoading) {
    this.$description.loading = isLoading;
    return this;
};
Skeleton.prototype.show = function() {};
Skeleton.prototype.hide = function() {};

Skeleton.prototype.repeat = function(times) {
    this.$description.repeat = times;
    return this;
};


Skeleton.prototype.render = function(renderFn) {
    this.$description.render = renderFn;
    return this;
};


Skeleton.prototype.$build = function() {

};
Skeleton.prototype.toNdElement = function() {
    return this.$build();
};

// Presets
Skeleton.card = function() {}; // Preset pour card
Skeleton.list = function(items = 3) {}; // Preset pour liste
Skeleton.table = function(rows = 5, cols = 4) {}; // Preset pour tableau
Skeleton.paragraph = function(lines = 3) {}; // Preset pour paragraphe