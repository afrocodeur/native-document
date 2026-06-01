/**
 * @file globals.d.ts
 * Exports all global attribute interfaces and utility types declared in
 * index.def.js / elements.d.ts. Import from here when you need these types
 * in component definitions.
 */

import type { ObservableItem } from './observable';

// ---------------------------------------------------------
// Observable shorthand
// ---------------------------------------------------------

/** T or an ObservableItem wrapping T */
export type Observable<T> = ObservableItem<T> | T;

// ---------------------------------------------------------
// Style / class maps
// ---------------------------------------------------------

/**
 * A map of CSS class names to reactive or static boolean conditions.
 * @example { active: isActive, disabled: isDisabled }
 */
export type NdClassMap = Record<string, Observable<boolean>>;

/**
 * A strongly-typed map of CSS property names to reactive or static values.
 * Supports both camelCase and kebab-case property names.
 */
export interface NdStyleMap {
    accentColor?:              Observable<string> | string;
    'accent-color'?:           Observable<string> | string;
    alignContent?:             Observable<string> | string;
    'align-content'?:          Observable<string> | string;
    alignItems?:               Observable<string> | string;
    'align-items'?:            Observable<string> | string;
    alignSelf?:                Observable<string> | string;
    'align-self'?:             Observable<string> | string;
    animation?:                Observable<string> | string;
    animationDelay?:           Observable<string> | string;
    'animation-delay'?:        Observable<string> | string;
    animationDuration?:        Observable<string> | string;
    'animation-duration'?:     Observable<string> | string;
    animationFillMode?:        Observable<string> | string;
    'animation-fill-mode'?:    Observable<string> | string;
    animationName?:            Observable<string> | string;
    'animation-name'?:         Observable<string> | string;
    animationTimingFunction?:  Observable<string> | string;
    'animation-timing-function'?: Observable<string> | string;
    backdropFilter?:           Observable<string> | string;
    'backdrop-filter'?:        Observable<string> | string;
    background?:               Observable<string> | string;
    backgroundColor?:          Observable<string> | string;
    'background-color'?:       Observable<string> | string;
    backgroundImage?:          Observable<string> | string;
    'background-image'?:       Observable<string> | string;
    backgroundPosition?:       Observable<string> | string;
    'background-position'?:    Observable<string> | string;
    backgroundSize?:           Observable<string> | string;
    'background-size'?:        Observable<string> | string;
    border?:                   Observable<string> | string;
    borderColor?:              Observable<string> | string;
    'border-color'?:           Observable<string> | string;
    borderRadius?:             Observable<string> | string;
    'border-radius'?:          Observable<string> | string;
    borderStyle?:              Observable<string> | string;
    'border-style'?:           Observable<string> | string;
    borderWidth?:              Observable<string> | string;
    'border-width'?:           Observable<string> | string;
    bottom?:                   Observable<string> | string;
    boxShadow?:                Observable<string> | string;
    'box-shadow'?:             Observable<string> | string;
    boxSizing?:                Observable<'border-box' | 'content-box' | string> | 'border-box' | 'content-box' | string;
    'box-sizing'?:             Observable<'border-box' | 'content-box' | string> | 'border-box' | 'content-box' | string;
    color?:                    Observable<string> | string;
    cursor?:                   Observable<string> | string;
    display?:                  Observable<'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none' | 'contents' | string> | string;
    filter?:                   Observable<string> | string;
    flex?:                     Observable<string> | string;
    flexDirection?:            Observable<'row' | 'row-reverse' | 'column' | 'column-reverse'> | 'row' | 'row-reverse' | 'column' | 'column-reverse';
    'flex-direction'?:         Observable<'row' | 'row-reverse' | 'column' | 'column-reverse'> | 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexGrow?:                 Observable<string | number> | string | number;
    'flex-grow'?:              Observable<string | number> | string | number;
    flexShrink?:               Observable<string | number> | string | number;
    'flex-shrink'?:            Observable<string | number> | string | number;
    flexWrap?:                 Observable<'nowrap' | 'wrap' | 'wrap-reverse'> | 'nowrap' | 'wrap' | 'wrap-reverse';
    'flex-wrap'?:              Observable<'nowrap' | 'wrap' | 'wrap-reverse'> | 'nowrap' | 'wrap' | 'wrap-reverse';
    font?:                     Observable<string> | string;
    fontFamily?:               Observable<string> | string;
    'font-family'?:            Observable<string> | string;
    fontSize?:                 Observable<string> | string;
    'font-size'?:              Observable<string> | string;
    fontWeight?:               Observable<string | number> | string | number;
    'font-weight'?:            Observable<string | number> | string | number;
    gap?:                      Observable<string> | string;
    grid?:                     Observable<string> | string;
    gridColumn?:               Observable<string> | string;
    'grid-column'?:            Observable<string> | string;
    gridRow?:                  Observable<string> | string;
    'grid-row'?:               Observable<string> | string;
    gridTemplateColumns?:      Observable<string> | string;
    'grid-template-columns'?:  Observable<string> | string;
    gridTemplateRows?:         Observable<string> | string;
    'grid-template-rows'?:     Observable<string> | string;
    height?:                   Observable<string> | string;
    justifyContent?:           Observable<string> | string;
    'justify-content'?:        Observable<string> | string;
    justifyItems?:             Observable<string> | string;
    'justify-items'?:          Observable<string> | string;
    justifySelf?:              Observable<string> | string;
    'justify-self'?:           Observable<string> | string;
    left?:                     Observable<string> | string;
    letterSpacing?:            Observable<string> | string;
    'letter-spacing'?:         Observable<string> | string;
    lineHeight?:               Observable<string> | string;
    'line-height'?:            Observable<string> | string;
    margin?:                   Observable<string> | string;
    marginBottom?:             Observable<string> | string;
    'margin-bottom'?:          Observable<string> | string;
    marginLeft?:               Observable<string> | string;
    'margin-left'?:            Observable<string> | string;
    marginRight?:              Observable<string> | string;
    'margin-right'?:           Observable<string> | string;
    marginTop?:                Observable<string> | string;
    'margin-top'?:             Observable<string> | string;
    maxHeight?:                Observable<string> | string;
    'max-height'?:             Observable<string> | string;
    maxWidth?:                 Observable<string> | string;
    'max-width'?:              Observable<string> | string;
    minHeight?:                Observable<string> | string;
    'min-height'?:             Observable<string> | string;
    minWidth?:                 Observable<string> | string;
    'min-width'?:              Observable<string> | string;
    objectFit?:                Observable<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'> | string;
    'object-fit'?:             Observable<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'> | string;
    opacity?:                  Observable<string | number> | string | number;
    overflow?:                 Observable<'visible' | 'hidden' | 'scroll' | 'auto' | string> | string;
    overflowX?:                Observable<string> | string;
    'overflow-x'?:             Observable<string> | string;
    overflowY?:                Observable<string> | string;
    'overflow-y'?:             Observable<string> | string;
    padding?:                  Observable<string> | string;
    paddingBottom?:            Observable<string> | string;
    'padding-bottom'?:         Observable<string> | string;
    paddingLeft?:              Observable<string> | string;
    'padding-left'?:           Observable<string> | string;
    paddingRight?:             Observable<string> | string;
    'padding-right'?:          Observable<string> | string;
    paddingTop?:               Observable<string> | string;
    'padding-top'?:            Observable<string> | string;
    pointerEvents?:            Observable<'none' | 'auto' | string> | string;
    'pointer-events'?:         Observable<'none' | 'auto' | string> | string;
    position?:                 Observable<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'> | string;
    right?:                    Observable<string> | string;
    textAlign?:                Observable<'left' | 'right' | 'center' | 'justify' | string> | string;
    'text-align'?:             Observable<string> | string;
    textDecoration?:           Observable<string> | string;
    'text-decoration'?:        Observable<string> | string;
    textOverflow?:             Observable<'clip' | 'ellipsis' | string> | string;
    'text-overflow'?:          Observable<string> | string;
    textTransform?:            Observable<'none' | 'capitalize' | 'uppercase' | 'lowercase' | string> | string;
    'text-transform'?:         Observable<string> | string;
    top?:                      Observable<string> | string;
    transform?:                Observable<string> | string;
    transformOrigin?:          Observable<string> | string;
    'transform-origin'?:       Observable<string> | string;
    transition?:               Observable<string> | string;
    userSelect?:               Observable<'none' | 'auto' | 'text' | 'all' | string> | string;
    'user-select'?:            Observable<string> | string;
    verticalAlign?:            Observable<string> | string;
    'vertical-align'?:         Observable<string> | string;
    visibility?:               Observable<'visible' | 'hidden' | 'collapse'> | string;
    whiteSpace?:               Observable<string> | string;
    'white-space'?:            Observable<string> | string;
    width?:                    Observable<string> | string;
    wordBreak?:                Observable<string> | string;
    'word-break'?:             Observable<string> | string;
    wordSpacing?:              Observable<string> | string;
    'word-spacing'?:           Observable<string> | string;
    zIndex?:                   Observable<string | number> | string | number;
    'z-index'?:                Observable<string | number> | string | number;
    [key: string]:             Observable<string | number> | string | number | undefined;
}

// ---------------------------------------------------------
// ARIA attributes
// ---------------------------------------------------------

/** All aria-* attributes as a typed map */
export interface NdAriaAttributes {
    'aria-label'?:              Observable<string> | string;
    'aria-labelledby'?:         string;
    'aria-describedby'?:        string;
    'aria-hidden'?:             Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-expanded'?:           Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-selected'?:           Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-checked'?:            Observable<boolean | 'true' | 'false' | 'mixed'> | boolean | string;
    'aria-disabled'?:           Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-required'?:           Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-invalid'?:            Observable<boolean | 'true' | 'false' | 'grammar' | 'spelling'> | boolean | string;
    'aria-live'?:               'off' | 'polite' | 'assertive';
    'aria-atomic'?:             Observable<boolean | 'true' | 'false'> | boolean | 'true' | 'false';
    'aria-relevant'?:           string;
    'aria-current'?:            Observable<boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time'> | boolean | string;
    'aria-controls'?:           string;
    'aria-owns'?:               string;
    'aria-haspopup'?:           boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    'aria-autocomplete'?:       'none' | 'inline' | 'list' | 'both';
    'aria-multiline'?:          Observable<boolean | 'true' | 'false'> | boolean;
    'aria-multiselectable'?:    Observable<boolean | 'true' | 'false'> | boolean;
    'aria-orientation'?:        'horizontal' | 'vertical';
    'aria-placeholder'?:        string;
    'aria-readonly'?:           Observable<boolean | 'true' | 'false'> | boolean;
    'aria-sort'?:               'none' | 'ascending' | 'descending' | 'other';
    'aria-valuemax'?:           number;
    'aria-valuemin'?:           number;
    'aria-valuenow'?:           number;
    'aria-valuetext'?:          string;
    'aria-rowcount'?:           number;
    'aria-rowindex'?:           number;
    'aria-rowspan'?:            number;
    'aria-colcount'?:           number;
    'aria-colindex'?:           number;
    'aria-colspan'?:            number;
    'aria-setsize'?:            number;
    'aria-posinset'?:           number;
    'aria-level'?:              number;
    'aria-modal'?:              Observable<boolean | 'true' | 'false'> | boolean;
    [key: `aria-${string}`]:   Observable<string | boolean | number> | string | boolean | number | undefined;
}

/** data-* attributes as a typed map */
export interface NdDataAttributes {
    [key: `data-${string}`]: string | number | boolean | undefined;
}

// ---------------------------------------------------------
// Global HTML attributes
// ---------------------------------------------------------

/**
 * All standard HTML global attributes accepted by NativeDocument elements.
 * Supports both reactive (ObservableItem) and static values.
 */
export interface GlobalAttributes extends NdAriaAttributes, NdDataAttributes {
    id?:               Observable<string> | string;
    class?:            Observable<string | NdClassMap> | string | NdClassMap;
    style?:            Observable<NdStyleMap | string> | NdStyleMap | string;
    title?:            Observable<string> | string;
    lang?:             string;
    dir?:              'ltr' | 'rtl' | 'auto';
    hidden?:           Observable<boolean> | boolean;
    draggable?:        Observable<boolean> | boolean;
    contenteditable?:  Observable<boolean> | boolean;
    contentEditable?:  Observable<boolean> | boolean;
    tabindex?:         Observable<string | number> | string | number;
    tabIndex?:         Observable<string | number> | string | number;
    accesskey?:        string;
    accessKey?:        string;
    spellcheck?:       Observable<boolean> | boolean;
    spellCheck?:       Observable<boolean> | boolean;
    role?:             | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner'
                       | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox'
                       | 'complementary' | 'contentinfo' | 'definition' | 'dialog'
                       | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell'
                       | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox'
                       | 'listitem' | 'log' | 'main' | 'math' | 'menu' | 'menubar'
                       | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation'
                       | 'none' | 'note' | 'option' | 'presentation' | 'progressbar'
                       | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup'
                       | 'rowheader' | 'scrollbar' | 'search' | 'searchbox' | 'separator'
                       | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 'table'
                       | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar'
                       | 'tooltip' | 'tree' | 'treegrid' | 'treeitem' | string;
    [key: string]:     unknown;
}

// ---------------------------------------------------------
// Form shared attributes
// ---------------------------------------------------------

export interface SharedFormAttributes {
    name?:       string;
    disabled?:   Observable<boolean> | boolean;
    required?:   Observable<boolean> | boolean;
    autofocus?:  Observable<boolean> | boolean;
    autoFocus?:  Observable<boolean> | boolean;
    form?:       string;
}

// ---------------------------------------------------------
// Element-specific attribute interfaces
// ---------------------------------------------------------

export interface AnchorAttributes extends GlobalAttributes {
    href?:            Observable<string> | string;
    target?:          '_blank' | '_self' | '_parent' | '_top' | string;
    rel?:             string;
    download?:        Observable<boolean | string> | boolean | string;
    hreflang?:        string;
    hrefLang?:        string;
    type?:            string;
    referrerpolicy?:  string;
    referrerPolicy?:  string;
}

export interface ImgAttributes extends GlobalAttributes {
    src?:             Observable<string> | string;
    alt?:             Observable<string> | string;
    width?:           Observable<string | number> | string | number;
    height?:          Observable<string | number> | string | number;
    loading?:         'lazy' | 'eager' | 'auto';
    decoding?:        'async' | 'sync' | 'auto';
    srcset?:          string;
    srcSet?:          string;
    sizes?:           string;
    crossorigin?:     'anonymous' | 'use-credentials';
    crossOrigin?:     'anonymous' | 'use-credentials';
    referrerpolicy?:  string;
    referrerPolicy?:  string;
}

export interface ButtonAttributes extends GlobalAttributes, SharedFormAttributes {
    type?:      'button' | 'submit' | 'reset';
    value?:     string;
}

export interface InputAttributes extends GlobalAttributes, SharedFormAttributes {
    type?:           'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
                   | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color'
                   | 'checkbox' | 'radio' | 'file' | 'range' | 'hidden' | 'submit'
                   | 'reset' | 'button' | 'image' | string;
    value?:          Observable<string | number | boolean> | string | number | boolean;
    checked?:        Observable<boolean> | boolean;
    placeholder?:    Observable<string> | string;
    readonly?:       Observable<boolean> | boolean;
    readOnly?:       Observable<boolean> | boolean;
    min?:            string | number;
    max?:            string | number;
    step?:           string | number;
    minlength?:      number;
    minLength?:      number;
    maxlength?:      number;
    maxLength?:      number;
    multiple?:       Observable<boolean> | boolean;
    accept?:         string;
    autocomplete?:   string;
    autoComplete?:   string;
    list?:           string;
    pattern?:        string;
    size?:           number;
}

export interface TextAreaAttributes extends GlobalAttributes, SharedFormAttributes {
    placeholder?:    Observable<string> | string;
    readonly?:       Observable<boolean> | boolean;
    readOnly?:       Observable<boolean> | boolean;
    rows?:           number;
    cols?:           number;
    wrap?:           'hard' | 'soft' | 'off';
    minlength?:      number;
    minLength?:      number;
    maxlength?:      number;
    maxLength?:      number;
    autocomplete?:   string;
    autoComplete?:   string;
    resize?:         'none' | 'horizontal' | 'vertical' | 'both';
}

export interface SelectAttributes extends GlobalAttributes, SharedFormAttributes {
    multiple?:       Observable<boolean> | boolean;
    size?:           number;
    autocomplete?:   string;
    autoComplete?:   string;
}

export interface OptionAttributes extends GlobalAttributes {
    value?:      string;
    selected?:   Observable<boolean> | boolean;
    disabled?:   Observable<boolean> | boolean;
    label?:      string;
}

export interface FormAttributes extends GlobalAttributes, SharedFormAttributes {
    action?:         string;
    method?:         'get' | 'post' | 'dialog';
    enctype?:        'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    target?:         '_blank' | '_self' | '_parent' | '_top' | string;
    novalidate?:     Observable<boolean> | boolean;
    noValidate?:     Observable<boolean> | boolean;
    autocomplete?:   'on' | 'off';
    autoComplete?:   'on' | 'off';
}

export interface VideoAttributes extends GlobalAttributes {
    src?:              Observable<string> | string;
    controls?:         Observable<boolean> | boolean;
    autoplay?:         Observable<boolean> | boolean;
    autoPlay?:         Observable<boolean> | boolean;
    loop?:             Observable<boolean> | boolean;
    muted?:            Observable<boolean> | boolean;
    poster?:           string;
    preload?:          'none' | 'metadata' | 'auto';
    playsinline?:      Observable<boolean> | boolean;
    playsInline?:      Observable<boolean> | boolean;
    width?:            Observable<string | number> | string | number;
    height?:           Observable<string | number> | string | number;
    crossorigin?:      'anonymous' | 'use-credentials';
    crossOrigin?:      'anonymous' | 'use-credentials';
}

export interface AudioAttributes extends GlobalAttributes {
    src?:       Observable<string> | string;
    controls?:  Observable<boolean> | boolean;
    autoplay?:  Observable<boolean> | boolean;
    autoPlay?:  Observable<boolean> | boolean;
    loop?:      Observable<boolean> | boolean;
    muted?:     Observable<boolean> | boolean;
    preload?:   'none' | 'metadata' | 'auto';
    crossorigin?: 'anonymous' | 'use-credentials';
    crossOrigin?: 'anonymous' | 'use-credentials';
}

export interface CanvasAttributes extends GlobalAttributes {
    width?:   Observable<string | number> | string | number;
    height?:  Observable<string | number> | string | number;
}

export interface DetailsAttributes extends GlobalAttributes {
    open?:  Observable<boolean> | boolean;
}

export interface DialogAttributes extends GlobalAttributes {
    open?:  Observable<boolean> | boolean;
}

export interface ProgressAttributes extends GlobalAttributes {
    value?:  Observable<string | number> | string | number;
    max?:    Observable<string | number> | string | number;
}

export interface MeterAttributes extends GlobalAttributes {
    value?:    number;
    min?:      number;
    max?:      number;
    low?:      number;
    high?:     number;
    optimum?:  number;
}

export interface SourceAttributes extends GlobalAttributes {
    src?:     Observable<string> | string;
    srcset?:  string;
    srcSet?:  string;
    type?:    string;
    media?:   string;
    sizes?:   string;
}

export interface TrackAttributes extends GlobalAttributes {
    src?:      string;
    kind?:     'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
    srclang?:  string;
    srcLang?:  string;
    label?:    string;
    default?:  boolean;
}

export interface ThAttributes extends GlobalAttributes {
    colspan?:  number;
    colSpan?:  number;
    rowspan?:  number;
    rowSpan?:  number;
    headers?:  string;
    scope?:    'col' | 'row' | 'colgroup' | 'rowgroup';
}

export interface TdAttributes extends GlobalAttributes {
    colspan?:  number;
    colSpan?:  number;
    rowspan?:  number;
    rowSpan?:  number;
    headers?:  string;
}

export interface LabelAttributes extends GlobalAttributes {
    for?:   string;
    htmlFor?: string;
}

export interface OutputAttributes extends GlobalAttributes, SharedFormAttributes {
    for?:     string;
    htmlFor?: string;
}

export interface TimeAttributes extends GlobalAttributes {
    datetime?:  string;
    dateTime?:  string;
}

export interface ModAttributes extends GlobalAttributes {
    cite?:      string;
    datetime?:  string;
    dateTime?:  string;
}

export interface OlAttributes extends GlobalAttributes {
    reversed?:  Observable<boolean> | boolean;
    start?:     number;
    type?:      '1' | 'a' | 'A' | 'i' | 'I';
}

export interface SvgAttributes extends GlobalAttributes {
    viewBox?:           string;
    viewbox?:           string;
    xmlns?:             string;
    width?:             Observable<string | number> | string | number;
    height?:            Observable<string | number> | string | number;
    fill?:              Observable<string> | string;
    stroke?:            Observable<string> | string;
    strokeWidth?:       Observable<string | number> | string | number;
    'stroke-width'?:    Observable<string | number> | string | number;
    strokeLinecap?:     'butt' | 'round' | 'square';
    'stroke-linecap'?:  'butt' | 'round' | 'square';
    strokeLinejoin?:    'miter' | 'round' | 'bevel';
    'stroke-linejoin'?: 'miter' | 'round' | 'bevel';
    preserveAspectRatio?: string;
    d?:                 string;
    cx?:                Observable<string | number> | string | number;
    cy?:                Observable<string | number> | string | number;
    r?:                 Observable<string | number> | string | number;
    rx?:                Observable<string | number> | string | number;
    ry?:                Observable<string | number> | string | number;
    x?:                 Observable<string | number> | string | number;
    y?:                 Observable<string | number> | string | number;
    x1?:                Observable<string | number> | string | number;
    y1?:                Observable<string | number> | string | number;
    x2?:                Observable<string | number> | string | number;
    y2?:                Observable<string | number> | string | number;
    points?:            string;
    transform?:         Observable<string> | string;
}
