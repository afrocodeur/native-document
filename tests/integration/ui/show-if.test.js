import { describe, it, expect, vi } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));

// Initialize NDElement prototypes (toNdElement, nd, etc.)
import { Div, ShowIf, HideIf, HideIfNot } from '../../../elements';

// Helper - create a NativeDocument Div element (requires toNdElement prototype)
const el = (text = 'content') => Div({}, text);

// Mount anchor into the document to enable DOM queries
const mount = (anchor) => {
    document.body.innerHTML = '';
    document.body.appendChild(anchor);
    return document.body;
};

describe('ShowIf', () => {

    // -- static boolean -------------------------------------------------------

    describe('static boolean condition', () => {
        it('returns the element when condition is true', () => {
            const result = ShowIf(true, el('hello'));
            expect(result).not.toBeNull();
        });

        it('returns null when condition is false', () => {
            const result = ShowIf(false, el('hello'));
            expect(result).toBeNull();
        });
    });

    // -- observable condition -------------------------------------------------

    describe('observable condition', () => {
        it('renders content when condition is initially true', () => {
            const visible = Observable(true);
            const anchor  = ShowIf(visible, el('hello'));
            const body    = mount(anchor);
            expect(body.textContent).toContain('hello');
        });

        it('does not render content when condition is initially false', () => {
            const visible = Observable(false);
            const anchor  = ShowIf(visible, el('hello'));
            const body    = mount(anchor);
            expect(body.textContent).not.toContain('hello');
        });

        it('mounts content when observable changes to true', () => {
            const visible = Observable(false);
            const anchor  = ShowIf(visible, el('hello'));
            const body    = mount(anchor);
            visible.set(true);
            expect(body.textContent).toContain('hello');
        });

        it('unmounts content when observable changes to false', () => {
            const visible = Observable(true);
            const anchor  = ShowIf(visible, el('hello'));
            const body    = mount(anchor);
            visible.set(false);
            expect(body.textContent).not.toContain('hello');
        });

        it('remounts content on second true', () => {
            const visible = Observable(true);
            const anchor  = ShowIf(visible, el('hello'));
            const body    = mount(anchor);
            visible.set(false);
            visible.set(true);
            expect(body.textContent).toContain('hello');
        });
    });

    // -- factory child --------------------------------------------------------

    describe('factory child', () => {
        it('accepts a function as child', () => {
            const visible = Observable(true);
            const factory = () => el('from factory');
            const anchor  = ShowIf(visible, factory);
            const body    = mount(anchor);
            expect(body.textContent).toContain('from factory');
        });

        it('shouldKeepInCache=false re-creates element on each mount', () => {
            let callCount = 0;
            const visible = Observable(false);
            const factory = () => { callCount++; return el('dynamic'); };
            ShowIf(visible, factory, { shouldKeepInCache: false });
            visible.set(true);
            visible.set(false);
            visible.set(true);
            expect(callCount).toBe(2);
        });

        it('shouldKeepInCache=true (default) creates element only once', () => {
            let callCount = 0;
            const visible = Observable(false);
            const factory = () => { callCount++; return el('cached'); };
            ShowIf(visible, factory, { shouldKeepInCache: true });
            visible.set(true);
            visible.set(false);
            visible.set(true);
            expect(callCount).toBe(1);
        });
    });

    // -- non-observable condition ---------------------------------------------

    describe('non-observable condition', () => {
        it('does not throw for invalid condition type', () => {
            // DebugManager.warn is already mocked via vi.mock at the top
            expect(() => ShowIf('invalid', el())).not.toThrow();
        });
    });

});

// -- HideIf ------------------------------------------------------------------

describe('HideIf', () => {
    it('hides content when condition is true', () => {
        const flag   = Observable(true);
        const anchor = HideIf(flag, el('hidden'));
        const body   = mount(anchor);
        expect(body.textContent).not.toContain('hidden');
    });

    it('shows content when condition is false', () => {
        const flag   = Observable(false);
        const anchor = HideIf(flag, el('visible'));
        const body   = mount(anchor);
        expect(body.textContent).toContain('visible');
    });

    it('reacts when condition changes', () => {
        const flag   = Observable(false);
        const anchor = HideIf(flag, el('content'));
        const body   = mount(anchor);
        expect(body.textContent).toContain('content');
        flag.set(true);
        expect(body.textContent).not.toContain('content');
    });
});

// -- HideIfNot ---------------------------------------------------------------

describe('HideIfNot', () => {
    it('shows content when condition is true (same as ShowIf)', () => {
        const visible = Observable(true);
        const anchor  = HideIfNot(visible, el('shown'));
        const body    = mount(anchor);
        expect(body.textContent).toContain('shown');
    });

    it('hides content when condition is false', () => {
        const visible = Observable(false);
        const anchor  = HideIfNot(visible, el('shown'));
        const body    = mount(anchor);
        expect(body.textContent).not.toContain('shown');
    });
});