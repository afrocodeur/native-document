import {Validator} from "../../../../index";

export const Validation = {

    required(value) {
        const valid = value !== null && value !== undefined && value !== '';
        return {
            valid,
            message: 'This field is required'
        };
    },

    minLength(value, min) {
        if (!value) return { valid: true };
        const valid = value.length >= min;
        return {
            valid,
            message: `Minimum ${min} characters required`
        };
    },

    maxLength(value, max) {
        if (!value) return { valid: true };
        const valid = value.length <= max;
        return {
            valid,
            message: `Maximum ${max} characters allowed`
        };
    },

    length(value, length) {
        if (!value) return { valid: true };
        const valid = value.length === length;
        return {
            valid,
            message: `Must be exactly ${length} characters`
        };
    },

    email(value) {
        if (!value) return { valid: true };
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = regex.test(value);
        return {
            valid,
            message: 'Invalid email address'
        };
    },

    pattern(value, regex) {
        if (!value) return { valid: true };
        const valid = regex.test(value);
        return {
            valid,
            message: 'Invalid format'
        };
    },

    alphaOnly(value) {
        if (!value) return { valid: true };
        const valid = /^[a-zA-Z]+$/.test(value);
        return {
            valid,
            message: 'Only letters allowed'
        };
    },

    numericOnly(value) {
        if (!value) return { valid: true };
        const valid = /^[0-9]+$/.test(value);
        return {
            valid,
            message: 'Only numbers allowed'
        };
    },

    alphaNumeric(value) {
        if (!value) return { valid: true };
        const valid = /^[a-zA-Z0-9]+$/.test(value);
        return {
            valid,
            message: 'Only letters and numbers allowed'
        };
    },

    min(value, min) {
        if (value === null || value === undefined || value === '') return { valid: true };
        const valid = Number(value) >= min;
        return {
            valid,
            message: `Minimum value is ${min}`
        };
    },

    max(value, max) {
        if (value === null || value === undefined || value === '') return { valid: true };
        const valid = Number(value) <= max;
        return {
            valid,
            message: `Maximum value is ${max}`
        };
    },

    between(value, min, max) {
        if (value === null || value === undefined || value === '') return { valid: true };
        const num = Number(value);
        const valid = num >= min && num <= max;
        return {
            valid,
            message: `Value must be between ${min} and ${max}`
        };
    },

    integer(value) {
        if (!value) return { valid: true };
        const valid = /^-?\d+$/.test(value);
        return {
            valid,
            message: 'Must be an integer'
        };
    },

    positive(value) {
        if (value === null || value === undefined || value === '') return { valid: true };
        const valid = Number(value) > 0;
        return {
            valid,
            message: 'Must be positive'
        };
    },

    negative(value) {
        if (value === null || value === undefined || value === '') return { valid: true };
        const valid = Number(value) < 0;
        return {
            valid,
            message: 'Must be negative'
        };
    },

    same(value, otherValue) {
        const valid = value === otherValue;
        return {
            valid,
            message: 'Values must match'
        };
    },

    different(value, otherValue) {
        const valid = value !== otherValue;
        return {
            valid,
            message: 'Values must be different'
        };
    },

    url(value) {
        if (!value) return { valid: true };
        try {
            new URL(value);
            return { valid: true };
        } catch {
            return {
                valid: false,
                message: 'Invalid URL'
            };
        }
    },

    phone(value) {
        if (!value) return { valid: true };
        // International phone format
        const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        const valid = regex.test(value);
        return {
            valid,
            message: 'Invalid phone number'
        };
    },

    date(value) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const valid = !isNaN(date.getTime());
        return {
            valid,
            message: 'Invalid date'
        };
    },

    after(value, afterDate) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const compareDate = new Date(afterDate);
        const valid = date > compareDate;
        return {
            valid,
            message: `Date must be after ${afterDate}`
        };
    },

    before(value, beforeDate) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const compareDate = new Date(beforeDate);
        const valid = date < compareDate;
        return {
            valid,
            message: `Date must be before ${beforeDate}`
        };
    },

    maxSize(file, maxBytes) {
        if (!file) return { valid: true };
        const valid = file.size <= maxBytes;
        const mb = (maxBytes / (1024 * 1024)).toFixed(2);
        return {
            valid,
            message: `File size must not exceed ${mb}MB`
        };
    },

    mimeTypes(file, allowedTypes) {
        if (!file) return { valid: true };
        const valid = allowedTypes.includes(file.type);
        return {
            valid,
            message: `Allowed types: ${allowedTypes.join(', ')}`
        };
    },

    lowercase(value) {
        if (!value) return { valid: true };
        const valid = value === value.toLowerCase();
        return {
            valid,
            message: 'Must be lowercase'
        };
    },

    uppercase(value) {
        if (!value) return { valid: true };
        const valid = value === value.toUpperCase();
        return {
            valid,
            message: 'Must be uppercase'
        };
    },

    noSpaces(value) {
        if (!value) return { valid: true };
        const valid = !/\s/.test(value);
        return {
            valid,
            message: 'Spaces not allowed'
        };
    },
    afterDate(value, afterDate) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const compareDate = new Date(afterDate);
        const valid = date > compareDate;
        return {
            valid,
            message: `Date must be after ${new Date(afterDate).toLocaleDateString()}`
        };
    },

    beforeDate(value, beforeDate) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const compareDate = new Date(beforeDate);
        const valid = date < compareDate;
        return {
            valid,
            message: `Date must be before ${new Date(beforeDate).toLocaleDateString()}`
        };
    },

    betweenDates(value, startDate, endDate) {
        if (!value) return { valid: true };
        const date = new Date(value);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const valid = date >= start && date <= end;
        return {
            valid,
            message: `Date must be between ${start.toLocaleDateString()} and ${end.toLocaleDateString()}`
        };
    },

    afterTime(value, afterTime) {
        if (!value) return { valid: true };
        const getSeconds = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60;
        };
        const valid = getSeconds(value) > getSeconds(afterTime);
        return {
            valid,
            message: `Time must be after ${afterTime}`
        };
    },

    beforeTime(value, beforeTime) {
        if (!value) return { valid: true };
        const getSeconds = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60;
        };
        const valid = getSeconds(value) < getSeconds(beforeTime);
        return {
            valid,
            message: `Time must be before ${beforeTime}`
        };
    },

    betweenTimes(value, startTime, endTime) {
        if (!value) return { valid: true };
        const getSeconds = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60;
        };
        const seconds = getSeconds(value);
        const start = getSeconds(startTime);
        const end = getSeconds(endTime);
        const valid = seconds >= start && seconds <= end;
        return {
            valid,
            message: `Time must be between ${startTime} and ${endTime}`
        };
    },

    hexColor(value) {
        if (!value) return { valid: true };
        const valid = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        return {
            valid,
            message: 'Invalid hex color format'
        };
    },

    rgbColor(value) {
        if (!value) return { valid: true };
        const valid = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(value);
        return {
            valid,
            message: 'Invalid RGB color format'
        };
    },

    dimensions(file, width, height) {
        if (!file) return { valid: true };

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const valid = img.width === width && img.height === height;
                resolve({
                    valid,
                    message: `Image must be exactly ${width}x${height}px`
                });
            };
            img.onerror = () => {
                resolve({
                    valid: false,
                    message: 'Invalid image file'
                });
            };
            img.src = URL.createObjectURL(file);
        });
    },

    maxDimensions(file, maxWidth, maxHeight) {
        if (!file) return { valid: true };

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const valid = img.width <= maxWidth && img.height <= maxHeight;
                resolve({
                    valid,
                    message: `Image must not exceed ${maxWidth}x${maxHeight}px`
                });
            };
            img.onerror = () => {
                resolve({
                    valid: false,
                    message: 'Invalid image file'
                });
            };
            img.src = URL.createObjectURL(file);
        });
    },

    minDimensions(file, minWidth, minHeight) {
        if (!file) return { valid: true };

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const valid = img.width >= minWidth && img.height >= minHeight;
                resolve({
                    valid,
                    message: `Image must be at least ${minWidth}x${minHeight}px`
                });
            };
            img.onerror = () => {
                resolve({
                    valid: false,
                    message: 'Invalid image file'
                });
            };
            img.src = URL.createObjectURL(file);
        });
    },

    aspectRatio(file, ratio) {
        if (!file) return { valid: true };

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const imageRatio = img.width / img.height;
                const valid = Math.abs(imageRatio - ratio) < 0.01;
                resolve({
                    valid,
                    message: `Image aspect ratio must be ${ratio}`
                });
            };
            img.onerror = () => {
                resolve({
                    valid: false,
                    message: 'Invalid image file'
                });
            };
            img.src = URL.createObjectURL(file);
        });
    },
    maxFileSize(file, maxBytes) {
        if (!file) return { valid: true };

        // Support File object ou array de Files
        if (Array.isArray(file)) {
            const allValid = file.every(f => f.size <= maxBytes);
            if (!allValid) {
                const mb = (maxBytes / (1024 * 1024)).toFixed(2);
                return {
                    valid: false,
                    message: `Each file must not exceed ${mb}MB`
                };
            }
            return { valid: true };
        }

        const valid = file.size <= maxBytes;
        const mb = (maxBytes / (1024 * 1024)).toFixed(2);
        return {
            valid,
            message: `File size must not exceed ${mb}MB`
        };
    },

    minFileSize(file, minBytes) {
        if (!file) return { valid: true };

        if (Array.isArray(file)) {
            const allValid = file.every(f => f.size >= minBytes);
            if (!allValid) {
                const kb = (minBytes / 1024).toFixed(2);
                return {
                    valid: false,
                    message: `Each file must be at least ${kb}KB`
                };
            }
            return { valid: true };
        }

        const valid = file.size >= minBytes;
        const kb = (minBytes / 1024).toFixed(2);
        return {
            valid,
            message: `File must be at least ${kb}KB`
        };
    },

    extensions(file, allowedExts) {
        if (!file) return { valid: true };

        const checkExtension = (f) => {
            const ext = f.name.split('.').pop().toLowerCase();
            return allowedExts.map(e => e.toLowerCase()).includes(ext);
        };

        if (Array.isArray(file)) {
            const allValid = file.every(checkExtension);
            if (!allValid) {
                return {
                    valid: false,
                    message: `Allowed extensions: ${allowedExts.join(', ')}`
                };
            }
            return { valid: true };
        }

        const valid = checkExtension(file);
        return {
            valid,
            message: `Allowed extensions: ${allowedExts.join(', ')}`
        };
    },

    maxFiles(files, max) {
        if (!files) return { valid: true };
        if (!Array.isArray(files)) return { valid: true };

        const valid = files.length <= max;
        return {
            valid,
            message: `Maximum ${max} file${max > 1 ? 's' : ''} allowed`
        };
    },

    minFiles(files, min) {
        if (!files) return { valid: false, message: `At least ${min} file${min > 1 ? 's' : ''} required` };
        if (!Array.isArray(files)) return { valid: false, message: `At least ${min} file${min > 1 ? 's' : ''} required` };

        const valid = files.length >= min;
        return {
            valid,
            message: `At least ${min} file${min > 1 ? 's' : ''} required`
        };
    },

    requiredIf(value, condition, allValues = {}) {
        let isRequired;

        if(typeof condition === 'string' && Object.keys(allValues).includes(condition)) {
            isRequired = !!allValues[condition];
        }
        else if (typeof condition === 'function') {
            isRequired = condition(allValues);
        } else if (Validator.isObservable(condition)) {
            isRequired = condition.val();
        } else {
            isRequired = !!condition;
        }

        if (!isRequired) {
            return { valid: true };
        }

        return Validation.required(value);
    }

};