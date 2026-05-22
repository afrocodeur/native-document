---
title: Stepper
description: Multi-step wizard component with validation, navigation, and custom renderers
---

# Stepper

```javascript
import { Stepper, StepperStep } from 'native-document/components';
```

## Default Renderer

```javascript
import { StepperRender, StepperStepRender } from 'native-document/ui';

Stepper.use(StepperRender);
StepperStep.use(StepperStepRender);
```

---

## `Stepper`

### Configuration

| Method | Parameters | Description |
|---|---|---|
| `.step(step)` | `step: StepperStep` | Add a step |
| `.data(data)` | `data: *` | Initial data passed to all steps |
| `.currentStep(obs)` | `obs: Observable<number>` | Bind the current step index to an observable |
| `.linear(enabled?)` | `enabled?: boolean` | Steps must complete in order (default) |
| `.nonLinear()` | - | Can jump to any step freely |
| `.editable(enabled?)` | `enabled?: boolean` | Allow returning to completed steps |
| `.horizontal()` | - | Horizontal layout (default) |
| `.vertical()` | - | Vertical layout |
| `.alternativeLabel(enabled?)` | `enabled?: boolean` | Labels below the indicators |
| `.showNumbers(enabled?)` | `enabled?: boolean` | Show step numbers in indicators |
| `.showConnector(enabled?)` | `enabled?: boolean` | Show connector line between steps |

### Navigation position

| Method | Description |
|---|---|
| `.navigationAtBottom()` | Navigation buttons at the bottom, horizontal layout |
| `.navigationAtTop()` | Navigation buttons at the top, horizontal layout |
| `.navigationAtLeading()` | Navigation buttons on the leading side, vertical layout |

### Navigation methods

| Method | Parameters | Description |
|---|---|---|
| `await stepper.next()` | - | Validates current step, then advances |
| `stepper.previous()` | - | Go to previous step |
| `await stepper.goToStep(index)` | `index: number` | Jump to a step (0-indexed) |
| `stepper.reset()` | - | Reset to step 0 |

### Events

| Method | Parameters | Description |
|---|---|---|
| `.onStepChange(handler)` | `handler: (current, previous) => void` | Fires on every step change |
| `.onNext(handler)` | `handler: (step, index) => void` | Fires when advancing |
| `.onPrevious(handler)` | `handler: (step, index) => void` | Fires when going back |
| `.onComplete(handler)` | `handler: (data) => void` | Fires when last step is completed |
| `.onReset(handler)` | `handler: () => void` | Fires on reset |

### Custom renderers

| Method | Parameters | Description |
|---|---|---|
| `.renderStepIndicator(fn)` | `fn: ($step) => NdChild` | Custom step indicator (circle/icon) |
| `.renderStepIndicatorConnector(fn)` | `fn: ($step) => NdChild` | Custom connector between indicators |
| `.renderContent(fn)` | `fn: ($step) => NdChild` | Custom step content wrapper |

---

## `StepperStep`

```javascript
StepperStep(title)
```

| Method | Parameters | Description |
|---|---|---|
| `.description(text)` | `text: string` | Subtitle below the step title |
| `.icon(element)` | `element: NdChild` | Icon displayed in the indicator |
| `.content(element)` | `element: NdChild` | Step body content |
| `.key(key)` | `key: string` | Unique identifier for this step |
| `.optional()` | - | Mark step as optional (can be skipped) |
| `.disabled(val)` | `val: boolean \| Observable<boolean>` | Disable the step |
| `.visibility(val)` | `val: boolean \| Observable<boolean>` | Show or hide the step reactively |
| `.validator(fn)` | `fn: () => boolean \| Promise<boolean>` | Validation function - must return `true` to advance |

---

## Example

```javascript
const refs = {};

const wizard = Stepper()
    .linear()
    .step(
        StepperStep('Account')
            .content(AccountForm().nd.refSelf(refs, 'accountForm'))
            .validator(async () => refs.accountForm.validate())
    )
    .step(
        StepperStep('Profile')
            .description('Tell us about yourself')
            .content(ProfileForm)
            .optional()
    )
    .step(
        StepperStep('Done')
            .icon(CheckIcon)
            .content(SuccessPanel)
    )
    .navigationAtBottom()
    .onComplete(async (data) => {
        await registerUser(data);
    })

document.body.appendChild(wizard);
```


---

## Theming

```css
:root {
    --stepper-connector-color:           var(--gray-lite-3);
    --stepper-connector-color-active:    var(--color-primary);
    --stepper-connector-color-completed: var(--color-success);
    --stepper-connector-thickness:       2px;
    --step-indicator-size:               32px;
    --step-indicator-bg:                 var(--gray-lite-4);
    --step-indicator-bg-active:          var(--color-primary);
    --step-indicator-bg-completed:       var(--color-success);
    --step-indicator-bg-error:           var(--color-danger);
    --step-indicator-color:              var(--gray);
    --step-indicator-color-active:       var(--white);
    --step-indicator-font-size:          var(--hint-size);
    --step-indicator-font-weight:        600;
    --step-label-size:                   var(--hint-size);
    --step-label-color:                  var(--gray);
    --step-label-color-active:           var(--text-color);
    --step-label-weight:                 500;
    --step-description-size:             var(--note-size);
    --step-description-color:            var(--gray);
    --stepper-content-padding:           var(--space-comfortable) 0;
}
```

---

## Next Steps

- **[Components Overview](./index.md)** - BaseComponent philosophy
- **[FormControl](./form/form-control.md)** - Form validation with steps
