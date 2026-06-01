import type { ValidChild } from '../../../../types/elements';
import type { PositionStackInterface, PositionStackDescription } from './PositionStack';

export interface FixedStackInterface extends PositionStackInterface {}


export declare function FixedStack(content: ValidChild, props?: Record<string, unknown>): FixedStackInterface;
export declare namespace FixedStack {


    function use(template: (description: PositionStackDescription, instance: FixedStackInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: FixedStackInterface) => FixedStackInterface): void;
    function presets(presets: Record<string, (instance: FixedStackInterface) => FixedStackInterface>): void;


}
