import {Dialog, Div, Span} from '../../../core/elements';
import Button from '../../../components/button/types/Button';
import {ElementCreator} from "../../../core/wrappers/ElementCreator";
import {createPortal} from "../../../core/elements/anchor/anchor";

import './modal.css';

export default function ModalRender($desc, instance) {
    const editableProps = instance.getEditableProps();

    editableProps.class.add('modal');
    if($desc.size) {
        editableProps.class.add('is-' + $desc.size);
    }

    if($desc.scrollable) {
        editableProps.props.add('is-scrollable');
    }

    const propsValue = instance.resolveProps();
    const dialog = Dialog({ ...propsValue });
    const content = [];

    const header = $desc.renderHeader ? $desc.renderHeader($desc, instance) : buildHeader($desc, instance, dialog);

    content.push(header);

    if($desc.renderContent) {
        content.push(Div({class: 'modal-body'}, $desc.renderContent($desc, instance)));
    }
    else if($desc.content) {
        content.push(Div({class: 'modal-body'}, $desc.content));
    }

    if($desc.renderFooter) {
        content.push($desc.renderFooter($desc, instance));
    }
    else if($desc.footer) {
        content.push(Div({class: 'modal-footer'}, $desc.footer));
    }

    dialog.appendChild(ElementCreator.getChild(content));


    $desc.isOpen.subscribe((value) => {
        const isNativeOpen = dialog.open;

        if (value && !isNativeOpen) {
            dialog.showModal();
            return;
        }
        if (!value && isNativeOpen) {
            dialog.close();
        }
    });

    setupBehaviours(dialog, $desc, instance);

    if($desc.draggable) {
        instance.makeDraggable(dialog, $desc.dragByHeader ? header : null);
    }
    if($desc.resizable) {
        instance.makeResizable(dialog, $desc.resizableOptions);
    }

    return createPortal(dialog);
}

const buildHeader = ($desc, instance) => {
    const content = [];

    content.push(Div({class: 'modal-title'}, $desc.title))

    if($desc.closable) {
        content.push(
            Button('×', {class: 'modal-close'})
                .ghost()
                .nd.onClick(() => instance.close())
        );
    }

    return Div({class: 'modal-header'}, content);
};

const setupBehaviours = (dialog, $desc, instance) => {

    dialog.addEventListener('close', () => instance.close());

    if($desc.closeOnBackdrop) {
        let clickStartedOnBackdrop = false;
        dialog.addEventListener('mousedown', (e) => {
            clickStartedOnBackdrop = (e.target === dialog);
        });

        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();

            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );

            if (clickStartedOnBackdrop && !isInDialog) {
                instance.close();
            }
            clickStartedOnBackdrop = false;
        });
    }

    if(!$desc.closeOnEscape) {
        dialog.nd.onKeyDown((e) => {
            if(e.key === 'Escape') {
                e.preventDefault();
            }
        });
    }

};