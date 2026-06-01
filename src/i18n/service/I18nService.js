import i18next from 'i18next';
import {Observable} from '../../core/data/Observable';
import {hasObservableParams, getObservableParams, getParams} from './functions';

const I18nService = (function () {
    const defaultLang = import.meta.env.VITE_LOCALE || 'en';
    const $current = Observable(defaultLang);
    i18next.on('languageChanged', (lng) => $current.set(lng));

    return {
        init(resources) {
            return i18next.init({
                lng: import.meta.env.VITE_LOCALE,
                fallbackLng: import.meta.env.VITE_FALLBACK_LANGUE || 'en',
                debug: import.meta.env.VITE_ENV === 'development',
                resources,
            });
        },
        current: $current,
        use(lng) {
            return i18next.changeLanguage(lng);
        },
        tr(key, ...args) {
            return i18next.t(key, ...args) || key;
        },
    };
}());

const tr = (key, params = {}) => {
    const isContainObservable = hasObservableParams(params);
    const observable = isContainObservable
        ? Observable.computed(() => I18nService.tr(key, getParams(params)), getObservableParams(params))
        : Observable(I18nService.tr(key, params));

    i18next.on('languageChanged', (lng) => {
        const data = isContainObservable ? getParams(params) : params;
        observable.set(I18nService.tr(key, data));
    });
    return observable;
};

String.prototype.tr = function(params = {}) {
    return tr(this, params);
};

export { I18nService, tr };