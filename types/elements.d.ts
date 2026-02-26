// DOM elements and components type definitions
import { ObservableItem } from './observable';
import { BindingHydrator } from "./template-cloner";
import { NDElement } from "./nd-element";

// ─────────────────────────────────────────────
// Base types
// ─────────────────────────────────────────────

export type ValidChild =
    | string
    | number
    | boolean
    | null
    | HTMLElement
    | DocumentFragment
    | Text
    | ObservableItem
    | NDElement
    | BindingHydrator
    | ValidChild[]
    | ((...args: any[]) => ValidChild);

type Observable<T> = ObservableItem<T> | T;

type NdClassMap = Record<string, Observable<boolean>>;
interface NdStyleMap {
    accentColor?: Observable<string> | string;
    'accent-color'?: Observable<string> | string;
    alignContent?: Observable<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' | string> | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' | string;
    'align-content'?: Observable<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' | string> | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch' | 'start' | 'end' | 'baseline' | string;
    alignItems?: Observable<'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string> | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string;
    'align-items'?: Observable<'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string> | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string;
    alignSelf?: Observable<'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string> | 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string;
    'align-self'?: Observable<'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string> | 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | 'start' | 'end' | 'self-start' | 'self-end' | string;
    animation?: Observable<string> | string;
    animationComposition?: Observable<string> | string;
    'animation-composition'?: Observable<string> | string;
    animationDelay?: Observable<string> | string;
    'animation-delay'?: Observable<string> | string;
    animationDirection?: Observable<'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string> | 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string;
    'animation-direction'?: Observable<'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string> | 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' | string;
    animationDuration?: Observable<string> | string;
    'animation-duration'?: Observable<string> | string;
    animationFillMode?: Observable<'none' | 'forwards' | 'backwards' | 'both' | string> | 'none' | 'forwards' | 'backwards' | 'both' | string;
    'animation-fill-mode'?: Observable<'none' | 'forwards' | 'backwards' | 'both' | string> | 'none' | 'forwards' | 'backwards' | 'both' | string;
    animationIterationCount?: Observable<string> | string;
    'animation-iteration-count'?: Observable<string> | string;
    animationName?: Observable<string> | string;
    'animation-name'?: Observable<string> | string;
    animationPlayState?: Observable<'running' | 'paused' | string> | 'running' | 'paused' | string;
    'animation-play-state'?: Observable<'running' | 'paused' | string> | 'running' | 'paused' | string;
    animationTimingFunction?: Observable<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string> | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string;
    'animation-timing-function'?: Observable<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string> | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string;
    appearance?: Observable<'none' | 'auto' | 'button' | 'textfield' | 'menulist' | string> | 'none' | 'auto' | 'button' | 'textfield' | 'menulist' | string;
    aspectRatio?: Observable<string> | string;
    'aspect-ratio'?: Observable<string> | string;
    backdropFilter?: Observable<string> | string;
    'backdrop-filter'?: Observable<string> | string;
    backfaceVisibility?: Observable<'visible' | 'hidden' | string> | 'visible' | 'hidden' | string;
    'backface-visibility'?: Observable<'visible' | 'hidden' | string> | 'visible' | 'hidden' | string;
    background?: Observable<string> | string;
    backgroundAttachment?: Observable<'scroll' | 'fixed' | 'local' | string> | 'scroll' | 'fixed' | 'local' | string;
    'background-attachment'?: Observable<'scroll' | 'fixed' | 'local' | string> | 'scroll' | 'fixed' | 'local' | string;
    backgroundBlendMode?: Observable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string> | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string;
    'background-blend-mode'?: Observable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string> | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string;
    backgroundClip?: Observable<'border-box' | 'padding-box' | 'content-box' | 'text' | string> | 'border-box' | 'padding-box' | 'content-box' | 'text' | string;
    'background-clip'?: Observable<'border-box' | 'padding-box' | 'content-box' | 'text' | string> | 'border-box' | 'padding-box' | 'content-box' | 'text' | string;
    backgroundColor?: Observable<string> | string;
    'background-color'?: Observable<string> | string;
    backgroundImage?: Observable<string> | string;
    'background-image'?: Observable<string> | string;
    backgroundOrigin?: Observable<'border-box' | 'padding-box' | 'content-box' | string> | 'border-box' | 'padding-box' | 'content-box' | string;
    'background-origin'?: Observable<'border-box' | 'padding-box' | 'content-box' | string> | 'border-box' | 'padding-box' | 'content-box' | string;
    backgroundPosition?: Observable<string> | string;
    'background-position'?: Observable<string> | string;
    backgroundPositionX?: Observable<string> | string;
    'background-position-x'?: Observable<string> | string;
    backgroundPositionY?: Observable<string> | string;
    'background-position-y'?: Observable<string> | string;
    backgroundRepeat?: Observable<'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | string> | 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | string;
    'background-repeat'?: Observable<'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | string> | 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'round' | 'space' | string;
    backgroundSize?: Observable<'cover' | 'contain' | 'auto' | string> | 'cover' | 'contain' | 'auto' | string;
    'background-size'?: Observable<'cover' | 'contain' | 'auto' | string> | 'cover' | 'contain' | 'auto' | string;
    border?: Observable<string> | string;
    borderBlock?: Observable<string> | string;
    'border-block'?: Observable<string> | string;
    borderBlockEnd?: Observable<string> | string;
    'border-block-end'?: Observable<string> | string;
    borderBlockStart?: Observable<string> | string;
    'border-block-start'?: Observable<string> | string;
    borderBottom?: Observable<string> | string;
    'border-bottom'?: Observable<string> | string;
    borderBottomColor?: Observable<string> | string;
    'border-bottom-color'?: Observable<string> | string;
    borderBottomLeftRadius?: Observable<string> | string;
    'border-bottom-left-radius'?: Observable<string> | string;
    borderBottomRightRadius?: Observable<string> | string;
    'border-bottom-right-radius'?: Observable<string> | string;
    borderBottomStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'border-bottom-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    borderBottomWidth?: Observable<string> | string;
    'border-bottom-width'?: Observable<string> | string;
    borderCollapse?: Observable<'collapse' | 'separate' | string> | 'collapse' | 'separate' | string;
    'border-collapse'?: Observable<'collapse' | 'separate' | string> | 'collapse' | 'separate' | string;
    borderColor?: Observable<string> | string;
    'border-color'?: Observable<string> | string;
    borderEndEndRadius?: Observable<string> | string;
    'border-end-end-radius'?: Observable<string> | string;
    borderEndStartRadius?: Observable<string> | string;
    'border-end-start-radius'?: Observable<string> | string;
    borderImage?: Observable<string> | string;
    'border-image'?: Observable<string> | string;
    borderImageOutset?: Observable<string> | string;
    'border-image-outset'?: Observable<string> | string;
    borderImageRepeat?: Observable<'stretch' | 'repeat' | 'round' | 'space' | string> | 'stretch' | 'repeat' | 'round' | 'space' | string;
    'border-image-repeat'?: Observable<'stretch' | 'repeat' | 'round' | 'space' | string> | 'stretch' | 'repeat' | 'round' | 'space' | string;
    borderImageSlice?: Observable<string> | string;
    'border-image-slice'?: Observable<string> | string;
    borderImageSource?: Observable<string> | string;
    'border-image-source'?: Observable<string> | string;
    borderImageWidth?: Observable<string> | string;
    'border-image-width'?: Observable<string> | string;
    borderInline?: Observable<string> | string;
    'border-inline'?: Observable<string> | string;
    borderInlineEnd?: Observable<string> | string;
    'border-inline-end'?: Observable<string> | string;
    borderInlineStart?: Observable<string> | string;
    'border-inline-start'?: Observable<string> | string;
    borderLeft?: Observable<string> | string;
    'border-left'?: Observable<string> | string;
    borderLeftColor?: Observable<string> | string;
    'border-left-color'?: Observable<string> | string;
    borderLeftStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'border-left-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    borderLeftWidth?: Observable<string> | string;
    'border-left-width'?: Observable<string> | string;
    borderRadius?: Observable<string> | string;
    'border-radius'?: Observable<string> | string;
    borderRight?: Observable<string> | string;
    'border-right'?: Observable<string> | string;
    borderRightColor?: Observable<string> | string;
    'border-right-color'?: Observable<string> | string;
    borderRightStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'border-right-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    borderRightWidth?: Observable<string> | string;
    'border-right-width'?: Observable<string> | string;
    borderSpacing?: Observable<string> | string;
    'border-spacing'?: Observable<string> | string;
    borderStartEndRadius?: Observable<string> | string;
    'border-start-end-radius'?: Observable<string> | string;
    borderStartStartRadius?: Observable<string> | string;
    'border-start-start-radius'?: Observable<string> | string;
    borderStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'border-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    borderTop?: Observable<string> | string;
    'border-top'?: Observable<string> | string;
    borderTopColor?: Observable<string> | string;
    'border-top-color'?: Observable<string> | string;
    borderTopLeftRadius?: Observable<string> | string;
    'border-top-left-radius'?: Observable<string> | string;
    borderTopRightRadius?: Observable<string> | string;
    'border-top-right-radius'?: Observable<string> | string;
    borderTopStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'border-top-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    borderTopWidth?: Observable<string> | string;
    'border-top-width'?: Observable<string> | string;
    borderWidth?: Observable<string> | string;
    'border-width'?: Observable<string> | string;
    bottom?: Observable<string> | string;
    boxDecorationBreak?: Observable<'slice' | 'clone' | string> | 'slice' | 'clone' | string;
    'box-decoration-break'?: Observable<'slice' | 'clone' | string> | 'slice' | 'clone' | string;
    boxShadow?: Observable<string> | string;
    'box-shadow'?: Observable<string> | string;
    boxSizing?: Observable<'border-box' | 'content-box' | string> | 'border-box' | 'content-box' | string;
    'box-sizing'?: Observable<'border-box' | 'content-box' | string> | 'border-box' | 'content-box' | string;
    breakAfter?: Observable<'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string> | 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string;
    'break-after'?: Observable<'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string> | 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string;
    breakBefore?: Observable<'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string> | 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string;
    'break-before'?: Observable<'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string> | 'auto' | 'avoid' | 'always' | 'all' | 'avoid-page' | 'page' | 'left' | 'right' | 'column' | string;
    breakInside?: Observable<'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | string> | 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | string;
    'break-inside'?: Observable<'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | string> | 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | string;
    captionSide?: Observable<'top' | 'bottom' | 'block-start' | 'block-end' | 'inline-start' | 'inline-end' | string> | 'top' | 'bottom' | 'block-start' | 'block-end' | 'inline-start' | 'inline-end' | string;
    'caption-side'?: Observable<'top' | 'bottom' | 'block-start' | 'block-end' | 'inline-start' | 'inline-end' | string> | 'top' | 'bottom' | 'block-start' | 'block-end' | 'inline-start' | 'inline-end' | string;
    caretColor?: Observable<string> | string;
    'caret-color'?: Observable<string> | string;
    clear?: Observable<'left' | 'right' | 'both' | 'none' | 'inline-start' | 'inline-end' | string> | 'left' | 'right' | 'both' | 'none' | 'inline-start' | 'inline-end' | string;
    clipPath?: Observable<string> | string;
    'clip-path'?: Observable<string> | string;
    clipRule?: Observable<'nonzero' | 'evenodd' | string> | 'nonzero' | 'evenodd' | string;
    'clip-rule'?: Observable<'nonzero' | 'evenodd' | string> | 'nonzero' | 'evenodd' | string;
    color?: Observable<string> | string;
    colorRendering?: Observable<'auto' | 'optimizeSpeed' | 'optimizeQuality' | string> | 'auto' | 'optimizeSpeed' | 'optimizeQuality' | string;
    'color-rendering'?: Observable<'auto' | 'optimizeSpeed' | 'optimizeQuality' | string> | 'auto' | 'optimizeSpeed' | 'optimizeQuality' | string;
    colorScheme?: Observable<'normal' | 'light' | 'dark' | 'light dark' | string> | 'normal' | 'light' | 'dark' | 'light dark' | string;
    'color-scheme'?: Observable<'normal' | 'light' | 'dark' | 'light dark' | string> | 'normal' | 'light' | 'dark' | 'light dark' | string;
    columnCount?: Observable<string | number> | string | number;
    'column-count'?: Observable<string | number> | string | number;
    columnFill?: Observable<'balance' | 'auto' | 'balance-all' | string> | 'balance' | 'auto' | 'balance-all' | string;
    'column-fill'?: Observable<'balance' | 'auto' | 'balance-all' | string> | 'balance' | 'auto' | 'balance-all' | string;
    columnGap?: Observable<string> | string;
    'column-gap'?: Observable<string> | string;
    columnRule?: Observable<string> | string;
    'column-rule'?: Observable<string> | string;
    columnRuleColor?: Observable<string> | string;
    'column-rule-color'?: Observable<string> | string;
    columnRuleStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'column-rule-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    columnRuleWidth?: Observable<string> | string;
    'column-rule-width'?: Observable<string> | string;
    columnSpan?: Observable<'none' | 'all' | string> | 'none' | 'all' | string;
    'column-span'?: Observable<'none' | 'all' | string> | 'none' | 'all' | string;
    columnWidth?: Observable<string> | string;
    'column-width'?: Observable<string> | string;
    columns?: Observable<string> | string;
    contain?: Observable<'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | string> | 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | string;
    content?: Observable<string> | string;
    contentVisibility?: Observable<'visible' | 'hidden' | 'auto' | string> | 'visible' | 'hidden' | 'auto' | string;
    'content-visibility'?: Observable<'visible' | 'hidden' | 'auto' | string> | 'visible' | 'hidden' | 'auto' | string;
    counterIncrement?: Observable<string> | string;
    'counter-increment'?: Observable<string> | string;
    counterReset?: Observable<string> | string;
    'counter-reset'?: Observable<string> | string;
    counterSet?: Observable<string> | string;
    'counter-set'?: Observable<string> | string;
    cursor?: Observable<'auto' | 'default' | 'none' | 'pointer' | 'crosshair' | 'move' | 'grab' | 'grabbing' | 'text' | 'wait' | 'help' | 'progress' | 'not-allowed' | 'no-drop' | 'copy' | 'alias' | 'zoom-in' | 'zoom-out' | 'col-resize' | 'row-resize' | 'n-resize' | 's-resize' | 'e-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'cell' | 'context-menu' | 'vertical-text' | string> | 'auto' | 'default' | 'none' | 'pointer' | 'crosshair' | 'move' | 'grab' | 'grabbing' | 'text' | 'wait' | 'help' | 'progress' | 'not-allowed' | 'no-drop' | 'copy' | 'alias' | 'zoom-in' | 'zoom-out' | 'col-resize' | 'row-resize' | 'n-resize' | 's-resize' | 'e-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'cell' | 'context-menu' | 'vertical-text' | string;
    direction?: Observable<'ltr' | 'rtl' | string> | 'ltr' | 'rtl' | string;
    display?: Observable<'block' | 'flex' | 'grid' | 'inline' | 'inline-flex' | 'inline-block' | 'inline-grid' | 'none' | 'contents' | 'table' | 'table-cell' | 'table-row' | 'list-item' | 'flow-root' | string> | 'block' | 'flex' | 'grid' | 'inline' | 'inline-flex' | 'inline-block' | 'inline-grid' | 'none' | 'contents' | 'table' | 'table-cell' | 'table-row' | 'list-item' | 'flow-root' | string;
    dominantBaseline?: Observable<'auto' | 'middle' | 'central' | 'text-before-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | string> | 'auto' | 'middle' | 'central' | 'text-before-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | string;
    'dominant-baseline'?: Observable<'auto' | 'middle' | 'central' | 'text-before-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | string> | 'auto' | 'middle' | 'central' | 'text-before-edge' | 'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | string;
    emptyCells?: Observable<'show' | 'hide' | string> | 'show' | 'hide' | string;
    'empty-cells'?: Observable<'show' | 'hide' | string> | 'show' | 'hide' | string;
    fill?: Observable<string> | string;
    fillOpacity?: Observable<string | number> | string | number;
    'fill-opacity'?: Observable<string | number> | string | number;
    fillRule?: Observable<'nonzero' | 'evenodd' | string> | 'nonzero' | 'evenodd' | string;
    'fill-rule'?: Observable<'nonzero' | 'evenodd' | string> | 'nonzero' | 'evenodd' | string;
    filter?: Observable<string> | string;
    flex?: Observable<string> | string;
    flexBasis?: Observable<string> | string;
    'flex-basis'?: Observable<string> | string;
    flexDirection?: Observable<'row' | 'column' | 'row-reverse' | 'column-reverse' | string> | 'row' | 'column' | 'row-reverse' | 'column-reverse' | string;
    'flex-direction'?: Observable<'row' | 'column' | 'row-reverse' | 'column-reverse' | string> | 'row' | 'column' | 'row-reverse' | 'column-reverse' | string;
    flexFlow?: Observable<string> | string;
    'flex-flow'?: Observable<string> | string;
    flexGrow?: Observable<string | number> | string | number;
    'flex-grow'?: Observable<string | number> | string | number;
    flexShrink?: Observable<string | number> | string | number;
    'flex-shrink'?: Observable<string | number> | string | number;
    flexWrap?: Observable<'nowrap' | 'wrap' | 'wrap-reverse' | string> | 'nowrap' | 'wrap' | 'wrap-reverse' | string;
    'flex-wrap'?: Observable<'nowrap' | 'wrap' | 'wrap-reverse' | string> | 'nowrap' | 'wrap' | 'wrap-reverse' | string;
    float?: Observable<'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | string> | 'left' | 'right' | 'none' | 'inline-start' | 'inline-end' | string;
    font?: Observable<string> | string;
    fontFamily?: Observable<string> | string;
    'font-family'?: Observable<string> | string;
    fontFeatureSettings?: Observable<string> | string;
    'font-feature-settings'?: Observable<string> | string;
    fontKerning?: Observable<'auto' | 'normal' | 'none' | string> | 'auto' | 'normal' | 'none' | string;
    'font-kerning'?: Observable<'auto' | 'normal' | 'none' | string> | 'auto' | 'normal' | 'none' | string;
    fontOpticalSizing?: Observable<'auto' | 'none' | string> | 'auto' | 'none' | string;
    'font-optical-sizing'?: Observable<'auto' | 'none' | string> | 'auto' | 'none' | string;
    fontSize?: Observable<string> | string;
    'font-size'?: Observable<string> | string;
    fontSizeAdjust?: Observable<string> | string;
    'font-size-adjust'?: Observable<string> | string;
    fontStretch?: Observable<'normal' | 'condensed' | 'expanded' | 'ultra-condensed' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-expanded' | string> | 'normal' | 'condensed' | 'expanded' | 'ultra-condensed' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-expanded' | string;
    'font-stretch'?: Observable<'normal' | 'condensed' | 'expanded' | 'ultra-condensed' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-expanded' | string> | 'normal' | 'condensed' | 'expanded' | 'ultra-condensed' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-expanded' | string;
    fontStyle?: Observable<'normal' | 'italic' | 'oblique' | string> | 'normal' | 'italic' | 'oblique' | string;
    'font-style'?: Observable<'normal' | 'italic' | 'oblique' | string> | 'normal' | 'italic' | 'oblique' | string;
    fontVariant?: Observable<'normal' | 'small-caps' | string> | 'normal' | 'small-caps' | string;
    'font-variant'?: Observable<'normal' | 'small-caps' | string> | 'normal' | 'small-caps' | string;
    fontVariationSettings?: Observable<string> | string;
    'font-variation-settings'?: Observable<string> | string;
    fontWeight?: Observable<'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string> | 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string;
    'font-weight'?: Observable<'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string> | 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string;
    forcedColorAdjust?: Observable<'auto' | 'none' | string> | 'auto' | 'none' | string;
    'forced-color-adjust'?: Observable<'auto' | 'none' | string> | 'auto' | 'none' | string;
    gap?: Observable<string> | string;
    grid?: Observable<string> | string;
    gridArea?: Observable<string> | string;
    'grid-area'?: Observable<string> | string;
    gridAutoColumns?: Observable<string> | string;
    'grid-auto-columns'?: Observable<string> | string;
    gridAutoFlow?: Observable<'row' | 'column' | 'dense' | 'row dense' | 'column dense' | string> | 'row' | 'column' | 'dense' | 'row dense' | 'column dense' | string;
    'grid-auto-flow'?: Observable<'row' | 'column' | 'dense' | 'row dense' | 'column dense' | string> | 'row' | 'column' | 'dense' | 'row dense' | 'column dense' | string;
    gridAutoRows?: Observable<string> | string;
    'grid-auto-rows'?: Observable<string> | string;
    gridColumn?: Observable<string> | string;
    'grid-column'?: Observable<string> | string;
    gridColumnEnd?: Observable<string> | string;
    'grid-column-end'?: Observable<string> | string;
    gridColumnStart?: Observable<string> | string;
    'grid-column-start'?: Observable<string> | string;
    gridRow?: Observable<string> | string;
    'grid-row'?: Observable<string> | string;
    gridRowEnd?: Observable<string> | string;
    'grid-row-end'?: Observable<string> | string;
    gridRowStart?: Observable<string> | string;
    'grid-row-start'?: Observable<string> | string;
    gridTemplate?: Observable<string> | string;
    'grid-template'?: Observable<string> | string;
    gridTemplateAreas?: Observable<string> | string;
    'grid-template-areas'?: Observable<string> | string;
    gridTemplateColumns?: Observable<string> | string;
    'grid-template-columns'?: Observable<string> | string;
    gridTemplateRows?: Observable<string> | string;
    'grid-template-rows'?: Observable<string> | string;
    height?: Observable<string> | string;
    hyphenateCharacter?: Observable<string> | string;
    'hyphenate-character'?: Observable<string> | string;
    hyphens?: Observable<'none' | 'manual' | 'auto' | string> | 'none' | 'manual' | 'auto' | string;
    imageOrientation?: Observable<'none' | 'from-image' | string> | 'none' | 'from-image' | string;
    'image-orientation'?: Observable<'none' | 'from-image' | string> | 'none' | 'from-image' | string;
    imageRendering?: Observable<'auto' | 'crisp-edges' | 'pixelated' | 'smooth' | string> | 'auto' | 'crisp-edges' | 'pixelated' | 'smooth' | string;
    'image-rendering'?: Observable<'auto' | 'crisp-edges' | 'pixelated' | 'smooth' | string> | 'auto' | 'crisp-edges' | 'pixelated' | 'smooth' | string;
    inset?: Observable<string> | string;
    insetBlock?: Observable<string> | string;
    'inset-block'?: Observable<string> | string;
    insetBlockEnd?: Observable<string> | string;
    'inset-block-end'?: Observable<string> | string;
    insetBlockStart?: Observable<string> | string;
    'inset-block-start'?: Observable<string> | string;
    insetInline?: Observable<string> | string;
    'inset-inline'?: Observable<string> | string;
    insetInlineEnd?: Observable<string> | string;
    'inset-inline-end'?: Observable<string> | string;
    insetInlineStart?: Observable<string> | string;
    'inset-inline-start'?: Observable<string> | string;
    isolation?: Observable<'auto' | 'isolate' | string> | 'auto' | 'isolate' | string;
    justifyContent?: Observable<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch' | string> | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch' | string;
    'justify-content'?: Observable<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch' | string> | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'stretch' | string;
    justifyItems?: Observable<'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string> | 'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string;
    'justify-items'?: Observable<'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string> | 'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string;
    justifySelf?: Observable<'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string> | 'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string;
    'justify-self'?: Observable<'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string> | 'auto' | 'normal' | 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | string;
    left?: Observable<string> | string;
    letterSpacing?: Observable<string> | string;
    'letter-spacing'?: Observable<string> | string;
    lineBreak?: Observable<'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | string> | 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | string;
    'line-break'?: Observable<'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | string> | 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere' | string;
    lineHeight?: Observable<string> | string;
    'line-height'?: Observable<string> | string;
    listStyle?: Observable<string> | string;
    'list-style'?: Observable<string> | string;
    listStyleImage?: Observable<string> | string;
    'list-style-image'?: Observable<string> | string;
    listStylePosition?: Observable<'inside' | 'outside' | string> | 'inside' | 'outside' | string;
    'list-style-position'?: Observable<'inside' | 'outside' | string> | 'inside' | 'outside' | string;
    listStyleType?: Observable<'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero' | 'lower-roman' | 'upper-roman' | 'lower-alpha' | 'upper-alpha' | string> | 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero' | 'lower-roman' | 'upper-roman' | 'lower-alpha' | 'upper-alpha' | string;
    'list-style-type'?: Observable<'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero' | 'lower-roman' | 'upper-roman' | 'lower-alpha' | 'upper-alpha' | string> | 'none' | 'disc' | 'circle' | 'square' | 'decimal' | 'decimal-leading-zero' | 'lower-roman' | 'upper-roman' | 'lower-alpha' | 'upper-alpha' | string;
    margin?: Observable<string> | string;
    marginBlock?: Observable<string> | string;
    'margin-block'?: Observable<string> | string;
    marginBlockEnd?: Observable<string> | string;
    'margin-block-end'?: Observable<string> | string;
    marginBlockStart?: Observable<string> | string;
    'margin-block-start'?: Observable<string> | string;
    marginBottom?: Observable<string> | string;
    'margin-bottom'?: Observable<string> | string;
    marginInline?: Observable<string> | string;
    'margin-inline'?: Observable<string> | string;
    marginInlineEnd?: Observable<string> | string;
    'margin-inline-end'?: Observable<string> | string;
    marginInlineStart?: Observable<string> | string;
    'margin-inline-start'?: Observable<string> | string;
    marginLeft?: Observable<string> | string;
    'margin-left'?: Observable<string> | string;
    marginRight?: Observable<string> | string;
    'margin-right'?: Observable<string> | string;
    marginTop?: Observable<string> | string;
    'margin-top'?: Observable<string> | string;
    markerEnd?: Observable<string> | string;
    'marker-end'?: Observable<string> | string;
    markerMid?: Observable<string> | string;
    'marker-mid'?: Observable<string> | string;
    markerStart?: Observable<string> | string;
    'marker-start'?: Observable<string> | string;
    mask?: Observable<string> | string;
    maskClip?: Observable<string> | string;
    'mask-clip'?: Observable<string> | string;
    maskComposite?: Observable<string> | string;
    'mask-composite'?: Observable<string> | string;
    maskImage?: Observable<string> | string;
    'mask-image'?: Observable<string> | string;
    maskMode?: Observable<string> | string;
    'mask-mode'?: Observable<string> | string;
    maskOrigin?: Observable<string> | string;
    'mask-origin'?: Observable<string> | string;
    maskPosition?: Observable<string> | string;
    'mask-position'?: Observable<string> | string;
    maskRepeat?: Observable<string> | string;
    'mask-repeat'?: Observable<string> | string;
    maskSize?: Observable<string> | string;
    'mask-size'?: Observable<string> | string;
    maxHeight?: Observable<string> | string;
    'max-height'?: Observable<string> | string;
    maxWidth?: Observable<string> | string;
    'max-width'?: Observable<string> | string;
    minHeight?: Observable<string> | string;
    'min-height'?: Observable<string> | string;
    minWidth?: Observable<string> | string;
    'min-width'?: Observable<string> | string;
    mixBlendMode?: Observable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string> | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string;
    'mix-blend-mode'?: Observable<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string> | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | string;
    objectFit?: Observable<'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | string> | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | string;
    'object-fit'?: Observable<'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | string> | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | string;
    objectPosition?: Observable<string> | string;
    'object-position'?: Observable<string> | string;
    offset?: Observable<string> | string;
    offsetAnchor?: Observable<string> | string;
    'offset-anchor'?: Observable<string> | string;
    offsetDistance?: Observable<string> | string;
    'offset-distance'?: Observable<string> | string;
    offsetPath?: Observable<string> | string;
    'offset-path'?: Observable<string> | string;
    offsetRotate?: Observable<string> | string;
    'offset-rotate'?: Observable<string> | string;
    opacity?: Observable<string | number> | string | number;
    order?: Observable<string | number> | string | number;
    orphans?: Observable<string | number> | string | number;
    outline?: Observable<string> | string;
    outlineColor?: Observable<string> | string;
    'outline-color'?: Observable<string> | string;
    outlineOffset?: Observable<string> | string;
    'outline-offset'?: Observable<string> | string;
    outlineStyle?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    'outline-style'?: Observable<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string> | 'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | string;
    outlineWidth?: Observable<string> | string;
    'outline-width'?: Observable<string> | string;
    overflow?: Observable<'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string> | 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string;
    overflowClip?: Observable<string> | string;
    'overflow-clip'?: Observable<string> | string;
    overflowWrap?: Observable<'normal' | 'break-word' | 'anywhere' | string> | 'normal' | 'break-word' | 'anywhere' | string;
    'overflow-wrap'?: Observable<'normal' | 'break-word' | 'anywhere' | string> | 'normal' | 'break-word' | 'anywhere' | string;
    overflowX?: Observable<'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string> | 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string;
    'overflow-x'?: Observable<'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string> | 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string;
    overflowY?: Observable<'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string> | 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string;
    'overflow-y'?: Observable<'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string> | 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip' | string;
    overscrollBehavior?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    'overscroll-behavior'?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    overscrollBehaviorX?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    'overscroll-behavior-x'?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    overscrollBehaviorY?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    'overscroll-behavior-y'?: Observable<'auto' | 'contain' | 'none' | string> | 'auto' | 'contain' | 'none' | string;
    padding?: Observable<string> | string;
    paddingBlock?: Observable<string> | string;
    'padding-block'?: Observable<string> | string;
    paddingBlockEnd?: Observable<string> | string;
    'padding-block-end'?: Observable<string> | string;
    paddingBlockStart?: Observable<string> | string;
    'padding-block-start'?: Observable<string> | string;
    paddingBottom?: Observable<string> | string;
    'padding-bottom'?: Observable<string> | string;
    paddingInline?: Observable<string> | string;
    'padding-inline'?: Observable<string> | string;
    paddingInlineEnd?: Observable<string> | string;
    'padding-inline-end'?: Observable<string> | string;
    paddingInlineStart?: Observable<string> | string;
    'padding-inline-start'?: Observable<string> | string;
    paddingLeft?: Observable<string> | string;
    'padding-left'?: Observable<string> | string;
    paddingRight?: Observable<string> | string;
    'padding-right'?: Observable<string> | string;
    paddingTop?: Observable<string> | string;
    'padding-top'?: Observable<string> | string;
    pageBreakAfter?: Observable<'auto' | 'always' | 'avoid' | 'left' | 'right' | string> | 'auto' | 'always' | 'avoid' | 'left' | 'right' | string;
    'page-break-after'?: Observable<'auto' | 'always' | 'avoid' | 'left' | 'right' | string> | 'auto' | 'always' | 'avoid' | 'left' | 'right' | string;
    pageBreakBefore?: Observable<'auto' | 'always' | 'avoid' | 'left' | 'right' | string> | 'auto' | 'always' | 'avoid' | 'left' | 'right' | string;
    'page-break-before'?: Observable<'auto' | 'always' | 'avoid' | 'left' | 'right' | string> | 'auto' | 'always' | 'avoid' | 'left' | 'right' | string;
    pageBreakInside?: Observable<'auto' | 'avoid' | string> | 'auto' | 'avoid' | string;
    'page-break-inside'?: Observable<'auto' | 'avoid' | string> | 'auto' | 'avoid' | string;
    perspective?: Observable<string> | string;
    perspectiveOrigin?: Observable<string> | string;
    'perspective-origin'?: Observable<string> | string;
    placeContent?: Observable<string> | string;
    'place-content'?: Observable<string> | string;
    placeItems?: Observable<string> | string;
    'place-items'?: Observable<string> | string;
    placeSelf?: Observable<string> | string;
    'place-self'?: Observable<string> | string;
    pointerEvents?: Observable<'auto' | 'none' | 'all' | 'fill' | 'painted' | 'stroke' | 'visible' | 'visibleFill' | 'visiblePainted' | 'visibleStroke' | string> | 'auto' | 'none' | 'all' | 'fill' | 'painted' | 'stroke' | 'visible' | 'visibleFill' | 'visiblePainted' | 'visibleStroke' | string;
    'pointer-events'?: Observable<'auto' | 'none' | 'all' | 'fill' | 'painted' | 'stroke' | 'visible' | 'visibleFill' | 'visiblePainted' | 'visibleStroke' | string> | 'auto' | 'none' | 'all' | 'fill' | 'painted' | 'stroke' | 'visible' | 'visibleFill' | 'visiblePainted' | 'visibleStroke' | string;
    position?: Observable<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | string> | 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky' | string;
    printColorAdjust?: Observable<'economy' | 'exact' | string> | 'economy' | 'exact' | string;
    'print-color-adjust'?: Observable<'economy' | 'exact' | string> | 'economy' | 'exact' | string;
    quotes?: Observable<string> | string;
    resize?: Observable<'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | string> | 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline' | string;
    right?: Observable<string> | string;
    rotate?: Observable<string> | string;
    rowGap?: Observable<string> | string;
    'row-gap'?: Observable<string> | string;
    scale?: Observable<string> | string;
    scrollBehavior?: Observable<'auto' | 'smooth' | string> | 'auto' | 'smooth' | string;
    'scroll-behavior'?: Observable<'auto' | 'smooth' | string> | 'auto' | 'smooth' | string;
    scrollMargin?: Observable<string> | string;
    'scroll-margin'?: Observable<string> | string;
    scrollPadding?: Observable<string> | string;
    'scroll-padding'?: Observable<string> | string;
    scrollSnapAlign?: Observable<'none' | 'start' | 'end' | 'center' | string> | 'none' | 'start' | 'end' | 'center' | string;
    'scroll-snap-align'?: Observable<'none' | 'start' | 'end' | 'center' | string> | 'none' | 'start' | 'end' | 'center' | string;
    scrollSnapStop?: Observable<'normal' | 'always' | string> | 'normal' | 'always' | string;
    'scroll-snap-stop'?: Observable<'normal' | 'always' | string> | 'normal' | 'always' | string;
    scrollSnapType?: Observable<'none' | 'x' | 'y' | 'block' | 'inline' | 'both' | string> | 'none' | 'x' | 'y' | 'block' | 'inline' | 'both' | string;
    'scroll-snap-type'?: Observable<'none' | 'x' | 'y' | 'block' | 'inline' | 'both' | string> | 'none' | 'x' | 'y' | 'block' | 'inline' | 'both' | string;
    shapeRendering?: Observable<'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision' | string> | 'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision' | string;
    'shape-rendering'?: Observable<'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision' | string> | 'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision' | string;
    stroke?: Observable<string> | string;
    strokeDasharray?: Observable<string> | string;
    'stroke-dasharray'?: Observable<string> | string;
    strokeDashoffset?: Observable<string> | string;
    'stroke-dashoffset'?: Observable<string> | string;
    strokeLinecap?: Observable<'butt' | 'round' | 'square' | string> | 'butt' | 'round' | 'square' | string;
    'stroke-linecap'?: Observable<'butt' | 'round' | 'square' | string> | 'butt' | 'round' | 'square' | string;
    strokeLinejoin?: Observable<'miter' | 'round' | 'bevel' | string> | 'miter' | 'round' | 'bevel' | string;
    'stroke-linejoin'?: Observable<'miter' | 'round' | 'bevel' | string> | 'miter' | 'round' | 'bevel' | string;
    strokeMiterlimit?: Observable<string | number> | string | number;
    'stroke-miterlimit'?: Observable<string | number> | string | number;
    strokeOpacity?: Observable<string | number> | string | number;
    'stroke-opacity'?: Observable<string | number> | string | number;
    strokeWidth?: Observable<string> | string;
    'stroke-width'?: Observable<string> | string;
    tabSize?: Observable<string | number> | string | number;
    'tab-size'?: Observable<string | number> | string | number;
    tableLayout?: Observable<'auto' | 'fixed' | string> | 'auto' | 'fixed' | string;
    'table-layout'?: Observable<'auto' | 'fixed' | string> | 'auto' | 'fixed' | string;
    textAlign?: Observable<'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'justify-all' | 'match-parent' | string> | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'justify-all' | 'match-parent' | string;
    'text-align'?: Observable<'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'justify-all' | 'match-parent' | string> | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'justify-all' | 'match-parent' | string;
    textAlignLast?: Observable<'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | string> | 'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | string;
    'text-align-last'?: Observable<'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | string> | 'auto' | 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | string;
    textAnchor?: Observable<'start' | 'middle' | 'end' | string> | 'start' | 'middle' | 'end' | string;
    'text-anchor'?: Observable<'start' | 'middle' | 'end' | string> | 'start' | 'middle' | 'end' | string;
    textDecoration?: Observable<'none' | 'underline' | 'overline' | 'line-through' | string> | 'none' | 'underline' | 'overline' | 'line-through' | string;
    'text-decoration'?: Observable<'none' | 'underline' | 'overline' | 'line-through' | string> | 'none' | 'underline' | 'overline' | 'line-through' | string;
    textDecorationColor?: Observable<string> | string;
    'text-decoration-color'?: Observable<string> | string;
    textDecorationLine?: Observable<'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string> | 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string;
    'text-decoration-line'?: Observable<'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string> | 'none' | 'underline' | 'overline' | 'line-through' | 'blink' | string;
    textDecorationStyle?: Observable<'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string> | 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
    'text-decoration-style'?: Observable<'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string> | 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
    textDecorationThickness?: Observable<string> | string;
    'text-decoration-thickness'?: Observable<string> | string;
    textIndent?: Observable<string> | string;
    'text-indent'?: Observable<string> | string;
    textOverflow?: Observable<'clip' | 'ellipsis' | string> | 'clip' | 'ellipsis' | string;
    'text-overflow'?: Observable<'clip' | 'ellipsis' | string> | 'clip' | 'ellipsis' | string;
    textRendering?: Observable<'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision' | string> | 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision' | string;
    'text-rendering'?: Observable<'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision' | string> | 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision' | string;
    textShadow?: Observable<string> | string;
    'text-shadow'?: Observable<string> | string;
    textSizeAdjust?: Observable<string> | string;
    'text-size-adjust'?: Observable<string> | string;
    textTransform?: Observable<'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'full-width' | string> | 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'full-width' | string;
    'text-transform'?: Observable<'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'full-width' | string> | 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'full-width' | string;
    textUnderlineOffset?: Observable<string> | string;
    'text-underline-offset'?: Observable<string> | string;
    textWrap?: Observable<'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable' | string> | 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable' | string;
    'text-wrap'?: Observable<'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable' | string> | 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable' | string;
    top?: Observable<string> | string;
    touchAction?: Observable<'auto' | 'none' | 'pan-x' | 'pan-y' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation' | string> | 'auto' | 'none' | 'pan-x' | 'pan-y' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation' | string;
    'touch-action'?: Observable<'auto' | 'none' | 'pan-x' | 'pan-y' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation' | string> | 'auto' | 'none' | 'pan-x' | 'pan-y' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down' | 'pinch-zoom' | 'manipulation' | string;
    transform?: Observable<string> | string;
    transformBox?: Observable<'content-box' | 'border-box' | 'fill-box' | 'stroke-box' | 'view-box' | string> | 'content-box' | 'border-box' | 'fill-box' | 'stroke-box' | 'view-box' | string;
    'transform-box'?: Observable<'content-box' | 'border-box' | 'fill-box' | 'stroke-box' | 'view-box' | string> | 'content-box' | 'border-box' | 'fill-box' | 'stroke-box' | 'view-box' | string;
    transformOrigin?: Observable<string> | string;
    'transform-origin'?: Observable<string> | string;
    transformStyle?: Observable<'flat' | 'preserve-3d' | string> | 'flat' | 'preserve-3d' | string;
    'transform-style'?: Observable<'flat' | 'preserve-3d' | string> | 'flat' | 'preserve-3d' | string;
    transition?: Observable<string> | string;
    transitionBehavior?: Observable<'normal' | 'allow-discrete' | string> | 'normal' | 'allow-discrete' | string;
    'transition-behavior'?: Observable<'normal' | 'allow-discrete' | string> | 'normal' | 'allow-discrete' | string;
    transitionDelay?: Observable<string> | string;
    'transition-delay'?: Observable<string> | string;
    transitionDuration?: Observable<string> | string;
    'transition-duration'?: Observable<string> | string;
    transitionProperty?: Observable<string> | string;
    'transition-property'?: Observable<string> | string;
    transitionTimingFunction?: Observable<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string> | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string;
    'transition-timing-function'?: Observable<'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string> | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'step-start' | 'step-end' | string;
    translate?: Observable<string> | string;
    unicodeBidi?: Observable<'normal' | 'embed' | 'bidi-override' | 'isolate' | 'isolate-override' | 'plaintext' | string> | 'normal' | 'embed' | 'bidi-override' | 'isolate' | 'isolate-override' | 'plaintext' | string;
    'unicode-bidi'?: Observable<'normal' | 'embed' | 'bidi-override' | 'isolate' | 'isolate-override' | 'plaintext' | string> | 'normal' | 'embed' | 'bidi-override' | 'isolate' | 'isolate-override' | 'plaintext' | string;
    userSelect?: Observable<'none' | 'auto' | 'text' | 'all' | 'contain' | string> | 'none' | 'auto' | 'text' | 'all' | 'contain' | string;
    'user-select'?: Observable<'none' | 'auto' | 'text' | 'all' | 'contain' | string> | 'none' | 'auto' | 'text' | 'all' | 'contain' | string;
    verticalAlign?: Observable<'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super' | string> | 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super' | string;
    'vertical-align'?: Observable<'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super' | string> | 'baseline' | 'top' | 'middle' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super' | string;
    visibility?: Observable<'visible' | 'hidden' | 'collapse' | string> | 'visible' | 'hidden' | 'collapse' | string;
    whiteSpace?: Observable<'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | string> | 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | string;
    'white-space'?: Observable<'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | string> | 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | string;
    whiteSpaceCollapse?: Observable<'collapse' | 'preserve' | 'preserve-breaks' | 'preserve-spaces' | 'break-spaces' | string> | 'collapse' | 'preserve' | 'preserve-breaks' | 'preserve-spaces' | 'break-spaces' | string;
    'white-space-collapse'?: Observable<'collapse' | 'preserve' | 'preserve-breaks' | 'preserve-spaces' | 'break-spaces' | string> | 'collapse' | 'preserve' | 'preserve-breaks' | 'preserve-spaces' | 'break-spaces' | string;
    widows?: Observable<string | number> | string | number;
    width?: Observable<string> | string;
    willChange?: Observable<string> | string;
    'will-change'?: Observable<string> | string;
    wordBreak?: Observable<'normal' | 'break-all' | 'keep-all' | 'break-word' | string> | 'normal' | 'break-all' | 'keep-all' | 'break-word' | string;
    'word-break'?: Observable<'normal' | 'break-all' | 'keep-all' | 'break-word' | string> | 'normal' | 'break-all' | 'keep-all' | 'break-word' | string;
    wordSpacing?: Observable<string> | string;
    'word-spacing'?: Observable<string> | string;
    wordWrap?: Observable<'normal' | 'break-word' | 'anywhere' | string> | 'normal' | 'break-word' | 'anywhere' | string;
    'word-wrap'?: Observable<'normal' | 'break-word' | 'anywhere' | string> | 'normal' | 'break-word' | 'anywhere' | string;
    writingMode?: Observable<'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr' | string> | 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr' | string;
    'writing-mode'?: Observable<'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr' | string> | 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr' | string;
    zIndex?: Observable<string | number> | string | number;
    'z-index'?: Observable<string | number> | string | number;
}

// ─────────────────────────────────────────────
// Shared attribute sets
// ─────────────────────────────────────────────

interface GlobalAttributes {
    id?:               Observable<string>;
    class?:            Observable<string> | NdClassMap | string;
    style?:            Observable<NdStyleMap> | NdStyleMap | string;
    title?:            string;
    lang?:             string;
    dir?:              'ltr' | 'rtl' | 'auto';
    hidden?:           Observable<boolean>;
    draggable?:        Observable<boolean>;
    contenteditable?:  Observable<boolean>;
    contentEditable?:  Observable<boolean>;
    tabindex?:         string | number;
    tabIndex?:         string | number;
    accesskey?:        string;
    accessKey?:        string;
    spellcheck?:       Observable<boolean>;
    spellCheck?:       Observable<boolean>;
    role?:             'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 'dialog' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem' | string;
    [key: `data-${string}`]: string;
    [key: `aria-${string}`]: string;
}

interface SharedFormAttributes {
    name?:      string;
    disabled?:  Observable<boolean>;
    required?:  Observable<boolean>;
    autofocus?: Observable<boolean>;
    autoFocus?: Observable<boolean>;
    form?:      string;
}

// ─────────────────────────────────────────────
// Element-specific attribute interfaces
// ─────────────────────────────────────────────

interface AnchorAttributes extends GlobalAttributes {
    href?:            Observable<string>;
    target?:          '_blank' | '_self' | '_parent' | '_top' | string;
    rel?:             string;
    download?:        Observable<boolean> | boolean | string;
    hreflang?:        string;
    hrefLang?:        string;
    type?:            string;
    referrerpolicy?:  string;
    referrerPolicy?:  string;
}

interface ImgAttributes extends GlobalAttributes {
    src?:             Observable<string>;
    alt?:             Observable<string>;
    width?:           Observable<string> | string | number;
    height?:          Observable<string> | string | number;
    loading?:         'lazy' | 'eager' | 'auto';
    decoding?:        'async' | 'sync' | 'auto';
    srcset?:          string;
    srcSet?:          string;
    sizes?:           string;
    crossorigin?:     'anonymous' | 'use-credentials';
    crossOrigin?:     'anonymous' | 'use-credentials';
    referrerpolicy?:  string;
    referrerPolicy?:  string;
    fetchpriority?:   'high' | 'low' | 'auto';
    fetchPriority?:   'high' | 'low' | 'auto';
}

interface InputAttributes extends GlobalAttributes, SharedFormAttributes {
    type?:          'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' |
        'date' | 'time' | 'datetime-local' | 'week' | 'month' |
        'checkbox' | 'radio' | 'range' | 'color' | 'file' | 'hidden';
    value?:         Observable<string>;
    placeholder?:   Observable<string>;
    checked?:       Observable<boolean>;
    readonly?:      Observable<boolean>;
    readOnly?:      Observable<boolean>;
    multiple?:      Observable<boolean>;
    min?:           Observable<string> | string | number;
    max?:           Observable<string> | string | number;
    step?:          Observable<string> | string | number;
    minlength?:     number;
    minLength?:     number;
    maxlength?:     number;
    maxLength?:     number;
    pattern?:       string;
    accept?:        string;
    autocomplete?:  'on' | 'off' | string;
    autoComplete?:  'on' | 'off' | string;
    list?:          string;
}

interface TextAreaAttributes extends GlobalAttributes, SharedFormAttributes {
    value?:         Observable<string>;
    placeholder?:   Observable<string>;
    readonly?:      Observable<boolean>;
    readOnly?:      Observable<boolean>;
    rows?:          number;
    cols?:          number;
    minlength?:     number;
    minLength?:     number;
    maxlength?:     number;
    maxLength?:     number;
    wrap?:          'hard' | 'soft' | 'off';
    autocomplete?:  'on' | 'off' | string;
    autoComplete?:  'on' | 'off' | string;
    spellcheck?:    Observable<boolean>;
    spellCheck?:    Observable<boolean>;
}

interface SelectAttributes extends GlobalAttributes, SharedFormAttributes {
    value?:    Observable<string>;
    multiple?: Observable<boolean>;
    size?:     number;
}

interface OptionAttributes extends GlobalAttributes {
    value?:    Observable<string>;
    selected?: Observable<boolean>;
    disabled?: Observable<boolean>;
}

interface FormAttributes extends GlobalAttributes, SharedFormAttributes {
    action?:       string;
    method?:       'get' | 'post';
    enctype?:      'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    encType?:      'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    novalidate?:   Observable<boolean>;
    noValidate?:   Observable<boolean>;
    target?:       '_blank' | '_self' | '_parent' | '_top' | string;
    autocomplete?: 'on' | 'off';
    autoComplete?: 'on' | 'off';
}

interface ButtonAttributes extends GlobalAttributes, SharedFormAttributes {
    type?:  'button' | 'submit' | 'reset';
    value?: Observable<string>;
}

interface VideoAttributes extends GlobalAttributes {
    src?:          Observable<string>;
    autoplay?:     Observable<boolean>;
    autoPlay?:     Observable<boolean>;
    controls?:     Observable<boolean>;
    loop?:         Observable<boolean>;
    muted?:        Observable<boolean>;
    preload?:      'auto' | 'metadata' | 'none';
    width?:        Observable<string> | string | number;
    height?:       Observable<string> | string | number;
    poster?:       string;
    playsinline?:  Observable<boolean>;
    playsInline?:  Observable<boolean>;
    crossorigin?:  'anonymous' | 'use-credentials';
    crossOrigin?:  'anonymous' | 'use-credentials';
}

interface AudioAttributes extends GlobalAttributes {
    src?:         Observable<string>;
    autoplay?:    Observable<boolean>;
    autoPlay?:    Observable<boolean>;
    controls?:    Observable<boolean>;
    loop?:        Observable<boolean>;
    muted?:       Observable<boolean>;
    preload?:     'auto' | 'metadata' | 'none';
    crossorigin?: 'anonymous' | 'use-credentials';
    crossOrigin?: 'anonymous' | 'use-credentials';
}

interface CanvasAttributes extends GlobalAttributes {
    width?:  Observable<string> | string | number;
    height?: Observable<string> | string | number;
}

interface DetailsAttributes extends GlobalAttributes {
    open?: Observable<boolean>;
}

interface DialogAttributes extends GlobalAttributes {
    open?: Observable<boolean>;
}

interface ProgressAttributes extends GlobalAttributes {
    value?: Observable<string> | string | number;
    max?:   number;
}

interface MeterAttributes extends GlobalAttributes {
    value?:   Observable<string> | string | number;
    min?:     number;
    max?:     number;
    low?:     number;
    high?:    number;
    optimum?: number;
}

interface SourceAttributes extends GlobalAttributes {
    src?:   string;
    type?:  string;
    media?: string;
}

interface TrackAttributes extends GlobalAttributes {
    src?:     string;
    kind?:    'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
    srclang?: string;
    srcLang?: string;
    label?:   string;
    default?: Observable<boolean>;
}

interface ThAttributes extends GlobalAttributes {
    colspan?: number;
    colSpan?: number;
    rowspan?: number;
    rowSpan?: number;
    headers?: string;
    scope?:   'row' | 'col' | 'rowgroup' | 'colgroup';
}

interface TdAttributes extends GlobalAttributes {
    colspan?: number;
    colSpan?: number;
    rowspan?: number;
    rowSpan?: number;
    headers?: string;
}

interface LabelAttributes extends GlobalAttributes {
    for?:     string;
    htmlFor?: string;
}

interface OutputAttributes extends GlobalAttributes {
    for?:  string;
    form?: string;
    name?: string;
}

interface TimeAttributes extends GlobalAttributes {
    datetime?: string;
    dateTime?: string;
}

interface ModAttributes extends GlobalAttributes {
    cite?:     string;
    datetime?: string;
    dateTime?: string;
}

interface OlAttributes extends GlobalAttributes {
    reversed?: Observable<boolean>;
    start?:    number;
    type?:     '1' | 'a' | 'A' | 'i' | 'I';
}

interface SvgAttributes extends GlobalAttributes {
    viewBox?:  string;
    viewbox?:  string;
    xmlns?:    string;
    width?:    Observable<string> | string | number;
    height?:   Observable<string> | string | number;
}

// ─────────────────────────────────────────────
// Element function return type
// ─────────────────────────────────────────────

type NdElement<T extends Element = HTMLElement> = T & { nd: NDElement };

type ElementFunction<A = GlobalAttributes, T extends Element = HTMLElement> =
    (attributes?: A, children?: ValidChild) => NdElement<T>;

type ElementFunctionNoChildren<A = GlobalAttributes, T extends Element = HTMLElement> =
    (attributes?: A) => NdElement<T>;

// ─────────────────────────────────────────────
// Text elements
// ─────────────────────────────────────────────

export declare const Div:        ElementFunction<GlobalAttributes, HTMLDivElement>;
export declare const Span:       ElementFunction<GlobalAttributes, HTMLSpanElement>;
export declare const P:          ElementFunction<GlobalAttributes, HTMLParagraphElement>;
export declare const Paragraph:  typeof P;
export declare const Strong:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const H1:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const H2:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const H3:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const H4:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const H5:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const H6:         ElementFunction<GlobalAttributes, HTMLHeadingElement>;
export declare const Pre:        ElementFunction<GlobalAttributes, HTMLPreElement>;
export declare const Code:       ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Blockquote: ElementFunction<GlobalAttributes & { cite?: string }, HTMLQuoteElement>;
export declare const Em:         ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Small:      ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Mark:       ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Del:        ElementFunction<ModAttributes, HTMLModElement>;
export declare const Ins:        ElementFunction<ModAttributes, HTMLModElement>;
export declare const Sub:        ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Sup:        ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Abbr:       ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Cite:       ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Quote:      ElementFunction<GlobalAttributes & { cite?: string }, HTMLQuoteElement>;
export declare const Br:         ElementFunctionNoChildren<GlobalAttributes, HTMLBRElement>;
export declare const Hr:         ElementFunctionNoChildren<GlobalAttributes, HTMLHRElement>;

// ─────────────────────────────────────────────
// Semantic elements
// ─────────────────────────────────────────────

export declare const Main:       ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Section:    ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Article:    ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Aside:      ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Nav:        ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Figure:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const FigCaption: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Header:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Footer:     ElementFunction<GlobalAttributes, HTMLElement>;

// ─────────────────────────────────────────────
// Interactive elements
// ─────────────────────────────────────────────

export declare const Details: ElementFunction<DetailsAttributes, HTMLDetailsElement>;
export declare const Summary: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Dialog:  ElementFunction<DialogAttributes, HTMLDialogElement>;
export declare const Menu:    ElementFunction<GlobalAttributes, HTMLMenuElement>;

// ─────────────────────────────────────────────
// Link
// ─────────────────────────────────────────────

export declare const Link: ElementFunction<AnchorAttributes, HTMLAnchorElement>;

// ─────────────────────────────────────────────
// Form elements
// ─────────────────────────────────────────────

export declare const Form: (
    attributes?: FormAttributes,
    children?: ValidChild
) => NdElement<HTMLFormElement> & {
    submit:            (actionOrFn: string | ((e: SubmitEvent) => void)) => NdElement<HTMLFormElement>;
    post:              (action: string) => NdElement<HTMLFormElement>;
    get:               (action: string) => NdElement<HTMLFormElement>;
    multipartFormData: () => NdElement<HTMLFormElement>;
};

export declare const Input:         ElementFunctionNoChildren<InputAttributes, HTMLInputElement>;
export declare const TextArea:      ElementFunction<TextAreaAttributes, HTMLTextAreaElement>;
export declare const TextInput:     typeof TextArea;
export declare const Select:        ElementFunction<SelectAttributes, HTMLSelectElement>;
export declare const FieldSet:      ElementFunction<GlobalAttributes & { disabled?: Observable<boolean> }, HTMLFieldSetElement>;
export declare const Option:        ElementFunction<OptionAttributes, HTMLOptionElement>;
export declare const Legend:        ElementFunction<GlobalAttributes, HTMLLegendElement>;
export declare const Label:         ElementFunction<LabelAttributes, HTMLLabelElement>;
export declare const Datalist:      ElementFunction<GlobalAttributes, HTMLDataListElement>;
export declare const Output:        ElementFunction<OutputAttributes, HTMLOutputElement>;
export declare const Progress:      ElementFunction<ProgressAttributes, HTMLProgressElement>;
export declare const Meter:         ElementFunction<MeterAttributes, HTMLMeterElement>;

export declare const ReadonlyInput: (attributes?: Omit<InputAttributes, 'type' | 'readonly' | 'readOnly'>) => NdElement<HTMLInputElement>;
export declare const HiddenInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const FileInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const PasswordInput: (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const Checkbox:      (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const Radio:         (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const RangeInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const ColorInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const DateInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const TimeInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const DateTimeInput: (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const WeekInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const MonthInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const SearchInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const TelInput:      (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const UrlInput:      (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const EmailInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;
export declare const NumberInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdElement<HTMLInputElement>;

export declare const Button:       ElementFunction<ButtonAttributes, HTMLButtonElement>;
export declare const SimpleButton: (children?: ValidChild, attributes?: Omit<ButtonAttributes, 'type'>) => NdElement<HTMLButtonElement>;
export declare const SubmitButton: (children?: ValidChild, attributes?: Omit<ButtonAttributes, 'type'>) => NdElement<HTMLButtonElement>;

// ─────────────────────────────────────────────
// Image elements
// ─────────────────────────────────────────────

export declare const BaseImage: ElementFunctionNoChildren<ImgAttributes, HTMLImageElement>;

export declare function Img(
    src: Observable<string>,
    attributes?: Omit<ImgAttributes, 'src'>
): NdElement<HTMLImageElement>;

export declare function AsyncImg(
    src: Observable<string>,
    defaultImage: string | null,
    attributes?: Omit<ImgAttributes, 'src'>,
    callback?: (error: Error | null, img: HTMLImageElement) => void
): NdElement<HTMLImageElement>;

export declare function LazyImg(
    src: Observable<string>,
    attributes?: Omit<ImgAttributes, 'src' | 'loading'>
): NdElement<HTMLImageElement>;

// ─────────────────────────────────────────────
// Media elements
// ─────────────────────────────────────────────

export declare const Audio:   ElementFunction<AudioAttributes, HTMLAudioElement>;
export declare const Video:   ElementFunction<VideoAttributes, HTMLVideoElement>;
export declare const Source:  ElementFunctionNoChildren<SourceAttributes, HTMLSourceElement>;
export declare const Track:   ElementFunctionNoChildren<TrackAttributes, HTMLTrackElement>;
export declare const Canvas:  ElementFunction<CanvasAttributes, HTMLCanvasElement>;
export declare const Svg:     ElementFunction<SvgAttributes, HTMLElement>;

// ─────────────────────────────────────────────
// List elements
// ─────────────────────────────────────────────

export declare const OrderedList:   ElementFunction<OlAttributes, HTMLOListElement>;
export declare const UnorderedList: ElementFunction<GlobalAttributes, HTMLUListElement>;
export declare const ListItem:      ElementFunction<GlobalAttributes & { value?: number }, HTMLLIElement>;
export declare const Li:            typeof ListItem;
export declare const Ol:            typeof OrderedList;
export declare const Ul:            typeof UnorderedList;

// ─────────────────────────────────────────────
// Definition list elements
// ─────────────────────────────────────────────

export declare const Dl: ElementFunction<GlobalAttributes, HTMLDListElement>;
export declare const Dt: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Dd: ElementFunction<GlobalAttributes, HTMLElement>;

// ─────────────────────────────────────────────
// Table elements
// ─────────────────────────────────────────────

export declare const Caption:    ElementFunction<GlobalAttributes, HTMLTableCaptionElement>;
export declare const Table:      ElementFunction<GlobalAttributes, HTMLTableElement>;
export declare const THead:      ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const TFoot:      ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const TBody:      ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const Tr:         ElementFunction<GlobalAttributes, HTMLTableRowElement>;
export declare const TRow:       typeof Tr;
export declare const Th:         ElementFunction<ThAttributes, HTMLTableCellElement>;
export declare const THeadCell:  typeof Th;
export declare const TFootCell:  typeof Th;
export declare const Td:         ElementFunction<TdAttributes, HTMLTableCellElement>;
export declare const TBodyCell:  typeof Td;

// ─────────────────────────────────────────────
// Misc elements
// ─────────────────────────────────────────────

export declare const Time:    ElementFunction<TimeAttributes, HTMLTimeElement>;
export declare const Data:    ElementFunction<GlobalAttributes & { value?: Observable<string> }, HTMLDataElement>;
export declare const Address: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Kbd:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Samp:    ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Var:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Wbr:     ElementFunctionNoChildren<GlobalAttributes, HTMLElement>;

// ─────────────────────────────────────────────
// Fragment
// ─────────────────────────────────────────────

export declare const Fragment: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const NativeDocumentFragment: typeof Anchor;

// ─────────────────────────────────────────────
// Anchor
// ─────────────────────────────────────────────

export declare type AnchorDocumentFragment = DocumentFragment & {
    detach:           () => void;
    restore:          () => void;
    clear:            () => void;
    remove:           () => void;
    removeChildren:   () => void;
    insertBefore:     (child: ValidChild, before: HTMLElement | Comment | null) => void;
    replaceContent:   (child: ValidChild) => void;
    setContent:       (child: ValidChild) => void;
    appendElement:    (child: ValidChild, before: HTMLElement | Comment | null) => void;
    append:           (...args: ValidChild[]) => void;
    getByIndex:       (index: number) => HTMLElement | null;
    endElement:       () => Comment;
    startElement:     () => Comment;
    removeWithAnchors: () => void;
};

export declare function Anchor(name?: string, isUniqueChild?: boolean): AnchorDocumentFragment;

export type NdHTMLElement<T extends HTMLElement = HTMLElement> = T & { nd: NDElement };