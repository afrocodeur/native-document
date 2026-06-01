import type { ValidChild } from '../../../../../types/elements';
import type { GlobalAttributes } from '../../../../../types/globals';
import type { BaseComponent } from '../../../BaseComponent';

export type FileAvatarModeDescription = {
    variant: 'hover-overlay' | 'corner-badge' | 'action-buttons';
    shape: 'circle' | 'square';
    size: number | string;
    placeholderIcon: ValidChild | null;
    overlayIcon: ValidChild | null;
    editImageIcon: ValidChild | null;
    changeLabel: ValidChild;
    removeLabel: ValidChild;
    renderAvatar: ((desc: unknown, instance: FileAvatarModeInterface) => ValidChild) | null;
    renderOverlay: ((desc: unknown, instance: FileAvatarModeInterface) => ValidChild) | null;
    renderActions: ((desc: unknown, instance: FileAvatarModeInterface) => ValidChild) | null;
    props: GlobalAttributes;
};

export interface FileAvatarModeInterface extends BaseComponent {
    render(renderFn: (description: FileAvatarModeDescription, instance: FileAvatarModeInterface) => ValidChild): this;
    hoverOverlay(): this;
    cornerBadge(): this;
    actionButtons(): this;
    circle(): this;
    square(): this;
    size(size: number | string): this;
    placeholderIcon(icon: ValidChild): this;
    overlayIcon(icon: ValidChild): this;
    editImageIcon(icon: ValidChild): this;
    changeLabel(label: ValidChild): this;
    removeLabel(label: ValidChild): this;
    renderAvatar(fn: (desc: unknown, instance: FileAvatarModeInterface) => ValidChild): this;
    renderOverlay(fn: (desc: unknown, instance: FileAvatarModeInterface) => ValidChild): this;
    renderActions(fn: (desc: unknown, instance: FileAvatarModeInterface) => ValidChild): this;
}


export declare function FileAvatarMode(props?: GlobalAttributes): FileAvatarModeInterface;
export declare namespace FileAvatarMode {


    function use(template: (description: FileAvatarModeDescription, instance: FileAvatarModeInterface) => ValidChild): void;


}
