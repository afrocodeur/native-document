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
type NdStyleMap = Record<string, Observable<string>>;

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
    role?:             string;
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