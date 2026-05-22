# Changelog

All notable changes to NativeDocument will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- `Card` - versatile content container with image, header, footer, actions, clickable and loading states (renderer implementation in progress)
- `List` - flexible list with single/multi selection, checkbox or click-to-select modes, dividers and keyboard navigation (renderer implementation in progress)

---

## [1.0.166] - 2026-06-03

### Added

#### Core
- `Observable.resource()` - async data fetching with built-in state machine (`unresolved`, `pending`, `ready`, `refreshing`, `errored`), `AbortController` support, reactive dependencies, debounce, and optimistic `mutate()`
- `Observable.batch()` - batch multiple state changes into a single computed update, with async support
- `Observable.useValueProperty(name?)` - define a custom property alias for `$value`
- `Observable.autoCleanup(enable, options?)` - automatic periodic cleanup of orphaned observables via `WeakRef` and `FinalizationRegistry`
- `Observable.getById(id)` - retrieve a registered observable by its internal memory ID
- `observable.intercept(callback)` - transform or abort values before they are set
- `observable.interceptMutations(callback)` - intercept array and object mutations separately
- `observable.onCleanup(callback)` - register a callback that runs when the observable is cleaned up
- `observable.once(predicate, callback)` - single-fire listener triggered by value or condition
- `observable.deepSubscribe(callback)` - react to changes at any nesting depth
- `observable.persist(key, options?)` - two-way synchronization with `localStorage`
- `observable.clone()` - deep clone of the observable's current value
- `observable.resolve()` - recursively extract plain values from observables and proxies
- `observable.trigger()` - force notification without changing the value
- `observable.reset()` - reset to the initial value (requires `{ reset: true }` option)
- `Observable.computed()` - derived observable that recalculates when dependencies change
- `Observable.object()` / `Observable.json()` / `Observable.init()` - per-property reactive proxy
- `Observable.array()` - reactive array with mutating methods (`push`, `pop`, `splice`, `swap`, `merge`, `at`, `count`, `removeItem`, `insertAfter`)
- `ObservableArray.where()` / `whereSome()` / `whereEvery()` - live reactive filtering
- `observable.format(type, options?)` - locale-aware value formatting (`currency`, `number`, `percent`, `date`, `time`, `datetime`, `relative`, `plural`, custom)
- `Observable.setLocale(locale)` - set the reactive locale for all `.format()` calls
- `Formatters` - extensible formatter registry for custom format types
- Convenience checkers: `isTruthy()`, `isFalsy()`, `isEmpty()`, `isNotEmpty()`, `isEqualTo()`, `isGreaterThan()`, `isBetween()`, `isStartingWith()`, `isIncludedIn()`, `isHaving()`, and more
- Convenience transformers: `toUpperCase()`, `toLower()`, `toTrimmed()`, `toLength()`, `toClamped()`, `toPercent()`, `toLiteral()`, `toProperty()`

#### NDElement
- `.nd` proxy on every HTML element - fluent API for events, lifecycle, DOM utilities
- Auto-generated event methods for all standard DOM events in 4 variants: `onClick`, `onPreventClick`, `onStopClick`, `onPreventStopClick`
- `.on(name, callback, options)` - generic event with `AbortController` auto-cleanup on unmount
- `.off(name, callback)` - remove a specific listener
- `.once(name, callback)` - one-time listener
- `.emit(name, detail?)` - dispatch a custom event
- `.attr(name, value)` / `.attrs(attrs)` - reactive attribute binding
- `.class(map)` / `.style(map)` - reactive class and style binding
- `.ref(target, name)` - store the native `HTMLElement` reference
- `.refSelf(target, name)` - store the `NDElement` instance reference
- `.with(methods)` - add methods to a single element instance (component encapsulation pattern)
- `NDElement.extend(methods)` - add methods to all NDElement instances globally
- `.ghostDom(element)` - inject a companion element alongside the returned element
- `.attach(methodName, hydrator)` - template binding for `useCache` / `useSingleton`
- `.mounted(callback)` / `.unmounted(callback)` / `.lifecycle({ mounted, unmounted })` - DOM lifecycle hooks
- `.beforeUnmount(id, asyncCallback)` - async callback before element removal (exit animations)
- `.destroyOnUnmount()` - automatically call `destroy()` on unmount
- `.destroy()` - abort internal `AbortController`, clear lifecycle observers
- `.transition(name)` / `.transitionIn(name)` / `.transitionOut(name)` / `.animate(name)` - CSS transition helpers
- `.openShadow(css?)` / `.closedShadow(css?)` - Shadow DOM encapsulation
- `.unmountChildren()` - unmount all child elements

#### Elements
- Wrapper functions for all standard HTML elements (`Div`, `Button`, `Input`, `Form`, `Table`, etc.)
- `Fragment` - one-time static content grouping via `DocumentFragment`
- `Anchor` / `NativeDocumentFragment` - dynamic DOM zone delimited by comment markers
- `ShowIf` / `HideIf` / `HideIfNot` - conditional rendering with optional caching
- `ShowWhen` - show when an observable matches a specific value
- `Switch` - binary content toggle
- `Match` - multi-state rendering with `.nd.add()` / `.nd.remove()` for dynamic states
- `When` - fluent builder for conditional rendering
- `ForEach` - keyed list rendering for arrays and objects, with index observable
- `ForEachArray` - high-performance array rendering with `TemplateCloner`
- `useCache($binder)` - template cloning with data binding (value, class, style, attr, attach)
- `useSingleton(view)` - singleton view with named updatable sections
- Full SVG element set (`SvgSvg`, `SvgCircle`, `SvgRect`, `SvgPath`, etc.) with reactive attributes
- `classPropertyAccumulator` / `cssPropertyAccumulator` - programmatic class and style builders

#### Router
- `Router.create({ name, mode }, callback)` - multi-mode router (history, hash, memory)
- Route parameters with validation via `RouteParamPatterns` (built-in: `id`, `uuid`, `slug`, `locale`, `token`, and more)
- Named routes, route groups with shared middleware and layout, catch-all `{*}`
- `Router.push()` / `Router.replace()` / `Router.redirectTo()` / `Router.back()` / `Router.forward()`
- `Link` component with named route resolution and active state
- Middleware system with `context` and `next()`
- Multiple named routers with `Router.get(name)` / `Router.routers`

#### Store
- `Store.create()` / `createResettable()` / `createPersistent()` / `createPersistentResettable()` / `createComposed()`
- `Store.group(name, fn)` - isolated namespace with full Store API
- `Store.use(name)` - two-way reactive follower
- `Store.follow(name)` - read-only reactive follower (throws on mutation)
- `Store.get(name)` - raw observable access
- `Store.has(name)` / `Store.delete(name)` / `Store.reset(name)`

#### Utilities
- `NativeFetch` - HTTP client with request/response interceptors, automatic JSON, query string, FormData support
- `Cache.once(fn)` / `Cache.singleton(fn)` / `Cache.memoize(fn)` - lazy init, eager singleton, key-based memoization
- Filter helpers: `equals`, `greaterThan`, `between`, `includes`, `startsWith`, `match`, `inArray`, `and`, `or`, `not`, `custom`, `dateEquals`, `dateBetween`, `timeBetween`, `dateTimeBetween`, and more
- `ArgTypes` + `.args()` + `withValidation()` - runtime argument validation (development only)
- `PluginsManager` - internal event bus for DevTools integration
- `MemoryManager` - `WeakRef`-based observable registry with `FinalizationRegistry` auto-cleanup
- `ShortcutManager` - global and context-scoped keyboard shortcuts with OS-aware display
- `I18nService` - locale management backed by `i18next`, with `tr()` translation helper and `npm run i18n:scan`

#### Components (50+)
- **Layout**: `HStack`, `VStack`, `Row`, `Col`, `AbsoluteStack`, `FixedStack`, `RelativeStack`, `Divider`, `Spacer`, `Splitter` + `SplitterPanel`
- **Navigation**: `BreadCrumb`, `Menu` + `MenuItem` + `MenuGroup` + `MenuLink` + `MenuDivider`, `Tabs`, `Pagination`, `Stepper` + `StepperStep`
- **Overlay**: `Modal`, `Popover`, `Dropdown` + `DropdownItem` + `DropdownGroup` + `DropdownTrigger`, `Tooltip`, `ContextMenu`
- **Feedback**: `Alert`, `Badge`, `Progress`, `Skeleton`, `Spinner`, `Toast`
- **Data**: `DataTable` + `Column` + `ColumnGroup`, `SimpleTable`, `Accordion` + `AccordionItem`, `List`
- **Interaction**: `Button`, `Switch`, `Slider`
- **Media**: `Avatar`, `AvatarGroup`, `Card`
- **Forms**: `FormControl`, `FieldCollection`, `StringField`, `EmailField`, `PasswordField`, `TelField`, `UrlField`, `HiddenField`, `NumberField`, `RangeField`, `TextAreaField`, `CheckboxField`, `CheckboxGroupField`, `RadioField`, `SelectField`, `AutocompleteField`, `DateField`, `TimeField`, `ColorField`, `SliderField`, `ImageField`, `FileField` (with `FileNativeMode`, `FileDropzoneMode`, `FileUploadButtonMode`, `FileWallMode`, `FileAvatarMode`)
- **Traits**: `HasEventEmitter`, `HasDraggable`, `HasResizable`, `HasItems`, `HasPosition`, `HasFullPosition`, `HasValidation`

#### CLI (`@native-document/cli`)
- `nd create <name>` - scaffold a complete project with Vite, routing, i18n, and store pre-configured
- `nd create <name> --feature` - feature-based architecture
- `nd create:page` / `create:component` / `create:service` / `create:feature` - generators
- `npm run i18n:scan` - scan source for missing translation keys

#### Build
- Rollup 4 multi-output: CDN IIFE (dev + minified), ESM for bundlers, DevTools bundle
- `process.env.NODE_ENV` replacement for tree-shaking all debug code in production
- TypeScript `.d.ts` definitions for all public APIs

---

## How to Read This File

Entries use the following categories:

- **Added** - new features
- **Changed** - changes to existing functionality
- **Deprecated** - features that will be removed in a future release
- **Removed** - features removed in this release
- **Fixed** - bug fixes
- **Security** - vulnerability fixes

---

[Unreleased]: https://github.com/afrocodeur/native-document/compare/v1.0.166...HEAD
[1.0.166]: https://github.com/afrocodeur/native-document/releases/tag/v1.0.166
