import type { ValidChild } from '../../../../types/elements';
import type { PositionStackInterface, PositionStackDescription } from './PositionStack';

export interface AbsoluteStackInterface extends PositionStackInterface {}


export declare function AbsoluteStack(content: ValidChild, props?: Record<string, unknown>): AbsoluteStackInterface;
export declare namespace AbsoluteStack {


    function use(template: (description: PositionStackDescription, instance: AbsoluteStackInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: AbsoluteStackInterface) => AbsoluteStackInterface): void;
    function presets(presets: Record<string, (instance: AbsoluteStackInterface) => AbsoluteStackInterface>): void;


}
