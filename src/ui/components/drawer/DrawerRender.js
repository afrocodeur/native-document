import {Aside, Div, H2, Header, Paragraph, Button, Footer, ShowIf} from '../../../core/elements';
import { $ } from '../../../core/data/Observable';

import './drawer.css';

export default function DrawerRender($desc, instance) {
    const $isOpen = $desc.isOpen ?? $(false);
    if(!$desc.isOpen) {
        instance.isOpen($isOpen);
    }

    const props = instance.getEditableProps();
    props.class.add('drawer-container');

    if($desc.backdrop) {
        props.class.add('drawer-has-backdrop');
    }
    props.class.add('at-'+$desc.position);
    props.class.add('is-open', $isOpen);

    const closeFn = () => {
        $isOpen.set(false);
    };

    return ShowIf($isOpen, () => {
        return Div({ ...instance.resolveProps() }, [
            $desc.backdrop ? Div({ class: 'drawer-backdrop' }) : null,

            Aside({ class: 'drawer-panel' },
                Div({ class: 'drawer-panel-container' }, [
                    Header({ class: 'drawer-header' }, buildDrawerHeader($desc, instance, closeFn)),
                    buildDrawerBody($desc, instance, closeFn),
                    buildDrawerFooter($desc, instance, closeFn),
                ])
            ),
        ]);
    });
}

const buildDrawerHeader = ($desc, instance, closeFn) => {
    if($desc.renderHeader) {
        return $desc.renderHeader($desc, instance, closeFn);
    }

    if(!($desc.title || $desc.subtitle) && !$desc.closable) {
        return null;
    }

    return [
        Div({ class: 'drawer-title-container' }, [
            H2({ class: 'drawer-title' }, $desc.title),
            $desc.subtitle ? Paragraph({ class: 'drawer-sub-title' }, $desc.subtitle) : null,
        ]),
        $desc.closable
            ? Button({ type: 'button', class: 'drawer-close', 'aria-label': 'Close menu' }, 'X').onClick(closeFn)
            : null,
    ];
};

const buildDrawerBody = ($desc, instance, closeFn) => {
    if($desc.renderContent) {
        return Div({ class: 'drawer-body' }, $desc.renderContent($desc, instance, closeFn));
    }

    return Div({ class: 'drawer-body' }, $desc.content);
};

const buildDrawerFooter = ($desc, instance, closeFn) => {
    if($desc.renderFooter) {
        return Footer({ class: 'drawer-footer' }, $desc.renderFooter($desc, instance, closeFn));
    }
    if($desc.footerContent) {
        return Footer({ class: 'drawer-footer' }, $desc.footerContent);
    }
    return null;
};