import { describe, it, expect, vi } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';
import ObservableArray from '../../../src/core/data/ObservableArray';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));

import { Div, Span, ForEachArray } from '../../../elements';

const mount = (anchor) => {
    document.body.innerHTML = '';
    document.body.appendChild(anchor);
    return document.body;
};

const items = (arr = []) => new ObservableArray(arr);

describe('ForEachArray', () => {

    // -- static array ---------------------------------------------------------

    describe('static array', () => {
        it('renders one element per item', () => {
            const anchor = ForEachArray(['a', 'b', 'c'], (item) => Div({}, item));
            const body   = mount(anchor);
            expect(body.querySelectorAll('div').length).toBe(3);
        });

        it('renders items in order', () => {
            const anchor = ForEachArray(['x', 'y', 'z'], (item) => Div({}, item));
            const body   = mount(anchor);
            const divs   = body.querySelectorAll('div');
            expect(divs[0].textContent).toBe('x');
            expect(divs[1].textContent).toBe('y');
            expect(divs[2].textContent).toBe('z');
        });

        it('renders empty array without error', () => {
            const anchor = ForEachArray([], (item) => Div({}, item));
            const body   = mount(anchor);
            expect(body.querySelectorAll('div').length).toBe(0);
        });
    });

    // -- ObservableArray initial render ---------------------------------------

    describe('ObservableArray initial render', () => {
        it('renders items from initial ObservableArray', () => {
            const obs    = items(['a', 'b', 'c']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            expect(body.querySelectorAll('div').length).toBe(3);
        });

        it('renders empty ObservableArray without error', () => {
            const obs    = items([]);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            expect(body.querySelectorAll('div').length).toBe(0);
        });
    });

    // -- push() ---------------------------------------------------------------

    describe('push()', () => {
        it('adds a rendered element to the DOM', () => {
            const obs    = items(['a', 'b']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.push('c');
            expect(body.querySelectorAll('div').length).toBe(3);
        });

        it('appended item appears last', () => {
            const obs    = items(['a', 'b']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.push('c');
            const divs = body.querySelectorAll('div');
            expect(divs[divs.length - 1].textContent).toBe('c');
        });
    });

    // -- removeItem() ---------------------------------------------------------

    describe('removeItem()', () => {
        it('removes the corresponding element', () => {
            const obs    = items(['a', 'b', 'c']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.removeItem('b');
            expect(body.querySelectorAll('div').length).toBe(2);
            expect(body.textContent).not.toContain('b');
        });
    });

    // -- clear() --------------------------------------------------------------

    describe('clear()', () => {
        it('removes all elements', () => {
            const obs    = items(['a', 'b', 'c']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.clear();
            expect(body.querySelectorAll('div').length).toBe(0);
        });
    });

    // -- set() ----------------------------------------------------------------

    describe('set()', () => {
        it('replaces all elements', () => {
            const obs    = items(['a', 'b']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.set(['x', 'y', 'z']);
            const divs = body.querySelectorAll('div');
            expect(divs.length).toBe(3);
            expect(divs[0].textContent).toBe('x');
        });
    });

    // -- swap() ---------------------------------------------------------------

    describe('swap()', () => {
        it('swaps two items in the DOM', () => {
            const obs    = items(['a', 'b', 'c']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.swap(0, 2);
            const divs = body.querySelectorAll('div');
            expect(divs[0].textContent).toBe('c');
            expect(divs[2].textContent).toBe('a');
        });
    });

    // -- index observable -----------------------------------------------------

    describe('index observable', () => {
        it('passes index observable when callback has 2 params', () => {
            const obs      = items(['a', 'b', 'c']);
            const indices  = [];
            const anchor   = ForEachArray(obs, (item, index) => {
                indices.push(index);
                return Div({}, item);
            });
            mount(anchor);
            expect(indices.length).toBe(3);
        });
    });

    // -- order preservation ---------------------------------------------------

    describe('order preservation', () => {
        it('preserves order after multiple mutations', () => {
            const obs    = items(['a', 'b', 'c']);
            const anchor = ForEachArray(obs, (item) => Div({}, item));
            const body   = mount(anchor);
            obs.push('d');
            obs.removeItem('b');
            const divs = body.querySelectorAll('div');
            expect([...divs].map((d) => d.textContent)).toEqual(['a', 'c', 'd']);
        });
    });

});