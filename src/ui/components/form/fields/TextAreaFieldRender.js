import {Span, TextArea} from '../../../../../elements';
import FieldRender from './FieldRender';

export default function TextAreaFieldRender($desc, instance) {
    if($desc.characterCounter) {
        $desc.slots.bottom = buildCharacterCounter($desc);
    }

    if($desc.wordCount) {
        $desc.slots.bottom = buildWordCounter($desc);
    }

    const textarea = buildTextarea($desc, instance);
    return FieldRender($desc, instance, textarea);
}

const buildTextarea = ($desc, instance) => {
    const textareaProps = {
        class:       'field-input field-textarea is-resize-' + ($desc.resize || 'vertical'),
        name:        $desc.name,
        value:        $desc.value,
        id:          $desc.id || $desc.name,
        placeholder: $desc.placeholder,
        disabled:    $desc.disabled,
        readonly:    $desc.readonly,
        rows:        $desc.rows || 4,
        cols:        $desc.cols || null,
        ...($desc.elementsProps.input || {}),
    };

    const textarea = TextArea(textareaProps, $desc.value);

    instance.$input = textarea;

    if($desc.autoGrow) {
        setupAutoGrow(textarea);
    }

    return textarea;
};

const setupAutoGrow = (textarea) => {
    const adjust = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    textarea.nd.onInput(adjust);
    requestAnimationFrame(adjust);
};

const buildCharacterCounter = ($desc) => {
    const $count = $desc.value?.__$isObservable
        ? $desc.value.transform(v => (v || '').length)
        : 0;

    const $isOver = $desc.value?.__$isObservable
        ? $desc.value.transform(v => (v || '').length > $desc.maxLength)
        : false;

    return Span({
        class: $isOver
            ? 'field-character-counter is-over-limit'
            : 'field-character-counter',
    }, [$count, ' / ', $desc.maxLength]);
};

const buildWordCounter = ($desc) => {
    const countWords = (value) => {
        const cleanedValue = value?.trim();
        if(!cleanedValue) {
            return 0;
        }
        return cleanedValue.split(/\s+/).length;
    };
    const $count = $desc.value?.__$Observable
        ? $desc.value.transform(countWords)
        : 0;

    const $isOver = ($desc.wordCount?.max && $desc.value?.__$Observable)
        ? $desc.value.transform(v => {
            const words = countWords(v);
            return words > $desc.wordCount.max;
        })
        : false;

    const label = $desc.wordCount?.max
        ? [$count, ' / ', $desc.wordCount.max, ' words']
        : [$count, ' words'];

    return Span({
        class: $isOver
            ? 'field-character-counter is-over-limit'
            : 'field-character-counter',
    }, label);
};