// DOM elements and components type definitions
import { ObservableItem } from './observable';
import { BindingHydrator } from './template-cloner';
import { NDElement } from './nd-element';

// - Re-export all attribute types and utilities from globals
export type {
    Observable,
    NdClassMap,
    NdStyleMap,
    NdAriaAttributes,
    NdDataAttributes,
    GlobalAttributes,
    SharedFormAttributes,
    AnchorAttributes,
    ImgAttributes,
    ButtonAttributes,
    InputAttributes,
    TextAreaAttributes,
    SelectAttributes,
    OptionAttributes,
    FormAttributes,
    VideoAttributes,
    AudioAttributes,
    CanvasAttributes,
    DetailsAttributes,
    DialogAttributes,
    ProgressAttributes,
    MeterAttributes,
    SourceAttributes,
    TrackAttributes,
    ThAttributes,
    TdAttributes,
    LabelAttributes,
    OutputAttributes,
    TimeAttributes,
    ModAttributes,
    OlAttributes,
    SvgAttributes,
} from './globals';

// ---------------------------------------------------------
// ValidChild — accepted content for any NativeDocument element
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// Internal element wrapper types
// ---------------------------------------------------------

type NdElement<T extends Element = HTMLElement> = T & { nd: NDElement };

export type ElementFunction<A = GlobalAttributes, T extends Element = HTMLElement> =
    (attributes?: A, children?: ValidChild) => NdElement<T>;

export type ElementFunctionNoChildren<A = GlobalAttributes, T extends Element = HTMLElement> =
    (attributes?: A) => NdElement<T>;

export type NdHTMLElement<T extends HTMLElement = HTMLElement> = T & { nd: NDElement };

// ---------------------------------------------------------
// Text & structural elements
// ---------------------------------------------------------

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
export declare const Q:          ElementFunction<GlobalAttributes & { cite?: string }, HTMLQuoteElement>;
export declare const Dfn:        ElementFunction<GlobalAttributes, HTMLElement>;
export declare const I:          ElementFunction<GlobalAttributes, HTMLElement>;
export declare const B:          ElementFunction<GlobalAttributes, HTMLElement>;
export declare const U:          ElementFunction<GlobalAttributes, HTMLElement>;
export declare const S:          ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Hr:         ElementFunctionNoChildren<GlobalAttributes, HTMLHRElement>;
export declare const Br:         ElementFunctionNoChildren<GlobalAttributes, HTMLBRElement>;

// ---------------------------------------------------------
// Layout & sectioning elements
// ---------------------------------------------------------

export declare const Section:  ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Article:  ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Aside:    ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Header:   ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Footer:   ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Main:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Nav:      ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Figure:   ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Figcaption: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Details:  ElementFunction<DetailsAttributes, HTMLDetailsElement>;
export declare const Summary:  ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Dialog:   ElementFunction<DialogAttributes, HTMLDialogElement>;
export declare const Template: ElementFunctionNoChildren<GlobalAttributes, HTMLTemplateElement>;

// ---------------------------------------------------------
// List elements
// ---------------------------------------------------------

export declare const Ul:  ElementFunction<GlobalAttributes, HTMLUListElement>;
export declare const Ol:  ElementFunction<OlAttributes, HTMLOListElement>;
export declare const Li:  ElementFunction<GlobalAttributes, HTMLLIElement>;
export declare const Dl:  ElementFunction<GlobalAttributes, HTMLDListElement>;
export declare const Dt:  ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Dd:  ElementFunction<GlobalAttributes, HTMLElement>;

// ---------------------------------------------------------
// Link & media elements
// ---------------------------------------------------------

export declare const A:           ElementFunction<AnchorAttributes, HTMLAnchorElement>;
export declare const Link:        typeof A;
export declare const Video:       ElementFunction<VideoAttributes, HTMLVideoElement>;
export declare const Audio:       ElementFunction<AudioAttributes, HTMLAudioElement>;
export declare const Source:      ElementFunctionNoChildren<SourceAttributes, HTMLSourceElement>;
export declare const Track:       ElementFunctionNoChildren<TrackAttributes, HTMLTrackElement>;
export declare const Canvas:      ElementFunction<CanvasAttributes, HTMLCanvasElement>;
export declare const Iframe:      ElementFunctionNoChildren<GlobalAttributes & {
    src?:             string;
    srcdoc?:          string;
    name?:            string;
    sandbox?:         string;
    allow?:           string;
    allowfullscreen?: boolean;
    width?:           string | number;
    height?:          string | number;
    loading?:         'lazy' | 'eager';
}, HTMLIFrameElement>;

// ---------------------------------------------------------
// SVG
// ---------------------------------------------------------

export declare const Svg:         ElementFunction<SvgAttributes, SVGSVGElement>;
export declare const SvgPath:     ElementFunction<SvgAttributes, SVGPathElement>;
export declare const SvgRect:     ElementFunction<SvgAttributes, SVGRectElement>;
export declare const SvgCircle:   ElementFunction<SvgAttributes, SVGCircleElement>;
export declare const SvgEllipse:  ElementFunction<SvgAttributes, SVGEllipseElement>;
export declare const SvgLine:     ElementFunction<SvgAttributes, SVGLineElement>;
export declare const SvgPolyline: ElementFunction<SvgAttributes, SVGPolylineElement>;
export declare const SvgPolygon:  ElementFunction<SvgAttributes, SVGPolygonElement>;
export declare const SvgG:        ElementFunction<SvgAttributes, SVGGElement>;
export declare const SvgText:     ElementFunction<SvgAttributes, SVGTextElement>;
export declare const SvgDefs:     ElementFunction<SvgAttributes, SVGDefsElement>;
export declare const SvgUse:      ElementFunction<SvgAttributes, SVGUseElement>;

// ---------------------------------------------------------
// Table elements
// ---------------------------------------------------------

export declare const Table:   ElementFunction<GlobalAttributes, HTMLTableElement>;
export declare const THead:   ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const TBody:   ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const TFoot:   ElementFunction<GlobalAttributes, HTMLTableSectionElement>;
export declare const Tr:      ElementFunction<GlobalAttributes, HTMLTableRowElement>;
export declare const TRow:    typeof Tr;
export declare const Th:      ElementFunction<ThAttributes, HTMLTableCellElement>;
export declare const THeadCell: typeof Th;
export declare const TFootCell: typeof Th;
export declare const Td:      ElementFunction<TdAttributes, HTMLTableCellElement>;
export declare const TBodyCell: typeof Td;

// ---------------------------------------------------------
// Misc elements
// ---------------------------------------------------------

export declare const Time:    ElementFunction<TimeAttributes, HTMLTimeElement>;
export declare const Data:    ElementFunction<GlobalAttributes & { value?: import('./globals').Observable<string> }, HTMLDataElement>;
export declare const Address: ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Kbd:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Samp:    ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Var:     ElementFunction<GlobalAttributes, HTMLElement>;
export declare const Wbr:     ElementFunctionNoChildren<GlobalAttributes, HTMLElement>;

// ---------------------------------------------------------
// Fragment & Anchor utilities
// ---------------------------------------------------------

export declare const Fragment:               ElementFunction<GlobalAttributes, HTMLElement>;
export declare const NativeDocumentFragment: typeof Anchor;

export declare type AnchorDocumentFragment = DocumentFragment & {
    detach():                                                           void;
    restore():                                                          void;
    clear():                                                            void;
    remove():                                                           void;
    removeChildren():                                                   void;
    insertBefore(child: ValidChild, before: HTMLElement | Comment | null): void;
    replaceContent(child: ValidChild):                                  void;
    setContent(child: ValidChild):                                      void;
    appendElement(child: ValidChild, before: HTMLElement | Comment | null): void;
    append(...args: ValidChild[]):                                      void;
    getByIndex(index: number):                                          HTMLElement | null;
    endElement():                                                       Comment;
    startElement():                                                     Comment;
    removeWithAnchors():                                                void;
};

export declare function Anchor(name?: string, isUniqueChild?: boolean): AnchorDocumentFragment;
