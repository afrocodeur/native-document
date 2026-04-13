import {Div} from '../../../core/elements';
import {ElementCreator} from '../../../core/wrappers/ElementCreator';
import SplitterGutter from '../../../components/splitter/SplitterGutter';
import './splitter.css';

export default function SplitterRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('splitter');
    props.class.add('is-' + ($desc.orientation || 'horizontal'));

    const container = Div(instance.resolveProps());

    if($desc.panels.__$isObservableArray) {
        $desc.panels.subscribe((panels) => {
            buildPanels(container, panels, $desc, instance);
        });
        buildPanels(container, $desc.panels.val(), $desc, instance);
    }
    else {
        buildPanels(container, $desc.panels, $desc, instance);
    }

    return container;
}

const buildPanels = (container, panels, $desc, instance) => {
    container.innerHTML = '';

    panels.forEach((panel, index) => {
        panel.$description.orientation = $desc.orientation || 'horizontal';
        container.appendChild(ElementCreator.getChild(panel));

        if(index < panels.length - 1) {
            const nextPanel = panels[index + 1];
            const canResize = panel.$description.resizable !== false
                && nextPanel.$description.resizable !== false;

            if(canResize) {
                const gutter = SplitterGutter(panel, nextPanel);

                if($desc.orientation === 'vertical') {
                    gutter.vertical();
                }

                if($desc.gutterSize) {
                    gutter.size($desc.gutterSize);
                }

                gutter.onDrag((sizes) => instance.emit('resize', {...sizes, index}));

                container.appendChild(ElementCreator.getChild(gutter));
            }
        }
    });

    setDefaultSizes(panels, $desc);
};

const setDefaultSizes = (panels, $desc) => {
    const isHorizontal = $desc.orientation !== 'vertical';
    const gutterSize   = $desc.gutterSize || 8;
    const gutterCount  = panels.length - 1;
    const count        = panels.length;

    panels.forEach((panel) => {
        if(panel.$description.size.val() != null) {
            return;
        }

        const defaultSize = `calc(${100 / count}% - ${(gutterCount * gutterSize) / count}px)`;
        panel.size(defaultSize);
    });
};