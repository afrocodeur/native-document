import {NDElement} from '../NDElement';

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

/**
 * Registers a beforeUnmount hook that plays an exit CSS transition before the element is removed.
 * Adds the class `{transitionName}-exit`, waits for the transition/animation to end, then removes it.
 *
 * @param {string} transitionName - CSS class prefix for the exit transition
 * @returns {this}
 * @example
 * Div({ class: 'modal' }).nd.transitionOut('fade');
 * // Adds 'fade-exit' before removal, waits for transitionend/animationend
 */
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

/**
 * Plays an enter CSS transition when the element is mounted into the DOM.
 * Adds `{transitionName}-enter-from` immediately, then swaps to `{transitionName}-enter-to`
 * on the next animation frame, and cleans up after the transition ends.
 *
 * @param {string} transitionName - CSS class prefix for the enter transition
 * @returns {this}
 * @example
 * Div({ class: 'modal' }).nd.transitionIn('fade');
 * // On mount: adds 'fade-enter-from', then swaps to 'fade-enter-to'
 */
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

/**
 * Applies both enter and exit transitions to the element.
 * Shorthand for calling .transitionIn(name) and .transitionOut(name).
 *
 * @param {string} transitionName - CSS class prefix for both enter and exit transitions
 * @returns {this}
 * @example
 * Div({}).nd.transition('slide');
 * // On mount: enter transition; on unmount: exit transition
 */
NDElement.prototype.transition = function (transitionName) {
    this.transitionIn(transitionName);
    this.transitionOut(transitionName);
    return this;
};

/**
 * Immediately applies a CSS animation class to the element.
 * Removes the class automatically once the animation ends.
 *
 * @param {string} animationName - CSS animation class name to add
 * @returns {this}
 * @example
 * Button('Click me').nd.animate('shake');
 * // Adds 'shake' class, removes it when animationend fires
 */
NDElement.prototype.animate = function(animationName) {
    const el = this.$element;
    el.classes.add(animationName);

    waitForVisualEnd(el).then(() => {
        el.classes.remove(animationName);
    });

    return this;
};