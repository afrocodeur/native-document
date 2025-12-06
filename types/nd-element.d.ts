import {BindingHydrator} from "./template-cloner";

export interface NDElement {
    readonly __$isNDElement: true;
    readonly $element: HTMLElement;
    readonly $observer: any;

    ref(target: any, name: string): this;
    unmountChildren(): this;
    remove(): this;

    lifecycle(states: { mounted?: (node: HTMLElement) => void; unmounted?: (node: HTMLElement) => boolean | void }): this;
    mounted(callback: (node: HTMLElement) => void): this;
    unmounted(callback: (node: HTMLElement) => boolean | void): this;

    htmlElement(): HTMLElement;
    node(): HTMLElement;
    attach(bindingHydrator: BindingHydrator): HTMLElement;

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
    onPreventClick(callback: (event: MouseEvent) => void): this;
    onPreventDblClick(callback: (event: MouseEvent) => void): this;
    onPreventMouseDown(callback: (event: MouseEvent) => void): this;
    onPreventMouseEnter(callback: (event: MouseEvent) => void): this;
    onPreventMouseLeave(callback: (event: MouseEvent) => void): this;
    onPreventMouseMove(callback: (event: MouseEvent) => void): this;
    onPreventMouseOut(callback: (event: MouseEvent) => void): this;
    onPreventMouseOver(callback: (event: MouseEvent) => void): this;
    onPreventMouseUp(callback: (event: MouseEvent) => void): this;
    onPreventWheel(callback: (event: WheelEvent) => void): this;
    onPreventContextMenu(callback: (event: MouseEvent) => void): this;

    // Prevent default versions for Keyboard Events
    onPreventKeyDown(callback: (event: KeyboardEvent) => void): this;
    onPreventKeyPress(callback: (event: KeyboardEvent) => void): this;
    onPreventKeyUp(callback: (event: KeyboardEvent) => void): this;

    // Prevent default versions for Form Events
    onPreventBlur(callback: (event: FocusEvent) => void): this;
    onPreventChange(callback: (event: Event) => void): this;
    onPreventFocus(callback: (event: FocusEvent) => void): this;
    onPreventFocusIn(callback: (event: FocusEvent) => void): this;
    onPreventFocusOut(callback: (event: FocusEvent) => void): this;
    onPreventInput(callback: (event: Event) => void): this;
    onPreventInvalid(callback: (event: Event) => void): this;
    onPreventReset(callback: (event: Event) => void): this;
    onPreventSearch(callback: (event: Event) => void): this;
    onPreventSelect(callback: (event: Event) => void): this;
    onPreventSubmit(callback: (event: Event) => void): this;

    // Prevent default versions for Drag Events
    onPreventDrag(callback: (event: DragEvent) => void): this;
    onPreventDragEnd(callback: (event: DragEvent) => void): this;
    onPreventDragEnter(callback: (event: DragEvent) => void): this;
    onPreventDragLeave(callback: (event: DragEvent) => void): this;
    onPreventDragOver(callback: (event: DragEvent) => void): this;
    onPreventDragStart(callback: (event: DragEvent) => void): this;
    onPreventDrop(callback: (event: DragEvent) => void): this;

    // Prevent default versions for Window/Page Events
    onPreventAfterPrint(callback: (event: Event) => void): this;
    onPreventBeforePrint(callback: (event: Event) => void): this;
    onPreventBeforeUnload(callback: (event: BeforeUnloadEvent) => void): this;
    onPreventError(callback: (event: Event) => void): this;
    onPreventHashChange(callback: (event: HashChangeEvent) => void): this;
    onPreventLoad(callback: (event: Event) => void): this;
    onPreventOffline(callback: (event: Event) => void): this;
    onPreventOnline(callback: (event: Event) => void): this;
    onPreventPageHide(callback: (event: PageTransitionEvent) => void): this;
    onPreventPageShow(callback: (event: PageTransitionEvent) => void): this;
    onPreventResize(callback: (event: UIEvent) => void): this;
    onPreventScroll(callback: (event: Event) => void): this;
    onPreventUnload(callback: (event: Event) => void): this;

    // Prevent default versions for Media Events
    onPreventAbort(callback: (event: Event) => void): this;
    onPreventCanPlay(callback: (event: Event) => void): this;
    onPreventCanPlayThrough(callback: (event: Event) => void): this;
    onPreventDurationChange(callback: (event: Event) => void): this;
    onPreventEmptied(callback: (event: Event) => void): this;
    onPreventEnded(callback: (event: Event) => void): this;
    onPreventLoadedData(callback: (event: Event) => void): this;
    onPreventLoadedMetadata(callback: (event: Event) => void): this;
    onPreventLoadStart(callback: (event: Event) => void): this;
    onPreventPause(callback: (event: Event) => void): this;
    onPreventPlay(callback: (event: Event) => void): this;
    onPreventPlaying(callback: (event: Event) => void): this;
    onPreventProgress(callback: (event: ProgressEvent) => void): this;
    onPreventRateChange(callback: (event: Event) => void): this;
    onPreventSeeked(callback: (event: Event) => void): this;
    onPreventSeeking(callback: (event: Event) => void): this;
    onPreventStalled(callback: (event: Event) => void): this;
    onPreventSuspend(callback: (event: Event) => void): this;
    onPreventTimeUpdate(callback: (event: Event) => void): this;
    onPreventVolumeChange(callback: (event: Event) => void): this;
    onPreventWaiting(callback: (event: Event) => void): this;

    // Prevent default versions for Touch Events
    onPreventTouchCancel(callback: (event: TouchEvent) => void): this;
    onPreventTouchEnd(callback: (event: TouchEvent) => void): this;
    onPreventTouchMove(callback: (event: TouchEvent) => void): this;
    onPreventTouchStart(callback: (event: TouchEvent) => void): this;

    // Prevent default versions for Animation Events
    onPreventAnimationEnd(callback: (event: AnimationEvent) => void): this;
    onPreventAnimationIteration(callback: (event: AnimationEvent) => void): this;
    onPreventAnimationStart(callback: (event: AnimationEvent) => void): this;

    // Prevent default versions for Transition Events
    onPreventTransitionEnd(callback: (event: TransitionEvent) => void): this;

    // Prevent default versions for Clipboard Events
    onPreventCopy(callback: (event: ClipboardEvent) => void): this;
    onPreventCut(callback: (event: ClipboardEvent) => void): this;
    onPreventPaste(callback: (event: ClipboardEvent) => void): this;

    // STOP PROPAGATION VERSIONS

    // Stop propagation versions for Mouse Events
    onStopClick(callback: (event: MouseEvent) => void): this;
    onStopDblClick(callback: (event: MouseEvent) => void): this;
    onStopMouseDown(callback: (event: MouseEvent) => void): this;
    onStopMouseEnter(callback: (event: MouseEvent) => void): this;
    onStopMouseLeave(callback: (event: MouseEvent) => void): this;
    onStopMouseMove(callback: (event: MouseEvent) => void): this;
    onStopMouseOut(callback: (event: MouseEvent) => void): this;
    onStopMouseOver(callback: (event: MouseEvent) => void): this;
    onStopMouseUp(callback: (event: MouseEvent) => void): this;
    onStopWheel(callback: (event: WheelEvent) => void): this;
    onStopContextMenu(callback: (event: MouseEvent) => void): this;

    // Stop propagation versions for Keyboard Events
    onStopKeyDown(callback: (event: KeyboardEvent) => void): this;
    onStopKeyPress(callback: (event: KeyboardEvent) => void): this;
    onStopKeyUp(callback: (event: KeyboardEvent) => void): this;

    // Stop propagation versions for Form Events
    onStopBlur(callback: (event: FocusEvent) => void): this;
    onStopChange(callback: (event: Event) => void): this;
    onStopFocus(callback: (event: FocusEvent) => void): this;
    onStopFocusIn(callback: (event: FocusEvent) => void): this;
    onStopFocusOut(callback: (event: FocusEvent) => void): this;
    onStopInput(callback: (event: Event) => void): this;
    onStopInvalid(callback: (event: Event) => void): this;
    onStopReset(callback: (event: Event) => void): this;
    onStopSearch(callback: (event: Event) => void): this;
    onStopSelect(callback: (event: Event) => void): this;
    onStopSubmit(callback: (event: Event) => void): this;

    // Stop propagation versions for Drag Events
    onStopDrag(callback: (event: DragEvent) => void): this;
    onStopDragEnd(callback: (event: DragEvent) => void): this;
    onStopDragEnter(callback: (event: DragEvent) => void): this;
    onStopDragLeave(callback: (event: DragEvent) => void): this;
    onStopDragOver(callback: (event: DragEvent) => void): this;
    onStopDragStart(callback: (event: DragEvent) => void): this;
    onStopDrop(callback: (event: DragEvent) => void): this;

    // Stop propagation versions for Window/Page Events
    onStopAfterPrint(callback: (event: Event) => void): this;
    onStopBeforePrint(callback: (event: Event) => void): this;
    onStopBeforeUnload(callback: (event: BeforeUnloadEvent) => void): this;
    onStopError(callback: (event: Event) => void): this;
    onStopHashChange(callback: (event: HashChangeEvent) => void): this;
    onStopLoad(callback: (event: Event) => void): this;
    onStopOffline(callback: (event: Event) => void): this;
    onStopOnline(callback: (event: Event) => void): this;
    onStopPageHide(callback: (event: PageTransitionEvent) => void): this;
    onStopPageShow(callback: (event: PageTransitionEvent) => void): this;
    onStopResize(callback: (event: UIEvent) => void): this;
    onStopScroll(callback: (event: Event) => void): this;
    onStopUnload(callback: (event: Event) => void): this;

    // Stop propagation versions for Media Events
    onStopAbort(callback: (event: Event) => void): this;
    onStopCanPlay(callback: (event: Event) => void): this;
    onStopCanPlayThrough(callback: (event: Event) => void): this;
    onStopDurationChange(callback: (event: Event) => void): this;
    onStopEmptied(callback: (event: Event) => void): this;
    onStopEnded(callback: (event: Event) => void): this;
    onStopLoadedData(callback: (event: Event) => void): this;
    onStopLoadedMetadata(callback: (event: Event) => void): this;
    onStopLoadStart(callback: (event: Event) => void): this;
    onStopPause(callback: (event: Event) => void): this;
    onStopPlay(callback: (event: Event) => void): this;
    onStopPlaying(callback: (event: Event) => void): this;
    onStopProgress(callback: (event: ProgressEvent) => void): this;
    onStopRateChange(callback: (event: Event) => void): this;
    onStopSeeked(callback: (event: Event) => void): this;
    onStopSeeking(callback: (event: Event) => void): this;
    onStopStalled(callback: (event: Event) => void): this;
    onStopSuspend(callback: (event: Event) => void): this;
    onStopTimeUpdate(callback: (event: Event) => void): this;
    onStopVolumeChange(callback: (event: Event) => void): this;
    onStopWaiting(callback: (event: Event) => void): this;

    // Stop propagation versions for Touch Events
    onStopTouchCancel(callback: (event: TouchEvent) => void): this;
    onStopTouchEnd(callback: (event: TouchEvent) => void): this;
    onStopTouchMove(callback: (event: TouchEvent) => void): this;
    onStopTouchStart(callback: (event: TouchEvent) => void): this;

    // Stop propagation versions for Animation Events
    onStopAnimationEnd(callback: (event: AnimationEvent) => void): this;
    onStopAnimationIteration(callback: (event: AnimationEvent) => void): this;
    onStopAnimationStart(callback: (event: AnimationEvent) => void): this;

    // Stop propagation versions for Transition Events
    onStopTransitionEnd(callback: (event: TransitionEvent) => void): this;

    // Stop propagation versions for Clipboard Events
    onStopCopy(callback: (event: ClipboardEvent) => void): this;
    onStopCut(callback: (event: ClipboardEvent) => void): this;
    onStopPaste(callback: (event: ClipboardEvent) => void): this;

    // PREVENT + STOP VERSIONS

    // Prevent + Stop versions for Mouse Events
    onPreventStopClick(callback: (event: MouseEvent) => void): this;
    onPreventStopDblClick(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseDown(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseEnter(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseLeave(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseMove(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseOut(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseOver(callback: (event: MouseEvent) => void): this;
    onPreventStopMouseUp(callback: (event: MouseEvent) => void): this;
    onPreventStopWheel(callback: (event: WheelEvent) => void): this;
    onPreventStopContextMenu(callback: (event: MouseEvent) => void): this;

    // Prevent + Stop versions for Keyboard Events
    onPreventStopKeyDown(callback: (event: KeyboardEvent) => void): this;
    onPreventStopKeyPress(callback: (event: KeyboardEvent) => void): this;
    onPreventStopKeyUp(callback: (event: KeyboardEvent) => void): this;

    // Prevent + Stop versions for Form Events
    onPreventStopBlur(callback: (event: FocusEvent) => void): this;
    onPreventStopChange(callback: (event: Event) => void): this;
    onPreventStopFocus(callback: (event: FocusEvent) => void): this;
    onPreventStopFocusIn(callback: (event: FocusEvent) => void): this;
    onPreventStopFocusOut(callback: (event: FocusEvent) => void): this;
    onPreventStopInput(callback: (event: Event) => void): this;
    onPreventStopInvalid(callback: (event: Event) => void): this;
    onPreventStopReset(callback: (event: Event) => void): this;
    onPreventStopSearch(callback: (event: Event) => void): this;
    onPreventStopSelect(callback: (event: Event) => void): this;
    onPreventStopSubmit(callback: (event: Event) => void): this;

    // Prevent + Stop versions for Drag Events
    onPreventStopDrag(callback: (event: DragEvent) => void): this;
    onPreventStopDragEnd(callback: (event: DragEvent) => void): this;
    onPreventStopDragEnter(callback: (event: DragEvent) => void): this;
    onPreventStopDragLeave(callback: (event: DragEvent) => void): this;
    onPreventStopDragOver(callback: (event: DragEvent) => void): this;
    onPreventStopDragStart(callback: (event: DragEvent) => void): this;
    onPreventStopDrop(callback: (event: DragEvent) => void): this;

    // Prevent + Stop versions for Window/Page Events
    onPreventStopAfterPrint(callback: (event: Event) => void): this;
    onPreventStopBeforePrint(callback: (event: Event) => void): this;
    onPreventStopBeforeUnload(callback: (event: BeforeUnloadEvent) => void): this;
    onPreventStopError(callback: (event: Event) => void): this;
    onPreventStopHashChange(callback: (event: HashChangeEvent) => void): this;
    onPreventStopLoad(callback: (event: Event) => void): this;
    onPreventStopOffline(callback: (event: Event) => void): this;
    onPreventStopOnline(callback: (event: Event) => void): this;
    onPreventStopPageHide(callback: (event: PageTransitionEvent) => void): this;
    onPreventStopPageShow(callback: (event: PageTransitionEvent) => void): this;
    onPreventStopResize(callback: (event: UIEvent) => void): this;
    onPreventStopScroll(callback: (event: Event) => void): this;
    onPreventStopUnload(callback: (event: Event) => void): this;

    // Prevent + Stop versions for Media Events
    onPreventStopAbort(callback: (event: Event) => void): this;
    onPreventStopCanPlay(callback: (event: Event) => void): this;
    onPreventStopCanPlayThrough(callback: (event: Event) => void): this;
    onPreventStopDurationChange(callback: (event: Event) => void): this;
    onPreventStopEmptied(callback: (event: Event) => void): this;
    onPreventStopEnded(callback: (event: Event) => void): this;
    onPreventStopLoadedData(callback: (event: Event) => void): this;
    onPreventStopLoadedMetadata(callback: (event: Event) => void): this;
    onPreventStopLoadStart(callback: (event: Event) => void): this;
    onPreventStopPause(callback: (event: Event) => void): this;
    onPreventStopPlay(callback: (event: Event) => void): this;
    onPreventStopPlaying(callback: (event: Event) => void): this;
    onPreventStopProgress(callback: (event: ProgressEvent) => void): this;
    onPreventStopRateChange(callback: (event: Event) => void): this;
    onPreventStopSeeked(callback: (event: Event) => void): this;
    onPreventStopSeeking(callback: (event: Event) => void): this;
    onPreventStopStalled(callback: (event: Event) => void): this;
    onPreventStopSuspend(callback: (event: Event) => void): this;
    onPreventStopTimeUpdate(callback: (event: Event) => void): this;
    onPreventStopVolumeChange(callback: (event: Event) => void): this;
    onPreventStopWaiting(callback: (event: Event) => void): this;

    // Prevent + Stop versions for Touch Events
    onPreventStopTouchCancel(callback: (event: TouchEvent) => void): this;
    onPreventStopTouchEnd(callback: (event: TouchEvent) => void): this;
    onPreventStopTouchMove(callback: (event: TouchEvent) => void): this;
    onPreventStopTouchStart(callback: (event: TouchEvent) => void): this;

    // Prevent + Stop versions for Animation Events
    onPreventStopAnimationEnd(callback: (event: AnimationEvent) => void): this;
    onPreventStopAnimationIteration(callback: (event: AnimationEvent) => void): this;
    onPreventStopAnimationStart(callback: (event: AnimationEvent) => void): this;

    // Prevent + Stop versions for Transition Events
    onPreventStopTransitionEnd(callback: (event: TransitionEvent) => void): this;

    // Prevent + Stop versions for Clipboard Events
    onPreventStopCopy(callback: (event: ClipboardEvent) => void): this;
    onPreventStopCut(callback: (event: ClipboardEvent) => void): this;
    onPreventStopPaste(callback: (event: ClipboardEvent) => void): this;

    // DELEGATION METHODS - WHEN (for children)

    // When versions for Mouse Events
    whenClick(callback: (event: MouseEvent) => void): this;
    whenDblClick(callback: (event: MouseEvent) => void): this;
    whenMouseDown(callback: (event: MouseEvent) => void): this;
    whenMouseEnter(callback: (event: MouseEvent) => void): this;
    whenMouseLeave(callback: (event: MouseEvent) => void): this;
    whenMouseMove(callback: (event: MouseEvent) => void): this;
    whenMouseOut(callback: (event: MouseEvent) => void): this;
    whenMouseOver(callback: (event: MouseEvent) => void): this;
    whenMouseUp(callback: (event: MouseEvent) => void): this;
    whenWheel(callback: (event: WheelEvent) => void): this;
    whenContextMenu(callback: (event: MouseEvent) => void): this;

    // When versions for Keyboard Events
    whenKeyDown(callback: (event: KeyboardEvent) => void): this;
    whenKeyPress(callback: (event: KeyboardEvent) => void): this;
    whenKeyUp(callback: (event: KeyboardEvent) => void): this;

    // When versions for Form Events
    whenBlur(callback: (event: FocusEvent) => void): this;
    whenChange(callback: (event: Event) => void): this;
    whenFocus(callback: (event: FocusEvent) => void): this;
    whenFocusIn(callback: (event: FocusEvent) => void): this;
    whenFocusOut(callback: (event: FocusEvent) => void): this;
    whenInput(callback: (event: Event) => void): this;
    whenInvalid(callback: (event: Event) => void): this;
    whenReset(callback: (event: Event) => void): this;
    whenSearch(callback: (event: Event) => void): this;
    whenSelect(callback: (event: Event) => void): this;
    whenSubmit(callback: (event: Event) => void): this;

    // When versions for Drag Events
    whenDrag(callback: (event: DragEvent) => void): this;
    whenDragEnd(callback: (event: DragEvent) => void): this;
    whenDragEnter(callback: (event: DragEvent) => void): this;
    whenDragLeave(callback: (event: DragEvent) => void): this;
    whenDragOver(callback: (event: DragEvent) => void): this;
    whenDragStart(callback: (event: DragEvent) => void): this;
    whenDrop(callback: (event: DragEvent) => void): this;

    // When versions for Window/Page Events
    whenAfterPrint(callback: (event: Event) => void): this;
    whenBeforePrint(callback: (event: Event) => void): this;
    whenBeforeUnload(callback: (event: BeforeUnloadEvent) => void): this;
    whenError(callback: (event: Event) => void): this;
    whenHashChange(callback: (event: HashChangeEvent) => void): this;
    whenLoad(callback: (event: Event) => void): this;
    whenOffline(callback: (event: Event) => void): this;
    whenOnline(callback: (event: Event) => void): this;
    whenPageHide(callback: (event: PageTransitionEvent) => void): this;
    whenPageShow(callback: (event: PageTransitionEvent) => void): this;
    whenResize(callback: (event: UIEvent) => void): this;
    whenScroll(callback: (event: Event) => void): this;
    whenUnload(callback: (event: Event) => void): this;

    // When versions for Media Events
    whenAbort(callback: (event: Event) => void): this;
    whenCanPlay(callback: (event: Event) => void): this;
    whenCanPlayThrough(callback: (event: Event) => void): this;
    whenDurationChange(callback: (event: Event) => void): this;
    whenEmptied(callback: (event: Event) => void): this;
    whenEnded(callback: (event: Event) => void): this;
    whenLoadedData(callback: (event: Event) => void): this;
    whenLoadedMetadata(callback: (event: Event) => void): this;
    whenLoadStart(callback: (event: Event) => void): this;
    whenPause(callback: (event: Event) => void): this;
    whenPlay(callback: (event: Event) => void): this;
    whenPlaying(callback: (event: Event) => void): this;
    whenProgress(callback: (event: ProgressEvent) => void): this;
    whenRateChange(callback: (event: Event) => void): this;
    whenSeeked(callback: (event: Event) => void): this;
    whenSeeking(callback: (event: Event) => void): this;
    whenStalled(callback: (event: Event) => void): this;
    whenSuspend(callback: (event: Event) => void): this;
    whenTimeUpdate(callback: (event: Event) => void): this;
    whenVolumeChange(callback: (event: Event) => void): this;
    whenWaiting(callback: (event: Event) => void): this;

    // When versions for Touch Events
    whenTouchCancel(callback: (event: TouchEvent) => void): this;
    whenTouchEnd(callback: (event: TouchEvent) => void): this;
    whenTouchMove(callback: (event: TouchEvent) => void): this;
    whenTouchStart(callback: (event: TouchEvent) => void): this;

    // When versions for Animation Events
    whenAnimationEnd(callback: (event: AnimationEvent) => void): this;
    whenAnimationIteration(callback: (event: AnimationEvent) => void): this;
    whenAnimationStart(callback: (event: AnimationEvent) => void): this;

    // When versions for Transition Events
    whenTransitionEnd(callback: (event: TransitionEvent) => void): this;

    // When versions for Clipboard Events
    whenCopy(callback: (event: ClipboardEvent) => void): this;
    whenCut(callback: (event: ClipboardEvent) => void): this;
    whenPaste(callback: (event: ClipboardEvent) => void): this;

    // CAPTURE METHODS (for parents)

    // Capture versions for Mouse Events
    captureClick(directHandler?: (event: MouseEvent) => void): this;
    captureDblClick(directHandler?: (event: MouseEvent) => void): this;
    captureMouseDown(directHandler?: (event: MouseEvent) => void): this;
    captureMouseEnter(directHandler?: (event: MouseEvent) => void): this;
    captureMouseLeave(directHandler?: (event: MouseEvent) => void): this;
    captureMouseMove(directHandler?: (event: MouseEvent) => void): this;
    captureMouseOut(directHandler?: (event: MouseEvent) => void): this;
    captureMouseOver(directHandler?: (event: MouseEvent) => void): this;
    captureMouseUp(directHandler?: (event: MouseEvent) => void): this;
    captureWheel(directHandler?: (event: WheelEvent) => void): this;
    captureContextMenu(directHandler?: (event: MouseEvent) => void): this;

    // Capture versions for Keyboard Events
    captureKeyDown(directHandler?: (event: KeyboardEvent) => void): this;
    captureKeyPress(directHandler?: (event: KeyboardEvent) => void): this;
    captureKeyUp(directHandler?: (event: KeyboardEvent) => void): this;

    // Capture versions for Form Events
    captureBlur(directHandler?: (event: FocusEvent) => void): this;
    captureChange(directHandler?: (event: Event) => void): this;
    captureFocus(directHandler?: (event: FocusEvent) => void): this;
    captureFocusIn(directHandler?: (event: FocusEvent) => void): this;
    captureFocusOut(directHandler?: (event: FocusEvent) => void): this;
    captureInput(directHandler?: (event: Event) => void): this;
    captureInvalid(directHandler?: (event: Event) => void): this;
    captureReset(directHandler?: (event: Event) => void): this;
    captureSearch(directHandler?: (event: Event) => void): this;
    captureSelect(directHandler?: (event: Event) => void): this;
    captureSubmit(directHandler?: (event: Event) => void): this;

    // Capture versions for Drag Events
    captureDrag(directHandler?: (event: DragEvent) => void): this;
    captureDragEnd(directHandler?: (event: DragEvent) => void): this;
    captureDragEnter(directHandler?: (event: DragEvent) => void): this;
    captureDragLeave(directHandler?: (event: DragEvent) => void): this;
    captureDragOver(directHandler?: (event: DragEvent) => void): this;
    captureDragStart(directHandler?: (event: DragEvent) => void): this;
    captureDrop(directHandler?: (event: DragEvent) => void): this;

    // Capture versions for Window/Page Events
    captureAfterPrint(directHandler?: (event: Event) => void): this;
    captureBeforePrint(directHandler?: (event: Event) => void): this;
    captureBeforeUnload(directHandler?: (event: BeforeUnloadEvent) => void): this;
    captureError(directHandler?: (event: Event) => void): this;
    captureHashChange(directHandler?: (event: HashChangeEvent) => void): this;
    captureLoad(directHandler?: (event: Event) => void): this;
    captureOffline(directHandler?: (event: Event) => void): this;
    captureOnline(directHandler?: (event: Event) => void): this;
    capturePageHide(directHandler?: (event: PageTransitionEvent) => void): this;
    capturePageShow(directHandler?: (event: PageTransitionEvent) => void): this;
    captureResize(directHandler?: (event: UIEvent) => void): this;
    captureScroll(directHandler?: (event: Event) => void): this;
    captureUnload(directHandler?: (event: Event) => void): this;

    // Capture versions for Media Events
    captureAbort(directHandler?: (event: Event) => void): this;
    captureCanPlay(directHandler?: (event: Event) => void): this;
    captureCanPlayThrough(directHandler?: (event: Event) => void): this;
    captureDurationChange(directHandler?: (event: Event) => void): this;
    captureEmptied(directHandler?: (event: Event) => void): this;
    captureEnded(directHandler?: (event: Event) => void): this;
    captureLoadedData(directHandler?: (event: Event) => void): this;
    captureLoadedMetadata(directHandler?: (event: Event) => void): this;
    captureLoadStart(directHandler?: (event: Event) => void): this;
    capturePause(directHandler?: (event: Event) => void): this;
    capturePlay(directHandler?: (event: Event) => void): this;
    capturePlaying(directHandler?: (event: Event) => void): this;
    captureProgress(directHandler?: (event: ProgressEvent) => void): this;
    captureRateChange(directHandler?: (event: Event) => void): this;
    captureSeeked(directHandler?: (event: Event) => void): this;
    captureSeeking(directHandler?: (event: Event) => void): this;
    captureStalled(directHandler?: (event: Event) => void): this;
    captureSuspend(directHandler?: (event: Event) => void): this;
    captureTimeUpdate(directHandler?: (event: Event) => void): this;
    captureVolumeChange(directHandler?: (event: Event) => void): this;
    captureWaiting(directHandler?: (event: Event) => void): this;

    // Capture versions for Touch Events
    captureTouchCancel(directHandler?: (event: TouchEvent) => void): this;
    captureTouchEnd(directHandler?: (event: TouchEvent) => void): this;
    captureTouchMove(directHandler?: (event: TouchEvent) => void): this;
    captureTouchStart(directHandler?: (event: TouchEvent) => void): this;

    // Capture versions for Animation Events
    captureAnimationEnd(directHandler?: (event: AnimationEvent) => void): this;
    captureAnimationIteration(directHandler?: (event: AnimationEvent) => void): this;
    captureAnimationStart(directHandler?: (event: AnimationEvent) => void): this;

    // Capture versions for Transition Events
    captureTransitionEnd(directHandler?: (event: TransitionEvent) => void): this;

    // Capture versions for Clipboard Events
    captureCopy(directHandler?: (event: ClipboardEvent) => void): this;
    captureCut(directHandler?: (event: ClipboardEvent) => void): this;
    capturePaste(directHandler?: (event: ClipboardEvent) => void): this;
}