import type { ValidChild, GlobalAttributes, NdStyleMap } from '../../types/elements';
import type { ObservableItem } from '../../types/observable';
import type { CssPropertyAccumulator, ClassPropertyAccumulator } from '../../types/property-accumulator';

export type EditableProps = Omit<GlobalAttributes, 'class' | 'style'> & {
    class: ClassPropertyAccumulator;
    style: CssPropertyAccumulator;
};

export interface BaseComponent {
    setDescription(description: Record<string, unknown>): this;
    postBuild(callback: (element: HTMLElement) => void): this;
    refSelf(target: Record<string, unknown>, name: string): this;
    toNdElement(): HTMLElement | DocumentFragment;
    node(): HTMLElement | DocumentFragment;
    toJSON(): Record<string, unknown>;
    getEditableProps(): EditableProps;
    resolveProps(): GlobalAttributes;
    props(props: GlobalAttributes): this;
    style(style: NdStyleMap): this;
    showIf(condition: boolean | ObservableItem<boolean>): this;
    visibility(condition: boolean | ObservableItem<boolean>): this;
    context(context: unknown): this;
    ghostDom(element: ValidChild): this;
}

export declare namespace BaseComponent {

    function use(Component: Function, ...traits: Function[]): void;
    function obs<T>(value: T | ObservableItem<T>): ObservableItem<T>;

}