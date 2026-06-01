import type { ValidChild } from '../../../../types/elements';
import type {StackDescription, StackInterface} from './Stack';

export interface VStackInterface extends StackInterface {}


export declare function VStack(content: ValidChild, props?: Record<string, unknown>): VStackInterface;
export declare namespace VStack {


    function use(template: (description: StackDescription, instance: VStackInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: VStackInterface) => VStackInterface): void;
    function presets(presets: Record<string, (instance: VStackInterface) => VStackInterface>): void;


}
