import {classPropertyAccumulator, cssPropertyAccumulator} from "../core/utils/property-accumulator";
import {Observable} from "../core/data/Observable";
import {ShowIf} from "../core/elements/control/show-if";
import {NDElement} from "../core/wrappers/NDElement";

/**
 *
 * @class
 */
export default function BaseComponent() {
    this.$description = {};
    this.$editableProps = null;
    this.$attachements = null;
}

Object.defineProperty( BaseComponent.prototype, 'nd', {
    get: function() {
        if(this.$element) {
            const nd = this.$element.nd;
            if(this.$attachements) {
                nd.$attachements = this.$attachements;
            }
            return nd;
        }
        this.$storeElement(this.toNdElement());
        const nd = this.$element.nd;
        if(this.$attachements) {
            nd.$attachements = this.$attachements;
        }
        return nd;
    }
});

BaseComponent.extends = function(Component, ...parents) {
    const MainParent = parents[0] || BaseComponent;
    Component.prototype = Object.create(MainParent.prototype);

    if(parents.length > 0) {
        for(const parent of parents) {
            Object.assign(Component.prototype, parent.prototype);
        }
    }
    Component.prototype.constructor = Component;
};

BaseComponent.use = function(Component, ...traits) {
    if(traits.length > 0) {
        for(const trait of traits) {
            Object.assign(Component.prototype, trait.prototype);
        }
    }
};

BaseComponent.obs = (value) => {
    return value.__$Observable ? value : Observable(value);
};

BaseComponent.prototype.setDescription = function(description) {
    for(const key in description) {
        if(this.$description[key]?.__$Observable) {
            this.$description[key].set(description[key]);
            continue;
        }
        this.$description[key] = description[key];
    }
    return this;
}

BaseComponent.prototype.$storeElement = function(element) {
    this.$element = element;
    return this;
};

BaseComponent.prototype.postBuild = function(callback) {
    this.$postBuild = this.$postBuild || [];
    this.$postBuild.push(callback);
    return this;
}

BaseComponent.prototype.ghostDom = NDElement.prototype.ghostDom;

BaseComponent.prototype.refSelf = function(target, name) {
    target[name] = this;
    return this;
};

BaseComponent.prototype.$build = function() {
    if(this.$beforeRender) {
        this.$beforeRender();
    }
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
    if(this.$description.showIf) {
        this.$element = ShowIf(this.$description.showIf, this.$element);
    }
    if(this.$postBuild) {
        for(let i = 0; i < this.$postBuild.length; i++) {
            this.$postBuild[i](this.$element);
        }
        this.$postBuild = null;
    }
    if(this.$attachements) {
        const nd = this.$element.nd;
        nd.ghostDom(this.$attachements);
        this.$attachements = null;
        return nd;
    }

    return this.$element;
};

BaseComponent.prototype.node = BaseComponent.prototype.toNdElement;

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

BaseComponent.prototype.getEditableProps = function() {
    if(!this.$editableProps) {
        const rawProps = this.$description.props || {};
        this.$editableProps = {
            ...rawProps,
            class: classPropertyAccumulator(rawProps.class || {}),
            style: cssPropertyAccumulator(rawProps.style || {})
        };
    }

    return this.$editableProps;
};

BaseComponent.prototype.resolveProps = function() {
    if(!this.$editableProps) {
        return this.$description.props ? { ...this.$description.props } : {};
    }
    const props = { ...this.$editableProps };
    if(props.class) {
        props.class = props.class.value();
    }
    if(props.style) {
        props.style = props.style.value();
    }

    return props;
};

BaseComponent.prototype.props = function(props) {
    this.$description.props = props;
    return this;
};

BaseComponent.prototype.style = function(style) {
    const props = this.getEditableProps();
    props.style.add(style);
    return this;
};

BaseComponent.prototype.showIf = function(condition) {
    this.$description.showIf = BaseComponent.obs(condition);
    return this;
};

BaseComponent.prototype.context = function(context) {
    this.$description.$context = context;
    return this;
}

BaseComponent.prototype.visibility = BaseComponent.prototype.showIf;