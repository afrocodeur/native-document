// Form elements type definitions
import {
    ValidChild,
    ElementFunction,
    ElementFunctionNoChildren,
    NdHTMLElement,
    GlobalAttributes,
    Observable
} from './elements';
import {
    FormAttributes,
    InputAttributes,
    TextAreaAttributes,
    SelectAttributes,
    OptionAttributes,
    ButtonAttributes,
    OutputAttributes,
    ProgressAttributes,
    MeterAttributes,
    LabelAttributes,
} from './elements';

// ─────────────────────────────────────────────
// Form
// ─────────────────────────────────────────────

export declare const Form: (
    attributes?: FormAttributes,
    children?: ValidChild
) => NdHTMLElement<HTMLFormElement> & {
    submit:            (actionOrFn: string | ((e: SubmitEvent) => void)) => NdHTMLElement<HTMLFormElement>;
    post:              (action: string) => NdHTMLElement<HTMLFormElement>;
    get:               (action: string) => NdHTMLElement<HTMLFormElement>;
    multipartFormData: () => NdHTMLElement<HTMLFormElement>;
};

// ─────────────────────────────────────────────
// Input
// ─────────────────────────────────────────────

export declare const Input:         ElementFunctionNoChildren<InputAttributes, HTMLInputElement>;
export declare const ReadonlyInput: (attributes?: Omit<InputAttributes, 'type' | 'readonly' | 'readOnly'>) => NdHTMLElement<HTMLInputElement>;
export declare const HiddenInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const FileInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const PasswordInput: (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const Checkbox:      (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const Radio:         (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const RangeInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const ColorInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const DateInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const TimeInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const DateTimeInput: (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const WeekInput:     (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const MonthInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const SearchInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const TelInput:      (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const UrlInput:      (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const EmailInput:    (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;
export declare const NumberInput:   (attributes?: Omit<InputAttributes, 'type'>) => NdHTMLElement<HTMLInputElement>;

// ─────────────────────────────────────────────
// Textarea & Select
// ─────────────────────────────────────────────

export declare const TextArea:  ElementFunction<TextAreaAttributes, HTMLTextAreaElement>;
export declare const TextInput: typeof TextArea;
export declare const Select:    ElementFunction<SelectAttributes, HTMLSelectElement>;
export declare const Option:    ElementFunction<OptionAttributes, HTMLOptionElement>;

// ─────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────

export declare const Button:       ElementFunction<ButtonAttributes, HTMLButtonElement>;
export declare const SimpleButton: (children?: ValidChild, attributes?: Omit<ButtonAttributes, 'type'>) => NdHTMLElement<HTMLButtonElement>;
export declare const SubmitButton: (children?: ValidChild, attributes?: Omit<ButtonAttributes, 'type'>) => NdHTMLElement<HTMLButtonElement>;

// ─────────────────────────────────────────────
// Other form elements
// ─────────────────────────────────────────────

export declare const FieldSet: ElementFunction<GlobalAttributes & { disabled?: Observable<boolean> }, HTMLFieldSetElement>;
export declare const Legend:   ElementFunction<GlobalAttributes, HTMLLegendElement>;
export declare const Label:    ElementFunction<LabelAttributes, HTMLLabelElement>;
export declare const Datalist: ElementFunction<GlobalAttributes, HTMLDataListElement>;
export declare const Output:   ElementFunction<OutputAttributes, HTMLOutputElement>;
export declare const Progress: ElementFunction<ProgressAttributes, HTMLProgressElement>;
export declare const Meter:    ElementFunction<MeterAttributes, HTMLMeterElement>;
