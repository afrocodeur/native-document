import { defineConfig } from 'vitepress'

export default defineConfig({
    title:       'NativeDocument',
    description: 'A reactive JavaScript framework that preserves native DOM simplicity without sacrificing modern features',

    themeConfig: {
        logo: '/logo.svg',

        nav: [
            { text: 'Guide',      link: '/getting-started' },
            { text: 'Components', link: '/components/' },
            { text: 'Utilities',  link: '/utils/cache' },
            {
                text: 'v1.0.161',
                items: [
                    { text: 'Changelog', link: 'https://github.com/afrocodeur/native-document/releases' },
                    { text: 'GitHub',    link: 'https://github.com/afrocodeur/native-document' }
                ]
            }
        ],

        sidebar: {
            '/components/': [
                {
                    text: 'Components',
                    items: [
                        { text: 'Overview',         link: '/components/' },
                        { text: 'Getting Started',  link: '/components/getting-started' },
                        { text: 'Traits',           link: '/components/traits' },
                    ]
                },
                {
                    text: 'Layout',
                    items: [
                        { text: 'Layout',           link: '/components/layout' },
                        { text: 'Splitter',         link: '/components/splitter' },
                    ]
                },
                {
                    text: 'Display',
                    items: [
                        { text: 'Alert & Feedback', link: '/components/alert' },
                        { text: 'Avatar',           link: '/components/avatar' },
                        { text: 'Badge',            link: '/components/alert' },
                        { text: 'Breadcrumb',       link: '/components/breadcrumb' },
                        { text: 'Tooltip',          link: '/components/tooltip' },
                        { text: 'Toast',            link: '/components/toast' },
                    ]
                },
                {
                    text: 'Navigation',
                    items: [
                        { text: 'Menu',             link: '/components/menu' },
                        { text: 'Tabs',             link: '/components/tabs' },
                        { text: 'Dropdown',         link: '/components/dropdown' },
                        { text: 'Context Menu',     link: '/components/context-menu' },
                        { text: 'Breadcrumb',       link: '/components/breadcrumb' },
                    ]
                },
                {
                    text: 'Overlay',
                    items: [
                        { text: 'Modal & Popover',  link: '/components/modal' },
                    ]
                },
                {
                    text: 'Data',
                    items: [
                        { text: 'Data Table',       link: '/components/data-table' },
                        { text: 'Accordion',        link: '/components/accordion' },
                    ]
                },
                {
                    text: 'Forms',
                    items: [
                        { text: 'Button',           link: '/components/button' },
                        { text: 'Form Fields',      link: '/components/form-fields' },
                        { text: 'Checkbox & Radio', link: '/components/checkbox-radio' },
                        { text: 'Select',           link: '/components/select' },
                        { text: 'File Upload',      link: '/components/file' },
                        { text: 'Slider & Stepper', link: '/components/slider-stepper' },
                        { text: 'Switch',           link: '/components/switch' },
                    ]
                }
            ],

            '/utils/': [
                {
                    text: 'Utilities',
                    items: [
                        { text: 'Cache',       link: '/utils/cache' },
                        { text: 'NativeFetch', link: '/utils/native-fetch' },
                        { text: 'Filters',     link: '/utils/filters' },
                    ]
                }
            ],

            '/': [
                {
                    text: 'Introduction',
                    items: [
                        { text: 'Getting Started',       link: '/getting-started' },
                        { text: 'CLI',                   link: '/cli' },
                        { text: 'Core Concepts',         link: '/core-concepts' },
                    ]
                },
                {
                    text: 'Essentials',
                    items: [
                        { text: 'Observables',           link: '/observables' },
                        { text: 'Observable Resource',   link: '/observable-resource' },
                        { text: 'Elements',              link: '/elements' },
                        { text: 'Conditional Rendering', link: '/conditional-rendering' },
                        { text: 'List Rendering',        link: '/list-rendering' },
                        { text: 'Anchor',                link: '/anchor' },
                    ]
                },
                {
                    text: 'Application',
                    items: [
                        { text: 'Routing',               link: '/routing' },
                        { text: 'State Management',      link: '/state-management' },
                        { text: 'i18n & Formatting',     link: '/i18n' },
                        { text: 'SVG Elements',          link: '/svg-elements' },
                    ]
                },
                {
                    text: 'NDElement',
                    items: [
                        { text: 'NDElement',             link: '/native-document-element' },
                        { text: 'Extending NDElement',   link: '/extending-native-document-element' },
                        { text: 'Lifecycle Events',      link: '/lifecycle-events' },
                        { text: 'Advanced Components',   link: '/advanced-components' },
                    ]
                },
                {
                    text: 'Advanced',
                    items: [
                        { text: 'Args Validation',       link: '/validation' },
                        { text: 'Memory Management',     link: '/memory-management' },
                    ]
                },
                {
                    text: 'Contributing',
                    items: [
                        { text: 'Contributing',          link: '/contributing' },
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/afrocodeur/native-document' }
        ],

        footer: {
            message:   'Released under the MIT License.',
            copyright: 'Copyright © 2024 AfroCodeur'
        },

        search: {
            provider: 'local'
        }
    }
})