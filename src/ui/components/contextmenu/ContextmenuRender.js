import {Div, ShowIf} from "../../../core/elements";
import {createPortal} from "../../../core/elements/anchor/anchor";
import { $ } from '../../../../index';
import {computePosition, flip, shift} from '@floating-ui/dom';


import './contextmenu.css';

export default function ContextMenuRender($desc, instance) {
    const $positionX = instance.$description.positionX, $positionY = instance.$description.positionY;
    const format     = (value) => value + 'px';

    const contextBox = Div({
        class: 'context-menu',
        style: {position: 'fixed', left: $positionX.transform(format), top: $positionY.transform(format)},
    }, $desc.menu);
    instance.$description.contextContainer = contextBox;

    const container = ShowIf($desc.isOpen, () => contextBox);

    createPortal(container, {name: 'context-menu'});

    if($desc.trigger) {
        contextMenuHandler($desc.trigger, instance);
    }

    document.addEventListener('click', () => instance.hide());
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') instance.hide();
    });

    return $desc.trigger || container;
}

export const contextMenuHandler = (trigger, instance, data = null) => {
    if(!instance.$element) {
        instance.toNdElement();
    }
    const $positionX = instance.$description.positionX, $positionY = instance.$description.positionY;
    const contextBox = instance.$description.contextContainer;

    trigger.nd.onContextMenu((e) => {
        e.preventDefault();
        instance.$description.data = data;

        const virtualEl = {
            getBoundingClientRect: () => ({
                width: 0, height: 0,
                x: e.clientX, y: e.clientY,
                top: e.clientY, left: e.clientX,
                right: e.clientX, bottom: e.clientY,
            }),
        };

        instance.show();

        requestAnimationFrame(() => {
            computePosition(virtualEl, contextBox, {
                placement: 'bottom-start',
                middleware: [
                    flip(),
                    shift({padding: 8})
                ],
            }).then(({x, y}) => {
                $positionX.set(x);
                $positionY.set(y);
            });
        });
    })
}