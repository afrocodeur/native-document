import type { ValidChild } from '../../../../types/elements';
import type {StackDescription, StackInterface} from './Stack';

export interface HStackInterface extends StackInterface {}


export declare function HStack(content: ValidChild, props?: Record<string, unknown>): HStackInterface;
export declare namespace HStack {


    function use(template: (description: StackDescription, instance: HStackInterface) => ValidChild): void;
    function preset(name: string, callback: (instance: HStackInterface) => HStackInterface): void;
    function presets(presets: Record<string, (instance: HStackInterface) => HStackInterface>): void;


}
