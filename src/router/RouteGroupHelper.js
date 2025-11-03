import {trim} from "../utils/helpers.js";

export const RouteGroupHelper = {
    /**
     *
     * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
     * @param {string} path
     * @returns {string}
     */
    fullPath: ($groupTree, path) => {
        const fullPath = [];
        $groupTree.forEach(group => {
            fullPath.push(trim(group.suffix, '/'));
        });
        fullPath.push(trim(path, '/'));
        return fullPath.join('/');
    },
    /**
     *
     * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
     * @param {Function[]} middlewares
     * @returns {Function[]}
     */
    fullMiddlewares: ($groupTree, middlewares) => {
        const fullMiddlewares = [];
        $groupTree.forEach(group => {
            if(group.options.middlewares) {
                fullMiddlewares.push(...group.options.middlewares);
            }
        });
        if(middlewares) {
            fullMiddlewares.push(...middlewares);
        }
        return fullMiddlewares;
    },
    /**
     *
     * @param {{suffix: string, options: {middlewares: Function[], name: string}}[]} $groupTree
     * @param {string} name
     * @returns {string}
     */
    fullName: ($groupTree, name) => {
        const fullName = [];
        $groupTree.forEach(group => {
            if(group.options?.name) {
                fullName.push(group.options.name);
            }
        });
        name && fullName.push(name);
        return fullName.join('.');
    },
    layout: ($groupTree) => {
        for(let i = $groupTree.length - 1; i >= 0; i--) {
            if($groupTree[i]?.options?.layout) {
                return $groupTree[i].options.layout;
            }
        }
        return null;
    }
};