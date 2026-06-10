import { describe, it, expect, vi } from 'vitest';
import { Route } from '../../../src/router/Route';
import Router from '../../../src/router/Router';

vi.mock('../../../src/core/utils/debug-manager', () => ({
    default: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), disable: vi.fn() },
}));

// Test helpers
const component = () => document.createElement('div');

const makeRouter = (callback) => {
    const router = new Router({ mode: 'memory' });
    callback(router);
    return router;
};

describe('Router guards (middlewares)', () => {

    // -- middleware execution -------------------------------------------------

    describe('middleware execution', () => {
        it('middleware is called on route change', () => {
            const guard = vi.fn((_req, next) => next());
            const router = makeRouter((r) => {
                r.add('/home', component, { middlewares: [guard] });
            });
            const resolved = router.resolve('/home');
            router.handleRouteChange(resolved.route, resolved.params, resolved.query, '/home');
            expect(guard).toHaveBeenCalledOnce();
        });

        it('middleware receives the request object', () => {
            let capturedRequest = null;
            const guard = vi.fn((req, next) => {
                capturedRequest = req;
                next();
            });
            const router = makeRouter((r) => {
                r.add('/about', component, { middlewares: [guard] });
            });
            const resolved = router.resolve('/about');
            router.handleRouteChange(resolved.route, {}, {}, '/about');
            expect(capturedRequest).toMatchObject({ path: '/about' });
        });

        it('multiple middlewares are called in order', () => {
            const order = [];
            const g1 = (_req, next) => { order.push(1); next(); };
            const g2 = (_req, next) => { order.push(2); next(); };
            const g3 = (_req, next) => { order.push(3); next(); };

            const router = makeRouter((r) => {
                r.add('/page', component, { middlewares: [g1, g2, g3] });
            });
            const resolved = router.resolve('/page');
            router.handleRouteChange(resolved.route, {}, {}, '/page');
            expect(order).toEqual([1, 2, 3]);
        });

        it('not calling next() stops the chain', () => {
            const g1 = vi.fn((_req, _next) => {}); // does not call next
            const g2 = vi.fn((_req, next) => next());

            const router = makeRouter((r) => {
                r.add('/blocked', component, { middlewares: [g1, g2] });
            });
            const resolved = router.resolve('/blocked');
            router.handleRouteChange(resolved.route, {}, {}, '/blocked');
            expect(g1).toHaveBeenCalledOnce();
            expect(g2).not.toHaveBeenCalled();
        });
    });

    // -- group middlewares ----------------------------------------------------

    describe('group middlewares', () => {
        it('group middleware is applied to all routes in the group', () => {
            const authGuard = vi.fn((_req, next) => next());

            const router = makeRouter((r) => {
                r.group('/admin', { middlewares: [authGuard] }, () => {
                    r.add('/dashboard', component);
                    r.add('/settings', component);
                });
            });

            const r1 = router.resolve('/admin/dashboard');
            router.handleRouteChange(r1.route, {}, {}, '/admin/dashboard');

            const r2 = router.resolve('/admin/settings');
            router.handleRouteChange(r2.route, {}, {}, '/admin/settings');

            expect(authGuard).toHaveBeenCalledTimes(2);
        });

        it('group middleware runs before route-level middleware', () => {
            const order = [];
            const groupGuard = (_req, next) => { order.push('group'); next(); };
            const routeGuard = (_req, next) => { order.push('route'); next(); };

            const router = makeRouter((r) => {
                r.group('/admin', { middlewares: [groupGuard] }, () => {
                    r.add('/users', component, { middlewares: [routeGuard] });
                });
            });

            const resolved = router.resolve('/admin/users');
            router.handleRouteChange(resolved.route, {}, {}, '/admin/users');
            expect(order).toEqual(['group', 'route']);
        });
    });

    // -- subscribe() ----------------------------------------------------------

    describe('subscribe()', () => {
        it('listener is called after all middlewares', () => {
            const listener = vi.fn();
            const guard = (_req, next) => next();

            const router = makeRouter((r) => {
                r.add('/home', component, { middlewares: [guard] });
            });
            router.subscribe(listener);

            const resolved = router.resolve('/home');
            router.handleRouteChange(resolved.route, {}, {}, '/home');
            expect(listener).toHaveBeenCalledOnce();
        });

        it('unsubscribe stops the listener from being called', () => {
            const listener = vi.fn();
            const router = makeRouter((r) => r.add('/home', component));
            const unsub = router.subscribe(listener);
            unsub();

            const resolved = router.resolve('/home');
            router.handleRouteChange(resolved.route, {}, {}, '/home');
            expect(listener).not.toHaveBeenCalled();
        });

        it('subscribe throws if argument is not a function', () => {
            const router = makeRouter((r) => r.add('/home', component));
            expect(() => router.subscribe('not-a-fn')).toThrow();
        });
    });

    // -- resolve() ------------------------------------------------------------

    describe('resolve()', () => {
        it('resolves a path to a route', () => {
            const router = makeRouter((r) => r.add('/about', component));
            const resolved = router.resolve('/about');
            expect(resolved.route).toBeDefined();
            expect(resolved.params).toEqual({});
        });

        it('resolves a named route', () => {
            const router = makeRouter((r) => {
                r.add('/about', component, { name: 'about' });
            });
            const resolved = router.resolve({ name: 'about' });
            expect(resolved.route.name()).toBe('about');
        });

        it('throws for an unknown path', () => {
            const router = makeRouter((r) => r.add('/home', component));
            expect(() => router.resolve('/unknown')).toThrow();
        });

        it('parses query string', () => {
            const router = makeRouter((r) => r.add('/search', component));
            const resolved = router.resolve('/search?q=hello&page=2');
            expect(resolved.query).toMatchObject({ q: 'hello', page: '2' });
        });
    });

    // -- currentState() -------------------------------------------------------

    describe('currentState()', () => {
        it('reflects the current route after handleRouteChange', () => {
            const router = makeRouter((r) => r.add('/home', component));
            const resolved = router.resolve('/home');
            router.handleRouteChange(resolved.route, {}, {}, '/home');
            expect(router.currentState().path).toBe('/home');
        });
    });

});