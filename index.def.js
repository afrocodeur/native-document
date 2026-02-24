/**
 * @fileoverview JSDoc type definitions for NativeDocument HTML elements.
 * Provides IDE autocomplete for element attributes.
 * Compound attribute names are listed in both their original (lowercase)
 * and camelCase forms so both conventions trigger autocomplete.
 */

// ─────────────────────────────────────────────
// Base types
// ─────────────────────────────────────────────

/**
 * An ObservableItem or a raw value.
 * @template T
 * @typedef {import('./native-document.dev').ObservableItem | T} Observable
 */

/**
 * A valid child — string, number, boolean, HTMLElement, DocumentFragment,
 * ObservableItem, NDElement, or an array of those.
 * @typedef {string|number|boolean|HTMLElement|DocumentFragment|ObservableItem|NDElement|Array} NdChild
 */

/**
 * Reactive class binding — maps class names to observable or plain booleans.
 * @typedef {Object.<string, Observable<boolean>|boolean>} NdClassMap
 */

/**
 * Reactive style binding — maps CSS property names to observable or plain strings.
 * @typedef {Object.<string, Observable<string>|string>} NdStyleMap
 */

// ─────────────────────────────────────────────
// Shared attribute sets
// ─────────────────────────────────────────────

/**
 * Global HTML attributes shared by all elements.
 * @typedef {Object} GlobalAttributes
 * @property {Observable<string>|string}             [id]               - Unique identifier
 * @property {Observable<string>|NdClassMap|string}  [class]            - CSS classes (string or reactive map)
 * @property {Observable<NdStyleMap>|NdStyleMap}     [style]            - Inline styles
 * @property {string}                                [title]            - Tooltip text
 * @property {string}                                [lang]             - Language code
 * @property {string}                                [dir]              - Text direction: 'ltr'|'rtl'|'auto'
 * @property {Observable<boolean>|boolean}           [hidden]           - Hide element
 * @property {Observable<boolean>|boolean}           [draggable]        - Make element draggable
 * @property {Observable<boolean>|boolean}           [contenteditable]  - Make content editable
 * @property {Observable<boolean>|boolean}           [contentEditable]  - Make content editable (camelCase)
 * @property {string}                                [tabindex]         - Tab order
 * @property {string}                                [tabIndex]         - Tab order (camelCase)
 * @property {string}                                [accesskey]        - Keyboard shortcut
 * @property {string}                                [accessKey]        - Keyboard shortcut (camelCase)
 * @property {Observable<boolean>|boolean}           [spellcheck]       - Enable spellcheck
 * @property {Observable<boolean>|boolean}           [spellCheck]       - Enable spellcheck (camelCase)
 * @property {string}                                [data-*]           - Custom data attributes
 * @property {string}                                [aria-*]           - ARIA accessibility attributes
 * @property {string}                                [role]             - ARIA role
 */

/**
 * Attributes shared by form-related elements.
 * @typedef {Object} SharedFormAttributes
 * @property {string}                       [name]       - Field name
 * @property {Observable<boolean>|boolean}  [disabled]   - Disable the field
 * @property {Observable<boolean>|boolean}  [required]   - Mark as required
 * @property {Observable<boolean>|boolean}  [autofocus]  - Auto-focus on page load
 * @property {Observable<boolean>|boolean}  [autoFocus]  - Auto-focus on page load (camelCase)
 * @property {string}                       [form]       - Associated form id
 */

// ─────────────────────────────────────────────
// Element-specific attribute types
// ─────────────────────────────────────────────

/**
 * @typedef {GlobalAttributes & {
 *   src:              Observable<string>|string,
 *   alt:              Observable<string>|string,
 *   width:            Observable<string>|string|number,
 *   height:           Observable<string>|string|number,
 *   loading:          'lazy'|'eager'|'auto',
 *   decoding:         'async'|'sync'|'auto',
 *   srcset:           string,
 *   srcSet:           string,
 *   sizes:            string,
 *   crossorigin:      'anonymous'|'use-credentials',
 *   crossOrigin:      'anonymous'|'use-credentials',
 *   referrerpolicy:   string,
 *   referrerPolicy:   string,
 *   fetchpriority:    'high'|'low'|'auto',
 *   fetchPriority:    'high'|'low'|'auto',
 * }} ImgAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   href:             Observable<string>|string,
 *   target:           '_blank'|'_self'|'_parent'|'_top'|string,
 *   rel:              string,
 *   download:         Observable<boolean>|boolean|string,
 *   hreflang:         string,
 *   hrefLang:         string,
 *   type:             string,
 *   referrerpolicy:   string,
 *   referrerPolicy:   string,
 * }} AnchorAttributes
 */

/**
 * @typedef {GlobalAttributes & SharedFormAttributes & {
 *   type:   'button'|'submit'|'reset',
 *   value:  Observable<string>|string,
 * }} ButtonAttributes
 */

/**
 * @typedef {GlobalAttributes & SharedFormAttributes & {
 *   type:           'text'|'email'|'password'|'number'|'tel'|'url'|'search'|
 *                   'date'|'time'|'datetime-local'|'week'|'month'|
 *                   'checkbox'|'radio'|'range'|'color'|'file'|'hidden',
 *   value:          Observable<string>|string,
 *   placeholder:    Observable<string>|string,
 *   checked:        Observable<boolean>|boolean,
 *   readonly:       Observable<boolean>|boolean,
 *   readOnly:       Observable<boolean>|boolean,
 *   multiple:       Observable<boolean>|boolean,
 *   min:            Observable<string>|string|number,
 *   max:            Observable<string>|string|number,
 *   step:           Observable<string>|string|number,
 *   minlength:      number,
 *   minLength:      number,
 *   maxlength:      number,
 *   maxLength:      number,
 *   pattern:        string,
 *   accept:         string,
 *   autocomplete:   'on'|'off'|string,
 *   autoComplete:   'on'|'off'|string,
 *   list:           string,
 * }} InputAttributes
 */

/**
 * @typedef {GlobalAttributes & SharedFormAttributes & {
 *   value:          Observable<string>|string,
 *   placeholder:    Observable<string>|string,
 *   readonly:       Observable<boolean>|boolean,
 *   readOnly:       Observable<boolean>|boolean,
 *   rows:           number,
 *   cols:           number,
 *   minlength:      number,
 *   minLength:      number,
 *   maxlength:      number,
 *   maxLength:      number,
 *   wrap:           'hard'|'soft'|'off',
 *   autocomplete:   'on'|'off'|string,
 *   autoComplete:   'on'|'off'|string,
 *   spellcheck:     Observable<boolean>|boolean,
 *   spellCheck:     Observable<boolean>|boolean,
 * }} TextAreaAttributes
 */

/**
 * @typedef {GlobalAttributes & SharedFormAttributes & {
 *   value:    Observable<string>|string,
 *   multiple: Observable<boolean>|boolean,
 *   size:     number,
 * }} SelectAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   value:    Observable<string>|string,
 *   selected: Observable<boolean>|boolean,
 *   disabled: Observable<boolean>|boolean,
 * }} OptionAttributes
 */

/**
 * @typedef {GlobalAttributes & SharedFormAttributes & {
 *   action:       string,
 *   method:       'get'|'post',
 *   enctype:      'application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain',
 *   encType:      'application/x-www-form-urlencoded'|'multipart/form-data'|'text/plain',
 *   novalidate:   Observable<boolean>|boolean,
 *   noValidate:   Observable<boolean>|boolean,
 *   target:       '_blank'|'_self'|'_parent'|'_top'|string,
 *   autocomplete: 'on'|'off',
 *   autoComplete: 'on'|'off',
 * }} FormAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   src:            Observable<string>|string,
 *   autoplay:       Observable<boolean>|boolean,
 *   autoPlay:       Observable<boolean>|boolean,
 *   controls:       Observable<boolean>|boolean,
 *   loop:           Observable<boolean>|boolean,
 *   muted:          Observable<boolean>|boolean,
 *   preload:        'auto'|'metadata'|'none',
 *   width:          Observable<string>|string|number,
 *   height:         Observable<string>|string|number,
 *   poster:         string,
 *   playsinline:    Observable<boolean>|boolean,
 *   playsInline:    Observable<boolean>|boolean,
 *   crossorigin:    'anonymous'|'use-credentials',
 *   crossOrigin:    'anonymous'|'use-credentials',
 * }} VideoAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   src:            Observable<string>|string,
 *   autoplay:       Observable<boolean>|boolean,
 *   autoPlay:       Observable<boolean>|boolean,
 *   controls:       Observable<boolean>|boolean,
 *   loop:           Observable<boolean>|boolean,
 *   muted:          Observable<boolean>|boolean,
 *   preload:        'auto'|'metadata'|'none',
 *   crossorigin:    'anonymous'|'use-credentials',
 *   crossOrigin:    'anonymous'|'use-credentials',
 * }} AudioAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   width:  Observable<string>|string|number,
 *   height: Observable<string>|string|number,
 * }} CanvasAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   open: Observable<boolean>|boolean,
 * }} DetailsAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   open: Observable<boolean>|boolean,
 * }} DialogAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   value: Observable<string>|string|number,
 *   max:   number,
 * }} ProgressAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   value:   Observable<string>|string|number,
 *   min:     number,
 *   max:     number,
 *   low:     number,
 *   high:    number,
 *   optimum: number,
 * }} MeterAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   src:   string,
 *   type:  string,
 *   media: string,
 * }} SourceAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   colspan:  number,
 *   colSpan:  number,
 *   rowspan:  number,
 *   rowSpan:  number,
 *   headers:  string,
 *   scope:    'row'|'col'|'rowgroup'|'colgroup',
 * }} ThAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   colspan:  number,
 *   colSpan:  number,
 *   rowspan:  number,
 *   rowSpan:  number,
 *   headers:  string,
 * }} TdAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   for:      string,
 *   htmlFor:  string,
 * }} LabelAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   for:   string,
 *   form:  string,
 *   name:  string,
 * }} OutputAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   datetime: string,
 *   dateTime: string,
 * }} TimeAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   cite:     string,
 *   datetime: string,
 *   dateTime: string,
 * }} ModAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   reversed: Observable<boolean>|boolean,
 *   start:    number,
 *   type:     '1'|'a'|'A'|'i'|'I',
 * }} OlAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   viewBox:  string,
 *   viewbox:  string,
 *   xmlns:    string,
 *   width:    Observable<string>|string|number,
 *   height:   Observable<string>|string|number,
 * }} SvgAttributes
 */

/**
 * @typedef {GlobalAttributes & {
 *   src:      string,
 *   kind:     'subtitles'|'captions'|'descriptions'|'chapters'|'metadata',
 *   srclang:  string,
 *   srcLang:  string,
 *   label:    string,
 *   default:  Observable<boolean>|boolean,
 * }} TrackAttributes
 */
