import type { ValidChild } from '../../../../types/elements';
import type { PositionStackInterface, PositionStackDescription } from './PositionStack';
import {StackDescription} from "./Stack";

export interface RelativeStackInterface extends PositionStackInterface {}


export declare function RelativeStack(content: ValidChild, props?: Record<string, unknown>): RelativeStackInterface;
export declare namespace RelativeStack {


    function use(template: (description: PositionStackDescription, instance: RelativeStackInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: RelativeStackInterface) => RelativeStackInterface): void;
    function presets(presets: Record<string, (instance: RelativeStackInterface) => RelativeStackInterface>): void;


}
