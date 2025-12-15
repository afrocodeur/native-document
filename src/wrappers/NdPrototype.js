import { NDElement } from "./NDElement";

const property = {
    configurable: true,
    get() {
        return  new NDElement(this);
    }
};

Object.defineProperty(HTMLElement.prototype, 'nd', property);

Object.defineProperty(DocumentFragment.prototype, 'nd', property);
Object.defineProperty(NDElement.prototype, 'nd', {
    configurable: true,
    get: function() {
        return this;
    }
});

const classListMethods = {
    getClasses() {
        return this.$element.className?.split(' ').filter(Boolean);
    },
    add(value) {
        const classes = this.getClasses();
        if(classes.indexOf(value) >= 0) {
            return;
        }
        classes.push(value);
        this.$element.className = classes.join(' ');
    },
    remove(value) {
        const classes = this.getClasses();
        const index = classes.indexOf(value);
        if(index < 0) {
            return;
        }
        classes.splice(index, 1);
        this.$element.className = classes.join(' ');
    },
    toggle(value, force = undefined) {
        const classes = this.getClasses();
        const index = classes.indexOf(value);
        if(index >= 0) {
            if(force === true) {
                return;
            }
            classes.splice(index, 1);
        }
        else {
            if(force === false) {
                return;
            }
            classes.push(value);
        }
        this.$element.className = classes.join(' ');
    },
    contains(value) {
        return this.getClasses().indexOf(value) >= 0;
    }
}

Object.defineProperty(HTMLElement.prototype, 'classes', {
    configurable: true,
    get() {
        return {
            $element: this,
            ...classListMethods
        };
    }
});