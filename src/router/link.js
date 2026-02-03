import Validator from "../core/utils/validator";
import {Link as NativeLink} from "../../elements";
import Router, {DEFAULT_ROUTER_NAME} from "./Router";
import RouterError from "./errors/RouterError";


export function Link(options, children){
    const { to, href, ...attributes } = options;
    if(href) {
        const router = Router.get();
        return NativeLink({ ...attributes, href}, children).nd.onPreventClick(() => {
            router.push(href);
        });
    }
    const target = typeof to === 'string' ? { name: to } : to;
    const routerName = target.router || DEFAULT_ROUTER_NAME;
    const router = Router.get(routerName);
    if(!router) {
        throw new RouterError('Router not found "'+routerName+'" for link "'+target.name+'"');
    }
    const url = router.generateUrl(target.name, target.params, target.query);
    return NativeLink({ ...attributes, href: url }, children).nd.onPreventClick(() => {
        router.push(url);
    });
}

Link.blank = function(attributes, children){
    return NativeLink({ ...attributes, target: '_blank'}, children);
};