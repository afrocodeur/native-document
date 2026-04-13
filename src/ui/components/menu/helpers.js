import {Div, ForEachArray, UnorderedList} from "../../../core/elements";
import {computePosition, flip, offset, shift} from "@floating-ui/dom";

export const buildSubmenu = ($desc, orientation, $isOpen, instance) => {
    const root     = instance.getRoot();
    const $compact = root.$description?.compact;
    if(orientation === 'inline') {
        const submenuEl = Div({ class: 'sub-menu', 'is-open': $isOpen, 'is-inline': $compact.is(false), 'is-vertical': $compact},
            UnorderedList({class: 'sub-menu-container'}, ForEachArray($desc.items))
        );

        $compact?.subscribe((isCompact) => {
            if(isCompact) {
                submenuEl.style.position = 'fixed';
                submenuEl.style.left     = '0px';
                submenuEl.style.top      = '0px';
            } else {
                submenuEl.style.position = '';
                submenuEl.style.left     = '';
                submenuEl.style.top      = '';
            }
        });

        return submenuEl;
    }

    return Div({class: 'sub-menu is-' + orientation, 'is-open': $isOpen, style: {position: 'fixed', left: '0px', top: '0px'}},
        UnorderedList({class: 'sub-menu-container'}, ForEachArray($desc.items))
    );
};

export const setupInteraction = (listItem, el, submenuEl, orientation, interaction, $isOpen, hasSubmenu, instance) => {
    const root              = instance.getRoot();
    const $compact          = root.$description?.compact;
    const $menuActive       = root.$description?.menuActive;
    const $isMenuActivated  = root.$description?.isMenuActivated;
    const $activeItem       = root.$description?.activeItem;
    const rootOrientation   = root.$description?.orientation || 'horizontal';
    const clickFirst        = root.$description.clickFirst || rootOrientation === 'inline';

    const isPopup = () => {
        if(orientation === 'horizontal') return true;
        if(orientation === 'vertical')   return true;
        return $compact?.val() || false;
    };

    const updatePosition = () => {
        const placement = (orientation === 'horizontal' && (!root || instance.$parent === root))
            ? 'bottom-start'
            : 'right-start';
        requestAnimationFrame(() => {
            computePosition(el, submenuEl, {
                placement,
                middleware: [offset(2), flip(), shift({padding: 4})],
            }).then(({x, y}) => {
                submenuEl.style.left = x + 'px';
                submenuEl.style.top  = y + 'px';
            });
        });
    };

    let closeTimer = null;

    const open = () => {

        $activeItem?.set(instance);

        if (hasSubmenu) {
            $isOpen.set(true);
            if (isPopup()) {
                updatePosition();
            }
        }
    };

    const close = () => {
        closeTimer = setTimeout(() => {
            if($activeItem?.val() === instance) {
                $activeItem?.set(null);
            }
            $isOpen.set(false);
        }, 20);
    };

    $activeItem?.subscribe((activeInstance) => {
        if(activeInstance !== instance
            && activeInstance?.$parent === instance.$parent) {
            $isOpen.set(false);
        }
    });

    listItem.nd
        .onMouseEnter((e) => {
            e.stopPropagation();
            clearTimeout(closeTimer);
            if(clickFirst && !$isMenuActivated?.val()) {
                return;
            }
            open();
        })
        .onMouseLeave((e) => {
            e.stopPropagation();
            if(clickFirst && $isMenuActivated?.val()) {
                return;
            }
            close();
        });

    if(clickFirst) {
        el.nd.onStopClick(() => {
            $isMenuActivated?.set(true);
            open();
        });
    }

    document.addEventListener('click', (e) => {
        $isMenuActivated?.set(false);
        $isOpen.set(false);
        $activeItem?.set(null);
    });
};