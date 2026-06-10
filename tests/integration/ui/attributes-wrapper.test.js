import { describe, it, expect, vi } from 'vitest';
import { Observable } from '../../../src/core/data/Observable';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));

import { Div, Input, Span } from '../../../elements';

describe('AttributesWrapper', () => {

    // -- string attributes ----------------------------------------------------

    describe('string attributes', () => {
        it('sets a string attribute', () => {
            const el = Div({ id: 'main', 'data-test': 'value' });
            expect(el.getAttribute('id')).toBe('main');
            expect(el.getAttribute('data-test')).toBe('value');
        });

        it('sets a number attribute as string', () => {
            const el = Div({ tabindex: 0 });
            expect(el.getAttribute('tabindex')).toBe('0');
        });

        it('ignores null values', () => {
            const el = Div({ id: null });
            expect(el.hasAttribute('id')).toBe(false);
        });

        it('ignores undefined values', () => {
            const el = Div({ id: undefined });
            expect(el.hasAttribute('id')).toBe(false);
        });
    });

    // -- class ----------------------------------------------------------------

    describe('class', () => {
        it('applies a class string', () => {
            const el = Div({ class: 'foo bar' });
            expect(el.className).toBe('foo bar');
        });

        it('applies a class map object', () => {
            const el = Div({ class: { active: true, disabled: false } });
            expect(el.classList.contains('active')).toBe(true);
            expect(el.classList.contains('disabled')).toBe(false);
        });

        it('toggles class reactively with Observable', () => {
            const isActive = Observable(false);
            const el = Div({ class: { active: isActive } });
            expect(el.classList.contains('active')).toBe(false);
            isActive.set(true);
            expect(el.classList.contains('active')).toBe(true);
        });

        it('adds multiple reactive classes', () => {
            const a = Observable(true);
            const b = Observable(false);
            const el = Div({ class: { foo: a, bar: b } });
            expect(el.classList.contains('foo')).toBe(true);
            expect(el.classList.contains('bar')).toBe(false);
            b.set(true);
            expect(el.classList.contains('bar')).toBe(true);
        });
    });

    // -- style ----------------------------------------------------------------

    describe('style', () => {
        it('applies a static style map', () => {
            const el = Div({ style: { color: 'red', fontSize: '16px' } });
            expect(el.style.color).toBe('red');
            expect(el.style.fontSize).toBe('16px');
        });

        it('updates style reactively with Observable', () => {
            const color = Observable('red');
            const el    = Div({ style: { color } });
            expect(el.style.color).toBe('red');
            color.set('blue');
            expect(el.style.color).toBe('blue');
        });

        it('sets CSS custom property via --var syntax', () => {
            const el = Div({ style: { '--primary': '#fff' } });
            expect(el.style.getPropertyValue('--primary')).toBe('#fff');
        });

        it('updates CSS custom property reactively', () => {
            const primary = Observable('#fff');
            const el      = Div({ style: { '--primary': primary } });
            expect(el.style.getPropertyValue('--primary')).toBe('#fff');
            primary.set('#000');
            expect(el.style.getPropertyValue('--primary')).toBe('#000');
        });
    });

    // -- Observable attribute -------------------------------------------------

    describe('Observable attribute', () => {
        it('sets attribute from Observable initial value', () => {
            const label = Observable('hello');
            const el    = Div({ 'aria-label': label });
            expect(el.getAttribute('aria-label')).toBe('hello');
        });

        it('updates attribute when Observable changes', () => {
            const label = Observable('hello');
            const el    = Div({ 'aria-label': label });
            label.set('world');
            expect(el.getAttribute('aria-label')).toBe('world');
        });

        it('handles multiple Observable attributes', () => {
            const a = Observable('val-a');
            const b = Observable('val-b');
            const el = Div({ 'data-a': a, 'data-b': b });
            b.set('changed');
            expect(el.getAttribute('data-a')).toBe('val-a');
            expect(el.getAttribute('data-b')).toBe('changed');
        });
    });

    // -- boolean attributes ---------------------------------------------------

    describe('boolean attributes', () => {
        it('sets disabled=true on input', () => {
            const el = Input({ type: 'text', disabled: true });
            expect(el.disabled).toBe(true);
        });

        it('sets disabled=false on input', () => {
            const el = Input({ type: 'text', disabled: false });
            expect(el.disabled).toBe(false);
        });

        it('toggles aria-disabled reactively via Observable', () => {
            // Use a standard string attribute for reliable reactive testing
            const isDisabled = Observable('false');
            const el         = Input({ type: 'text', 'aria-disabled': isDisabled });
            expect(el.getAttribute('aria-disabled')).toBe('false');
            isDisabled.set('true');
            expect(el.getAttribute('aria-disabled')).toBe('true');
        });

        it('sets checked on checkbox', () => {
            const el = Input({ type: 'checkbox', checked: true });
            expect(el.checked).toBe(true);
        });
    });

    // -- aria attributes ------------------------------------------------------

    describe('aria attributes (via this.aria + resolveAriaKey)', () => {
        it('sets aria-label directly', () => {
            const el = Div({ 'aria-label': 'My label' });
            expect(el.getAttribute('aria-label')).toBe('My label');
        });

        it('sets role attribute', () => {
            const el = Div({ role: 'dialog' });
            expect(el.getAttribute('role')).toBe('dialog');
        });

        it('sets aria-expanded reactively', () => {
            const expanded = Observable('false');
            const el       = Div({ 'aria-expanded': expanded });
            expect(el.getAttribute('aria-expanded')).toBe('false');
            expanded.set('true');
            expect(el.getAttribute('aria-expanded')).toBe('true');
        });
    });

});