import NativeDocumentError from '../errors/NativeDocumentError';

export const LocalStorage = {
    getJson(key) {
        const value = localStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch (e) {
            throw new NativeDocumentError('invalid_json:'+key);
        }
    },
    getNumber(key) {
        return Number(this.get(key));
    },
    getBool(key) {
        const value = this.get(key);
        return value === 'true' || value === '1';
    },
    setJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    setBool(key, value) {
        localStorage.setItem(key, value ? 'true' : 'false');
    },
    get(key, defaultValue = null) {
        return localStorage.getItem(key) || defaultValue;
    },
    set(key, value) {
        return localStorage.setItem(key, value);
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    has(key) {
        return localStorage.getItem(key) != null;
    },
};

export const $getFromStorage = (key, value) => {
    if(!LocalStorage.has(key)) {
        return value;
    }
    switch (typeof value) {
    case 'object': return LocalStorage.getJson(key) ?? value;
    case 'boolean': return LocalStorage.getBool(key) ?? value;
    case 'number': return LocalStorage.getNumber(key) ?? value;
    default: return LocalStorage.get(key, value) ?? value;
    }
};

export const $saveToStorage = (value) => {
    switch (typeof value) {
    case 'object': return LocalStorage.setJson;
    case 'boolean': return LocalStorage.setBool;
    default: return LocalStorage.set;
    }
};