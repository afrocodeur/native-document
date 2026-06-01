import {Div, Span, ShowIf} from '../../../core/elements';

export default function AccordionItemRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('accordion-item');
    props.class.add({'is-disabled': $desc.disabled});

    const header = buildHeader($desc, instance);
    const content = buildContent($desc, instance);

    return Div(instance.resolveProps(), [header, content]);
}

const buildHeader = ($desc, instance) => {
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

    const header = Div({class: 'accordion-header'}, content);

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

const buildContent = ($desc, instance) => {
    if($desc.renderContent) {
        return ShowIf($desc.expanded, () =>
            Div({class: 'accordion-content'}, $desc.renderContent($desc, instance)),
        );
    }

    return ShowIf($desc.expanded, () =>
        Div({class: 'accordion-content'}, $desc.content),
    );
};