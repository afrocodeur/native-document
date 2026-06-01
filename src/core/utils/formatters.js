const $parseDateParts = (value, locale) => {
    const d = new Date(value);
    return {
        d,
        parts: new Intl.DateTimeFormat(locale, {
            year:   'numeric',
            month:  'long',
            day:    '2-digit',
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).formatToParts(d).reduce((acc, { type, value }) => {
            acc[type] = value;
            return acc;
        }, {}),
    };
};

const $applyDatePattern = (pattern, d, parts) => {
    const pad = n => String(n).padStart(2, '0');
    return pattern
        .replace('YYYY', parts.year)
        .replace('YY',   parts.year.slice(-2))
        .replace('MMMM', parts.month)
        .replace('MMM',  parts.month.slice(0, 3))
        .replace('MM',   pad(d.getMonth() + 1))
        .replace('DD',   pad(d.getDate()))
        .replace('D',    d.getDate())
        .replace('HH',   parts.hour)
        .replace('mm',   parts.minute)
        .replace('ss',   parts.second);
};

export const Formatters = {
    currency: (value, locale, { currency = 'XOF', notation, minimumFractionDigits, maximumFractionDigits } = {}) =>
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            notation,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(value),

    number: (value, locale, { notation, minimumFractionDigits, maximumFractionDigits } = {}) =>
        new Intl.NumberFormat(locale, {
            notation,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(value),

    percent: (value, locale, { decimals = 1 } = {}) =>
        new Intl.NumberFormat(locale, {
            style:                'percent',
            maximumFractionDigits: decimals,
        }).format(value),

    date: (value, locale, { format, dateStyle = 'long' } = {}) => {
        if (format) {
            const { d, parts } = $parseDateParts(value, locale);
            return $applyDatePattern(format, d, parts);
        }
        return new Intl.DateTimeFormat(locale, { dateStyle }).format(new Date(value));
    },

    time: (value, locale, { format, hour = '2-digit', minute = '2-digit', second } = {}) => {
        if (format) {
            const { d, parts } = $parseDateParts(value, locale);
            return $applyDatePattern(format, d, parts);
        }
        return new Intl.DateTimeFormat(locale, { hour, minute, second }).format(new Date(value));
    },

    datetime: (value, locale, { format, dateStyle = 'long', hour = '2-digit', minute = '2-digit', second } = {}) => {
        if (format) {
            const { d, parts } = $parseDateParts(value, locale);
            return $applyDatePattern(format, d, parts);
        }
        return new Intl.DateTimeFormat(locale, { dateStyle, hour, minute, second }).format(new Date(value));
    },

    relative: (value, locale, { unit = 'day', numeric = 'auto' } = {}) => {
        const diff = Math.round((value - Date.now()) / (1000 * 60 * 60 * 24));
        return new Intl.RelativeTimeFormat(locale, { numeric }).format(diff, unit);
    },

    plural: (value, locale, { singular, plural } = {}) => {
        const rule = new Intl.PluralRules(locale).select(value);
        return `${value} ${rule === 'one' ? singular : plural}`;
    },
};