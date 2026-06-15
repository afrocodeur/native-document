import {Div, Span, ShowIf} from '../../../core/elements';

// [a11y] ID counter for aria-controls
let _accordionIdCounter = 0;

export default function AccordionItemRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('accordion-item');
    props.class.add({'is-disabled': $desc.disabled});

    // [a11y] Generate unique IDs for aria-controls / aria-labelledby
    const accordionId = ++_accordionIdCounter;
    const headerId    = `accordion-header-${accordionId}`;
    const panelId     = `accordion-panel-${accordionId}`;

    const header = buildHeader($desc, instance, headerId, panelId);
    const content = buildContent($desc, instance, headerId, panelId);

    return Div(instance.resolveProps(), [header, content]);
}

const buildHeader = ($desc, instance, headerId, panelId) => {
    if($desc.renderHeader) {
        return $desc.renderHeader($desc, instance);
    }

    const indicatorClass = $desc.expanded.transform(
        (expanded) => 'accordion-indicator' + (expanded ? ' is-expanded' : ''),
    );

    const content = [
        Span({class: 'accordion-header-icon'}, $desc.icon),
        Span({class: 'accordion-header-title'}, $desc.title),
        buildIndicator($desc),
    ];

    const header = Div({
        class: 'accordion-header',
        id: headerId,
        // [a11y] aria-expanded reactive, aria-controls points to panel
        'aria-expanded': $desc.expanded.transform((v) => String(v)),
        'aria-controls': panelId,
    }, content);

    if(!$desc.disabled?.val()) {
        header.nd.onClick(() => {
            if($desc.collapsible || !$desc.expanded.val()) {
                instance.toggle();
            }
        });
    }

    return header;
};

const buildIndicator = ($desc) => {
    if($desc.renderIndicator) {
        return $desc.renderIndicator($desc.expanded);
    }

    return Span({
        class: $desc.expanded.transform((expanded) => 'accordion-indicator' + (expanded ? ' is-expanded' : '')),
    }, '▾');
};

const buildContent = ($desc, instance, headerId, panelId) => {
    // [a11y] role=region + aria-labelledby on panel
    const panelProps = {
        class: 'accordion-content',
        id: panelId,
        role: 'region',
        'aria-labelledby': headerId,
    };

    if($desc.renderContent) {
        return ShowIf($desc.expanded, () =>
            Div(panelProps, $desc.renderContent($desc, instance)),
        );
    }

    return ShowIf($desc.expanded, () =>
        Div(panelProps, $desc.content),
    );
};