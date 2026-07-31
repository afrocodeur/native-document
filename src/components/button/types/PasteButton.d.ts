import {ButtonDescription, ButtonInterface} from "./Button";
import {ObservableItem} from "../../../../types/observable";
import type {ValidChild} from "../../../../types/elements";


export interface PasteButtonInterface extends ButtonInterface{

    into($observable: ObservableItem): this;

}
export declare function PasteButton(label: ValidChild, props?: Record<string, unknown>): PasteButtonInterface;
export declare namespace PasteButton {

    function use(template: (description: ButtonDescription, instance: ButtonInterface) => ValidChild): void;

}
