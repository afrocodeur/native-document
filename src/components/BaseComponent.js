/**
 *
 * @class
 */
export default function BaseComponent() {

}

Object.defineProperty( BaseComponent.prototype, 'nd', {
    get: function() {
        if(this.$element) {
            return this.$element.nd;
        }
        this.$storeElement(this.node());
        return this.$element?.nd;
    }
});


BaseComponent.extends = function(Component, ...parents) {
    Component.prototype = Object.create(BaseComponent.prototype);

    if(parents.length > 0) {
        for(const parent of parents) {
            Object.assign(Component.prototype, parent.prototype);
        }
    }
    Component.prototype.constructor = Component;
};

BaseComponent.prototype.$storeElement = function(element) {
    this.$element = element;
    return this;
};

BaseComponent.prototype.refSelf = function(target, name) {
    target[name] = this;
    return this;
};

BaseComponent.prototype.$build = function() {
    const ComponentClass = this.constructor;
    const renderer = this.$description.render || ComponentClass.defaultTemplate;

    if (!renderer) {
        throw new Error(`No renderer for ${ComponentClass.name}`);
    }

    return renderer(this.$description, this);
};

BaseComponent.prototype.toNdElement = function() {
    if (this.$element) {
        return this.$element;
    }
    this.$element = this.$build();
    return this.$element;
};

BaseComponent.prototype.toJSON = function() {
    if(!this.$description) {
        return {};
    }
    return { ...this.$description };
};

BaseComponent.prototype.render = function(renderFn) {
    if (typeof renderFn !== 'function') {
        throw new Error('Custom renderer must be a function');
    }
    this.$description.render = renderFn;
    return this;
};