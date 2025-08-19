import Validator from "../utils/validator.js";
import {Link as NativeLink} from "../../elements.js";
import Router, {DEFAULT_ROUTER_NAME} from "./Router.js";
import RouterError from "../errors/RouterError.js";


export function Link(options, children){
    const { to, href, ...attributes } = options;
    const target = to || href;
    if(Validator.isString(target)) {
        const router = Router.get();
        return NativeLink({ ...attributes, href: target}, children).nd.onPreventClick(() => {
            router.push(target);
        });
    }
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