import type {Observable, ValidChild} from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';

export type FileImagePreviewModeDescription = {
    variant: 'hover-overlay' | 'corner-badge' | 'action-buttons';
    shape: 'circle' | 'square';
    size: number | string;
    placeholderIcon: ValidChild | null;
    overlayIcon: ValidChild | null;
    editImageIcon: ValidChild | null;
    changeLabel: ValidChild;
    removeLabel: ValidChild;
    renderAvatar: ((desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild) | null;
    renderOverlay: ((desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild) | null;
    renderActions: ((desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild) | null;
    props: GlobalAttributes;
};

export interface FileImagePreviewModeInterface extends BaseComponent {
    render(renderFn: (description: FileImagePreviewModeDescription, instance: FileImagePreviewModeInterface) => ValidChild): this;
    hoverOverlay(): this;
    cornerBadge(): this;
    actionButtons(): this;
    circle(): this;
    square(): this;
    asAvatar(): this;
    asCover(): this;
    ratio(ratio: string): this;

    ratio(ratio: string | number): this;

    squareRatio(): this;
    widescreenRatio(): this;
    bannerRatio(customRatio?: string): this;
    landscapeRatio(): this;
    storyRatio(): this;
    portraitRatio(): this;
    previewSourceFrom(observable: Observable<string>): this;

    size(size: number | string): this;
    placeholderIcon(icon: ValidChild): this;
    overlayIcon(icon: ValidChild): this;
    editImageIcon(icon: ValidChild): this;
    changeLabel(label: ValidChild): this;
    removeLabel(label: ValidChild): this;
    renderAvatar(fn: (desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild): this;
    renderOverlay(fn: (desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild): this;
    renderActions(fn: (desc: unknown, instance: FileImagePreviewModeInterface) => ValidChild): this;
}


export declare function FileImagePreviewMode(props?: GlobalAttributes): FileImagePreviewModeInterface;
export declare namespace FileImagePreviewMode {

    function use(template: (description: FileImagePreviewModeDescription, instance: FileImagePreviewModeInterface) => ValidChild): void;

}
