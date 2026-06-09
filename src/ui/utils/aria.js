/**
 * Applies aria attributes on a trigger element for overlay components.
 * Sets aria-haspopup and keeps aria-expanded in sync with the isOpen observable.
 *
 * @param {HTMLElement} triggerSource - The trigger element
 * @param {ObservableItem<boolean>} isOpen - Observable controlling the open state
 * @param {'menu'|'listbox'|'dialog'|'tree'|'grid'} [type='menu'] - aria-haspopup value
 */
export const ariaTrigger = (triggerSource, isOpen, type = 'menu') => {
    const triggerEl = triggerSource?.toNdElement?.() ?? triggerSource;
    if(!triggerEl) {
        return;
    }
    triggerEl.setAttribute('aria-haspopup', type);
    triggerEl.setAttribute('aria-expanded', 'false');
    isOpen.subscribe((value) => {
        triggerEl.setAttribute('aria-expanded', String(value));
    });
};
