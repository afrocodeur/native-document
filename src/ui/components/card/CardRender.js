import { Div, Img, Span } from '../../../core/elements';

import './card.css';
import {Button} from '../../../components/button';

export default function CardRender($desc, instance) {
    const imageSlot   = buildImage($desc, instance);
    const headerSlot  = buildHeader($desc, instance);
    const contentSlot = buildContent($desc, instance);
    const actionsSlot = buildActions($desc, instance);
    const footerSlot  = buildFooter($desc, instance, actionsSlot);

    if ($desc.layout) {
        return $desc.layout(
            { image: imageSlot, header: headerSlot, content: contentSlot, actions: actionsSlot, footer: footerSlot },
            instance,
        );
    }

    const props = instance.getEditableProps();

    props.class.add('card');

    if ($desc.variant) {
        props.class.add('is-' + $desc.variant);
    }

    props.class.add({
        'is-horizontal': $desc.horizontal,
        'is-hoverable':  $desc.hoverable,
        'is-clickable':  instance.hasListeners('click'),
    });

    if ($desc.loading) {
        props.class.add({ 'is-loading': $desc.loading });
    }

    const children = [
        imageSlot,
        Div({ class: 'card-content'}, [
            Div({ class: 'card-body' }, [headerSlot, contentSlot]),
            footerSlot,
        ]),
    ];

    const el = Div(instance.resolveProps(), children);

    el.nd.onClick((e) => instance.emit('click', e));
    el.nd.onMouseEnter((e) => instance.emit('hover', e));

    return el;
}

function buildImage($desc, instance) {
    if ($desc.renderImage) {
        return $desc.renderImage($desc, instance);
    }

    if (!$desc.image) {
        return null;
    }

    return Div({ class: 'card-image-wrapper' }, [
        Img($desc.image, {
            class: `card-image is-${$desc.imagePosition}`,
            alt:   '',
        })
    ]);
}

function buildHeader($desc, instance) {
    if ($desc.renderHeader) {
        return $desc.renderHeader($desc, instance);
    }

    const parts = [];

    if ($desc.title) {
        parts.push(Span({ class: 'card-title' }, $desc.title));
    }

    if ($desc.subtitle) {
        parts.push(Span({ class: 'card-subtitle' }, $desc.subtitle));
    }

    if (!parts.length) {
        return null;
    }

    return Div({ class: 'card-header' }, parts);
}

function buildContent($desc, instance) {
    if ($desc.renderContent) {
        return $desc.renderContent($desc, instance);
    }

    if (!$desc.content) {
        return null;
    }

    return Div({ class: 'card-content' }, $desc.content);
}

function buildActions($desc, instance) {
    if ($desc.renderActions) {
        return $desc.renderActions($desc, instance);
    }

    if (!$desc.actions?.length) {
        return null;
    }

    const buttons = $desc.actions.map(({ label, callback }) => {
        const btn = (typeof label === 'string') ? Button(label, { class: 'card-action' }) : label;
        btn.nd.onClick(() => callback?.());
        return btn;
    });

    return Div({ class: 'card-actions' }, buttons);
}

function buildFooter($desc, instance, actionsSlot) {
    if ($desc.renderFooter) {
        return $desc.renderFooter($desc, instance);
    }

    if (!actionsSlot) {
        return null;
    }

    return Div({ class: 'card-footer' }, actionsSlot);
}
