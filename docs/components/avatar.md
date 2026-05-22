---
title: Avatar
description: Avatar and AvatarGroup components for displaying user profile pictures, initials, or icons
---

# Avatar

```javascript
import { Avatar, AvatarGroup } from 'native-document/components';

Avatar(source?, props?)
```

## Default Renderer

```javascript
import { AvatarRender, AvatarGroupRender } from 'native-document/ui';

Avatar.use(AvatarRender);
AvatarGroup.use(AvatarGroupRender);
```

## `$description`

```javascript
{
    src:       null,     // string | Observable<string>
    alt:       null,
    name:      null,     // full name - initials auto-generated
    initials:  null,     // explicit initials override
    icon:      null,     // DOM element fallback
    size:      'medium', // 'xs' | 'small' | 'medium' | 'large' | 'xl'
    shape:     'circle', // 'circle' | 'square' | 'rounded'
    variant:   null,     // background color variant
    color:     null,     // custom background color
    textColor: null,
    status:    null,     // 'online' | 'offline' | 'busy' | 'away'
    props:     {} // HTML attributes for the root element
}
```

## Methods

```javascript
// Source
.src('/images/alice.jpg')
.src(Observable('/api/user/avatar'))  // reactive
.alt('Alice Johnson')

// Name & initials
.name('Alice Johnson')    // auto-generates initials 'AJ'
.initials('AJ')           // explicit initials

// Fallback when no src
.icon(UserIcon)

// Size
.extraSmall()
.small()
.medium()
.large()
.extraLarge()

// Shape
.circle()
.square()
.rounded()

// Color (for initials/icon fallback)
.primary()
.success()
.danger()
.warning()
.info()
.color('#6366f1')
.textColor('#fff')

// Status indicator
.status('online')   // green dot
.status('offline')  // gray dot
.status('busy')     // red dot
.status('away')     // yellow dot
.statusAtTopLeading()
.statusAtBottomLeading()
.statusAtTopTrailing()
.statusAtBottomTrailing()
```

## Example

```javascript
Avatar(user.avatar)
    .name(user.name)
    .status(user.status)
    .large()

// With initials fallback
Avatar()
    .name('Alice Johnson')
    .primary()
    .circle()
```

---

## `AvatarGroup`

```javascript
AvatarGroup(props?)
```

Displays a stack of overlapping avatars.

### Methods

```javascript
.item(avatar)                       // add an Avatar instance
.items([avatar1, avatar2])          // add multiple
.max(5)                             // show max N avatars, then "+N more"
.overlap(12)                        // overlap in px
.onMoreClick((count) => showAll())  // callback when "+N" is clicked
```

### Example

```javascript
AvatarGroup()
    .item(Avatar(user1.avatar).name(user1.name))
    .item(Avatar(user2.avatar).name(user2.name))
    .item(Avatar(user3.avatar).name(user3.name))
    .max(5)
    .overlap(12)
    .onMoreClick((count) => showAllMembers())
```

---

## Theming

```css
:root {
    --avatar-size-extra-small:    24px;
    --avatar-size-small:          32px;
    --avatar-size-medium:         40px;
    --avatar-size-large:          56px;
    --avatar-size-extra-large:    72px;
    --avatar-status-size:         10px;
    --avatar-status-offset:       1px;
    --avatar-color-primary:       var(--color-primary);
    --avatar-color-secondary:     var(--color-secondary);
    --avatar-color-success:       var(--color-success);
    --avatar-color-danger:        var(--color-danger);
    --avatar-color-warning:       var(--color-warning);
    --avatar-color-info:          var(--color-info);
    /* AvatarGroup */
    --avatar-group-overlap:       -15px;
    --avatar-group-more-text-color:       var(--white);
    --avatar-group-more-background-color: var(--gray-lite-4);
}
```