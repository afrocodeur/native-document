import { Icon } from './Icon';
import { ICON_GETTERS } from './icon-getters';


// -- Icon.{name} getters - tree-shakable via defineProperty -------------------

for(const name in ICON_GETTERS) {
    const canonicalName = ICON_GETTERS[name];
    Object.defineProperty(Icon, name, {
        get: () => Icon(canonicalName, Icon.defaultConfigs ?? {}),
        enumerable:   false,
        configurable: true,
    });
}


export { Icon };