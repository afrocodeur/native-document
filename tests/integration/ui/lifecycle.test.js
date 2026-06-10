import { describe, it, expect, vi } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));

import { Div } from '../../../elements';

// Wait for MutationObserver to fire
const tick = () => new Promise((r) => setTimeout(r, 0));

// Helper - returns the HTMLElement and a stable .nd reference
const mkEl = (text = 'content') => {
    const el = Div({}, text);
    return { el, nd: el.nd };
};

describe('Lifecycle', () => {

    // -- mounted() ------------------------------------------------------------

    describe('mounted()', () => {
        it('callback is called when element is inserted into DOM', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.mounted(cb);
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            expect(cb).toHaveBeenCalledOnce();
        });

        it('callback is not called before insertion', async () => {
            const { nd } = mkEl('hello');
            const cb = vi.fn();
            nd.mounted(cb);
            await tick();
            expect(cb).not.toHaveBeenCalled();
        });

        it('multiple mounted callbacks are all called', async () => {
            const { el, nd } = mkEl('hello');
            const cb1 = vi.fn();
            const cb2 = vi.fn();
            nd.mounted(cb1);
            nd.mounted(cb2);
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            expect(cb1).toHaveBeenCalledOnce();
            expect(cb2).toHaveBeenCalledOnce();
        });

        it('lifecycle({ mounted }) shorthand works', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.lifecycle({ mounted: cb });
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- unmounted() ----------------------------------------------------------

    describe('unmounted()', () => {
        it('callback is called when element is removed from DOM', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.unmounted(cb);
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            el.remove();
            await tick();
            expect(cb).toHaveBeenCalledOnce();
        });

        it('callback is not called before removal', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.unmounted(cb);
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            expect(cb).not.toHaveBeenCalled();
        });

        it('lifecycle({ unmounted }) shorthand works', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.lifecycle({ unmounted: cb });
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            el.remove();
            await tick();
            expect(cb).toHaveBeenCalledOnce();
        });
    });

    // -- destroy() ------------------------------------------------------------

    describe('destroy()', () => {
        it('nulls the internal $element reference', () => {
            const { nd } = mkEl('hello');
            nd.destroy();
            expect(nd.$element).toBeNull();
        });

        it('does not throw when called multiple times', () => {
            const { nd } = mkEl('hello');
            nd.destroy();
            expect(() => nd.destroy()).not.toThrow();
        });

        it('unsubscribes from lifecycle callbacks after destroy', async () => {
            const { el, nd } = mkEl('hello');
            const cb = vi.fn();
            nd.mounted(cb);
            nd.destroy();
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            expect(cb).not.toHaveBeenCalled();
        });
    });

    // -- destroyOnUnmount() ---------------------------------------------------

    describe('destroyOnUnmount()', () => {
        it('nulls $element when element is removed from DOM', async () => {
            const { el, nd } = mkEl('hello');
            nd.destroyOnUnmount();
            document.body.innerHTML = '';
            document.body.appendChild(el);
            await tick();
            el.remove();
            await tick();
            expect(nd.$element).toBeNull();
        });
    });

});