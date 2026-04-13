import BaseComponent from "../BaseComponent";
import DebugManager from "../../core/utils/debug-manager";
import { HStack, VStack } from "../stacks/index";
import {Div} from "../../core/elements/index";

export default function Skeleton(props = {}) {
    if (!(this instanceof Skeleton)) {
        return new Skeleton(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        type: 'rect',
        variant: 'pulse',
        borderRadiusType: 'rounded',
        lines: null,
        width: null,
        height: null,
        loading: null,
        repeat: null,
        props
    };
}

BaseComponent.extends(Skeleton);

Skeleton.defaultTemplate = null;

Skeleton.use = function(template) {
    Skeleton.defaultTemplate = template;
};

Skeleton.preset = function(name, callback) {
    if (Skeleton.prototype[name] || Skeleton[name]) {
        DebugManager.warn(`Warning: the ${name} method already exists in Skeleton.`);
        return;
    }
    Skeleton[name] = (props) => callback(new Skeleton(props));
};

Skeleton.presets = function(presets) {
    for (const name in presets) {
        Skeleton.preset(name, presets[name]);
    }
};

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

Skeleton.prototype.rounded = function() {
    this.$description.borderRadiusType = 'rounded';
    return this;
};

Skeleton.prototype.pill = function() {
    this.$description.borderRadiusType = 'pill';
    return this;
};

Skeleton.prototype.smooth = function() {
    this.$description.borderRadiusType = 'smooth';
    return this;
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


Skeleton.card = function(type) {
    return VStack([
        Skeleton().type('image').height(200),
        VStack([
            Skeleton().text(1),
            Skeleton().text(2),
        ]).spacing('cozy')
    ], { class: 'skeleton-card '+type }).spacing('cozy');
};

Skeleton.list = function(items = 3) {
    return VStack(
        Array.from({length: items}, () =>
            HStack([
                Div({ class: 'skeleton-list-item-avatar' }, Skeleton().circle().size(40, 40)),
                Div({ class: 'skeleton-list-item-text' }, Skeleton().text(2)),
            ], { class: 'skeleton-list-item' }).spacing('comfortable').alignCenter()
        )
    ).spacing('comfortable');
};

Skeleton.table = function(rows = 5, cols = 4) {
    const buildRow = () =>
        HStack(
            Array.from({length: cols}, () =>
                Div({ class: 'skeleton-table-col' }, Skeleton().rect().height(16))
            ),
            { class: 'skeleton-table-row' }
        ).spacing('comfortable').alignCenter();

    return VStack([
        buildRow(),
        ...Array.from({length: rows}, () => buildRow())
    ]).spacing('cozy');
};

Skeleton.paragraph = function(lines = 3) {
    return Skeleton().text(lines);
};
