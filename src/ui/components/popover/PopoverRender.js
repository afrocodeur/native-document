import {Div, ShowIf, Span} from '../../../core/elements';
import {computePosition, flip, arrow, offset, shift, size} from '@floating-ui/dom';
import {Observable} from '../../../core/data/Observable';

import './popover.css';

let $popoverId = 0;

const PLACEMENT_MAP = {
    'top':             'top',
    'top-leading':     'top-start',
    'top-trailing':    'top-end',
    'top-center':      'top',
    'right':           'right',
    'right-leading':   'right-start',
    'right-trailing':  'right-end',
    'bottom':          'bottom',
    'bottom-leading':  'bottom-start',
    'bottom-trailing': 'bottom-end',
    'bottom-center':   'bottom',
    'left':            'left',
    'left-leading':    'left-start',
    'left-trailing':   'left-end',
    'leading-center':  'left',
    'trailing-center': 'right',
};

const supportsPopover = () => {
    return Object.hasOwn(HTMLElement.prototype, "popover");
};

export default function PopoverRender($desc, instance, classPrefix = 'popover') {
    const trigger = ($desc.renderTrigger
        ? $desc.renderTrigger($desc, instance)
        : $desc.trigger).toNdElement();

    const editableProps = instance.getEditableProps();
    const toUnit = v => v + 'px';

    const popoverId = classPrefix+'-nd-' + (++$popoverId);
    const $x        = Observable(10).intercept(toUnit);
    const $y        = Observable(0).intercept(toUnit);

    let popoverArrow = $desc.arrow ? Span({class: classPrefix+'-arrow'}) : null;

    editableProps.class.add(classPrefix);
    editableProps.class.add('is-'+$desc.variant);
    editableProps.style.add({left: $x, top: $y});

    const popover = Div({
        popover: 'manual',
        role:    'dialog',
        id:      popoverId,
        ...instance.resolveProps()
    }, [
        buildContent($desc, instance, classPrefix),
        popoverArrow,
    ]);

    const popOverAnchor = ShowIf($desc.isOpen, popover);


    let position;
    const updatePosition = (state) => {
        if(!state) {
            return;
        }

        let targetElement = trigger;
        if($desc.matchTargetWidth) {
            if($desc.matchTargetWidth.$element) {
                targetElement = $desc.matchTargetWidth.$element;
            }
            else if($desc.matchTargetWidth.tagName) {
                targetElement = $desc.matchTargetWidth;
            }
        }
        requestAnimationFrame(() => {
            if($desc.showIf && $desc.showIf.val() === false) {
                return;
            }
            if(supportsPopover()) {
                popover.showPopover();
            }

            const middleware = [
                offset($desc.offset || 8),
                flip(),
                shift($desc.shift || {padding: 0}),
                $desc.arrow ? arrow({element: popoverArrow}) : null,
            ];

            if($desc.matchTriggerWidth || $desc.matchTargetWidth) {
                middleware.push(size({
                    apply({rects, elements}) {
                        elements.floating.style.width = rects.reference.width + 'px';
                    }
                }));
            }

            computePosition(targetElement, popover, {
                placement:  PLACEMENT_MAP[position],
                middleware: middleware.filter(Boolean),
            }).then(({x, y, placement, middlewareData}) => {
                $x.set(x);
                $y.set(y);

                if(!$desc.arrow) {
                    return;
                }

                const arrowData  = middlewareData.arrow;
                const staticSide = {
                    top:    'bottom',
                    right:  'left',
                    bottom: 'top',
                    left:   'right',
                }[placement.split('-')[0]];

                Object.assign(popoverArrow.style, {
                    left:         arrowData.x != null ? arrowData.x + 'px' : '',
                    top:          arrowData.y != null ? arrowData.y + 'px' : '',
                    [staticSide]: '-4px',
                });

                popover.setAttribute('data-placement', placement);
            });
        });
    };

    if($desc.position?.__$Observable) {
        position = $desc.position.val();
        $desc.position.subscribe((value) => {
            position = value;
            updatePosition();
        });
    }
    else {
        position = $desc.position || 'bottom';
    }

    $desc.isOpen.on(true, updatePosition);

    bindInteractions($desc, trigger, popover, instance);

    const updatePositionHandler = () => updatePosition($desc.isOpen.val());

    const observer = new ResizeObserver(updatePositionHandler);

    observer.observe(trigger);
    window.addEventListener('resize', updatePositionHandler);
    window.addEventListener('scroll', updatePositionHandler);

    if($desc.updatePositionOn) {
        $desc.updatePositionOn.subscribe(updatePositionHandler);
    }

    if($desc.includeTriggerIntoGhost) {
        return popOverAnchor.nd.ghostDom(trigger);
    }
    return popOverAnchor;
}

const bindInteractions = ($desc, trigger, popover, instance) => {
    if($desc.closeOnClickOutside) {
        const triggerElement = trigger.$element || trigger;
        document.addEventListener('click', (e) => {
            if(e.target === popover || popover.contains(e.target)) {
                return;
            }
            if(e.target === triggerElement || triggerElement.contains(e.target)) {
                return;
            }
            instance.close();
        });
    }

    if($desc.interaction === 'click') {
        trigger.nd.onClick(() => instance.toggle());
        return;
    }

    let closeTimeout = null;
    const close = () => {
        closeTimeout = setTimeout(() => instance.close(), 150);
    };

    if($desc.interaction === 'hover') {
        trigger.nd
            .onMouseEnter(() => {
                clearTimeout(closeTimeout);
                instance.open();
            })
            .onMouseLeave(close);

        popover.nd.onMouseEnter(() => clearTimeout(closeTimeout));
        popover.nd.onMouseLeave(close);
        return;
    }
    if($desc.interaction === 'focus') {
        trigger.nd
            .onKeyPress(() => instance.open())
            .onFocus(() => instance.open())
            .onBlur(close);
    }
};

const buildContent = ($desc, instance, classPrefix = 'popover') => {
    const content = [];

    if($desc.renderHeader || $desc.header) {
        content.push(Div({class: classPrefix+'-header'}, $desc.renderHeader
            ? $desc.renderHeader($desc, instance)
            : $desc.header
        ));
    }

    if($desc.renderContent || $desc.content) {
        content.push(Div({class: classPrefix+'-body'}, $desc.renderContent
            ? $desc.renderContent($desc, instance)
            : $desc.content
        ));
    }

    if($desc.renderFooter || $desc.footer) {
        content.push(Div({class: classPrefix+'-footer'}, $desc.renderFooter
            ? $desc.renderFooter($desc, instance)
            : $desc.footer
        ));
    }

    return content;
};