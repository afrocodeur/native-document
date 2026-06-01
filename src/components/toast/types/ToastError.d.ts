import type { ValidChild } from '../../../../types/elements';
import type { ToastInterface } from './Toast';

export interface ToastErrorInterface extends ToastInterface {}


export declare function ToastError(content: ValidChild, props?: Record<string, unknown>): ToastErrorInterface;
