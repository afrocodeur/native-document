import {ButtonInterface} from "./Button";
import {ObservableItem} from "../../../../types/observable";
import {ValidChild} from "../../../../types/elements";


export interface CopyButtonInterface extends ButtonInterface{

    from($observable: ObservableItem): this;

}
export declare function CopyButton(label: ValidChild, props?: Record<string, unknown>): CopyButtonInterface;
export declare namespace CopyButton {

    function use(template: (description: ButtonInterface, instance: ButtonInterface) => ValidChild): void;

}
