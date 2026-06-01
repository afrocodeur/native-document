import type { ObservableItem } from '../../types/observable';

/**
 * Resolves all param values — unwraps ObservableItem values to their current value.
 */
export declare function getParams(
    params: Record<string, ObservableItem<unknown> | unknown> | null | undefined
): Record<string, unknown>;

/**
 * Returns true if any param value is an ObservableItem.
 */
export declare function hasObservableParams(
    params: Record<string, unknown> | null | undefined
): boolean;

/**
 * Returns only the ObservableItem values from a params object.
 */
export declare function getObservableParams(
    params: Record<string, ObservableItem<unknown> | unknown> | null | undefined
): ObservableItem<unknown>[];
