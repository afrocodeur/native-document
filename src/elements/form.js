import HtmlElementWrapper from "../wrappers/HtmlElementWrapper";


export const Form = HtmlElementWrapper('form', function(el) {

    el.submit = function(action) {
        if(typeof action === 'function') {
            el.on.submit((e) => {
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

export const Input = HtmlElementWrapper('input');

export const TextArea = HtmlElementWrapper('textarea');
export const TextInput = TextArea;

export const Select = HtmlElementWrapper('select');
export const FieldSet = HtmlElementWrapper('fieldset', );
export const Option = HtmlElementWrapper('option');
export const Legend = HtmlElementWrapper('legend');
export const Datalist = HtmlElementWrapper('datalist');
export const Output = HtmlElementWrapper('output');
export const Progress = HtmlElementWrapper('progress');
export const Meter = HtmlElementWrapper('meter');

export const ReadonlyInput = (attributes) => Input({ readonly: true, ...attributes });
export const HiddenInput = (attributes) => Input({type: 'hidden', ...attributes });
export const FileInput = (attributes) => Input({ type: 'file', ...attributes });
export const PasswordInput = (attributes) => Input({ type: 'password', ...attributes });
export const Checkbox = (attributes) => Input({ type: 'checkbox', ...attributes });
export const Radio = (attributes) => Input({ type: 'radio', ...attributes });

export const RangeInput = (attributes) => Input({ type: 'range', ...attributes });
export const ColorInput = (attributes) => Input({ type: 'color', ...attributes });
export const DateInput = (attributes) => Input({ type: 'date', ...attributes });
export const TimeInput = (attributes) => Input({ type: 'time', ...attributes });
export const DateTimeInput = (attributes) => Input({ type: 'datetime-local', ...attributes });
export const WeekInput = (attributes) => Input({ type: 'week', ...attributes });
export const MonthInput = (attributes) => Input({ type: 'month', ...attributes });
export const SearchInput = (attributes) => Input({ type: 'search', ...attributes });
export const TelInput = (attributes) => Input({ type: 'tel', ...attributes });
export const UrlInput = (attributes) => Input({ type: 'url', ...attributes });
export const EmailInput = (attributes) => Input({ type: 'email', ...attributes });
export const NumberInput = (attributes) => Input({ type: 'number', ...attributes });


export const Button = HtmlElementWrapper('button');
export const SimpleButton = (child, attributes) => Button(child, { type: 'button', ...attributes });
export const SubmitButton = (child, attributes) => Button(child, { type: 'submit', ...attributes });

