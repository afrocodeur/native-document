import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';
import type { StepperStepInterface } from './StepperStep';
import type { GlobalAttributes } from '../../../../types/globals';

export type StepperDescription = {
        steps: ObservableItem<StepperStepInterface[]>;
        visibleSteps: ObservableItem<StepperStepInterface[]>;
        currentStep: ObservableItem<number>;
        orientation: 'horizontal' | 'vertical';
        linear: boolean;
        alternativeLabel: boolean;
        editable: ObservableItem<boolean>;
        showNumbers: boolean;
        showConnector: boolean;
        data: unknown | null;
        renderStepIndicator: ((step: StepperStepInterface, index: number) => ValidChild) | null;
        renderStepIndicatorConnector: ((desc: unknown) => ValidChild) | null;
        renderContent: ((step: StepperStepInterface) => ValidChild) | null;
        render: ((desc: StepperDescription, instance: StepperInterface) => ValidChild) | null;
        position: 'top' | 'bottom' | 'leading' | 'trailing';
        props: GlobalAttributes;
    };

export interface StepperInterface extends BaseComponent {
    step(step: StepperStepInterface | ((step: StepperStepInterface, stepper: StepperInterface) => void)): this;
    clear(): this;
    currentStep(step?: number): number | this;
    orientation(orientation: 'horizontal' | 'vertical'): this;
    horizontal(): this;
    vertical(): this;
    linear(): this;
    nonLinear(): this;
    editable(editable?: boolean): this;
    alternativeLabel(alternative?: boolean): this;
    showNumbers(show?: boolean): this;
    showConnector(show?: boolean): this;
    data(data: unknown): this;
    previous(): this;
    reset(): this;
    onStepChange(handler: (index: number) => void): this;
    onNext(handler: () => void): this;
    onPrevious(handler: () => void): this;
    onComplete(handler: () => void): this;
    onReset(handler: () => void): this;
    renderStepIndicator(renderFn: (step: StepperStepInterface, index: number) => ValidChild): this;
    renderStepIndicatorConnector(renderFn: (desc: unknown) => ValidChild): this;
    renderContent(renderFn: (step: StepperStepInterface) => ValidChild): this;
    navigationAtLeading(): this;
    navigationAtBottom(): this;
    navigationAtTop(): this;
    navigationAtTrailing(): this;

    render(renderFn: (description: StepperDescription, instance: StepperInterface) => ValidChild): this;
}


export declare function Stepper(props?: Record<string, unknown>): StepperInterface;
export declare namespace Stepper {


    function use(template: (description: StepperDescription, instance: StepperInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: StepperInterface) => StepperInterface): void;
    function presets(presets: Record<string, (instance: StepperInterface) => StepperInterface>): void;


}
