export interface LocalStorageStatic {
    /**
     * Retrieves a value from localStorage and parses it as JSON.
     * Throws a NativeDocumentError if the value is not valid JSON.
     *
     * @param key - The storage key
     * @returns The parsed JSON value
     * @throws NativeDocumentError if JSON parsing fails
     */
    getJson<T = unknown>(key: string): T;

    /**
     * Retrieves a value from localStorage and converts it to a number.
     *
     * @param key - The storage key
     * @returns The numeric value, or NaN if conversion fails
     */
    getNumber(key: string): number;

    /**
     * Retrieves a value from localStorage and converts it to a boolean.
     * Returns true if the stored value is 'true' or '1'.
     *
     * @param key - The storage key
     * @returns The boolean value
     */
    getBool(key: string): boolean;

    /**
     * Serializes a value as JSON and stores it in localStorage.
     *
     * @param key - The storage key
     * @param value - The value to serialize and store
     */
    setJson<T = unknown>(key: string, value: T): void;

    /**
     * Stores a boolean value in localStorage as 'true' or 'false'.
     *
     * @param key - The storage key
     * @param value - The boolean value to store
     */
    setBool(key: string, value: boolean): void;

    /**
     * Retrieves a raw string value from localStorage.
     *
     * @param key - The storage key
     * @param defaultValue - Value returned if the key does not exist (default: null)
     * @returns The stored string value, or defaultValue if not found
     */
    get(key: string, defaultValue?: string | null): string | null;

    /**
     * Stores a value in localStorage.
     *
     * @param key - The storage key
     * @param value - The value to store
     */
    set(key: string, value: string): void;

    /**
     * Removes an entry from localStorage.
     *
     * @param key - The storage key to remove
     */
    remove(key: string): void;

    /**
     * Checks whether a key exists in localStorage.
     *
     * @param key - The storage key to check
     * @returns true if the key exists, false otherwise
     */
    has(key: string): boolean;
}

export declare const LocalStorage: LocalStorageStatic;

/**
 * Retrieves a value from localStorage, automatically casting it to the type of the provided default value.
 * Returns the default value if the key does not exist.
 *
 * @param key - The storage key
 * @param value - The default value (also determines the expected type)
 * @returns The stored value cast to T, or the default value
 */
export declare function $getFromStorage<T>(key: string, value: T): T;

/**
 * Returns the appropriate LocalStorage setter function based on the type of the provided value.
 *
 * @param value - The value whose type determines the setter to use
 * @returns setJson for objects, setBool for booleans, set for all other types
 */
export declare function $saveToStorage<T>(
    value: T
): T extends object
    ? typeof LocalStorage.setJson
    : T extends boolean
        ? typeof LocalStorage.setBool
        : typeof LocalStorage.set;