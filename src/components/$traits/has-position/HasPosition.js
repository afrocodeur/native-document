
export default function HasPosition() {}

HasPosition.prototype.atTop = function() {
    this.$description.position = 'top';
    return this;
};
HasPosition.prototype.atBottom = function() {
    this.$description.position = 'bottom';
    return this;
};
HasPosition.prototype.atLeft = function() {
    this.$description.position = 'left';
    return this;
};
HasPosition.prototype.atRight = function() {
    this.$description.position = 'right';
    return this;
};
HasPosition.prototype.atCenter = function() {
    this.$description.position = 'center';
    return this;
};