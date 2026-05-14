import {Observable} from "../../src/core/data/Observable";

export const DevToolService = {
    createdObservable: Observable(0),
}


export const DevToolsPlugin = {
    $name: 'DevTools',
    name: 'DevTools',
    onCreateObservable(observable) {
        DevToolService.createdObservable.set((last) => ++last);
        // console.log('Création Capturé', observable.$value);
    }
};