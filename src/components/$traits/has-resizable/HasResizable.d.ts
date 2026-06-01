interface ResizableOptions {
    directions?: string[];
    size?: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
    };
}

export interface HasResizable {
    makeResizable(parent: HTMLElement, options?: ResizableOptions): () => void;
}
