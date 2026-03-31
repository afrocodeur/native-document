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
    const el = this.$element;
    this.beforeUnmount('transition-exit', async function() {
        el.classes.add(exitClass);
        await waitForVisualEnd(el);
        el.classes.remove(exitClass);
    });
    return this;
};

NDElement.prototype.transitionIn = function(transitionName) {
    const startClass = transitionName + '-enter-from';
    const endClass = transitionName + '-enter-to';

    const el = this.$element;

    el.classes.add(startClass);

    this.mounted(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.classes.remove(startClass);
                el.classes.add(endClass);

                waitForVisualEnd(el).then(() => {
                    el.classes.remove(endClass);
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
    const el = this.$element;
    el.classes.add(animationName);

    waitForVisualEnd(el).then(() => {
        el.classes.remove(animationName);
    });

    return this;
};