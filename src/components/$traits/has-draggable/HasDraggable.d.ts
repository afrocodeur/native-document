export interface HasDraggable {
    move(x: number, y: number): void;
    makeDraggable(parent: HTMLElement, grip?: HTMLElement | null): () => void;
}
