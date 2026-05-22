---
title: Button
description: Headless Button component with variants, sizes, loading state, icons, and presets
---

# Button

```javascript
import { Button } from 'native-document/components';

Button(label, props?)
```

## Default Renderer

```javascript
import { ButtonRender } from 'native-document/ui';
import { SpinnerRender } from 'native-document/ui';

Button.use(ButtonRender);
Spinner.use(SpinnerRender); // required - loading state is rendered as a spinner
```

## `$description`

```javascript
{
    label:            'Submit',
        type:             null,         // 'button' | 'submit' | 'reset'
        variant:          null,
        size:             null,         // 'small' | 'medium' | 'large'
        icon:             null,         // DOM element
        iconPosition:     'leading',    // 'leading' | 'trailing' | 'top' | 'bottom'
        iconOnly:         false,
        loading:          null,         // Observable<boolean>
        disabled:         null,         // Observable<boolean>
        outline:          false,
        block:            false,
        borderRadiusType: null,         // 'rounded' | 'pill' | 'circle' | 'smooth'
        props:            {} // HTML attributes for the root element
}
```

## Methods

### Variants

```javascript
.primary()
    .secondary()
    .danger()
    .success()
    .warning()
    .ghost()
    .link()
    .outline()
```

### Size

```javascript
.small()
    .medium()
    .large()
```

### Shape

```javascript
.rounded()
    .pill()
    .circle()
    .smooth()
```

### Icon

```javascript
.icon(element, position?)
    .iconAtLeading()
    .iconAtTrailing()
    .iconAtTop()
    .iconAtBottom()
    .iconOnly()
```

### State

```javascript
.loading(observable | true)
    .disabled(observable | true)
    .block()
    .type('submit')
```

## Example

```javascript
const isLoading = Observable(false);

Button('Save Changes')
    .primary()
    .large()
    .rounded()
    .loading(isLoading)
    .icon(SaveIcon)
    .nd
    .onClick(async () => {
        isLoading.set(true);
        await save();
        isLoading.set(false);
    })
```

## Presets

```javascript
Button.preset('save', (label, props) => {
    return Button(label || 'Save', props).primary();
});
Button.preset('cancel', (label, props) => {
    return Button(label || 'Cancel', props).ghost();
});

Button.save()
Button.cancel('Go back')
```

## Custom Renderer Example

```javascript
Button.use(($description) => {
    return NativeButton({
        type:     $description.type || 'button',
        class:    buildClasses($description),
        disabled: $description.disabled,
        ...$description.props
    }, [
        ShowIf($description.loading, () => Spinner()),
        ShowIf($description.icon && $description.iconPosition === 'leading', () => $description.icon),
        ShowIf(!$description.iconOnly, $description.label),
        ShowIf($description.icon && $description.iconPosition === 'trailing', () => $description.icon),
    ]);
});
```

---

## Theming

```css
:root {
    --btn-height-small:            28px;
    --btn-height-medium:           36px;
    --btn-height-large:            44px;
    --btn-padding-small:           0 var(--space-cozy-comfortable);
    --btn-padding-medium:          0 var(--space-comfortable);
    --btn-padding-large:           0 var(--space-relaxed);
    --btn-font-size-small:         var(--note-size);
    --btn-font-size-medium:        var(--description-size);
    --btn-font-size-large:         var(--text-size);
    --btn-icon-size-small:         14px;
    --btn-icon-size-medium:        16px;
    --btn-icon-size-large:         18px;
    --btn-loader-size:             14px;
    --btn-gap:                     var(--space-cozy);
    --btn-font-weight:             500;
    --btn-transition:              background 120ms ease, color 120ms ease, border-color 120ms ease;
    --btn-disabled-opacity:        0.45;
    --btn-color-primary:           var(--color-primary);
    --btn-color-primary-hover:     var(--color-primary-hover);
    --btn-color-secondary:         var(--color-secondary);
    --btn-color-secondary-hover:   var(--color-secondary-hover);
    --btn-color-danger:            var(--color-danger);
    --btn-color-danger-hover:      var(--color-danger-hover);
    --btn-color-success:           var(--color-success);
    --btn-color-success-hover:     var(--color-success-hover);
    --btn-color-warning:           var(--color-warning);
    --btn-color-warning-hover:     var(--color-warning-hover);
    --btn-color-info:              var(--color-info);
    --btn-color-info-hover:        var(--color-info-hover);
}
```