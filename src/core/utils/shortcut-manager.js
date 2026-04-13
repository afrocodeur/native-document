import DebugManager from '../../core/utils/debug-manager';

const isMac = navigator.platform.toUpperCase().includes('MAC')
    || navigator.userAgent.includes('Mac');

const MAC_SYMBOLS = {
    meta:  '⌘',
    shift: '⇧',
    alt:   '⌥',
    ctrl:  '⌃',
};

const WIN_LABELS = {
    meta:  'Ctrl',
    shift: 'Shift',
    alt:   'Alt',
    ctrl:  'Ctrl',
};

/**
 * Parse a shortcut string into a normalized object.
 * Supports:
 *   Short convention : '+S', '++S', '+Shift+S'
 *   Standard         : 'Ctrl+S', 'Cmd+S', 'Ctrl+Alt+S'
 */
const parse = (shortcut) => {
    if(!shortcut) return null;

    const result = { meta: false, shift: false, alt: false, ctrl: false, key: '' };

    // Short convention — starts with '+'
    if(shortcut.startsWith('+')) {
        result.meta = true;

        let rest = shortcut.slice(1);

        // '++S' → alt
        if(rest.startsWith('+')) {
            result.alt = true;
            rest = rest.slice(1);
        }

        const parts = rest.split('+').filter(Boolean);

        for(const part of parts) {
            const upper = part.toUpperCase();
            if(upper === 'SHIFT')      result.shift = true;
            else if(upper === 'ALT')   result.alt   = true;
            else if(upper === 'CTRL')  result.ctrl  = true;
            else                       result.key   = part.toUpperCase();
        }

        return result;
    }

    // Standard convention — 'Ctrl+S', 'Cmd+Shift+S'
    const parts = shortcut.split('+').filter(Boolean);

    for(const part of parts) {
        const upper = part.toUpperCase();
        if(upper === 'CTRL' || upper === 'CMD' || upper === 'META') result.meta  = true;
        else if(upper === 'SHIFT')                                   result.shift = true;
        else if(upper === 'ALT' || upper === 'OPTION')               result.alt   = true;
        else                                                         result.key   = part.toUpperCase();
    }

    return result;
};

/**
 * Normalize a parsed shortcut to a canonical key string
 * used for storage and comparison.
 */
const normalize = (parsed) => {
    const parts = [];
    if(parsed.meta)  parts.push('meta');
    if(parsed.ctrl)  parts.push('ctrl');
    if(parsed.shift) parts.push('shift');
    if(parsed.alt)   parts.push('alt');
    parts.push(parsed.key.toLowerCase());
    return parts.join('+');
};

const displayOnMac = (shortcut) => {
    const parsed = parse(shortcut);
    if(!parsed) return '';

    const parts = [];

    if(parsed.meta) {
        parts.push(MAC_SYMBOLS.meta);
    }
    if(parsed.ctrl) {
        parts.push(MAC_SYMBOLS.ctrl);
    }
    if(parsed.shift) {
        parts.push(MAC_SYMBOLS.shift);
    }
    if(parsed.alt) {
        parts.push(MAC_SYMBOLS.alt);
    }
    parts.push(parsed.key);

    return parts.join(' ');
};

const displayOnWindows = (shortcut) => {
    const parsed = parse(shortcut);
    if(!parsed) return '';

    const parts = [];
    if(parsed.meta || parsed.ctrl) {
        parts.push(WIN_LABELS.meta);
    }
    if(parsed.shift) {
        parts.push(WIN_LABELS.shift);
    }
    if(parsed.alt) {
        parts.push(WIN_LABELS.alt);
    }
    parts.push(parsed.key);

    return parts.join('+');
}

/**
 * Display a shortcut string for the current OS.
 */
const display = isMac ? displayOnMac : displayOnWindows;

const $registry   = new Map();
const $handlers   = new Map();

const ShortcutManager = {

    /**
     * Register a shortcut.
     * @param {string} shortcut
     * @param {Function} handler
     * @param {{ context?: string, force?: boolean, source?: string }} options
     */
    register(shortcut, handler, options = {}) {
        const parsed = parse(shortcut);
        if(!parsed || !parsed.key) {
            DebugManager.warn(`ShortcutManager: invalid shortcut "${shortcut}"`);
            return this;
        }

        const key     = normalize(parsed);
        const context = options.context || 'global';
        const source  = options.source  || 'unknown';
        const mapKey  = context + ':' + key;

        if($registry.has(mapKey) && !options.force) {
            const existing = $registry.get(mapKey);
            DebugManager.warn(
                `ShortcutManager: "${shortcut}" is already registered by "${existing.source}" in context "${context}". Use { force: true } to override.`
            );
            return this;
        }

        $registry.set(mapKey, {handler, source, context, parsed});
        return this;
    },

    /**
     * Unregister a shortcut.
     */
    unregister(shortcut, context = 'global') {
        const parsed = parse(shortcut);
        if(!parsed) return this;

        const key    = normalize(parsed);
        const mapKey = context + ':' + key;

        $registry.delete(mapKey);
        return this;
    },

    /**
     * Display a shortcut for the current OS.
     */
    display,

    /**
     * Parse a shortcut string.
     */
    parse,

    /**
     * Check if a shortcut is registered.
     */
    has(shortcut, context = 'global') {
        const parsed = parse(shortcut);
        if(!parsed) return false;
        return $registry.has(context + ':' + normalize(parsed));
    },

    /**
     * Initialize the global keyboard listener.
     */
    init() {
        if(this.$initialized) {
            return this;
        }

        this.$initialized = true;

        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();

            const parts = [];
            if(e.metaKey || e.ctrlKey) parts.push('meta');
            if(e.ctrlKey && !e.metaKey) parts.push('ctrl');
            if(e.shiftKey)              parts.push('shift');
            if(e.altKey)                parts.push('alt');
            parts.push(key.toLowerCase());
            parts.push(key.toLowerCase());

            const normalizedKey = parts.join('+');

            const globalKey = 'global:' + normalizedKey;
            if($registry.has(globalKey)) {
                e.preventDefault();
                $registry.get(globalKey).handler(e);
                return;
            }

            for(const [mapKey, entry] of $registry.entries()) {
                if(mapKey.endsWith(':' + normalizedKey) && entry.context !== 'global') {
                    e.preventDefault();
                    entry.handler(e);
                    return;
                }
            }
        });

        return this;
    },
};

export default ShortcutManager;