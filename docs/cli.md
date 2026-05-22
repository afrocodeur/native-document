---
title: CLI
description: The official NativeDocument CLI for scaffolding projects, pages, components, and services
---

# CLI

The official NativeDocument CLI scaffolds projects, pages, components, and services so you can focus on building.

## Installation

```bash
npm install -g @native-document/cli
```

Verify:

```bash
nd --help
```

> Source: [github.com/afrocodeur/native-document-cli](https://github.com/afrocodeur/native-document-cli)

---

## `nd create` - New Project

### Default structure

```bash
nd create MyApp
cd MyApp
npm install
npm start
```

### Feature-based structure

```bash
nd create MyApp --feature
```

Use `--feature` when you want to organize code by domain feature rather than by file type.

---

## Project Structures

### Default

```
src/
├── main.js
├── index.css
├── core/
│   ├── lang/
│   │   ├── lang.js
│   │   └── locales/
│   │       ├── en.json
│   │       └── fr.json
│   ├── middlewares/
│   └── services/
├── routes/
│   ├── routes.js
│   └── layouts/
│       └── DefaultLayout/
├── components/
├── pages/
│   ├── home/
│   │   ├── HomePage.js
│   │   └── home.css
│   └── not-found/
│       ├── NotFoundPage.js
│       └── not-found.css
└── services/
```

### Feature-based (`--feature`)

Same root structure, plus a `src/features/` folder. Each feature is self-contained:

```
src/features/auth/
├── components/
├── services/
│   └── AuthService/
│       └── AuthService.js
├── utils/
└── index.js       # public API - import from here
```

Import from a feature via its public API:

```javascript
import { AuthService } from '@/features/auth';
```

---

## Generator Commands

### `nd create:page`

Scaffold a new page:

```bash
nd create:page dashboard
nd create:page user/profile    # nested page
```

Generates a page folder with component and CSS file inside `src/pages/`.

### `nd create:component`

Scaffold a reusable component:

```bash
nd create:component UserCard
nd create:component ui/Button  # nested component
```

Generates a component folder inside `src/components/`.

### `nd create:service`

Scaffold a service (business logic + observables):

```bash
nd create:service AuthService
nd create:service api/UserService
```

Generates a service folder inside `src/services/`.

### `nd create:feature` (feature mode only)

Scaffold a complete feature module:

```bash
nd create:feature auth
nd create:feature cart
```

Generates a feature folder inside `src/features/` with its own components, services, and `index.js`.

---

## Available Scripts

After creating a project:

```bash
npm start          # start development server (Vite)
npm run build      # build for production
npm run preview    # preview the production build
npm run lint       # run ESLint
npm run i18n:scan  # scan for missing translation keys
```

---

## Aliases

The `@` alias points to `src/` and is pre-configured in Vite:

```javascript
import { AuthService } from '@/services/AuthService';
import { UserCard }    from '@/components/UserCard';
import { AuthService } from '@/features/auth'; // feature mode
```

---

## Next Steps

- **[Getting Started](./getting-started.md)** - First steps after `nd create`
- **[Routing](./routing.md)** - Define routes in `src/routes/routes.js`
- **[State Management](./state-management.md)** - Organize state with Store groups
- **[i18n & Formatting](./i18n.md)** - Set up translations and locale formatting