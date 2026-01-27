import { createFilter, createMultiSourceFilter } from "./utils";


export function includes(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!value) return false;
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().includes(String(query).toLowerCase());
        }
        return String(value).includes(String(query));
    });
}

export const contains = includes;

export function startsWith(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().startsWith(String(query).toLowerCase());
        }
        return String(value).startsWith(String(query));
    });
}

export function endsWith(observableOrValue, caseSensitive = false){
    return createFilter(observableOrValue, (value, query) => {
        if (!query) return true;
        if (!caseSensitive){
            return String(value).toLowerCase().endsWith(String(query).toLowerCase());
        }
        return String(value).endsWith(String(query));
    });
}