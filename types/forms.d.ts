// Form elements type definitions
import { Attributes, ValidChild, NDElement } from './elements';
import {ElementFunction} from "./elements";

// Form Elements
export declare const Form: ElementFunction & {
    submit(action: string | ((event: Event) => void)): HTMLFormElement & { nd: NDElement };
    multipartFormData(): HTMLFormElement & { nd: NDElement };
    post(action: string): HTMLFormElement & { nd: NDElement };
    get(action: string): HTMLFormElement & { nd: NDElement };
};

export declare const Input: ElementFunction;
export declare const TextArea: ElementFunction;
export declare const Select: ElementFunction;
export declare const Option: ElementFunction;
export declare const Button: ElementFunction;

// Specialized Input Types
export declare const HiddenInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const FileInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const PasswordInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const Checkbox: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const Radio: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const NumberInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const EmailInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const DateInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const TimeInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const RangeInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const ColorInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };

export declare const ReadonlyInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const DateTimeInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const WeekInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const MonthInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const SearchInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const TelInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };
export declare const UrlInput: (attributes?: Attributes) => HTMLInputElement & { nd: NDElement };

export declare const TextInput: ElementFunction;
export declare const FieldSet: ElementFunction;
export declare const Legend: ElementFunction;
export declare const Datalist: ElementFunction;
export declare const Output: ElementFunction;
export declare const Progress: ElementFunction;
export declare const Meter: ElementFunction;

// Specialized Button Types
export declare const SimpleButton: (child: ValidChild, attributes?: Attributes) => HTMLButtonElement & { nd: NDElement };
export declare const SubmitButton: (child: ValidChild, attributes?: Attributes) => HTMLButtonElement & { nd: NDElement };
