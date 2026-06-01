import {Div, Span} from '../../../core/elements';
import Button from '../../../components/button/Button';
import {createPortal} from '../../../core/elements/anchor/anchor';

import './toast.css';

const $containers = {};

const getContainer = (position) => {
    if($containers[position]) {
        return $containers[position];
    }

    const container = Div({class: 'toast-container is-' + position});
    createPortal(container, { name: 'toast-' + position });
    $containers[position] = container;

    return container;
};

export default function ToastRender($desc, instance) {
    const props    = instance.getEditableProps();
    const type     = $desc.type || 'info';
    const position = $desc.position || 'top-trailing';

    props.class.add('toast');
    props.class.add('is-' + type);

    const content = [];

    if($desc.showIcon && $desc.icon) {
        content.push(Span({class: 'toast-icon'}, $desc.icon));
    }

    content.push(buildContent($desc, instance));

    if($desc.closable) {
        const closeBtn = Button('×', { class: 'toast-close', type: 'button' })
            .ghost()
            .nd.onClick(() => instance.close());
        content.push(closeBtn);
    }

    const element = Div(instance.resolveProps(), content);

    const container = getContainer(position);
    container.appendChild(element);

    const close = (visible) => {
        if(!visible) {
            element.remove();
            $desc.visibility.unsubscribe(close);
        }
    };
    $desc.visibility.subscribe(close);

    if($desc.duration <= 0) {
        return element;
    }

    let timer = null;
    const initCloseCountdown = () => {
        timer = setTimeout(() => instance.close(element), $desc.duration);
    };

    if($desc.pauseOnHover) {
        element.nd
            .onMouseEnter(() => clearTimeout(timer))
            .onMouseLeave(initCloseCountdown);
    }
    initCloseCountdown();
    return element;
}

const buildContent = ($desc, instance) => {
    const body = [];

    if($desc.title) {
        body.push(Div({class: 'toast-title'}, $desc.title));
    }

    if($desc.content) {
        body.push(Div({class: 'toast-content'}, $desc.content));
    }

    if($desc.actions?.length) {
        const actions = $desc.actions.map((action) => {
            return Button(action.label)
                .ghost()
                .variant(action.variant || $desc.type || null)
                .small()
                .nd.onClick(() => action.handler.call(this, ...arguments, instance));
        });

        body.push(Div({class: 'toast-footer'}, actions));
    }

    return Div({class: 'toast-body'}, body);
};
