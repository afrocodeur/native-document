import type { ValidChild } from '../../../../types/elements';
import type { ToastInterface } from './Toast';

export interface ToastWarningInterface extends ToastInterface {}


export declare function ToastWarning(content: ValidChild, props?: Record<string, unknown>): ToastWarningInterface;
