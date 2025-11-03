// DOM elements and components type definitions - Version complète
import { ObservableItem } from './observable';
import {BindingHydrator} from "./template-cloner";
import {NDElement} from "./nd-element";


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


export type Attributes = Record<string, any> & {
    class?: string | Record<string, boolean | ObservableItem<boolean>>;
    style?: string | Record<string, string | ObservableItem<string>>;
};

export type ElementFunction = (attributes?: Attributes, children?: ValidChild) => HTMLElement & { nd: NDElement };
export type ElementFunctionWithoutAttrs = (children?: ValidChild) => HTMLElement & { nd: NDElement };

// HTML Elements
export declare const Link: ElementFunction;
export declare const Abbr: ElementFunction;
export declare const Cite: ElementFunction;
export declare const Quote: ElementFunction;

// Lists
export declare const Dl: ElementFunction;
export declare const Dt: ElementFunction;
export declare const Dd: ElementFunction;

export declare const Div: ElementFunction;
export declare const Span: ElementFunction;
export declare const P: ElementFunction;
export declare const Paragraph: ElementFunction;
export declare const Strong: ElementFunction;
export declare const H1: ElementFunction;
export declare const H2: ElementFunction;
export declare const H3: ElementFunction;
export declare const H4: ElementFunction;
export declare const H5: ElementFunction;
export declare const H6: ElementFunction;
export declare const Label: ElementFunction;
export declare const Br: ElementFunctionWithoutAttrs;
export declare const Hr: ElementFunctionWithoutAttrs;

export declare const Pre: ElementFunction;
export declare const Code: ElementFunction;
export declare const Blockquote: ElementFunction;
export declare const Em: ElementFunction;
export declare const Small: ElementFunction;
export declare const Mark: ElementFunction;
export declare const Del: ElementFunction;
export declare const Ins: ElementFunction;
export declare const Sub: ElementFunction;
export declare const Sup: ElementFunction;

// Semantic elements
export declare const Main: ElementFunction;
export declare const Section: ElementFunction;
export declare const Article: ElementFunction;
export declare const Aside: ElementFunction;
export declare const Nav: ElementFunction;
export declare const Figure: ElementFunction;
export declare const FigCaption: ElementFunction;
export declare const Header: ElementFunction;
export declare const Footer: ElementFunction;

export declare const Details: ElementFunction;
export declare const Summary: ElementFunction;
export declare const Dialog: ElementFunction;
export declare const Menu: ElementFunction;

// Lists
export declare const OrderedList: ElementFunction;
export declare const UnorderedList: ElementFunction;
export declare const ListItem: ElementFunction;
export declare const Li: ElementFunction;
export declare const Ol: ElementFunction;
export declare const Ul: ElementFunction;

// Media
export declare const Audio: ElementFunction;
export declare const Video: ElementFunction;
export declare const Source: ElementFunction;
export declare const Track: ElementFunction;
export declare const Canvas: ElementFunction;
export declare const Svg: ElementFunction;

// Other elements
export declare const Time: ElementFunction;
export declare const Data: ElementFunction;
export declare const Address: ElementFunction;
export declare const Kbd: ElementFunction;
export declare const Samp: ElementFunction;
export declare const Var: ElementFunction;
export declare const Wbr: ElementFunctionWithoutAttrs;

// Table elements
export declare const Caption: ElementFunction;
export declare const Table: ElementFunction;
export declare const THead: ElementFunction;
export declare const TFoot: ElementFunction;
export declare const TBody: ElementFunction;
export declare const Tr: ElementFunction;
export declare const TRow: ElementFunction;
export declare const Th: ElementFunction;
export declare const THeadCell: ElementFunction;
export declare const TFootCell: ElementFunction;
export declare const Td: ElementFunction;
export declare const TBodyCell: ElementFunction;

// Fragment
export declare const Fragment: ElementFunction;
export declare const NativeDocumentFragment: typeof Anchor;


export declare type AnchorDocumentFragment = DocumentFragment & {
    detach: ()  => void;
    restore: ()  => void;
    clear: ()  => void;
    remove: ()  => void;
    removeChildren: ()  => void;
    insertBefore: (child: ValidChild, before: HTMLElement|Comment)  => void;
    replaceContent: (child: ValidChild)  => void;
    appendElement: (child: ValidChild, before: HTMLElement) => void;
    getByIndex: (index: number) => HTMLElement;
    endElement: () => Comment;
    startElement: () => Comment;
};

// Anchor
export declare function Anchor(name?: string, isUniqueChild?: boolean): AnchorDocumentFragment;