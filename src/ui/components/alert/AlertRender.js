import {Div, Span} from '../../../core/elements';
import Button from '../../../components/button/Button';

import './alert.css';

export default function AlertRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('alert');
    props.class.add('is-' + ($desc.variant || 'info'));
    props.class.add('is-' + ($desc.appearance || 'bordered'));

    const content = [];

    if($desc.showIcon && $desc.icon) {
        content.push(Span({class: 'alert-icon'}, $desc.icon));
    }

    content.push(buildBody($desc, instance));

    return Div(instance.resolveProps(), content);
}

const buildBody = ($desc, instance) => {
    const body = [];

    if($desc.renderTitle) {
        body.push(Div({class: 'alert-title'}, [
            $desc.renderTitle($desc, instance),
            $desc.closable ? buildClose($desc, instance) : null,
        ]));
    }
    else if($desc.title) {
        body.push(Div({class: 'alert-title'}, [
            $desc.title,
            $desc.closable ? buildClose($desc, instance) : null,
        ]));
    }

    if($desc.renderContent) {
        body.push(Div({class: 'alert-content'}, $desc.renderContent($desc, instance)));
    }
    else if($desc.content) {
        body.push(Div({class: 'alert-content'}, $desc.content));
    }

    if($desc.renderFooter) {
        body.push(Div({class: 'alert-footer'}, $desc.renderFooter($desc, instance)));
    }
    else if($desc.actions?.length) {
        body.push(buildFooter($desc, instance));
    }

    return Div({class: 'alert-body'}, body);
};

const buildFooter = ($desc, instance) => {
    const actions = $desc.actions.map((action) => {
        let classes = '';

        if ($desc.appearance === 'filled') {
            classes  += ' is-light';
        }


        return Button(action.label, { class: 'alert-action'+classes })
            .variant(action.variant || $desc.variant || 'info').nd.onClick(function() {
                action.handler.call(this, ...arguments, instance);
            });
    });

    return Div({class: 'alert-footer'}, actions);
};

const buildClose = ($desc, instance) => {
    return Button('×', { class: 'alert-close' })
        .nd.onClick(() => {
            instance.emit('close');
            instance.hide();
        });
};