import {classPropertyAccumulator, cssPropertyAccumulator} from '../core/utils/property-accumulator';
import {Observable} from '../core/data/Observable';
import {ShowIf} from '../core/elements/control/show-if';
import {NDElement} from '../core/wrappers/NDElement';

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
    },
});

/**
 * @param {Function} Component
 * @param {...Function} parents
 */
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

/**
 * @param {Record<string, *>} description
 * @returns {this}
 */
BaseComponent.prototype.setDescription = function(description) {
    for(const key in description) {
        if(this.$description[key]?.__$Observable) {
            this.$description[key].set(description[key]);
            continue;
        }
        this.$description[key] = description[key];
    }
    return this;
};

BaseComponent.prototype.$storeElement = function(element) {
    this.$element = element;
    return this;
};

/**
 * @param {(element: HTMLElement) => void} callback
 * @returns {this}
 */
BaseComponent.prototype.postBuild = function(callback) {
    this.$postBuild = this.$postBuild || [];
    this.$postBuild.push(callback);
    return this;
};

BaseComponent.prototype.ghostDom = NDElement.prototype.ghostDom;

/**
 * @param {Record<string, *>} target
 * @param {string} name
 * @returns {this}
 */
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

/**
 * @returns {HTMLElement|DocumentFragment}
 */
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

/**
 * @returns {Record<string, *>}
 */
BaseComponent.prototype.toJSON = function() {
    if(!this.$description) {
        return {};
    }
    return { ...this.$description };
};

/**
 * @param {(description: *, component: *) => NdChild} renderFn
 * @returns {this}
 */
BaseComponent.prototype.render = function(renderFn) {
    if (typeof renderFn !== 'function') {
        throw new Error('Custom renderer must be a function');
    }
    this.$description.render = renderFn;
    return this;
};

/**
 * Returns the internal editable props object for this component.
 * The `class` and `style` properties are wrapped in reactive accumulators
 * ({@link ClassPropertyAccumulatorType} and {@link CssPropertyAccumulatorType})
 * instead of plain strings, to allow incremental reactive updates.
 * @returns {Omit<GlobalAttributes, "class"|"style"> & { class: ClassPropertyAccumulatorType, style: CssPropertyAccumulatorType }}
 */
BaseComponent.prototype.getEditableProps = function() {
    if(!this.$editableProps) {
        const rawProps = this.$description.props || {};
        this.$editableProps = {
            ...rawProps,
            class: classPropertyAccumulator(rawProps.class || {}),
            style: cssPropertyAccumulator(rawProps.style || {}),
        };
    }

    return this.$editableProps;
};

/**
 * Returns a plain snapshot of the resolved props, with class and style
 * unwrapped from their reactive accumulators to their current values.
 * @returns {GlobalAttributes}
 */
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

/**
 * @param {GlobalAttributes} props
 * @returns {this}
 */
BaseComponent.prototype.props = function(props) {
    this.$description.props = props;
    return this;
};


/**
 * @param {NdStyleMap} style
 * @returns {this}
 */
BaseComponent.prototype.style = function(style) {
    const props = this.getEditableProps();
    props.style.add(style);
    return this;
};

/**
 * @param {boolean|Observable<boolean>} condition
 * @returns {this}
 */
BaseComponent.prototype.showIf = function(condition) {
    this.$description.showIf = BaseComponent.obs(condition);
    return this;
};

/**
 * @param {*} context
 * @returns {this}
 */
BaseComponent.prototype.context = function(context) {
    this.$description.$context = context;
    return this;
};

BaseComponent.prototype.visibility = BaseComponent.prototype.showIf;