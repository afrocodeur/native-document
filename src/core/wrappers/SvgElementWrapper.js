import {createHtmlElement} from './HtmlElementWrapper';

export default function SvgElementWrapper(name) {
    let node = null;

    let createElement = (attr, children) => {
        node = document.createElementNS('http://www.w3.org/2000/svg', name);
        createElement = (attr, children) => {
            return createHtmlElement(node.cloneNode(), attr, children);
        };
        return createHtmlElement(node.cloneNode(), attr, children);
    };

    return (attr, children) => createElement(attr, children);
}