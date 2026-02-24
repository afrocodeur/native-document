import HtmlElementWrapper from "../wrappers/HtmlElementWrapper";


/**
 * Creates a `<form>` element.
 * Extended with fluent methods: `.submit()`, `.post()`, `.get()`, `.multipartFormData()`.
 * @type {function(FormAttributes=, NdChild|NdChild[]=): HTMLFormElement & {
 *   submit: (actionOrFn: string | ((e: SubmitEvent) => void)) => HTMLFormElement,
 *   post: (action: string) => HTMLFormElement,
 *   get: (action: string) => HTMLFormElement,
 *   multipartFormData: () => HTMLFormElement,
 * }}
 */
export const Form = HtmlElementWrapper('form', function(el) {

    el.submit = function(action) {
        if(typeof action === 'function') {
            el.onSubmit((e) => {
                e.preventDefault();
                action(e);
            });
            return el;
        }
        this.setAttribute('action', action);
        return el;
    };
    el.multipartFormData = function() {
        this.setAttribute('enctype', 'multipart/form-data');
        return el;
    }
    el.post = function(action) {
        this.setAttribute('method', 'post');
        this.setAttribute('action', action);
        return el;
    };
    el.get = function(action) {
        this.setAttribute('method', 'get');
        this.setAttribute('action', action);
    };
    return el;
});

/**
 * Creates an `<input>` element.
 * @type {function(InputAttributes=): HTMLInputElement}
 */
export const Input = HtmlElementWrapper('input');

/**
 * Creates a `<textarea>` element.
 * @type {function(TextAreaAttributes=, NdChild|NdChild[]=): HTMLTextAreaElement}
 */
export const TextArea = HtmlElementWrapper('textarea');

/**
 * Alias for {@link TextArea}.
 * @type {function(TextAreaAttributes=, NdChild|NdChild[]=): HTMLTextAreaElement}
 */
export const TextInput = TextArea;

/**
 * Creates a `<select>` element.
 * @type {function(SelectAttributes=, NdChild|NdChild[]=): HTMLSelectElement}
 */
export const Select = HtmlElementWrapper('select');

/**
 * Creates a `<fieldset>` element.
 * @type {function(GlobalAttributes & { disabled?: Observable<boolean>|boolean }=, NdChild|NdChild[]=): HTMLFieldSetElement}
 */
export const FieldSet = HtmlElementWrapper('fieldset');

/**
 * Creates an `<option>` element.
 * @type {function(OptionAttributes=, NdChild|NdChild[]=): HTMLOptionElement}
 */
export const Option = HtmlElementWrapper('option');

/**
 * Creates a `<legend>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLLegendElement}
 */
export const Legend = HtmlElementWrapper('legend');

/**
 * Creates a `<datalist>` element.
 * @type {function(GlobalAttributes=, NdChild|NdChild[]=): HTMLDataListElement}
 */
export const Datalist = HtmlElementWrapper('datalist');

/**
 * Creates an `<output>` element.
 * @type {function(OutputAttributes=, NdChild|NdChild[]=): HTMLOutputElement}
 */
export const Output = HtmlElementWrapper('output');

/**
 * Creates a `<progress>` element.
 * @type {function(ProgressAttributes=, NdChild|NdChild[]=): HTMLProgressElement}
 */
export const Progress = HtmlElementWrapper('progress');

/**
 * Creates a `<meter>` element.
 * @type {function(MeterAttributes=, NdChild|NdChild[]=): HTMLMeterElement}
 */
export const Meter = HtmlElementWrapper('meter');

/**
 * Creates an `<input readonly>` element.
 * @param {Omit<InputAttributes, 'type'|'readonly'|'readOnly'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const ReadonlyInput = (attributes) => Input({ readonly: true, ...attributes });

/**
 * Creates an `<input type="hidden">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const HiddenInput = (attributes) => Input({ type: 'hidden', ...attributes });

/**
 * Creates an `<input type="file">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const FileInput = (attributes) => Input({ type: 'file', ...attributes });

/**
 * Creates an `<input type="password">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const PasswordInput = (attributes) => Input({ type: 'password', ...attributes });

/**
 * Creates an `<input type="checkbox">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const Checkbox = (attributes) => Input({ type: 'checkbox', ...attributes });

/**
 * Creates an `<input type="radio">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const Radio = (attributes) => Input({ type: 'radio', ...attributes });

/**
 * Creates an `<input type="range">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const RangeInput = (attributes) => Input({ type: 'range', ...attributes });

/**
 * Creates an `<input type="color">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const ColorInput = (attributes) => Input({ type: 'color', ...attributes });

/**
 * Creates an `<input type="date">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const DateInput = (attributes) => Input({ type: 'date', ...attributes });

/**
 * Creates an `<input type="time">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const TimeInput = (attributes) => Input({ type: 'time', ...attributes });

/**
 * Creates an `<input type="datetime-local">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const DateTimeInput = (attributes) => Input({ type: 'datetime-local', ...attributes });

/**
 * Creates an `<input type="week">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const WeekInput = (attributes) => Input({ type: 'week', ...attributes });

/**
 * Creates an `<input type="month">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const MonthInput = (attributes) => Input({ type: 'month', ...attributes });

/**
 * Creates an `<input type="search">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const SearchInput = (attributes) => Input({ type: 'search', ...attributes });

/**
 * Creates an `<input type="tel">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const TelInput = (attributes) => Input({ type: 'tel', ...attributes });

/**
 * Creates an `<input type="url">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const UrlInput = (attributes) => Input({ type: 'url', ...attributes });

/**
 * Creates an `<input type="email">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const EmailInput = (attributes) => Input({ type: 'email', ...attributes });

/**
 * Creates an `<input type="number">` element.
 * @param {Omit<InputAttributes, 'type'>} [attributes]
 * @returns {HTMLInputElement}
 */
export const NumberInput = (attributes) => Input({ type: 'number', ...attributes });

/**
 * Creates a `<button>` element.
 * @type {function(ButtonAttributes=, NdChild|NdChild[]=): HTMLButtonElement}
 */
export const Button = HtmlElementWrapper('button');

/**
 * Creates a `<button type="button">` element.
 * @param {NdChild|NdChild[]} [child]
 * @param {Omit<ButtonAttributes, 'type'>} [attributes]
 * @returns {HTMLButtonElement}
 */
export const SimpleButton = (child, attributes) => Button(child, { type: 'button', ...attributes });

/**
 * Creates a `<button type="submit">` element.
 * @param {NdChild|NdChild[]} [child]
 * @param {Omit<ButtonAttributes, 'type'>} [attributes]
 * @returns {HTMLButtonElement}
 */
export const SubmitButton = (child, attributes) => Button(child, { type: 'submit', ...attributes });