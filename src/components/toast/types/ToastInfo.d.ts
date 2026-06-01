import type { ValidChild } from '../../../../types/elements';
import type { ToastInterface } from './Toast';

export interface ToastInfoInterface extends ToastInterface {}


export declare function ToastInfo(content: ValidChild, props?: Record<string, unknown>): ToastInfoInterface;
