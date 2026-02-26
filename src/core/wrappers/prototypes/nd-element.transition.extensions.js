import {NDElement} from "../NDElement";

/**
 * @param {HTMLElement} el
 * @param {number} timeout
 */
const waitForVisualEnd = (el, timeout = 1000) => {
    return new Promise((resolve) => {
        let isResolved = false;

        const cleanupAndResolve = (e) => {
            if (e && e.target !== el) return;
            if (isResolved) return;

            isResolved = true;
            el.removeEventListener('transitionend', cleanupAndResolve);
            el.removeEventListener('animationend', cleanupAndResolve);
            clearTimeout(timer);
            resolve();
        };

        el.addEventListener('transitionend', cleanupAndResolve);
        el.addEventListener('animationend', cleanupAndResolve);

        const timer = setTimeout(cleanupAndResolve, timeout);

        const style = window.getComputedStyle(el);
        const hasTransition = style.transitionDuration !== '0s';
        const hasAnimation = style.animationDuration !== '0s';

        if (!hasTransition && !hasAnimation) {
            cleanupAndResolve();
        }
    });
};

NDElement.prototype.transitionOut = function(transitionName) {
    const exitClass = transitionName + '-exit';
    this.beforeUnmount('transition-exit', async function() {
        this.$element.classes.add(exitClass);
        await waitForVisualEnd(this.$element);
        this.$element.classes.remove(exitClass);
    });
    return this;
};

NDElement.prototype.transitionIn = function(transitionName) {
    const startClass = transitionName + '-enter-from';
    const endClass = transitionName + '-enter-to';

    this.$element.classes.add(startClass);

    this.mounted(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.$element.classes.remove(startClass);
                this.$element.classes.add(endClass);

                waitForVisualEnd(this.$element).then(() => {
                    this.$element.classes.remove(endClass);
                });
            });
        });
    });
    return this;
};


NDElement.prototype.transition = function (transitionName) {
    this.transitionIn(transitionName);
    this.transitionOut(transitionName);
    return this;
};

NDElement.prototype.animate = function(animationName) {
    this.$element.classes.add(animationName);

    waitForVisualEnd(this.$element).then(() => {
        this.$element.classes.remove(animationName);
    });

    return this;
};