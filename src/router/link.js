import Validator from "../utils/validator.js";
import {Link as NativeLink} from "../../elements.js";
import Router from "./Router.js";
import RouterError from "../errors/RouterError.js";


export function Link(attributes, children){
    const target = attributes.to || attributes.href;
    if(Validator.isString(target)) {
        const router = Router.get();
        return NativeLink({ ...attributes, href: target}, children).nd.on.prevent.click(() => {
            router.push(target);
        });
    }
    const router = Router.get(target.router);
    if(!router) {
        throw new RouterError('Router not found "'+target.router+'" for link "'+target.name+'"');
    }
    const url = router.generateUrl(target.name, target.params, target.query);
    return NativeLink({ ...attributes, href: url }, children).nd.on.prevent.click(() => {
        router.push(url);
    });
}

Link.blank = function(attributes, children){
    return NativeLink({ ...attributes, target: '_blank'}, children);
};