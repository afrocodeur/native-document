
export default function HasFullPosition() {}

HasFullPosition.prototype.atTop = function() {
    this.$description.position = 'top';
    return this;
};
HasFullPosition.prototype.atBottom = function() {
    this.$description.position = 'bottom';
    return this;
};
HasFullPosition.prototype.atLeft = function() {
    this.$description.position = 'left';
    return this;
};
HasFullPosition.prototype.atRight = function() {
    this.$description.position = 'right';
    return this;
};
HasFullPosition.prototype.atTopLeading = function() {
    this.$description.position = 'top-leading';
    return this;
};
HasFullPosition.prototype.atTopTrailing = function() {
    this.$description.position = 'top-trailing';
    return this;
};
HasFullPosition.prototype.atTopCenter = function() {
    this.$description.position = 'top-center';
    return this;
};
HasFullPosition.prototype.atBottomLeading = function() {
    this.$description.position = 'bottom-leading';
    return this;
};
HasFullPosition.prototype.atBottomTrailing = function() {
    this.$description.position = 'bottom-trailing';
    return this;
};
HasFullPosition.prototype.atBottomCenter = function() {
    this.$description.position = 'bottom-center';
    return this;
};
HasFullPosition.prototype.atLeadingCenter = function() {
    this.$description.position = 'leading-center';
    return this;
};
HasFullPosition.prototype.atTrailingCenter = function() {
    this.$description.position = 'trailing-center';
    return this;
};