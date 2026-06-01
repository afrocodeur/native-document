import type { ValidChild } from '../../../../types/elements';
import type { ToastInterface } from './Toast';

export interface ToastSuccessInterface extends ToastInterface {}


export declare function ToastSuccess(content: ValidChild, props?: Record<string, unknown>): ToastSuccessInterface;
