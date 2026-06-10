import { describe, it, expect } from 'vitest';
import { Route } from '../../../src/router/Route';

const route = (path, options = {}) => new Route(path, () => {}, options);

describe('Route matching', () => {

    // -- exact path -----------------------------------------------------------

    describe('exact path', () => {
        it('matches an exact path', () => {
            const r = route('/about');
            expect(r.match('/about')).toEqual({});
        });

        it('does not match a different path', () => {
            const r = route('/about');
            expect(r.match('/contact')).toBe(false);
        });

        it('normalizes leading and trailing slashes', () => {
            const r = route('about/');
            expect(r.match('about')).toEqual({});
        });

        it('does not match a partial path', () => {
            const r = route('/about');
            expect(r.match('/about/us')).toBe(false);
        });

        it('matches root path /', () => {
            const r = route('/');
            expect(r.match('/')).toEqual({});
        });
    });

    // -- :param extraction ----------------------------------------------------

    describe('param extraction', () => {
        it('extracts a single param', () => {
            const r = route('/user/{id}');
            expect(r.match('/user/42')).toEqual({ id: '42' });
        });

        it('extracts multiple params', () => {
            const r = route('/user/{userId}/post/{postId}');
            expect(r.match('/user/1/post/99')).toEqual({ userId: '1', postId: '99' });
        });

        it('does not match if param segment is missing', () => {
            const r = route('/user/{id}');
            expect(r.match('/user/')).toBe(false);
        });

        it('does not match if extra segments are present', () => {
            const r = route('/user/{id}');
            expect(r.match('/user/42/extra')).toBe(false);
        });
    });

    // -- typed params ---------------------------------------------------------

    describe('typed params', () => {
        it('{id:id} matches numeric id', () => {
            const r = route('/post/{id:id}');
            expect(r.match('/post/123')).toEqual({ id: '123' });
        });

        it('{id:id} does not match non-numeric', () => {
            const r = route('/post/{id:id}');
            expect(r.match('/post/abc')).toBe(false);
        });

        it('{lang:lang} matches a two-letter language code', () => {
            const r = route('/{lang:lang}/home');
            expect(r.match('/fr/home')).toEqual({ lang: 'fr' });
        });

        it('{lang:lang} does not match three-letter code', () => {
            const r = route('/{lang:lang}/home');
            expect(r.match('/fra/home')).toBe(false);
        });

        it('{token:token} matches alphanumeric token', () => {
            const r = route('/token/{value:token}');
            expect(r.match('/token/abc123_-')).toEqual({ value: 'abc123_-' });
        });

        it('{n:number} matches integer', () => {
            const r = route('/page/{n:number}');
            expect(r.match('/page/5')).toEqual({ n: '5' });
        });

        it('{n:number} matches float', () => {
            const r = route('/price/{n:number}');
            expect(r.match('/price/3.14')).toEqual({ n: '3.14' });
        });
    });

    // -- custom param validators ----------------------------------------------

    describe('custom param validators (with)', () => {
        it('accepts a custom regex pattern via options.with', () => {
            const r = route('/status/{code}', {
                with: { code: 'active|inactive|pending' },
            });
            expect(r.match('/status/active')).toEqual({ code: 'active' });
            expect(r.match('/status/unknown')).toBe(false);
        });
    });

    // -- url() ----------------------------------------------------------------

    describe('url()', () => {
        it('generates a URL from params', () => {
            const r = route('/user/{id}');
            expect(r.url({ params: { id: 42 } })).toBe('/user/42');
        });

        it('generates a URL with query string', () => {
            const r = route('/search');
            const url = r.url({ query: { q: 'hello', page: '1' } });
            expect(url).toContain('/search?');
            expect(url).toContain('q=hello');
            expect(url).toContain('page=1');
        });

        it('throws if a required param is missing', () => {
            const r = route('/user/{id}');
            expect(() => r.url({ params: {} })).toThrow();
        });

        it('prepends basePath if provided', () => {
            const r = route('/about');
            expect(r.url({ basePath: '/app' })).toBe('/app/about');
        });
    });

    // -- route metadata -------------------------------------------------------

    describe('route metadata', () => {
        it('name() returns the route name', () => {
            const r = route('/about', { name: 'about' });
            expect(r.name()).toBe('about');
        });

        it('name() returns null without a name', () => {
            const r = route('/about');
            expect(r.name()).toBeNull();
        });

        it('path() returns the normalized path', () => {
            // trim() strips trailing slashes
            const r = route('/about');
            expect(r.path()).toBe('/about');
        });

        it('shouldRebuild() returns false by default', () => {
            const r = route('/about');
            expect(r.shouldRebuild()).toBe(false);
        });

        it('shouldRebuild() returns true when set', () => {
            const r = route('/about', { shouldRebuild: true });
            expect(r.shouldRebuild()).toBe(true);
        });
    });

});