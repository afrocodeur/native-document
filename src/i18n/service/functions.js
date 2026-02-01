import {Observable} from "../../../index";
import Validator from "../../core/utils/validator";

export const getParams = (params) => {
    if(!params) {
        return {};
    }

    const result = {};
    for (const key in params) {
        result[key] = Observable.value(params[key]);
    }
    return result;
};

export const hasObservableParams = (params) => {
    if(!params) {
        return false;
    }
    return Validator.isObject(params)
        && Object.values(params).some(value => Validator.isObservable(value));
};

export const getObservableParams = (params) => {
    if(!params) {
        return [];
    }
    return Object.values(params).filter(value => Validator.isObservable(value));
};