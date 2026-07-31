import {Span, Button} from '../../../../../elements';
import FieldRender from './FieldRender';
import { $ } from '../../../../core/data/Observable';
import './password-field.css';

export default function PasswordFieldRender($desc, instance) {
    if($desc.visibilityToggle) {
        const $visible = $(false);
        const icons    = $desc.visibilityIcons || {show: '👁', hide: '🙈'};

        const toggleBtn = Button({ type: 'button', class: 'field-visibility-toggle'},
            $visible.transform(v => v ? icons.hide : icons.show),
        );

        toggleBtn.nd.onClick(() => {
            $visible.toggle();
            instance.$input?.setAttribute('type', $visible.val() ? 'text' : 'password');
        });

        $desc.slots.trailing = toggleBtn;
    }

    if($desc.showStrengthMeter) {
        $desc.slots.bottom = buildStrengthMeter($desc);
    }

    return FieldRender($desc, instance);
}

const DEFAULT_STRENGTH_LABELS = {
    0: '',
    1: 'Very weak',
    2: 'Weak',
    3: 'Fair',
    4: 'Strong',
    5: 'Very strong',
};

const buildStrengthMeter = ($desc) => {
    const $strength     = $desc.value?.transform(computeStrength) || $(0);
    const strengthLabels = $desc.strengthLabels || DEFAULT_STRENGTH_LABELS;

    const $label = $strength.transform((score) => strengthLabels[score] || '');

    const $scoreClass = $strength.transform((score) => 'field-strength-bar is-score-' + score);
    const $width      = $strength.transform((score) => (score / 5 * 100) + '%');

    return Span({class: 'field-strength-meter'}, [
        Span({class: 'field-strength-track'},
            Span({class: $scoreClass, style: {width: $width}}),
        ),
        Span({class: 'field-strength-label'}, $label),
    ]);
};

const computeStrength = (password) => {
    if(!password) return 0;
    let score = 0;
    if(password.length >= 8)          score++;
    if(/[A-Z]/.test(password))        score++;
    if(/[a-z]/.test(password))        score++;
    if(/\d/.test(password))           score++;
    if(/[^A-Za-z0-9]/.test(password)) score++;
    return score;
};