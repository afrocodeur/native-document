---
layout: home

hero:
  name: NativeDocument
  text: The declarative rendering of SwiftUI. The power of pure JavaScript.
  tagline: No Virtual DOM. No proprietary syntax. No hook rules. Just modern, performant, predictable Vanilla JS.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/afrocodeur/native-document

features:
  - icon: ⚡
    title: Surgical Reactivity
    details: Your component function runs exactly once. When data changes, NativeDocument updates the exact DOM node in the background. Declarative expressiveness with Vanilla JS performance.

  - icon: 🧠
    title: Zero Cognitive Load
    details: No complex mental model to maintain. No dependency arrays. No hook order rules. Your JavaScript closures stay intact and your execution flow is perfectly linear.

  - icon: 🧩
    title: Natural Component Communication
    details: A child component is a living object, not a black box. Fluid, transparent parent-child communication without forwardRef, defineExpose, or global state overhead.

  - icon: 🇬🇧
    title: Fluent UI Logic
    details: Express your rendering conditions as naturally as a sentence in English. When(isAdmin).show(AdminPanel).otherwise(UserPanel) - pure JS, readable at a glance.

  - icon: 🚀
    title: Official CLI
    details: Scaffold a complete project in one command. nd create my-app. Default and feature-based architectures, i18n, routing and store pre-configured.

  - icon: 🌲
    title: True Tree-Shaking
    details: Only bundle what you use. NativeDocument is designed for bundlers - Vite, Webpack, Rollup. Every import is individually tree-shakeable.
---

## Tired of fighting your framework?

Building a modern UI should not require constant mental gymnastics. Sound familiar?

- **Wild re-renders** - One variable changes and your entire component (or app) recalculates. The larger the app, the more the Virtual DOM weighs on memory.
- **Hook prison** - Juggling `useEffect` order, managing infinite dependency arrays, hunting memory leaks.
- **Magic syntax** - Learning pseudo-HTML or depending on a mystical compiler just to display a list or a condition.

---

## The proof is in the code

```javascript
import { $, Div, Button, Span } from 'native-document';

export function Counter() {
    const count = $(0);

    return Div({ class: 'counter-card' }, [
        Span(['Count: ', count]),
        Button('Increment').nd.onClick(() => count.$value++)
    ]);
}
```

No JSX. No compiler. No rules. Just JavaScript.

---

## Ready to lighten your code?

```bash
npm install -g @native-document/cli
nd create my-awesome-app
```