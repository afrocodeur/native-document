# VitePress Conventions for NativeDocument Docs

## Frontmatter

Every markdown file must start with a frontmatter block:

```yaml
---
title: Page Title
description: One sentence description for SEO and sidebar tooltip
---
```

Special pages:
- Home page (`index.md`) uses the `layout: home` frontmatter with hero and features blocks
- API reference pages can add `outline: deep` to show all heading levels in the right sidebar

---

## Folder & File Structure

```
docs/
├── index.md                        # Home page (layout: home)
├── getting-started.md
├── core-concepts.md
├── observables.md
├── elements.md
├── conditional-rendering.md
├── list-rendering.md
├── routing.md
├── state-management.md
├── lifecycle-events.md
├── native-document-element.md
├── extending-native-document-element.md
├── advanced-components.md
├── validation.md
├── memory-management.md
├── anchor.md
├── svg-elements.md
├── i18n.md
├── components/
│   ├── index.md
│   ├── getting-started.md
│   ├── traits.md
│   ├── layout.md
│   ├── accordion.md
│   ├── alert.md
│   ├── avatar.md
│   ├── breadcrumb.md
│   ├── button.md
│   ├── context-menu.md
│   ├── data-table.md
│   ├── dropdown.md
│   ├── file.md
│   ├── form-fields.md
│   ├── checkbox-radio.md
│   ├── select.md
│   ├── menu.md
│   ├── modal.md
│   ├── slider-stepper.md
│   ├── splitter.md
│   ├── switch.md
│   ├── tabs.md
│   ├── toast.md
│   └── tooltip.md
└── utils/
    ├── cache.md
    ├── native-fetch.md
    └── filters.md
```

---

## Internal Links

VitePress resolves links relative to the current file.
Always use `.md` extension — VitePress strips it at build time.

```markdown
<!-- From docs/readme.md or docs/getting-started.md -->
[Observables](./observables.md)
[Cache](./utils/cache.md)
[Components](./components/index.md)

<!-- From docs/components/accordion.md -->
[Getting Started](./getting-started.md)          <!-- components/getting-started.md -->
[Observables](../observables.md)                 <!-- docs/observables.md -->
[Cache](../utils/cache.md)                       <!-- docs/utils/cache.md -->
```

Never use absolute paths (`/docs/...`) or paths without `.md`.

---

## `.vitepress/config.js` — Sidebar & Nav

```javascript
// .vitepress/config.js
export default {
    title: 'NativeDocument',
    description: 'A reactive JavaScript framework that preserves native DOM simplicity',
    themeConfig: {
        nav: [
            { text: 'Guide',      link: '/getting-started' },
            { text: 'Components', link: '/components/' },
            { text: 'Utilities',  link: '/utils/cache' },
        ],
        sidebar: {
            '/components/': [
                {
                    text: 'Components',
                    items: [
                        { text: 'Overview',          link: '/components/' },
                        { text: 'Getting Started',   link: '/components/getting-started' },
                        { text: 'Traits',            link: '/components/traits' },
                        { text: 'Layout',            link: '/components/layout' },
                        { text: 'Accordion',         link: '/components/accordion' },
                        { text: 'Alert & Feedback',  link: '/components/alert' },
                        { text: 'Avatar',            link: '/components/avatar' },
                        { text: 'Breadcrumb',        link: '/components/breadcrumb' },
                        { text: 'Button',            link: '/components/button' },
                        { text: 'Context Menu',      link: '/components/context-menu' },
                        { text: 'Data Table',        link: '/components/data-table' },
                        { text: 'Dropdown',          link: '/components/dropdown' },
                        { text: 'File Upload',       link: '/components/file' },
                        { text: 'Form Fields',       link: '/components/form-fields' },
                        { text: 'Checkbox & Radio',  link: '/components/checkbox-radio' },
                        { text: 'Select',            link: '/components/select' },
                        { text: 'Menu',              link: '/components/menu' },
                        { text: 'Modal & Popover',   link: '/components/modal' },
                        { text: 'Slider & Stepper',  link: '/components/slider-stepper' },
                        { text: 'Splitter',          link: '/components/splitter' },
                        { text: 'Switch',            link: '/components/switch' },
                        { text: 'Tabs',              link: '/components/tabs' },
                        { text: 'Toast',             link: '/components/toast' },
                        { text: 'Tooltip',           link: '/components/tooltip' },
                    ]
                }
            ],
            '/utils/': [
                {
                    text: 'Utilities',
                    items: [
                        { text: 'Cache',         link: '/utils/cache' },
                        { text: 'NativeFetch',   link: '/utils/native-fetch' },
                        { text: 'Filters',       link: '/utils/filters' },
                    ]
                }
            ],
            '/': [
                {
                    text: 'Guide',
                    items: [
                        { text: 'Getting Started',        link: '/getting-started' },
                        { text: 'Core Concepts',          link: '/core-concepts' },
                        { text: 'Observables',            link: '/observables' },
                        { text: 'Elements',               link: '/elements' },
                        { text: 'Conditional Rendering',  link: '/conditional-rendering' },
                        { text: 'List Rendering',         link: '/list-rendering' },
                        { text: 'Routing',                link: '/routing' },
                        { text: 'State Management',       link: '/state-management' },
                        { text: 'Lifecycle Events',       link: '/lifecycle-events' },
                        { text: 'NDElement',              link: '/native-document-element' },
                        { text: 'Extending NDElement',    link: '/extending-native-document-element' },
                        { text: 'Advanced Components',    link: '/advanced-components' },
                        { text: 'Args Validation',        link: '/validation' },
                        { text: 'Memory Management',      link: '/memory-management' },
                        { text: 'Anchor',                 link: '/anchor' },
                        { text: 'SVG Elements',           link: '/svg-elements' },
                        { text: 'i18n & Formatting',      link: '/i18n' },
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/afrocodeur/native-document' }
        ]
    }
}
```

---

## Page Template

Every doc page follows this structure:

```markdown
---
title: Page Title
description: One sentence description
---

# Page Title

Brief intro paragraph.

## Section

Content.

## Next Steps

- [Link to related page](./related.md)
- [Another link](./other.md)
```

---

## Rules Applied to All Files

1. Every file starts with frontmatter (`title` + `description`)
2. All internal links use relative paths with `.md` extension
3. No `docs/` prefix in any link (files are already inside `docs/`)
4. Utility links: `./utils/cache.md`, `./utils/native-fetch.md`, `./utils/filters.md`
5. Component links from guide pages: `./components/index.md`
6. Component links from component pages: `../observables.md` to go up to guide
7. The "Next Steps" section at the bottom of each page replaces the old flat link lists