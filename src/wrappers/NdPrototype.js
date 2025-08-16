import { NDElement } from "./NDElement";

Object.defineProperty(HTMLElement.prototype, 'nd', {
    get() {
        if(this.$nd) {
            return this.$nd;
        }

        this.$nd = new NDElement(this);
        this.$nd.nd = this.$nd;
        return this.$nd;
    }
});