import { AnchorDocumentFragment } from "./elements";

export type ViewCreator = (instance: SingletonView) => Node;

export type SectionFunction = (...args: any[]) => Node | Node[];

export type ComponentUpdater = (...args: any[]) => void;

export type ComponentsMap = Record<string, ComponentUpdater>;

export declare class SingletonView {
    constructor(viewCreator: ViewCreator);

    render(data: any[]): Node;

    createSection(name: string, fn?: SectionFunction): AnchorDocumentFragment;
}

export declare function useSingleton(fn: ViewCreator): (...args: any[]) => Node;