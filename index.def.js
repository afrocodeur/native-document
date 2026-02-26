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
 * Reactive style binding.
 * Maps CSS property names (camelCase or kebab-case) to observable or plain values.
 * WebStorm will suggest all standard CSS properties.
 * @typedef {Object} NdStyleMap
 * @property {Observable<string>|string} [accentColor] - CSS accent-color
 * @property {Observable<string>|string} [accent-color] - CSS accent-color (kebab-case)
 * @property {Observable<'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'stretch'|'start'|'end'|'baseline'|string>|'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'stretch'|'start'|'end'|'baseline'|string} [alignContent] - CSS align-content
 * @property {Observable<'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'stretch'|'start'|'end'|'baseline'|string>|'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'stretch'|'start'|'end'|'baseline'|string} [align-content] - CSS align-content (kebab-case)
 * @property {Observable<'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string>|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string} [alignItems] - CSS align-items
 * @property {Observable<'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string>|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string} [align-items] - CSS align-items (kebab-case)
 * @property {Observable<'auto'|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string>|'auto'|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string} [alignSelf] - CSS align-self
 * @property {Observable<'auto'|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string>|'auto'|'flex-start'|'flex-end'|'center'|'stretch'|'baseline'|'start'|'end'|'self-start'|'self-end'|string} [align-self] - CSS align-self (kebab-case)
 * @property {Observable<string>|string} [animation] - CSS animation
 * @property {Observable<string>|string} [animationComposition] - CSS animation-composition
 * @property {Observable<string>|string} [animation-composition] - CSS animation-composition (kebab-case)
 * @property {Observable<string>|string} [animationDelay] - CSS animation-delay
 * @property {Observable<string>|string} [animation-delay] - CSS animation-delay (kebab-case)
 * @property {Observable<'normal'|'reverse'|'alternate'|'alternate-reverse'|string>|'normal'|'reverse'|'alternate'|'alternate-reverse'|string} [animationDirection] - CSS animation-direction
 * @property {Observable<'normal'|'reverse'|'alternate'|'alternate-reverse'|string>|'normal'|'reverse'|'alternate'|'alternate-reverse'|string} [animation-direction] - CSS animation-direction (kebab-case)
 * @property {Observable<string>|string} [animationDuration] - CSS animation-duration
 * @property {Observable<string>|string} [animation-duration] - CSS animation-duration (kebab-case)
 * @property {Observable<'none'|'forwards'|'backwards'|'both'|string>|'none'|'forwards'|'backwards'|'both'|string} [animationFillMode] - CSS animation-fill-mode
 * @property {Observable<'none'|'forwards'|'backwards'|'both'|string>|'none'|'forwards'|'backwards'|'both'|string} [animation-fill-mode] - CSS animation-fill-mode (kebab-case)
 * @property {Observable<string>|string} [animationIterationCount] - CSS animation-iteration-count
 * @property {Observable<string>|string} [animation-iteration-count] - CSS animation-iteration-count (kebab-case)
 * @property {Observable<string>|string} [animationName] - CSS animation-name
 * @property {Observable<string>|string} [animation-name] - CSS animation-name (kebab-case)
 * @property {Observable<'running'|'paused'|string>|'running'|'paused'|string} [animationPlayState] - CSS animation-play-state
 * @property {Observable<'running'|'paused'|string>|'running'|'paused'|string} [animation-play-state] - CSS animation-play-state (kebab-case)
 * @property {Observable<'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string>|'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string} [animationTimingFunction] - CSS animation-timing-function
 * @property {Observable<'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string>|'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string} [animation-timing-function] - CSS animation-timing-function (kebab-case)
 * @property {Observable<'none'|'auto'|'button'|'textfield'|'menulist'|string>|'none'|'auto'|'button'|'textfield'|'menulist'|string} [appearance] - CSS appearance
 * @property {Observable<string>|string} [aspectRatio] - CSS aspect-ratio
 * @property {Observable<string>|string} [aspect-ratio] - CSS aspect-ratio (kebab-case)
 * @property {Observable<string>|string} [backdropFilter] - CSS backdrop-filter
 * @property {Observable<string>|string} [backdrop-filter] - CSS backdrop-filter (kebab-case)
 * @property {Observable<'visible'|'hidden'|string>|'visible'|'hidden'|string} [backfaceVisibility] - CSS backface-visibility
 * @property {Observable<'visible'|'hidden'|string>|'visible'|'hidden'|string} [backface-visibility] - CSS backface-visibility (kebab-case)
 * @property {Observable<string>|string} [background] - CSS background
 * @property {Observable<'scroll'|'fixed'|'local'|string>|'scroll'|'fixed'|'local'|string} [backgroundAttachment] - CSS background-attachment
 * @property {Observable<'scroll'|'fixed'|'local'|string>|'scroll'|'fixed'|'local'|string} [background-attachment] - CSS background-attachment (kebab-case)
 * @property {Observable<'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string>|'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string} [backgroundBlendMode] - CSS background-blend-mode
 * @property {Observable<'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string>|'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string} [background-blend-mode] - CSS background-blend-mode (kebab-case)
 * @property {Observable<'border-box'|'padding-box'|'content-box'|'text'|string>|'border-box'|'padding-box'|'content-box'|'text'|string} [backgroundClip] - CSS background-clip
 * @property {Observable<'border-box'|'padding-box'|'content-box'|'text'|string>|'border-box'|'padding-box'|'content-box'|'text'|string} [background-clip] - CSS background-clip (kebab-case)
 * @property {Observable<string>|string} [backgroundColor] - CSS background-color
 * @property {Observable<string>|string} [background-color] - CSS background-color (kebab-case)
 * @property {Observable<string>|string} [backgroundImage] - CSS background-image
 * @property {Observable<string>|string} [background-image] - CSS background-image (kebab-case)
 * @property {Observable<'border-box'|'padding-box'|'content-box'|string>|'border-box'|'padding-box'|'content-box'|string} [backgroundOrigin] - CSS background-origin
 * @property {Observable<'border-box'|'padding-box'|'content-box'|string>|'border-box'|'padding-box'|'content-box'|string} [background-origin] - CSS background-origin (kebab-case)
 * @property {Observable<string>|string} [backgroundPosition] - CSS background-position
 * @property {Observable<string>|string} [background-position] - CSS background-position (kebab-case)
 * @property {Observable<string>|string} [backgroundPositionX] - CSS background-position-x
 * @property {Observable<string>|string} [background-position-x] - CSS background-position-x (kebab-case)
 * @property {Observable<string>|string} [backgroundPositionY] - CSS background-position-y
 * @property {Observable<string>|string} [background-position-y] - CSS background-position-y (kebab-case)
 * @property {Observable<'repeat'|'no-repeat'|'repeat-x'|'repeat-y'|'round'|'space'|string>|'repeat'|'no-repeat'|'repeat-x'|'repeat-y'|'round'|'space'|string} [backgroundRepeat] - CSS background-repeat
 * @property {Observable<'repeat'|'no-repeat'|'repeat-x'|'repeat-y'|'round'|'space'|string>|'repeat'|'no-repeat'|'repeat-x'|'repeat-y'|'round'|'space'|string} [background-repeat] - CSS background-repeat (kebab-case)
 * @property {Observable<'cover'|'contain'|'auto'|string>|'cover'|'contain'|'auto'|string} [backgroundSize] - CSS background-size
 * @property {Observable<'cover'|'contain'|'auto'|string>|'cover'|'contain'|'auto'|string} [background-size] - CSS background-size (kebab-case)
 * @property {Observable<string>|string} [border] - CSS border
 * @property {Observable<string>|string} [borderBlock] - CSS border-block
 * @property {Observable<string>|string} [border-block] - CSS border-block (kebab-case)
 * @property {Observable<string>|string} [borderBlockEnd] - CSS border-block-end
 * @property {Observable<string>|string} [border-block-end] - CSS border-block-end (kebab-case)
 * @property {Observable<string>|string} [borderBlockStart] - CSS border-block-start
 * @property {Observable<string>|string} [border-block-start] - CSS border-block-start (kebab-case)
 * @property {Observable<string>|string} [borderBottom] - CSS border-bottom
 * @property {Observable<string>|string} [border-bottom] - CSS border-bottom (kebab-case)
 * @property {Observable<string>|string} [borderBottomColor] - CSS border-bottom-color
 * @property {Observable<string>|string} [border-bottom-color] - CSS border-bottom-color (kebab-case)
 * @property {Observable<string>|string} [borderBottomLeftRadius] - CSS border-bottom-left-radius
 * @property {Observable<string>|string} [border-bottom-left-radius] - CSS border-bottom-left-radius (kebab-case)
 * @property {Observable<string>|string} [borderBottomRightRadius] - CSS border-bottom-right-radius
 * @property {Observable<string>|string} [border-bottom-right-radius] - CSS border-bottom-right-radius (kebab-case)
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [borderBottomStyle] - CSS border-bottom-style
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [border-bottom-style] - CSS border-bottom-style (kebab-case)
 * @property {Observable<string>|string} [borderBottomWidth] - CSS border-bottom-width
 * @property {Observable<string>|string} [border-bottom-width] - CSS border-bottom-width (kebab-case)
 * @property {Observable<'collapse'|'separate'|string>|'collapse'|'separate'|string} [borderCollapse] - CSS border-collapse
 * @property {Observable<'collapse'|'separate'|string>|'collapse'|'separate'|string} [border-collapse] - CSS border-collapse (kebab-case)
 * @property {Observable<string>|string} [borderColor] - CSS border-color
 * @property {Observable<string>|string} [border-color] - CSS border-color (kebab-case)
 * @property {Observable<string>|string} [borderEndEndRadius] - CSS border-end-end-radius
 * @property {Observable<string>|string} [border-end-end-radius] - CSS border-end-end-radius (kebab-case)
 * @property {Observable<string>|string} [borderEndStartRadius] - CSS border-end-start-radius
 * @property {Observable<string>|string} [border-end-start-radius] - CSS border-end-start-radius (kebab-case)
 * @property {Observable<string>|string} [borderImage] - CSS border-image
 * @property {Observable<string>|string} [border-image] - CSS border-image (kebab-case)
 * @property {Observable<string>|string} [borderImageOutset] - CSS border-image-outset
 * @property {Observable<string>|string} [border-image-outset] - CSS border-image-outset (kebab-case)
 * @property {Observable<'stretch'|'repeat'|'round'|'space'|string>|'stretch'|'repeat'|'round'|'space'|string} [borderImageRepeat] - CSS border-image-repeat
 * @property {Observable<'stretch'|'repeat'|'round'|'space'|string>|'stretch'|'repeat'|'round'|'space'|string} [border-image-repeat] - CSS border-image-repeat (kebab-case)
 * @property {Observable<string>|string} [borderImageSlice] - CSS border-image-slice
 * @property {Observable<string>|string} [border-image-slice] - CSS border-image-slice (kebab-case)
 * @property {Observable<string>|string} [borderImageSource] - CSS border-image-source
 * @property {Observable<string>|string} [border-image-source] - CSS border-image-source (kebab-case)
 * @property {Observable<string>|string} [borderImageWidth] - CSS border-image-width
 * @property {Observable<string>|string} [border-image-width] - CSS border-image-width (kebab-case)
 * @property {Observable<string>|string} [borderInline] - CSS border-inline
 * @property {Observable<string>|string} [border-inline] - CSS border-inline (kebab-case)
 * @property {Observable<string>|string} [borderInlineEnd] - CSS border-inline-end
 * @property {Observable<string>|string} [border-inline-end] - CSS border-inline-end (kebab-case)
 * @property {Observable<string>|string} [borderInlineStart] - CSS border-inline-start
 * @property {Observable<string>|string} [border-inline-start] - CSS border-inline-start (kebab-case)
 * @property {Observable<string>|string} [borderLeft] - CSS border-left
 * @property {Observable<string>|string} [border-left] - CSS border-left (kebab-case)
 * @property {Observable<string>|string} [borderLeftColor] - CSS border-left-color
 * @property {Observable<string>|string} [border-left-color] - CSS border-left-color (kebab-case)
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [borderLeftStyle] - CSS border-left-style
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [border-left-style] - CSS border-left-style (kebab-case)
 * @property {Observable<string>|string} [borderLeftWidth] - CSS border-left-width
 * @property {Observable<string>|string} [border-left-width] - CSS border-left-width (kebab-case)
 * @property {Observable<string>|string} [borderRadius] - CSS border-radius
 * @property {Observable<string>|string} [border-radius] - CSS border-radius (kebab-case)
 * @property {Observable<string>|string} [borderRight] - CSS border-right
 * @property {Observable<string>|string} [border-right] - CSS border-right (kebab-case)
 * @property {Observable<string>|string} [borderRightColor] - CSS border-right-color
 * @property {Observable<string>|string} [border-right-color] - CSS border-right-color (kebab-case)
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [borderRightStyle] - CSS border-right-style
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [border-right-style] - CSS border-right-style (kebab-case)
 * @property {Observable<string>|string} [borderRightWidth] - CSS border-right-width
 * @property {Observable<string>|string} [border-right-width] - CSS border-right-width (kebab-case)
 * @property {Observable<string>|string} [borderSpacing] - CSS border-spacing
 * @property {Observable<string>|string} [border-spacing] - CSS border-spacing (kebab-case)
 * @property {Observable<string>|string} [borderStartEndRadius] - CSS border-start-end-radius
 * @property {Observable<string>|string} [border-start-end-radius] - CSS border-start-end-radius (kebab-case)
 * @property {Observable<string>|string} [borderStartStartRadius] - CSS border-start-start-radius
 * @property {Observable<string>|string} [border-start-start-radius] - CSS border-start-start-radius (kebab-case)
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [borderStyle] - CSS border-style
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [border-style] - CSS border-style (kebab-case)
 * @property {Observable<string>|string} [borderTop] - CSS border-top
 * @property {Observable<string>|string} [border-top] - CSS border-top (kebab-case)
 * @property {Observable<string>|string} [borderTopColor] - CSS border-top-color
 * @property {Observable<string>|string} [border-top-color] - CSS border-top-color (kebab-case)
 * @property {Observable<string>|string} [borderTopLeftRadius] - CSS border-top-left-radius
 * @property {Observable<string>|string} [border-top-left-radius] - CSS border-top-left-radius (kebab-case)
 * @property {Observable<string>|string} [borderTopRightRadius] - CSS border-top-right-radius
 * @property {Observable<string>|string} [border-top-right-radius] - CSS border-top-right-radius (kebab-case)
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [borderTopStyle] - CSS border-top-style
 * @property {Observable<'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string>|'none'|'hidden'|'solid'|'dashed'|'dotted'|'double'|'groove'|'ridge'|'inset'|'outset'|string} [border-top-style] - CSS border-top-style (kebab-case)
 * @property {Observable<string>|string} [borderTopWidth] - CSS border-top-width
 * @property {Observable<string>|string} [border-top-width] - CSS border-top-width (kebab-case)
 * @property {Observable<string>|string} [borderWidth] - CSS border-width
 * @property {Observable<string>|string} [border-width] - CSS border-width (kebab-case)
 * @property {Observable<string>|string} [bottom] - CSS bottom
 * @property {Observable<'slice'|'clone'|string>|'slice'|'clone'|string} [boxDecorationBreak] - CSS box-decoration-break
 * @property {Observable<'slice'|'clone'|string>|'slice'|'clone'|string} [box-decoration-break] - CSS box-decoration-break (kebab-case)
 * @property {Observable<string>|string} [boxShadow] - CSS box-shadow
 * @property {Observable<string>|string} [box-shadow] - CSS box-shadow (kebab-case)
 * @property {Observable<'border-box'|'content-box'|string>|'border-box'|'content-box'|string} [boxSizing] - CSS box-sizing
 * @property {Observable<'border-box'|'content-box'|string>|'border-box'|'content-box'|string} [box-sizing] - CSS box-sizing (kebab-case)
 * @property {Observable<'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string>|'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string} [breakAfter] - CSS break-after
 * @property {Observable<'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string>|'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string} [break-after] - CSS break-after (kebab-case)
 * @property {Observable<'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string>|'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string} [breakBefore] - CSS break-before
 * @property {Observable<'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string>|'auto'|'avoid'|'always'|'all'|'avoid-page'|'page'|'left'|'right'|'column'|string} [break-before] - CSS break-before (kebab-case)
 * @property {Observable<'auto'|'avoid'|'avoid-page'|'avoid-column'|string>|'auto'|'avoid'|'avoid-page'|'avoid-column'|string} [breakInside] - CSS break-inside
 * @property {Observable<'auto'|'avoid'|'avoid-page'|'avoid-column'|string>|'auto'|'avoid'|'avoid-page'|'avoid-column'|string} [break-inside] - CSS break-inside (kebab-case)
 * @property {Observable<'top'|'bottom'|'block-start'|'block-end'|'inline-start'|'inline-end'|string>|'top'|'bottom'|'block-start'|'block-end'|'inline-start'|'inline-end'|string} [captionSide] - CSS caption-side
 * @property {Observable<'top'|'bottom'|'block-start'|'block-end'|'inline-start'|'inline-end'|string>|'top'|'bottom'|'block-start'|'block-end'|'inline-start'|'inline-end'|string} [caption-side] - CSS caption-side (kebab-case)
 * @property {Observable<string>|string} [caretColor] - CSS caret-color
 * @property {Observable<string>|string} [caret-color] - CSS caret-color (kebab-case)
 * @property {Observable<'left'|'right'|'both'|'none'|'inline-start'|'inline-end'|string>|'left'|'right'|'both'|'none'|'inline-start'|'inline-end'|string} [clear] - CSS clear
 * @property {Observable<string>|string} [clipPath] - CSS clip-path
 * @property {Observable<string>|string} [clip-path] - CSS clip-path (kebab-case)
 * @property {Observable<'nonzero'|'evenodd'|string>|'nonzero'|'evenodd'|string} [clipRule] - CSS clip-rule
 * @property {Observable<'nonzero'|'evenodd'|string>|'nonzero'|'evenodd'|string} [clip-rule] - CSS clip-rule (kebab-case)
 * @property {Observable<string>|string} [color] - CSS color
 * @property {Observable<'auto'|'optimizeSpeed'|'optimizeQuality'|string>|'auto'|'optimizeSpeed'|'optimizeQuality'|string} [colorRendering] - CSS color-rendering
 * @property {Observable<'auto'|'optimizeSpeed'|'optimizeQuality'|string>|'auto'|'optimizeSpeed'|'optimizeQuality'|string} [color-rendering] - CSS color-rendering (kebab-case)
 * @property {Observable<'normal'|'light'|'dark'|'light dark'|string>|'normal'|'light'|'dark'|'light dark'|string} [colorScheme] - CSS color-scheme
 * @property {Observable<'normal'|'light'|'dark'|'light dark'|string>|'normal'|'light'|'dark'|'light dark'|string} [color-scheme] - CSS color-scheme (kebab-case)
 * @property {Observable<string>|string} [columnCount] - CSS column-count
 * @property {Observable<string>|string} [column-count] - CSS column-count (kebab-case)
 * @property {Observable<'balance'|'auto'|'balance-all'|string>|'balance'|'auto'|'balance-all'|string} [columnFill] - CSS column-fill
 * @property {Observable<'balance'|'auto'|'balance-all'|string>|'balance'|'auto'|'balance-all'|string} [column-fill] - CSS column-fill (kebab-case)
 * @property {Observable<string>|string} [columnGap] - CSS column-gap
 * @property {Observable<string>|string} [column-gap] - CSS column-gap (kebab-case)
 * @property {Observable<string>|string} [columnRule] - CSS column-rule
 * @property {Observable<string>|string} [column-rule] - CSS column-rule (kebab-case)
 * @property {Observable<string>|string} [columnRuleColor] - CSS column-rule-color
 * @property {Observable<string>|string} [column-rule-color] - CSS column-rule-color (kebab-case)
 * @property {Observable<string>|string} [columnRuleStyle] - CSS column-rule-style
 * @property {Observable<string>|string} [column-rule-style] - CSS column-rule-style (kebab-case)
 * @property {Observable<string>|string} [columnRuleWidth] - CSS column-rule-width
 * @property {Observable<string>|string} [column-rule-width] - CSS column-rule-width (kebab-case)
 * @property {Observable<'none'|'all'|string>|'none'|'all'|string} [columnSpan] - CSS column-span
 * @property {Observable<'none'|'all'|string>|'none'|'all'|string} [column-span] - CSS column-span (kebab-case)
 * @property {Observable<string>|string} [columnWidth] - CSS column-width
 * @property {Observable<string>|string} [column-width] - CSS column-width (kebab-case)
 * @property {Observable<string>|string} [columns] - CSS columns
 * @property {Observable<'none'|'strict'|'content'|'size'|'layout'|'style'|'paint'|string>|'none'|'strict'|'content'|'size'|'layout'|'style'|'paint'|string} [contain] - CSS contain
 * @property {Observable<string>|string} [content] - CSS content
 * @property {Observable<'visible'|'hidden'|'auto'|string>|'visible'|'hidden'|'auto'|string} [contentVisibility] - CSS content-visibility
 * @property {Observable<'visible'|'hidden'|'auto'|string>|'visible'|'hidden'|'auto'|string} [content-visibility] - CSS content-visibility (kebab-case)
 * @property {Observable<string>|string} [counterIncrement] - CSS counter-increment
 * @property {Observable<string>|string} [counter-increment] - CSS counter-increment (kebab-case)
 * @property {Observable<string>|string} [counterReset] - CSS counter-reset
 * @property {Observable<string>|string} [counter-reset] - CSS counter-reset (kebab-case)
 * @property {Observable<string>|string} [counterSet] - CSS counter-set
 * @property {Observable<string>|string} [counter-set] - CSS counter-set (kebab-case)
 * @property {Observable<'auto'|'default'|'none'|'pointer'|'crosshair'|'move'|'grab'|'grabbing'|'text'|'wait'|'help'|'progress'|'not-allowed'|'no-drop'|'copy'|'alias'|'zoom-in'|'zoom-out'|'col-resize'|'row-resize'|'n-resize'|'s-resize'|'e-resize'|'w-resize'|'ne-resize'|'nw-resize'|'se-resize'|'sw-resize'|'ew-resize'|'ns-resize'|'nesw-resize'|'nwse-resize'|'cell'|'context-menu'|'vertical-text'|string>|'auto'|'default'|'none'|'pointer'|'crosshair'|'move'|'grab'|'grabbing'|'text'|'wait'|'help'|'progress'|'not-allowed'|'no-drop'|'copy'|'alias'|'zoom-in'|'zoom-out'|'col-resize'|'row-resize'|'n-resize'|'s-resize'|'e-resize'|'w-resize'|'ne-resize'|'nw-resize'|'se-resize'|'sw-resize'|'ew-resize'|'ns-resize'|'nesw-resize'|'nwse-resize'|'cell'|'context-menu'|'vertical-text'|string} [cursor] - CSS cursor
 * @property {Observable<'ltr'|'rtl'|string>|'ltr'|'rtl'|string} [direction] - CSS direction
 * @property {Observable<'block'|'flex'|'grid'|'inline'|'inline-flex'|'inline-block'|'inline-grid'|'none'|'contents'|'table'|'table-cell'|'table-row'|'list-item'|'flow-root'|string>|'block'|'flex'|'grid'|'inline'|'inline-flex'|'inline-block'|'inline-grid'|'none'|'contents'|'table'|'table-cell'|'table-row'|'list-item'|'flow-root'|string} [display] - CSS display
 * @property {Observable<'auto'|'middle'|'central'|'text-before-edge'|'text-after-edge'|'ideographic'|'alphabetic'|'hanging'|'mathematical'|string>|'auto'|'middle'|'central'|'text-before-edge'|'text-after-edge'|'ideographic'|'alphabetic'|'hanging'|'mathematical'|string} [dominantBaseline] - CSS dominant-baseline
 * @property {Observable<'auto'|'middle'|'central'|'text-before-edge'|'text-after-edge'|'ideographic'|'alphabetic'|'hanging'|'mathematical'|string>|'auto'|'middle'|'central'|'text-before-edge'|'text-after-edge'|'ideographic'|'alphabetic'|'hanging'|'mathematical'|string} [dominant-baseline] - CSS dominant-baseline (kebab-case)
 * @property {Observable<'show'|'hide'|string>|'show'|'hide'|string} [emptyCells] - CSS empty-cells
 * @property {Observable<'show'|'hide'|string>|'show'|'hide'|string} [empty-cells] - CSS empty-cells (kebab-case)
 * @property {Observable<string>|string} [fill] - CSS fill
 * @property {Observable<string>|string} [fillOpacity] - CSS fill-opacity
 * @property {Observable<string>|string} [fill-opacity] - CSS fill-opacity (kebab-case)
 * @property {Observable<'nonzero'|'evenodd'|string>|'nonzero'|'evenodd'|string} [fillRule] - CSS fill-rule
 * @property {Observable<'nonzero'|'evenodd'|string>|'nonzero'|'evenodd'|string} [fill-rule] - CSS fill-rule (kebab-case)
 * @property {Observable<string>|string} [filter] - CSS filter
 * @property {Observable<string>|string} [flex] - CSS flex
 * @property {Observable<string>|string} [flexBasis] - CSS flex-basis
 * @property {Observable<string>|string} [flex-basis] - CSS flex-basis (kebab-case)
 * @property {Observable<'row'|'column'|'row-reverse'|'column-reverse'|string>|'row'|'column'|'row-reverse'|'column-reverse'|string} [flexDirection] - CSS flex-direction
 * @property {Observable<'row'|'column'|'row-reverse'|'column-reverse'|string>|'row'|'column'|'row-reverse'|'column-reverse'|string} [flex-direction] - CSS flex-direction (kebab-case)
 * @property {Observable<string>|string} [flexFlow] - CSS flex-flow
 * @property {Observable<string>|string} [flex-flow] - CSS flex-flow (kebab-case)
 * @property {Observable<string>|string} [flexGrow] - CSS flex-grow
 * @property {Observable<string>|string} [flex-grow] - CSS flex-grow (kebab-case)
 * @property {Observable<string>|string} [flexShrink] - CSS flex-shrink
 * @property {Observable<string>|string} [flex-shrink] - CSS flex-shrink (kebab-case)
 * @property {Observable<'nowrap'|'wrap'|'wrap-reverse'|string>|'nowrap'|'wrap'|'wrap-reverse'|string} [flexWrap] - CSS flex-wrap
 * @property {Observable<'nowrap'|'wrap'|'wrap-reverse'|string>|'nowrap'|'wrap'|'wrap-reverse'|string} [flex-wrap] - CSS flex-wrap (kebab-case)
 * @property {Observable<'left'|'right'|'none'|'inline-start'|'inline-end'|string>|'left'|'right'|'none'|'inline-start'|'inline-end'|string} [float] - CSS float
 * @property {Observable<string>|string} [font] - CSS font
 * @property {Observable<string>|string} [fontDisplay] - CSS font-display
 * @property {Observable<string>|string} [font-display] - CSS font-display (kebab-case)
 * @property {Observable<string>|string} [fontFamily] - CSS font-family
 * @property {Observable<string>|string} [font-family] - CSS font-family (kebab-case)
 * @property {Observable<string>|string} [fontFeatureSettings] - CSS font-feature-settings
 * @property {Observable<string>|string} [font-feature-settings] - CSS font-feature-settings (kebab-case)
 * @property {Observable<'auto'|'normal'|'none'|string>|'auto'|'normal'|'none'|string} [fontKerning] - CSS font-kerning
 * @property {Observable<'auto'|'normal'|'none'|string>|'auto'|'normal'|'none'|string} [font-kerning] - CSS font-kerning (kebab-case)
 * @property {Observable<string>|string} [fontOpticalSizing] - CSS font-optical-sizing
 * @property {Observable<string>|string} [font-optical-sizing] - CSS font-optical-sizing (kebab-case)
 * @property {Observable<string>|string} [fontSize] - CSS font-size
 * @property {Observable<string>|string} [font-size] - CSS font-size (kebab-case)
 * @property {Observable<string>|string} [fontSizeAdjust] - CSS font-size-adjust
 * @property {Observable<string>|string} [font-size-adjust] - CSS font-size-adjust (kebab-case)
 * @property {Observable<'normal'|'condensed'|'expanded'|'ultra-condensed'|'extra-condensed'|'semi-condensed'|'semi-expanded'|'extra-expanded'|'ultra-expanded'|string>|'normal'|'condensed'|'expanded'|'ultra-condensed'|'extra-condensed'|'semi-condensed'|'semi-expanded'|'extra-expanded'|'ultra-expanded'|string} [fontStretch] - CSS font-stretch
 * @property {Observable<'normal'|'condensed'|'expanded'|'ultra-condensed'|'extra-condensed'|'semi-condensed'|'semi-expanded'|'extra-expanded'|'ultra-expanded'|string>|'normal'|'condensed'|'expanded'|'ultra-condensed'|'extra-condensed'|'semi-condensed'|'semi-expanded'|'extra-expanded'|'ultra-expanded'|string} [font-stretch] - CSS font-stretch (kebab-case)
 * @property {Observable<'normal'|'italic'|'oblique'|string>|'normal'|'italic'|'oblique'|string} [fontStyle] - CSS font-style
 * @property {Observable<'normal'|'italic'|'oblique'|string>|'normal'|'italic'|'oblique'|string} [font-style] - CSS font-style (kebab-case)
 * @property {Observable<'normal'|'small-caps'|string>|'normal'|'small-caps'|string} [fontVariant] - CSS font-variant
 * @property {Observable<'normal'|'small-caps'|string>|'normal'|'small-caps'|string} [font-variant] - CSS font-variant (kebab-case)
 * @property {Observable<string>|string} [fontVariationSettings] - CSS font-variation-settings
 * @property {Observable<string>|string} [font-variation-settings] - CSS font-variation-settings (kebab-case)
 * @property {Observable<'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|string>|'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|string} [fontWeight] - CSS font-weight
 * @property {Observable<'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|string>|'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'|string} [font-weight] - CSS font-weight (kebab-case)
 * @property {Observable<string>|string} [forcedColorAdjust] - CSS forced-color-adjust
 * @property {Observable<string>|string} [forced-color-adjust] - CSS forced-color-adjust (kebab-case)
 * @property {Observable<string>|string} [gap] - CSS gap
 * @property {Observable<string>|string} [grid] - CSS grid
 * @property {Observable<string>|string} [gridArea] - CSS grid-area
 * @property {Observable<string>|string} [grid-area] - CSS grid-area (kebab-case)
 * @property {Observable<string>|string} [gridAutoColumns] - CSS grid-auto-columns
 * @property {Observable<string>|string} [grid-auto-columns] - CSS grid-auto-columns (kebab-case)
 * @property {Observable<'row'|'column'|'dense'|'row dense'|'column dense'|string>|'row'|'column'|'dense'|'row dense'|'column dense'|string} [gridAutoFlow] - CSS grid-auto-flow
 * @property {Observable<'row'|'column'|'dense'|'row dense'|'column dense'|string>|'row'|'column'|'dense'|'row dense'|'column dense'|string} [grid-auto-flow] - CSS grid-auto-flow (kebab-case)
 * @property {Observable<string>|string} [gridAutoRows] - CSS grid-auto-rows
 * @property {Observable<string>|string} [grid-auto-rows] - CSS grid-auto-rows (kebab-case)
 * @property {Observable<string>|string} [gridColumn] - CSS grid-column
 * @property {Observable<string>|string} [grid-column] - CSS grid-column (kebab-case)
 * @property {Observable<string>|string} [gridColumnEnd] - CSS grid-column-end
 * @property {Observable<string>|string} [grid-column-end] - CSS grid-column-end (kebab-case)
 * @property {Observable<string>|string} [gridColumnStart] - CSS grid-column-start
 * @property {Observable<string>|string} [grid-column-start] - CSS grid-column-start (kebab-case)
 * @property {Observable<string>|string} [gridRow] - CSS grid-row
 * @property {Observable<string>|string} [grid-row] - CSS grid-row (kebab-case)
 * @property {Observable<string>|string} [gridRowEnd] - CSS grid-row-end
 * @property {Observable<string>|string} [grid-row-end] - CSS grid-row-end (kebab-case)
 * @property {Observable<string>|string} [gridRowStart] - CSS grid-row-start
 * @property {Observable<string>|string} [grid-row-start] - CSS grid-row-start (kebab-case)
 * @property {Observable<string>|string} [gridTemplate] - CSS grid-template
 * @property {Observable<string>|string} [grid-template] - CSS grid-template (kebab-case)
 * @property {Observable<string>|string} [gridTemplateAreas] - CSS grid-template-areas
 * @property {Observable<string>|string} [grid-template-areas] - CSS grid-template-areas (kebab-case)
 * @property {Observable<string>|string} [gridTemplateColumns] - CSS grid-template-columns
 * @property {Observable<string>|string} [grid-template-columns] - CSS grid-template-columns (kebab-case)
 * @property {Observable<string>|string} [gridTemplateRows] - CSS grid-template-rows
 * @property {Observable<string>|string} [grid-template-rows] - CSS grid-template-rows (kebab-case)
 * @property {Observable<string>|string} [height] - CSS height
 * @property {Observable<string>|string} [hyphenateCharacter] - CSS hyphenate-character
 * @property {Observable<string>|string} [hyphenate-character] - CSS hyphenate-character (kebab-case)
 * @property {Observable<'none'|'manual'|'auto'|string>|'none'|'manual'|'auto'|string} [hyphens] - CSS hyphens
 * @property {Observable<'none'|'from-image'|string>|'none'|'from-image'|string} [imageOrientation] - CSS image-orientation
 * @property {Observable<'none'|'from-image'|string>|'none'|'from-image'|string} [image-orientation] - CSS image-orientation (kebab-case)
 * @property {Observable<'auto'|'crisp-edges'|'pixelated'|'smooth'|string>|'auto'|'crisp-edges'|'pixelated'|'smooth'|string} [imageRendering] - CSS image-rendering
 * @property {Observable<'auto'|'crisp-edges'|'pixelated'|'smooth'|string>|'auto'|'crisp-edges'|'pixelated'|'smooth'|string} [image-rendering] - CSS image-rendering (kebab-case)
 * @property {Observable<string>|string} [inset] - CSS inset
 * @property {Observable<string>|string} [insetBlock] - CSS inset-block
 * @property {Observable<string>|string} [inset-block] - CSS inset-block (kebab-case)
 * @property {Observable<string>|string} [insetBlockEnd] - CSS inset-block-end
 * @property {Observable<string>|string} [inset-block-end] - CSS inset-block-end (kebab-case)
 * @property {Observable<string>|string} [insetBlockStart] - CSS inset-block-start
 * @property {Observable<string>|string} [inset-block-start] - CSS inset-block-start (kebab-case)
 * @property {Observable<string>|string} [insetInline] - CSS inset-inline
 * @property {Observable<string>|string} [inset-inline] - CSS inset-inline (kebab-case)
 * @property {Observable<string>|string} [insetInlineEnd] - CSS inset-inline-end
 * @property {Observable<string>|string} [inset-inline-end] - CSS inset-inline-end (kebab-case)
 * @property {Observable<string>|string} [insetInlineStart] - CSS inset-inline-start
 * @property {Observable<string>|string} [inset-inline-start] - CSS inset-inline-start (kebab-case)
 * @property {Observable<'auto'|'isolate'|string>|'auto'|'isolate'|string} [isolation] - CSS isolation
 * @property {Observable<'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'start'|'end'|'stretch'|string>|'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'start'|'end'|'stretch'|string} [justifyContent] - CSS justify-content
 * @property {Observable<'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'start'|'end'|'stretch'|string>|'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'|'start'|'end'|'stretch'|string} [justify-content] - CSS justify-content (kebab-case)
 * @property {Observable<'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string>|'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string} [justifyItems] - CSS justify-items
 * @property {Observable<'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string>|'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string} [justify-items] - CSS justify-items (kebab-case)
 * @property {Observable<'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string>|'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string} [justifySelf] - CSS justify-self
 * @property {Observable<'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string>|'auto'|'normal'|'stretch'|'center'|'start'|'end'|'flex-start'|'flex-end'|'baseline'|string} [justify-self] - CSS justify-self (kebab-case)
 * @property {Observable<string>|string} [left] - CSS left
 * @property {Observable<string>|string} [letterSpacing] - CSS letter-spacing
 * @property {Observable<string>|string} [letter-spacing] - CSS letter-spacing (kebab-case)
 * @property {Observable<'auto'|'loose'|'normal'|'strict'|'anywhere'|string>|'auto'|'loose'|'normal'|'strict'|'anywhere'|string} [lineBreak] - CSS line-break
 * @property {Observable<'auto'|'loose'|'normal'|'strict'|'anywhere'|string>|'auto'|'loose'|'normal'|'strict'|'anywhere'|string} [line-break] - CSS line-break (kebab-case)
 * @property {Observable<string>|string} [lineHeight] - CSS line-height
 * @property {Observable<string>|string} [line-height] - CSS line-height (kebab-case)
 * @property {Observable<string>|string} [listStyle] - CSS list-style
 * @property {Observable<string>|string} [list-style] - CSS list-style (kebab-case)
 * @property {Observable<string>|string} [listStyleImage] - CSS list-style-image
 * @property {Observable<string>|string} [list-style-image] - CSS list-style-image (kebab-case)
 * @property {Observable<'inside'|'outside'|string>|'inside'|'outside'|string} [listStylePosition] - CSS list-style-position
 * @property {Observable<'inside'|'outside'|string>|'inside'|'outside'|string} [list-style-position] - CSS list-style-position (kebab-case)
 * @property {Observable<'none'|'disc'|'circle'|'square'|'decimal'|'decimal-leading-zero'|'lower-roman'|'upper-roman'|'lower-alpha'|'upper-alpha'|'lower-latin'|'upper-latin'|string>|'none'|'disc'|'circle'|'square'|'decimal'|'decimal-leading-zero'|'lower-roman'|'upper-roman'|'lower-alpha'|'upper-alpha'|'lower-latin'|'upper-latin'|string} [listStyleType] - CSS list-style-type
 * @property {Observable<'none'|'disc'|'circle'|'square'|'decimal'|'decimal-leading-zero'|'lower-roman'|'upper-roman'|'lower-alpha'|'upper-alpha'|'lower-latin'|'upper-latin'|string>|'none'|'disc'|'circle'|'square'|'decimal'|'decimal-leading-zero'|'lower-roman'|'upper-roman'|'lower-alpha'|'upper-alpha'|'lower-latin'|'upper-latin'|string} [list-style-type] - CSS list-style-type (kebab-case)
 * @property {Observable<string>|string} [margin] - CSS margin
 * @property {Observable<string>|string} [marginBlock] - CSS margin-block
 * @property {Observable<string>|string} [margin-block] - CSS margin-block (kebab-case)
 * @property {Observable<string>|string} [marginBlockEnd] - CSS margin-block-end
 * @property {Observable<string>|string} [margin-block-end] - CSS margin-block-end (kebab-case)
 * @property {Observable<string>|string} [marginBlockStart] - CSS margin-block-start
 * @property {Observable<string>|string} [margin-block-start] - CSS margin-block-start (kebab-case)
 * @property {Observable<string>|string} [marginBottom] - CSS margin-bottom
 * @property {Observable<string>|string} [margin-bottom] - CSS margin-bottom (kebab-case)
 * @property {Observable<string>|string} [marginInline] - CSS margin-inline
 * @property {Observable<string>|string} [margin-inline] - CSS margin-inline (kebab-case)
 * @property {Observable<string>|string} [marginInlineEnd] - CSS margin-inline-end
 * @property {Observable<string>|string} [margin-inline-end] - CSS margin-inline-end (kebab-case)
 * @property {Observable<string>|string} [marginInlineStart] - CSS margin-inline-start
 * @property {Observable<string>|string} [margin-inline-start] - CSS margin-inline-start (kebab-case)
 * @property {Observable<string>|string} [marginLeft] - CSS margin-left
 * @property {Observable<string>|string} [margin-left] - CSS margin-left (kebab-case)
 * @property {Observable<string>|string} [marginRight] - CSS margin-right
 * @property {Observable<string>|string} [margin-right] - CSS margin-right (kebab-case)
 * @property {Observable<string>|string} [marginTop] - CSS margin-top
 * @property {Observable<string>|string} [margin-top] - CSS margin-top (kebab-case)
 * @property {Observable<string>|string} [markerEnd] - CSS marker-end
 * @property {Observable<string>|string} [marker-end] - CSS marker-end (kebab-case)
 * @property {Observable<string>|string} [markerMid] - CSS marker-mid
 * @property {Observable<string>|string} [marker-mid] - CSS marker-mid (kebab-case)
 * @property {Observable<string>|string} [markerStart] - CSS marker-start
 * @property {Observable<string>|string} [marker-start] - CSS marker-start (kebab-case)
 * @property {Observable<string>|string} [mask] - CSS mask
 * @property {Observable<string>|string} [maskClip] - CSS mask-clip
 * @property {Observable<string>|string} [mask-clip] - CSS mask-clip (kebab-case)
 * @property {Observable<string>|string} [maskComposite] - CSS mask-composite
 * @property {Observable<string>|string} [mask-composite] - CSS mask-composite (kebab-case)
 * @property {Observable<string>|string} [maskImage] - CSS mask-image
 * @property {Observable<string>|string} [mask-image] - CSS mask-image (kebab-case)
 * @property {Observable<string>|string} [maskMode] - CSS mask-mode
 * @property {Observable<string>|string} [mask-mode] - CSS mask-mode (kebab-case)
 * @property {Observable<string>|string} [maskOrigin] - CSS mask-origin
 * @property {Observable<string>|string} [mask-origin] - CSS mask-origin (kebab-case)
 * @property {Observable<string>|string} [maskPosition] - CSS mask-position
 * @property {Observable<string>|string} [mask-position] - CSS mask-position (kebab-case)
 * @property {Observable<string>|string} [maskRepeat] - CSS mask-repeat
 * @property {Observable<string>|string} [mask-repeat] - CSS mask-repeat (kebab-case)
 * @property {Observable<string>|string} [maskSize] - CSS mask-size
 * @property {Observable<string>|string} [mask-size] - CSS mask-size (kebab-case)
 * @property {Observable<string>|string} [maxHeight] - CSS max-height
 * @property {Observable<string>|string} [max-height] - CSS max-height (kebab-case)
 * @property {Observable<string>|string} [maxWidth] - CSS max-width
 * @property {Observable<string>|string} [max-width] - CSS max-width (kebab-case)
 * @property {Observable<string>|string} [minHeight] - CSS min-height
 * @property {Observable<string>|string} [min-height] - CSS min-height (kebab-case)
 * @property {Observable<string>|string} [minWidth] - CSS min-width
 * @property {Observable<string>|string} [min-width] - CSS min-width (kebab-case)
 * @property {Observable<'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string>|'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string} [mixBlendMode] - CSS mix-blend-mode
 * @property {Observable<'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string>|'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'|string} [mix-blend-mode] - CSS mix-blend-mode (kebab-case)
 * @property {Observable<'fill'|'contain'|'cover'|'none'|'scale-down'|string>|'fill'|'contain'|'cover'|'none'|'scale-down'|string} [objectFit] - CSS object-fit
 * @property {Observable<'fill'|'contain'|'cover'|'none'|'scale-down'|string>|'fill'|'contain'|'cover'|'none'|'scale-down'|string} [object-fit] - CSS object-fit (kebab-case)
 * @property {Observable<string>|string} [objectPosition] - CSS object-position
 * @property {Observable<string>|string} [object-position] - CSS object-position (kebab-case)
 * @property {Observable<string>|string} [offset] - CSS offset
 * @property {Observable<string>|string} [offsetAnchor] - CSS offset-anchor
 * @property {Observable<string>|string} [offset-anchor] - CSS offset-anchor (kebab-case)
 * @property {Observable<string>|string} [offsetDistance] - CSS offset-distance
 * @property {Observable<string>|string} [offset-distance] - CSS offset-distance (kebab-case)
 * @property {Observable<string>|string} [offsetPath] - CSS offset-path
 * @property {Observable<string>|string} [offset-path] - CSS offset-path (kebab-case)
 * @property {Observable<string>|string} [offsetRotate] - CSS offset-rotate
 * @property {Observable<string>|string} [offset-rotate] - CSS offset-rotate (kebab-case)
 * @property {Observable<string>|string} [opacity] - CSS opacity
 * @property {Observable<string>|string} [order] - CSS order
 * @property {Observable<string>|string} [orphans] - CSS orphans
 * @property {Observable<string>|string} [outline] - CSS outline
 * @property {Observable<string>|string} [outlineColor] - CSS outline-color
 * @property {Observable<string>|string} [outline-color] - CSS outline-color (kebab-case)
 * @property {Observable<string>|string} [outlineOffset] - CSS outline-offset
 * @property {Observable<string>|string} [outline-offset] - CSS outline-offset (kebab-case)
 * @property {Observable<string>|string} [outlineStyle] - CSS outline-style
 * @property {Observable<string>|string} [outline-style] - CSS outline-style (kebab-case)
 * @property {Observable<string>|string} [outlineWidth] - CSS outline-width
 * @property {Observable<string>|string} [outline-width] - CSS outline-width (kebab-case)
 * @property {Observable<'visible'|'hidden'|'scroll'|'auto'|'clip'|string>|'visible'|'hidden'|'scroll'|'auto'|'clip'|string} [overflow] - CSS overflow
 * @property {Observable<string>|string} [overflowClip] - CSS overflow-clip
 * @property {Observable<string>|string} [overflow-clip] - CSS overflow-clip (kebab-case)
 * @property {Observable<'normal'|'break-word'|'anywhere'|string>|'normal'|'break-word'|'anywhere'|string} [overflowWrap] - CSS overflow-wrap
 * @property {Observable<'normal'|'break-word'|'anywhere'|string>|'normal'|'break-word'|'anywhere'|string} [overflow-wrap] - CSS overflow-wrap (kebab-case)
 * @property {Observable<'visible'|'hidden'|'scroll'|'auto'|'clip'|string>|'visible'|'hidden'|'scroll'|'auto'|'clip'|string} [overflowX] - CSS overflow-x
 * @property {Observable<'visible'|'hidden'|'scroll'|'auto'|'clip'|string>|'visible'|'hidden'|'scroll'|'auto'|'clip'|string} [overflow-x] - CSS overflow-x (kebab-case)
 * @property {Observable<'visible'|'hidden'|'scroll'|'auto'|'clip'|string>|'visible'|'hidden'|'scroll'|'auto'|'clip'|string} [overflowY] - CSS overflow-y
 * @property {Observable<'visible'|'hidden'|'scroll'|'auto'|'clip'|string>|'visible'|'hidden'|'scroll'|'auto'|'clip'|string} [overflow-y] - CSS overflow-y (kebab-case)
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscrollBehavior] - CSS overscroll-behavior
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscroll-behavior] - CSS overscroll-behavior (kebab-case)
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscrollBehaviorX] - CSS overscroll-behavior-x
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscroll-behavior-x] - CSS overscroll-behavior-x (kebab-case)
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscrollBehaviorY] - CSS overscroll-behavior-y
 * @property {Observable<'auto'|'contain'|'none'|string>|'auto'|'contain'|'none'|string} [overscroll-behavior-y] - CSS overscroll-behavior-y (kebab-case)
 * @property {Observable<string>|string} [padding] - CSS padding
 * @property {Observable<string>|string} [paddingBlock] - CSS padding-block
 * @property {Observable<string>|string} [padding-block] - CSS padding-block (kebab-case)
 * @property {Observable<string>|string} [paddingBlockEnd] - CSS padding-block-end
 * @property {Observable<string>|string} [padding-block-end] - CSS padding-block-end (kebab-case)
 * @property {Observable<string>|string} [paddingBlockStart] - CSS padding-block-start
 * @property {Observable<string>|string} [padding-block-start] - CSS padding-block-start (kebab-case)
 * @property {Observable<string>|string} [paddingBottom] - CSS padding-bottom
 * @property {Observable<string>|string} [padding-bottom] - CSS padding-bottom (kebab-case)
 * @property {Observable<string>|string} [paddingInline] - CSS padding-inline
 * @property {Observable<string>|string} [padding-inline] - CSS padding-inline (kebab-case)
 * @property {Observable<string>|string} [paddingInlineEnd] - CSS padding-inline-end
 * @property {Observable<string>|string} [padding-inline-end] - CSS padding-inline-end (kebab-case)
 * @property {Observable<string>|string} [paddingInlineStart] - CSS padding-inline-start
 * @property {Observable<string>|string} [padding-inline-start] - CSS padding-inline-start (kebab-case)
 * @property {Observable<string>|string} [paddingLeft] - CSS padding-left
 * @property {Observable<string>|string} [padding-left] - CSS padding-left (kebab-case)
 * @property {Observable<string>|string} [paddingRight] - CSS padding-right
 * @property {Observable<string>|string} [padding-right] - CSS padding-right (kebab-case)
 * @property {Observable<string>|string} [paddingTop] - CSS padding-top
 * @property {Observable<string>|string} [padding-top] - CSS padding-top (kebab-case)
 * @property {Observable<'auto'|'always'|'avoid'|'left'|'right'|string>|'auto'|'always'|'avoid'|'left'|'right'|string} [pageBreakAfter] - CSS page-break-after
 * @property {Observable<'auto'|'always'|'avoid'|'left'|'right'|string>|'auto'|'always'|'avoid'|'left'|'right'|string} [page-break-after] - CSS page-break-after (kebab-case)
 * @property {Observable<'auto'|'always'|'avoid'|'left'|'right'|string>|'auto'|'always'|'avoid'|'left'|'right'|string} [pageBreakBefore] - CSS page-break-before
 * @property {Observable<'auto'|'always'|'avoid'|'left'|'right'|string>|'auto'|'always'|'avoid'|'left'|'right'|string} [page-break-before] - CSS page-break-before (kebab-case)
 * @property {Observable<'auto'|'avoid'|string>|'auto'|'avoid'|string} [pageBreakInside] - CSS page-break-inside
 * @property {Observable<'auto'|'avoid'|string>|'auto'|'avoid'|string} [page-break-inside] - CSS page-break-inside (kebab-case)
 * @property {Observable<string>|string} [perspective] - CSS perspective
 * @property {Observable<string>|string} [perspectiveOrigin] - CSS perspective-origin
 * @property {Observable<string>|string} [perspective-origin] - CSS perspective-origin (kebab-case)
 * @property {Observable<string>|string} [placeContent] - CSS place-content
 * @property {Observable<string>|string} [place-content] - CSS place-content (kebab-case)
 * @property {Observable<string>|string} [placeItems] - CSS place-items
 * @property {Observable<string>|string} [place-items] - CSS place-items (kebab-case)
 * @property {Observable<string>|string} [placeSelf] - CSS place-self
 * @property {Observable<string>|string} [place-self] - CSS place-self (kebab-case)
 * @property {Observable<'auto'|'none'|'all'|'fill'|'painted'|'stroke'|'visible'|'visibleFill'|'visiblePainted'|'visibleStroke'|string>|'auto'|'none'|'all'|'fill'|'painted'|'stroke'|'visible'|'visibleFill'|'visiblePainted'|'visibleStroke'|string} [pointerEvents] - CSS pointer-events
 * @property {Observable<'auto'|'none'|'all'|'fill'|'painted'|'stroke'|'visible'|'visibleFill'|'visiblePainted'|'visibleStroke'|string>|'auto'|'none'|'all'|'fill'|'painted'|'stroke'|'visible'|'visibleFill'|'visiblePainted'|'visibleStroke'|string} [pointer-events] - CSS pointer-events (kebab-case)
 * @property {Observable<'static'|'relative'|'absolute'|'fixed'|'sticky'|string>|'static'|'relative'|'absolute'|'fixed'|'sticky'|string} [position] - CSS position
 * @property {Observable<string>|string} [printColorAdjust] - CSS print-color-adjust
 * @property {Observable<string>|string} [print-color-adjust] - CSS print-color-adjust (kebab-case)
 * @property {Observable<string>|string} [quotes] - CSS quotes
 * @property {Observable<'none'|'both'|'horizontal'|'vertical'|'block'|'inline'|string>|'none'|'both'|'horizontal'|'vertical'|'block'|'inline'|string} [resize] - CSS resize
 * @property {Observable<string>|string} [right] - CSS right
 * @property {Observable<string>|string} [rotate] - CSS rotate
 * @property {Observable<string>|string} [rowGap] - CSS row-gap
 * @property {Observable<string>|string} [row-gap] - CSS row-gap (kebab-case)
 * @property {Observable<string>|string} [scale] - CSS scale
 * @property {Observable<'auto'|'smooth'|string>|'auto'|'smooth'|string} [scrollBehavior] - CSS scroll-behavior
 * @property {Observable<'auto'|'smooth'|string>|'auto'|'smooth'|string} [scroll-behavior] - CSS scroll-behavior (kebab-case)
 * @property {Observable<string>|string} [scrollMargin] - CSS scroll-margin
 * @property {Observable<string>|string} [scroll-margin] - CSS scroll-margin (kebab-case)
 * @property {Observable<string>|string} [scrollPadding] - CSS scroll-padding
 * @property {Observable<string>|string} [scroll-padding] - CSS scroll-padding (kebab-case)
 * @property {Observable<'none'|'start'|'end'|'center'|string>|'none'|'start'|'end'|'center'|string} [scrollSnapAlign] - CSS scroll-snap-align
 * @property {Observable<'none'|'start'|'end'|'center'|string>|'none'|'start'|'end'|'center'|string} [scroll-snap-align] - CSS scroll-snap-align (kebab-case)
 * @property {Observable<'normal'|'always'|string>|'normal'|'always'|string} [scrollSnapStop] - CSS scroll-snap-stop
 * @property {Observable<'normal'|'always'|string>|'normal'|'always'|string} [scroll-snap-stop] - CSS scroll-snap-stop (kebab-case)
 * @property {Observable<'none'|'x'|'y'|'block'|'inline'|'both'|string>|'none'|'x'|'y'|'block'|'inline'|'both'|string} [scrollSnapType] - CSS scroll-snap-type
 * @property {Observable<'none'|'x'|'y'|'block'|'inline'|'both'|string>|'none'|'x'|'y'|'block'|'inline'|'both'|string} [scroll-snap-type] - CSS scroll-snap-type (kebab-case)
 * @property {Observable<'auto'|'optimizeSpeed'|'crispEdges'|'geometricPrecision'|string>|'auto'|'optimizeSpeed'|'crispEdges'|'geometricPrecision'|string} [shapeRendering] - CSS shape-rendering
 * @property {Observable<'auto'|'optimizeSpeed'|'crispEdges'|'geometricPrecision'|string>|'auto'|'optimizeSpeed'|'crispEdges'|'geometricPrecision'|string} [shape-rendering] - CSS shape-rendering (kebab-case)
 * @property {Observable<string>|string} [stroke] - CSS stroke
 * @property {Observable<string>|string} [strokeDasharray] - CSS stroke-dasharray
 * @property {Observable<string>|string} [stroke-dasharray] - CSS stroke-dasharray (kebab-case)
 * @property {Observable<string>|string} [strokeDashoffset] - CSS stroke-dashoffset
 * @property {Observable<string>|string} [stroke-dashoffset] - CSS stroke-dashoffset (kebab-case)
 * @property {Observable<'butt'|'round'|'square'|string>|'butt'|'round'|'square'|string} [strokeLinecap] - CSS stroke-linecap
 * @property {Observable<'butt'|'round'|'square'|string>|'butt'|'round'|'square'|string} [stroke-linecap] - CSS stroke-linecap (kebab-case)
 * @property {Observable<'miter'|'round'|'bevel'|string>|'miter'|'round'|'bevel'|string} [strokeLinejoin] - CSS stroke-linejoin
 * @property {Observable<'miter'|'round'|'bevel'|string>|'miter'|'round'|'bevel'|string} [stroke-linejoin] - CSS stroke-linejoin (kebab-case)
 * @property {Observable<string>|string} [strokeMiterlimit] - CSS stroke-miterlimit
 * @property {Observable<string>|string} [stroke-miterlimit] - CSS stroke-miterlimit (kebab-case)
 * @property {Observable<string>|string} [strokeOpacity] - CSS stroke-opacity
 * @property {Observable<string>|string} [stroke-opacity] - CSS stroke-opacity (kebab-case)
 * @property {Observable<string>|string} [strokeWidth] - CSS stroke-width
 * @property {Observable<string>|string} [stroke-width] - CSS stroke-width (kebab-case)
 * @property {Observable<string>|string} [tabSize] - CSS tab-size
 * @property {Observable<string>|string} [tab-size] - CSS tab-size (kebab-case)
 * @property {Observable<'auto'|'fixed'|string>|'auto'|'fixed'|string} [tableLayout] - CSS table-layout
 * @property {Observable<'auto'|'fixed'|string>|'auto'|'fixed'|string} [table-layout] - CSS table-layout (kebab-case)
 * @property {Observable<'left'|'right'|'center'|'justify'|'start'|'end'|'justify-all'|'match-parent'|string>|'left'|'right'|'center'|'justify'|'start'|'end'|'justify-all'|'match-parent'|string} [textAlign] - CSS text-align
 * @property {Observable<'left'|'right'|'center'|'justify'|'start'|'end'|'justify-all'|'match-parent'|string>|'left'|'right'|'center'|'justify'|'start'|'end'|'justify-all'|'match-parent'|string} [text-align] - CSS text-align (kebab-case)
 * @property {Observable<'auto'|'left'|'right'|'center'|'justify'|'start'|'end'|string>|'auto'|'left'|'right'|'center'|'justify'|'start'|'end'|string} [textAlignLast] - CSS text-align-last
 * @property {Observable<'auto'|'left'|'right'|'center'|'justify'|'start'|'end'|string>|'auto'|'left'|'right'|'center'|'justify'|'start'|'end'|string} [text-align-last] - CSS text-align-last (kebab-case)
 * @property {Observable<'start'|'middle'|'end'|string>|'start'|'middle'|'end'|string} [textAnchor] - CSS text-anchor
 * @property {Observable<'start'|'middle'|'end'|string>|'start'|'middle'|'end'|string} [text-anchor] - CSS text-anchor (kebab-case)
 * @property {Observable<'none'|'underline'|'overline'|'line-through'|string>|'none'|'underline'|'overline'|'line-through'|string} [textDecoration] - CSS text-decoration
 * @property {Observable<'none'|'underline'|'overline'|'line-through'|string>|'none'|'underline'|'overline'|'line-through'|string} [text-decoration] - CSS text-decoration (kebab-case)
 * @property {Observable<string>|string} [textDecorationColor] - CSS text-decoration-color
 * @property {Observable<string>|string} [text-decoration-color] - CSS text-decoration-color (kebab-case)
 * @property {Observable<'none'|'underline'|'overline'|'line-through'|'blink'|string>|'none'|'underline'|'overline'|'line-through'|'blink'|string} [textDecorationLine] - CSS text-decoration-line
 * @property {Observable<'none'|'underline'|'overline'|'line-through'|'blink'|string>|'none'|'underline'|'overline'|'line-through'|'blink'|string} [text-decoration-line] - CSS text-decoration-line (kebab-case)
 * @property {Observable<'solid'|'double'|'dotted'|'dashed'|'wavy'|string>|'solid'|'double'|'dotted'|'dashed'|'wavy'|string} [textDecorationStyle] - CSS text-decoration-style
 * @property {Observable<'solid'|'double'|'dotted'|'dashed'|'wavy'|string>|'solid'|'double'|'dotted'|'dashed'|'wavy'|string} [text-decoration-style] - CSS text-decoration-style (kebab-case)
 * @property {Observable<string>|string} [textDecorationThickness] - CSS text-decoration-thickness
 * @property {Observable<string>|string} [text-decoration-thickness] - CSS text-decoration-thickness (kebab-case)
 * @property {Observable<string>|string} [textIndent] - CSS text-indent
 * @property {Observable<string>|string} [text-indent] - CSS text-indent (kebab-case)
 * @property {Observable<'clip'|'ellipsis'|string>|'clip'|'ellipsis'|string} [textOverflow] - CSS text-overflow
 * @property {Observable<'clip'|'ellipsis'|string>|'clip'|'ellipsis'|string} [text-overflow] - CSS text-overflow (kebab-case)
 * @property {Observable<'auto'|'optimizeSpeed'|'optimizeLegibility'|'geometricPrecision'|string>|'auto'|'optimizeSpeed'|'optimizeLegibility'|'geometricPrecision'|string} [textRendering] - CSS text-rendering
 * @property {Observable<'auto'|'optimizeSpeed'|'optimizeLegibility'|'geometricPrecision'|string>|'auto'|'optimizeSpeed'|'optimizeLegibility'|'geometricPrecision'|string} [text-rendering] - CSS text-rendering (kebab-case)
 * @property {Observable<string>|string} [textShadow] - CSS text-shadow
 * @property {Observable<string>|string} [text-shadow] - CSS text-shadow (kebab-case)
 * @property {Observable<string>|string} [textSizeAdjust] - CSS text-size-adjust
 * @property {Observable<string>|string} [text-size-adjust] - CSS text-size-adjust (kebab-case)
 * @property {Observable<'none'|'uppercase'|'lowercase'|'capitalize'|'full-width'|string>|'none'|'uppercase'|'lowercase'|'capitalize'|'full-width'|string} [textTransform] - CSS text-transform
 * @property {Observable<'none'|'uppercase'|'lowercase'|'capitalize'|'full-width'|string>|'none'|'uppercase'|'lowercase'|'capitalize'|'full-width'|string} [text-transform] - CSS text-transform (kebab-case)
 * @property {Observable<string>|string} [textUnderlineOffset] - CSS text-underline-offset
 * @property {Observable<string>|string} [text-underline-offset] - CSS text-underline-offset (kebab-case)
 * @property {Observable<'wrap'|'nowrap'|'balance'|'pretty'|'stable'|string>|'wrap'|'nowrap'|'balance'|'pretty'|'stable'|string} [textWrap] - CSS text-wrap
 * @property {Observable<'wrap'|'nowrap'|'balance'|'pretty'|'stable'|string>|'wrap'|'nowrap'|'balance'|'pretty'|'stable'|string} [text-wrap] - CSS text-wrap (kebab-case)
 * @property {Observable<string>|string} [top] - CSS top
 * @property {Observable<'auto'|'none'|'pan-x'|'pan-y'|'pan-left'|'pan-right'|'pan-up'|'pan-down'|'pinch-zoom'|'manipulation'|string>|'auto'|'none'|'pan-x'|'pan-y'|'pan-left'|'pan-right'|'pan-up'|'pan-down'|'pinch-zoom'|'manipulation'|string} [touchAction] - CSS touch-action
 * @property {Observable<'auto'|'none'|'pan-x'|'pan-y'|'pan-left'|'pan-right'|'pan-up'|'pan-down'|'pinch-zoom'|'manipulation'|string>|'auto'|'none'|'pan-x'|'pan-y'|'pan-left'|'pan-right'|'pan-up'|'pan-down'|'pinch-zoom'|'manipulation'|string} [touch-action] - CSS touch-action (kebab-case)
 * @property {Observable<string>|string} [transform] - CSS transform
 * @property {Observable<'content-box'|'border-box'|'fill-box'|'stroke-box'|'view-box'|string>|'content-box'|'border-box'|'fill-box'|'stroke-box'|'view-box'|string} [transformBox] - CSS transform-box
 * @property {Observable<'content-box'|'border-box'|'fill-box'|'stroke-box'|'view-box'|string>|'content-box'|'border-box'|'fill-box'|'stroke-box'|'view-box'|string} [transform-box] - CSS transform-box (kebab-case)
 * @property {Observable<string>|string} [transformOrigin] - CSS transform-origin
 * @property {Observable<string>|string} [transform-origin] - CSS transform-origin (kebab-case)
 * @property {Observable<'flat'|'preserve-3d'|string>|'flat'|'preserve-3d'|string} [transformStyle] - CSS transform-style
 * @property {Observable<'flat'|'preserve-3d'|string>|'flat'|'preserve-3d'|string} [transform-style] - CSS transform-style (kebab-case)
 * @property {Observable<string>|string} [transition] - CSS transition
 * @property {Observable<string>|string} [transitionBehavior] - CSS transition-behavior
 * @property {Observable<string>|string} [transition-behavior] - CSS transition-behavior (kebab-case)
 * @property {Observable<string>|string} [transitionDelay] - CSS transition-delay
 * @property {Observable<string>|string} [transition-delay] - CSS transition-delay (kebab-case)
 * @property {Observable<string>|string} [transitionDuration] - CSS transition-duration
 * @property {Observable<string>|string} [transition-duration] - CSS transition-duration (kebab-case)
 * @property {Observable<string>|string} [transitionProperty] - CSS transition-property
 * @property {Observable<string>|string} [transition-property] - CSS transition-property (kebab-case)
 * @property {Observable<'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string>|'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string} [transitionTimingFunction] - CSS transition-timing-function
 * @property {Observable<'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string>|'linear'|'ease'|'ease-in'|'ease-out'|'ease-in-out'|'step-start'|'step-end'|string} [transition-timing-function] - CSS transition-timing-function (kebab-case)
 * @property {Observable<string>|string} [translate] - CSS translate
 * @property {Observable<'normal'|'embed'|'bidi-override'|'isolate'|'isolate-override'|'plaintext'|string>|'normal'|'embed'|'bidi-override'|'isolate'|'isolate-override'|'plaintext'|string} [unicodeBidi] - CSS unicode-bidi
 * @property {Observable<'normal'|'embed'|'bidi-override'|'isolate'|'isolate-override'|'plaintext'|string>|'normal'|'embed'|'bidi-override'|'isolate'|'isolate-override'|'plaintext'|string} [unicode-bidi] - CSS unicode-bidi (kebab-case)
 * @property {Observable<'none'|'auto'|'text'|'all'|'contain'|string>|'none'|'auto'|'text'|'all'|'contain'|string} [userSelect] - CSS user-select
 * @property {Observable<'none'|'auto'|'text'|'all'|'contain'|string>|'none'|'auto'|'text'|'all'|'contain'|string} [user-select] - CSS user-select (kebab-case)
 * @property {Observable<'baseline'|'top'|'middle'|'bottom'|'text-top'|'text-bottom'|'sub'|'super'|string>|'baseline'|'top'|'middle'|'bottom'|'text-top'|'text-bottom'|'sub'|'super'|string} [verticalAlign] - CSS vertical-align
 * @property {Observable<'baseline'|'top'|'middle'|'bottom'|'text-top'|'text-bottom'|'sub'|'super'|string>|'baseline'|'top'|'middle'|'bottom'|'text-top'|'text-bottom'|'sub'|'super'|string} [vertical-align] - CSS vertical-align (kebab-case)
 * @property {Observable<'visible'|'hidden'|'collapse'|string>|'visible'|'hidden'|'collapse'|string} [visibility] - CSS visibility
 * @property {Observable<'normal'|'nowrap'|'pre'|'pre-wrap'|'pre-line'|'break-spaces'|string>|'normal'|'nowrap'|'pre'|'pre-wrap'|'pre-line'|'break-spaces'|string} [whiteSpace] - CSS white-space
 * @property {Observable<'normal'|'nowrap'|'pre'|'pre-wrap'|'pre-line'|'break-spaces'|string>|'normal'|'nowrap'|'pre'|'pre-wrap'|'pre-line'|'break-spaces'|string} [white-space] - CSS white-space (kebab-case)
 * @property {Observable<'collapse'|'preserve'|'preserve-breaks'|'preserve-spaces'|'break-spaces'|string>|'collapse'|'preserve'|'preserve-breaks'|'preserve-spaces'|'break-spaces'|string} [whiteSpaceCollapse] - CSS white-space-collapse
 * @property {Observable<'collapse'|'preserve'|'preserve-breaks'|'preserve-spaces'|'break-spaces'|string>|'collapse'|'preserve'|'preserve-breaks'|'preserve-spaces'|'break-spaces'|string} [white-space-collapse] - CSS white-space-collapse (kebab-case)
 * @property {Observable<string>|string} [widows] - CSS widows
 * @property {Observable<string>|string} [width] - CSS width
 * @property {Observable<string>|string} [willChange] - CSS will-change
 * @property {Observable<string>|string} [will-change] - CSS will-change (kebab-case)
 * @property {Observable<'normal'|'break-all'|'keep-all'|'break-word'|string>|'normal'|'break-all'|'keep-all'|'break-word'|string} [wordBreak] - CSS word-break
 * @property {Observable<'normal'|'break-all'|'keep-all'|'break-word'|string>|'normal'|'break-all'|'keep-all'|'break-word'|string} [word-break] - CSS word-break (kebab-case)
 * @property {Observable<string>|string} [wordSpacing] - CSS word-spacing
 * @property {Observable<string>|string} [word-spacing] - CSS word-spacing (kebab-case)
 * @property {Observable<'normal'|'break-word'|'anywhere'|string>|'normal'|'break-word'|'anywhere'|string} [wordWrap] - CSS word-wrap
 * @property {Observable<'normal'|'break-word'|'anywhere'|string>|'normal'|'break-word'|'anywhere'|string} [word-wrap] - CSS word-wrap (kebab-case)
 * @property {Observable<'horizontal-tb'|'vertical-rl'|'vertical-lr'|'sideways-rl'|'sideways-lr'|string>|'horizontal-tb'|'vertical-rl'|'vertical-lr'|'sideways-rl'|'sideways-lr'|string} [writingMode] - CSS writing-mode
 * @property {Observable<'horizontal-tb'|'vertical-rl'|'vertical-lr'|'sideways-rl'|'sideways-lr'|string>|'horizontal-tb'|'vertical-rl'|'vertical-lr'|'sideways-rl'|'sideways-lr'|string} [writing-mode] - CSS writing-mode (kebab-case)
 * @property {Observable<string>|string} [zIndex] - CSS z-index
 * @property {Observable<string>|string} [z-index] - CSS z-index (kebab-case)
 */

/**
 * Reactive class binding — maps class names to observable or plain booleans.
 * @typedef {Object.<string, Observable<boolean>|boolean>} NdClassMap
 */

/**
 * Custom data attributes (data-*).
 * Any key prefixed with "data-" is valid. Values are always strings in the DOM.
 * @typedef {Object} NdDataAttributes
 * @property {string} [data-id]          - Element identifier
 * @property {string} [data-name]        - Element name
 * @property {string} [data-value]       - Element value
 * @property {string} [data-type]        - Element type
 * @property {string} [data-index]       - Element index
 * @property {string} [data-key]         - Element key
 * @property {string} [data-label]       - Element label
 * @property {string} [data-title]       - Element title
 * @property {string} [data-href]        - Element href
 * @property {string} [data-src]         - Element src
 * @property {string} [data-target]      - Element target
 * @property {string} [data-action]      - Element action
 * @property {string} [data-method]      - Element method
 * @property {string} [data-url]         - Element url
 * @property {string} [data-route]       - Router route name
 * @property {string} [data-component]   - Component name
 * @property {string} [data-state]       - Component state
 * @property {string} [data-size]        - Element size
 * @property {string} [data-color]       - Element color
 * @property {string} [data-theme]       - Theme name
 * @property {string} [data-variant]     - Variant name
 * @property {string} [data-disabled]    - Disabled state
 * @property {string} [data-active]      - Active state
 * @property {string} [data-selected]    - Selected state
 * @property {string} [data-checked]     - Checked state
 * @property {string} [data-open]        - Open state
 * @property {string} [data-visible]     - Visible state
 * @property {string} [data-loading]     - Loading state
 * @property {string} [data-error]       - Error state
 * @property {string} [data-count]       - Item count
 * @property {string} [data-total]       - Total count
 * @property {string} [data-page]        - Page number
 * @property {string} [data-step]        - Step number
 * @property {string} [data-min]         - Minimum value
 * @property {string} [data-max]         - Maximum value
 * @property {string} [data-format]      - Data format
 * @property {string} [data-locale]      - Locale string
 * @property {string} [data-tooltip]     - Tooltip content
 * @property {string} [data-placement]   - Tooltip/popover placement
 * @property {string} [data-trigger]     - Trigger type
 * @property {string} [data-toggle]      - Toggle target
 * @property {string} [data-dismiss]     - Dismiss target
 * @property {string} [data-testid]      - Test identifier
 * @property {string} [data-cy]          - Cypress test identifier
 */

/**
 * ARIA accessibility attributes.
 * @typedef {Object} NdAriaAttributes
 * @property {'alert'alertdialog'application'article'banner'button'cell'checkbox'columnheader'combobox'complementary'contentinfo'definition'dialog'directory'document'feed'figure'form'grid'gridcell'group'heading'img'link'list'listbox'listitem'log'main'marquee'math'menu'menubar'menuitem'menuitemcheckbox'menuitemradio'navigation'none'note'option'presentation'progressbar'radio'radiogroup'region'row'rowgroup'rowheader'scrollbar'search'searchbox'separator'slider'spinbutton'status'switch'tab'table'tablist'tabpanel'term'textbox'timer'toolbar'tooltip'tree'treegrid'treeitem'} [role] - ARIA role
 * @property {Observable<string>|string} [aria-activedescendant] - aria-activedescendant
 * @property {Observable<string>|string} [ariaactivedescendant] - aria-activedescendant (camelCase)
 * @property {Observable<string>|string} [aria-atomic] - aria-atomic
 * @property {Observable<string>|string} [ariaatomic] - aria-atomic (camelCase)
 * @property {Observable<string>|string} [aria-autocomplete] - aria-autocomplete
 * @property {Observable<string>|string} [ariaautocomplete] - aria-autocomplete (camelCase)
 * @property {Observable<string>|string} [aria-braillelabel] - aria-braillelabel
 * @property {Observable<string>|string} [ariabraillelabel] - aria-braillelabel (camelCase)
 * @property {Observable<string>|string} [aria-brailleroledescription] - aria-brailleroledescription
 * @property {Observable<string>|string} [ariabrailleroledescription] - aria-brailleroledescription (camelCase)
 * @property {Observable<string>|string} [aria-busy] - aria-busy
 * @property {Observable<string>|string} [ariabusy] - aria-busy (camelCase)
 * @property {Observable<string>|string} [aria-checked] - aria-checked
 * @property {Observable<string>|string} [ariachecked] - aria-checked (camelCase)
 * @property {Observable<string>|string} [aria-colcount] - aria-colcount
 * @property {Observable<string>|string} [ariacolcount] - aria-colcount (camelCase)
 * @property {Observable<string>|string} [aria-colindex] - aria-colindex
 * @property {Observable<string>|string} [ariacolindex] - aria-colindex (camelCase)
 * @property {Observable<string>|string} [aria-colindextext] - aria-colindextext
 * @property {Observable<string>|string} [ariacolindextext] - aria-colindextext (camelCase)
 * @property {Observable<string>|string} [aria-colspan] - aria-colspan
 * @property {Observable<string>|string} [ariacolspan] - aria-colspan (camelCase)
 * @property {Observable<string>|string} [aria-controls] - aria-controls
 * @property {Observable<string>|string} [ariacontrols] - aria-controls (camelCase)
 * @property {Observable<string>|string} [aria-current] - aria-current
 * @property {Observable<string>|string} [ariacurrent] - aria-current (camelCase)
 * @property {Observable<string>|string} [aria-describedby] - aria-describedby
 * @property {Observable<string>|string} [ariadescribedby] - aria-describedby (camelCase)
 * @property {Observable<string>|string} [aria-description] - aria-description
 * @property {Observable<string>|string} [ariadescription] - aria-description (camelCase)
 * @property {Observable<string>|string} [aria-details] - aria-details
 * @property {Observable<string>|string} [ariadetails] - aria-details (camelCase)
 * @property {Observable<string>|string} [aria-disabled] - aria-disabled
 * @property {Observable<string>|string} [ariadisabled] - aria-disabled (camelCase)
 * @property {Observable<string>|string} [aria-dropeffect] - aria-dropeffect
 * @property {Observable<string>|string} [ariadropeffect] - aria-dropeffect (camelCase)
 * @property {Observable<string>|string} [aria-errormessage] - aria-errormessage
 * @property {Observable<string>|string} [ariaerrormessage] - aria-errormessage (camelCase)
 * @property {Observable<string>|string} [aria-expanded] - aria-expanded
 * @property {Observable<string>|string} [ariaexpanded] - aria-expanded (camelCase)
 * @property {Observable<string>|string} [aria-flowto] - aria-flowto
 * @property {Observable<string>|string} [ariaflowto] - aria-flowto (camelCase)
 * @property {Observable<string>|string} [aria-grabbed] - aria-grabbed
 * @property {Observable<string>|string} [ariagrabbed] - aria-grabbed (camelCase)
 * @property {Observable<string>|string} [aria-haspopup] - aria-haspopup
 * @property {Observable<string>|string} [ariahaspopup] - aria-haspopup (camelCase)
 * @property {Observable<string>|string} [aria-hidden] - aria-hidden
 * @property {Observable<string>|string} [ariahidden] - aria-hidden (camelCase)
 * @property {Observable<string>|string} [aria-invalid] - aria-invalid
 * @property {Observable<string>|string} [ariainvalid] - aria-invalid (camelCase)
 * @property {Observable<string>|string} [aria-keyshortcuts] - aria-keyshortcuts
 * @property {Observable<string>|string} [ariakeyshortcuts] - aria-keyshortcuts (camelCase)
 * @property {Observable<string>|string} [aria-label] - aria-label
 * @property {Observable<string>|string} [arialabel] - aria-label (camelCase)
 * @property {Observable<string>|string} [aria-labelledby] - aria-labelledby
 * @property {Observable<string>|string} [arialabelledby] - aria-labelledby (camelCase)
 * @property {Observable<string>|string} [aria-level] - aria-level
 * @property {Observable<string>|string} [arialevel] - aria-level (camelCase)
 * @property {Observable<string>|string} [aria-live] - aria-live
 * @property {Observable<string>|string} [arialive] - aria-live (camelCase)
 * @property {Observable<string>|string} [aria-modal] - aria-modal
 * @property {Observable<string>|string} [ariamodal] - aria-modal (camelCase)
 * @property {Observable<string>|string} [aria-multiline] - aria-multiline
 * @property {Observable<string>|string} [ariamultiline] - aria-multiline (camelCase)
 * @property {Observable<string>|string} [aria-multiselectable] - aria-multiselectable
 * @property {Observable<string>|string} [ariamultiselectable] - aria-multiselectable (camelCase)
 * @property {Observable<string>|string} [aria-orientation] - aria-orientation
 * @property {Observable<string>|string} [ariaorientation] - aria-orientation (camelCase)
 * @property {Observable<string>|string} [aria-owns] - aria-owns
 * @property {Observable<string>|string} [ariaowns] - aria-owns (camelCase)
 * @property {Observable<string>|string} [aria-placeholder] - aria-placeholder
 * @property {Observable<string>|string} [ariaplaceholder] - aria-placeholder (camelCase)
 * @property {Observable<string>|string} [aria-posinset] - aria-posinset
 * @property {Observable<string>|string} [ariaposinset] - aria-posinset (camelCase)
 * @property {Observable<string>|string} [aria-pressed] - aria-pressed
 * @property {Observable<string>|string} [ariapressed] - aria-pressed (camelCase)
 * @property {Observable<string>|string} [aria-readonly] - aria-readonly
 * @property {Observable<string>|string} [ariareadonly] - aria-readonly (camelCase)
 * @property {Observable<string>|string} [aria-relevant] - aria-relevant
 * @property {Observable<string>|string} [ariarelevant] - aria-relevant (camelCase)
 * @property {Observable<string>|string} [aria-required] - aria-required
 * @property {Observable<string>|string} [ariarequired] - aria-required (camelCase)
 * @property {Observable<string>|string} [aria-roledescription] - aria-roledescription
 * @property {Observable<string>|string} [ariaroledescription] - aria-roledescription (camelCase)
 * @property {Observable<string>|string} [aria-rowcount] - aria-rowcount
 * @property {Observable<string>|string} [ariarowcount] - aria-rowcount (camelCase)
 * @property {Observable<string>|string} [aria-rowindex] - aria-rowindex
 * @property {Observable<string>|string} [ariarowindex] - aria-rowindex (camelCase)
 * @property {Observable<string>|string} [aria-rowindextext] - aria-rowindextext
 * @property {Observable<string>|string} [ariarowindextext] - aria-rowindextext (camelCase)
 * @property {Observable<string>|string} [aria-rowspan] - aria-rowspan
 * @property {Observable<string>|string} [ariarowspan] - aria-rowspan (camelCase)
 * @property {Observable<string>|string} [aria-selected] - aria-selected
 * @property {Observable<string>|string} [ariaselected] - aria-selected (camelCase)
 * @property {Observable<string>|string} [aria-setsize] - aria-setsize
 * @property {Observable<string>|string} [ariasetsize] - aria-setsize (camelCase)
 * @property {Observable<string>|string} [aria-sort] - aria-sort
 * @property {Observable<string>|string} [ariasort] - aria-sort (camelCase)
 * @property {Observable<string>|string} [aria-valuemax] - aria-valuemax
 * @property {Observable<string>|string} [ariavaluemax] - aria-valuemax (camelCase)
 * @property {Observable<string>|string} [aria-valuemin] - aria-valuemin
 * @property {Observable<string>|string} [ariavaluemin] - aria-valuemin (camelCase)
 * @property {Observable<string>|string} [aria-valuenow] - aria-valuenow
 * @property {Observable<string>|string} [ariavaluenow] - aria-valuenow (camelCase)
 * @property {Observable<string>|string} [aria-valuetext] - aria-valuetext
 * @property {Observable<string>|string} [ariavaluetext] - aria-valuetext (camelCase)
 */

/**
 * Global HTML attributes shared by all elements.
 * @typedef {NdDataAttributes & NdAriaAttributes & Object} GlobalAttributes
 * @property {Observable<string>|string}             [id]              - Unique identifier
 * @property {Observable<string>|NdClassMap|string}  [class]           - CSS classes (string or reactive map)
 * @property {Observable<NdStyleMap>|NdStyleMap}     [style]           - Inline styles
 * @property {string}                                [title]           - Tooltip text
 * @property {string}                                [lang]            - Language code
 * @property {string}                                [dir]             - Text direction: 'ltr'|'rtl'|'auto'
 * @property {Observable<boolean>|boolean}           [hidden]          - Hide element
 * @property {Observable<boolean>|boolean}           [draggable]       - Make element draggable
 * @property {Observable<boolean>|boolean}           [contenteditable] - Make content editable
 * @property {Observable<boolean>|boolean}           [contentEditable] - Make content editable (camelCase)
 * @property {string}                                [tabindex]        - Tab order
 * @property {string}                                [tabIndex]        - Tab order (camelCase)
 * @property {string}                                [accesskey]       - Keyboard shortcut
 * @property {string}                                [accessKey]       - Keyboard shortcut (camelCase)
 * @property {Observable<boolean>|boolean}           [spellcheck]      - Enable spellcheck
 * @property {Observable<boolean>|boolean}           [spellCheck]      - Enable spellcheck (camelCase)
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