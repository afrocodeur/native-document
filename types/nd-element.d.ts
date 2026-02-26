import {BindingHydrator} from "./template-cloner";

type ShadowMode = 'open' | 'closed';

interface MethodsObject {
    [methodName: string]: (this: NDElement, ...args: any[]) => any;
}

export type ExtractMethods<T extends MethodsObject> = {
    [K in keyof T]: T[K] extends (this: NDElement, ...args: infer Args) => infer R
        ? (...args: Args) => R
        : never;
};

export interface NDElement {
    readonly __$isNDElement: true;
    readonly $element: HTMLElement;
    readonly $observer: any;
    readonly nd: this;

    ref(target: any, name: string): this;
    refSelf(target: any, name: string): this;
    with<T extends MethodsObject>(methods: T): this & ExtractMethods<T>;
    extend(methods: MethodsObject): NDElement;
    extend<T extends MethodsObject>(
        methods: T
    ): NDElement & { prototype: NDElement & ExtractMethods<T> };

    unmountChildren(): this;
    remove(): this;

    lifecycle(states: { mounted?: (node: HTMLElement) => void; unmounted?: (node: HTMLElement) => boolean | void }): this;
    mounted(callback: (node: HTMLElement) => void): this;
    unmounted(callback: (node: HTMLElement) => boolean | void): this;

    beforeUnmount(id: string, callback: (this: NDElement, el: HTMLElement) => void | Promise<void>): this;
    transition(transitionName: string): this;
    transitionIn(transitionName: string): this;
    transitionOut(transitionName: string): this;
    animate(animationName: string): this;

    htmlElement(): HTMLElement;
    node(): HTMLElement;
    shadow(mode: ShadowMode, style?: string | null): this;
    openShadow(style?: string | null): this;
    closedShadow(style?: string | null): this;
    attach(methodName: string, bindingHydrator: BindingHydrator): HTMLElement;

    on(name: string, callback: EventListener, options?: boolean | AddEventListenerOptions): this;

    // Mouse Events
    onClick(callback: (event: MouseEvent) => void): this;
    onDblClick(callback: (event: MouseEvent) => void): this;
    onMouseDown(callback: (event: MouseEvent) => void): this;
    onMouseEnter(callback: (event: MouseEvent) => void): this;
    onMouseLeave(callback: (event: MouseEvent) => void): this;
    onMouseMove(callback: (event: MouseEvent) => void): this;
    onMouseOut(callback: (event: MouseEvent) => void): this;
    onMouseOver(callback: (event: MouseEvent) => void): this;
    onMouseUp(callback: (event: MouseEvent) => void): this;
    onWheel(callback: (event: WheelEvent) => void): this;
    onContextMenu(callback: (event: MouseEvent) => void): this; // Extra event

    // Keyboard Events
    onKeyDown(callback: (event: KeyboardEvent) => void): this;
    onKeyPress(callback: (event: KeyboardEvent) => void): this;
    onKeyUp(callback: (event: KeyboardEvent) => void): this;

    // Form Events
    onBlur(callback: (event: FocusEvent) => void): this;
    onChange(callback: (event: Event) => void): this;
    onFocus(callback: (event: FocusEvent) => void): this;
    onFocusIn(callback: (event: FocusEvent) => void): this; // Extra event
    onFocusOut(callback: (event: FocusEvent) => void): this; // Extra event
    onInput(callback: (event: Event) => void): this;
    onInvalid(callback: (event: Event) => void): this;
    onReset(callback: (event: Event) => void): this;
    onSearch(callback: (event: Event) => void): this;
    onSelect(callback: (event: Event) => void): this;
    onSubmit(callback: (event: Event) => void): this;

    // Drag Events
    onDrag(callback: (event: DragEvent) => void): this;
    onDragEnd(callback: (event: DragEvent) => void): this;
    onDragEnter(callback: (event: DragEvent) => void): this;
    onDragLeave(callback: (event: DragEvent) => void): this;
    onDragOver(callback: (event: DragEvent) => void): this;
    onDragStart(callback: (event: DragEvent) => void): this;
    onDrop(callback: (event: DragEvent) => void): this;

    // Window/Page Events
    onAfterPrint(callback: (event: Event) => void): this;
    onBeforePrint(callback: (event: Event) => void): this;
    onBeforeUnload(callback: (event: BeforeUnloadEvent) => void): this;
    onError(callback: (event: Event) => void): this;
    onHashChange(callback: (event: HashChangeEvent) => void): this;
    onLoad(callback: (event: Event) => void): this;
    onOffline(callback: (event: Event) => void): this;
    onOnline(callback: (event: Event) => void): this;
    onPageHide(callback: (event: PageTransitionEvent) => void): this;
    onPageShow(callback: (event: PageTransitionEvent) => void): this;
    onResize(callback: (event: UIEvent) => void): this;
    onScroll(callback: (event: Event) => void): this;
    onUnload(callback: (event: Event) => void): this;

    // Media Events
    onAbort(callback: (event: Event) => void): this;
    onCanPlay(callback: (event: Event) => void): this;
    onCanPlayThrough(callback: (event: Event) => void): this;
    onDurationChange(callback: (event: Event) => void): this;
    onEmptied(callback: (event: Event) => void): this;
    onEnded(callback: (event: Event) => void): this;
    onLoadedData(callback: (event: Event) => void): this;
    onLoadedMetadata(callback: (event: Event) => void): this;
    onLoadStart(callback: (event: Event) => void): this;
    onPause(callback: (event: Event) => void): this;
    onPlay(callback: (event: Event) => void): this;
    onPlaying(callback: (event: Event) => void): this;
    onProgress(callback: (event: ProgressEvent) => void): this;
    onRateChange(callback: (event: Event) => void): this;
    onSeeked(callback: (event: Event) => void): this;
    onSeeking(callback: (event: Event) => void): this;
    onStalled(callback: (event: Event) => void): this;
    onSuspend(callback: (event: Event) => void): this;
    onTimeUpdate(callback: (event: Event) => void): this;
    onVolumeChange(callback: (event: Event) => void): this;
    onWaiting(callback: (event: Event) => void): this;

    // Touch Events (Extra events)
    onTouchCancel(callback: (event: TouchEvent) => void): this;
    onTouchEnd(callback: (event: TouchEvent) => void): this;
    onTouchMove(callback: (event: TouchEvent) => void): this;
    onTouchStart(callback: (event: TouchEvent) => void): this;

    // Animation Events (Extra events)
    onAnimationEnd(callback: (event: AnimationEvent) => void): this;
    onAnimationIteration(callback: (event: AnimationEvent) => void): this;
    onAnimationStart(callback: (event: AnimationEvent) => void): this;

    // Transition Events (Extra events)
    onTransitionEnd(callback: (event: TransitionEvent) => void): this;

    // Clipboard Events (Extra events)
    onCopy(callback: (event: ClipboardEvent) => void): this;
    onCut(callback: (event: ClipboardEvent) => void): this;
    onPaste(callback: (event: ClipboardEvent) => void): this;

    // PREVENT DEFAULT VERSIONS

    // Prevent default versions for Mouse Events
    onPreventClick(callback?: (event: MouseEvent) => void): this;
    onPreventDblClick(callback?: (event: MouseEvent) => void): this;
    onPreventMouseDown(callback?: (event: MouseEvent) => void): this;
    onPreventMouseEnter(callback?: (event: MouseEvent) => void): this;
    onPreventMouseLeave(callback?: (event: MouseEvent) => void): this;
    onPreventMouseMove(callback?: (event: MouseEvent) => void): this;
    onPreventMouseOut(callback?: (event: MouseEvent) => void): this;
    onPreventMouseOver(callback?: (event: MouseEvent) => void): this;
    onPreventMouseUp(callback?: (event: MouseEvent) => void): this;
    onPreventWheel(callback?: (event: WheelEvent) => void): this;
    onPreventContextMenu(callback?: (event: MouseEvent) => void): this;

    // Prevent default versions for Keyboard Events
    onPreventKeyDown(callback?: (event: KeyboardEvent) => void): this;
    onPreventKeyPress(callback?: (event: KeyboardEvent) => void): this;
    onPreventKeyUp(callback?: (event: KeyboardEvent) => void): this;

    // Prevent default versions for Form Events
    onPreventBlur(callback?: (event: FocusEvent) => void): this;
    onPreventChange(callback?: (event: Event) => void): this;
    onPreventFocus(callback?: (event: FocusEvent) => void): this;
    onPreventFocusIn(callback?: (event: FocusEvent) => void): this;
    onPreventFocusOut(callback?: (event: FocusEvent) => void): this;
    onPreventInput(callback?: (event: Event) => void): this;
    onPreventInvalid(callback?: (event: Event) => void): this;
    onPreventReset(callback?: (event: Event) => void): this;
    onPreventSearch(callback?: (event: Event) => void): this;
    onPreventSelect(callback?: (event: Event) => void): this;
    onPreventSubmit(callback?: (event: Event) => void): this;

    // Prevent default versions for Drag Events
    onPreventDrag(callback?: (event: DragEvent) => void): this;
    onPreventDragEnd(callback?: (event: DragEvent) => void): this;
    onPreventDragEnter(callback?: (event: DragEvent) => void): this;
    onPreventDragLeave(callback?: (event: DragEvent) => void): this;
    onPreventDragOver(callback?: (event: DragEvent) => void): this;
    onPreventDragStart(callback?: (event: DragEvent) => void): this;
    onPreventDrop(callback?: (event: DragEvent) => void): this;

    // Prevent default versions for Window/Page Events
    onPreventAfterPrint(callback?: (event: Event) => void): this;
    onPreventBeforePrint(callback?: (event: Event) => void): this;
    onPreventBeforeUnload(callback?: (event: BeforeUnloadEvent) => void): this;
    onPreventError(callback?: (event: Event) => void): this;
    onPreventHashChange(callback?: (event: HashChangeEvent) => void): this;
    onPreventLoad(callback?: (event: Event) => void): this;
    onPreventOffline(callback?: (event: Event) => void): this;
    onPreventOnline(callback?: (event: Event) => void): this;
    onPreventPageHide(callback?: (event: PageTransitionEvent) => void): this;
    onPreventPageShow(callback?: (event: PageTransitionEvent) => void): this;
    onPreventResize(callback?: (event: UIEvent) => void): this;
    onPreventScroll(callback?: (event: Event) => void): this;
    onPreventUnload(callback?: (event: Event) => void): this;

    // Prevent default versions for Media Events
    onPreventAbort(callback?: (event: Event) => void): this;
    onPreventCanPlay(callback?: (event: Event) => void): this;
    onPreventCanPlayThrough(callback?: (event: Event) => void): this;
    onPreventDurationChange(callback?: (event: Event) => void): this;
    onPreventEmptied(callback?: (event: Event) => void): this;
    onPreventEnded(callback?: (event: Event) => void): this;
    onPreventLoadedData(callback?: (event: Event) => void): this;
    onPreventLoadedMetadata(callback?: (event: Event) => void): this;
    onPreventLoadStart(callback?: (event: Event) => void): this;
    onPreventPause(callback?: (event: Event) => void): this;
    onPreventPlay(callback?: (event: Event) => void): this;
    onPreventPlaying(callback?: (event: Event) => void): this;
    onPreventProgress(callback?: (event: ProgressEvent) => void): this;
    onPreventRateChange(callback?: (event: Event) => void): this;
    onPreventSeeked(callback?: (event: Event) => void): this;
    onPreventSeeking(callback?: (event: Event) => void): this;
    onPreventStalled(callback?: (event: Event) => void): this;
    onPreventSuspend(callback?: (event: Event) => void): this;
    onPreventTimeUpdate(callback?: (event: Event) => void): this;
    onPreventVolumeChange(callback?: (event: Event) => void): this;
    onPreventWaiting(callback?: (event: Event) => void): this;

    // Prevent default versions for Touch Events
    onPreventTouchCancel(callback?: (event: TouchEvent) => void): this;
    onPreventTouchEnd(callback?: (event: TouchEvent) => void): this;
    onPreventTouchMove(callback?: (event: TouchEvent) => void): this;
    onPreventTouchStart(callback?: (event: TouchEvent) => void): this;

    // Prevent default versions for Animation Events
    onPreventAnimationEnd(callback?: (event: AnimationEvent) => void): this;
    onPreventAnimationIteration(callback?: (event: AnimationEvent) => void): this;
    onPreventAnimationStart(callback?: (event: AnimationEvent) => void): this;

    // Prevent default versions for Transition Events
    onPreventTransitionEnd(callback?: (event: TransitionEvent) => void): this;

    // Prevent default versions for Clipboard Events
    onPreventCopy(callback?: (event: ClipboardEvent) => void): this;
    onPreventCut(callback?: (event: ClipboardEvent) => void): this;
    onPreventPaste(callback?: (event: ClipboardEvent) => void): this;

    // STOP PROPAGATION VERSIONS

    // Stop propagation versions for Mouse Events
    onStopClick(callback?: (event: MouseEvent) => void): this;
    onStopDblClick(callback?: (event: MouseEvent) => void): this;
    onStopMouseDown(callback?: (event: MouseEvent) => void): this;
    onStopMouseEnter(callback?: (event: MouseEvent) => void): this;
    onStopMouseLeave(callback?: (event: MouseEvent) => void): this;
    onStopMouseMove(callback?: (event: MouseEvent) => void): this;
    onStopMouseOut(callback?: (event: MouseEvent) => void): this;
    onStopMouseOver(callback?: (event: MouseEvent) => void): this;
    onStopMouseUp(callback?: (event: MouseEvent) => void): this;
    onStopWheel(callback?: (event: WheelEvent) => void): this;
    onStopContextMenu(callback?: (event: MouseEvent) => void): this;

    // Stop propagation versions for Keyboard Events
    onStopKeyDown(callback?: (event: KeyboardEvent) => void): this;
    onStopKeyPress(callback?: (event: KeyboardEvent) => void): this;
    onStopKeyUp(callback?: (event: KeyboardEvent) => void): this;

    // Stop propagation versions for Form Events
    onStopBlur(callback?: (event: FocusEvent) => void): this;
    onStopChange(callback?: (event: Event) => void): this;
    onStopFocus(callback?: (event: FocusEvent) => void): this;
    onStopFocusIn(callback?: (event: FocusEvent) => void): this;
    onStopFocusOut(callback?: (event: FocusEvent) => void): this;
    onStopInput(callback?: (event: Event) => void): this;
    onStopInvalid(callback?: (event: Event) => void): this;
    onStopReset(callback?: (event: Event) => void): this;
    onStopSearch(callback?: (event: Event) => void): this;
    onStopSelect(callback?: (event: Event) => void): this;
    onStopSubmit(callback?: (event: Event) => void): this;

    // Stop propagation versions for Drag Events
    onStopDrag(callback?: (event: DragEvent) => void): this;
    onStopDragEnd(callback?: (event: DragEvent) => void): this;
    onStopDragEnter(callback?: (event: DragEvent) => void): this;
    onStopDragLeave(callback?: (event: DragEvent) => void): this;
    onStopDragOver(callback?: (event: DragEvent) => void): this;
    onStopDragStart(callback?: (event: DragEvent) => void): this;
    onStopDrop(callback?: (event: DragEvent) => void): this;

    // Stop propagation versions for Window/Page Events
    onStopAfterPrint(callback?: (event: Event) => void): this;
    onStopBeforePrint(callback?: (event: Event) => void): this;
    onStopBeforeUnload(callback?: (event: BeforeUnloadEvent) => void): this;
    onStopError(callback?: (event: Event) => void): this;
    onStopHashChange(callback?: (event: HashChangeEvent) => void): this;
    onStopLoad(callback?: (event: Event) => void): this;
    onStopOffline(callback?: (event: Event) => void): this;
    onStopOnline(callback?: (event: Event) => void): this;
    onStopPageHide(callback?: (event: PageTransitionEvent) => void): this;
    onStopPageShow(callback?: (event: PageTransitionEvent) => void): this;
    onStopResize(callback?: (event: UIEvent) => void): this;
    onStopScroll(callback?: (event: Event) => void): this;
    onStopUnload(callback?: (event: Event) => void): this;

    // Stop propagation versions for Media Events
    onStopAbort(callback?: (event: Event) => void): this;
    onStopCanPlay(callback?: (event: Event) => void): this;
    onStopCanPlayThrough(callback?: (event: Event) => void): this;
    onStopDurationChange(callback?: (event: Event) => void): this;
    onStopEmptied(callback?: (event: Event) => void): this;
    onStopEnded(callback?: (event: Event) => void): this;
    onStopLoadedData(callback?: (event: Event) => void): this;
    onStopLoadedMetadata(callback?: (event: Event) => void): this;
    onStopLoadStart(callback?: (event: Event) => void): this;
    onStopPause(callback?: (event: Event) => void): this;
    onStopPlay(callback?: (event: Event) => void): this;
    onStopPlaying(callback?: (event: Event) => void): this;
    onStopProgress(callback?: (event: ProgressEvent) => void): this;
    onStopRateChange(callback?: (event: Event) => void): this;
    onStopSeeked(callback?: (event: Event) => void): this;
    onStopSeeking(callback?: (event: Event) => void): this;
    onStopStalled(callback?: (event: Event) => void): this;
    onStopSuspend(callback?: (event: Event) => void): this;
    onStopTimeUpdate(callback?: (event: Event) => void): this;
    onStopVolumeChange(callback?: (event: Event) => void): this;
    onStopWaiting(callback?: (event: Event) => void): this;

    // Stop propagation versions for Touch Events
    onStopTouchCancel(callback?: (event: TouchEvent) => void): this;
    onStopTouchEnd(callback?: (event: TouchEvent) => void): this;
    onStopTouchMove(callback?: (event: TouchEvent) => void): this;
    onStopTouchStart(callback?: (event: TouchEvent) => void): this;

    // Stop propagation versions for Animation Events
    onStopAnimationEnd(callback?: (event: AnimationEvent) => void): this;
    onStopAnimationIteration(callback?: (event: AnimationEvent) => void): this;
    onStopAnimationStart(callback?: (event: AnimationEvent) => void): this;

    // Stop propagation versions for Transition Events
    onStopTransitionEnd(callback?: (event: TransitionEvent) => void): this;

    // Stop propagation versions for Clipboard Events
    onStopCopy(callback?: (event: ClipboardEvent) => void): this;
    onStopCut(callback?: (event: ClipboardEvent) => void): this;
    onStopPaste(callback?: (event: ClipboardEvent) => void): this;

    // PREVENT + STOP VERSIONS

    // Prevent + Stop versions for Mouse Events
    onPreventStopClick(callback?: (event: MouseEvent) => void): this;
    onPreventStopDblClick(callback?: (event: MouseEvent) => void): this;
    onPreventStopMouseDown(callback?: (event: MouseEvent) => void): this;
    onPreventStopMouseMove(callback?: (event: MouseEvent) => void): this;
    onPreventStopMouseOut(callback?: (event: MouseEvent) => void): this;
    onPreventStopMouseOver(callback?: (event: MouseEvent) => void): this;
    onPreventStopMouseUp(callback?: (event: MouseEvent) => void): this;
    onPreventStopWheel(callback?: (event: WheelEvent) => void): this;
    onPreventStopContextMenu(callback?: (event: MouseEvent) => void): this;

    // Prevent + Stop versions for Keyboard Events
    onPreventStopKeyDown(callback?: (event: KeyboardEvent) => void): this;
    onPreventStopKeyPress(callback?: (event: KeyboardEvent) => void): this;
    onPreventStopKeyUp(callback?: (event: KeyboardEvent) => void): this;

    // Prevent + Stop versions for Form Events
    onPreventStopChange(callback?: (event: Event) => void): this;
    onPreventStopInput(callback?: (event: Event) => void): this;
    onPreventStopInvalid(callback?: (event: Event) => void): this;
    onPreventStopReset(callback?: (event: Event) => void): this;
    onPreventStopSearch(callback?: (event: Event) => void): this;
    onPreventStopSelect(callback?: (event: Event) => void): this;
    onPreventStopSubmit(callback?: (event: Event) => void): this;
    onPreventStopFocusIn(callback?: (event: FocusEvent) => void): this;
    onPreventStopFocusOut(callback?: (event: FocusEvent) => void): this;

    // Prevent + Stop versions for Drag Events
    onPreventStopDrag(callback?: (event: DragEvent) => void): this;
    onPreventStopDragEnd(callback?: (event: DragEvent) => void): this;
    onPreventStopDragEnter(callback?: (event: DragEvent) => void): this;
    onPreventStopDragLeave(callback?: (event: DragEvent) => void): this;
    onPreventStopDragOver(callback?: (event: DragEvent) => void): this;
    onPreventStopDragStart(callback?: (event: DragEvent) => void): this;
    onPreventStopDrop(callback?: (event: DragEvent) => void): this;

    // Prevent + Stop versions for Window/Page Events
    onPreventStopBeforeUnload(callback?: (event: BeforeUnloadEvent) => void): this;
    onPreventStopHashChange(callback?: (event: HashChangeEvent) => void): this;

    // Prevent + Stop versions for Touch Events
    onPreventStopTouchCancel(callback?: (event: TouchEvent) => void): this;
    onPreventStopTouchEnd(callback?: (event: TouchEvent) => void): this;
    onPreventStopTouchMove(callback?: (event: TouchEvent) => void): this;
    onPreventStopTouchStart(callback?: (event: TouchEvent) => void): this;

    // Prevent + Stop versions for Animation Events
    onPreventStopAnimationEnd(callback?: (event: AnimationEvent) => void): this;
    onPreventStopAnimationIteration(callback?: (event: AnimationEvent) => void): this;
    onPreventStopAnimationStart(callback?: (event: AnimationEvent) => void): this;

    // Prevent + Stop versions for Transition Events
    onPreventStopTransitionEnd(callback?: (event: TransitionEvent) => void): this;

    // Prevent + Stop versions for Clipboard Events
    onPreventStopCopy(callback?: (event: ClipboardEvent) => void): this;
    onPreventStopCut(callback?: (event: ClipboardEvent) => void): this;
    onPreventStopPaste(callback?: (event: ClipboardEvent) => void): this;

}