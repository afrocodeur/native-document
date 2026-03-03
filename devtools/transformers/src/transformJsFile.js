import {transformObservableDeclarations, transformObservableImports} from "./utils.js";


export default function transformJsFile(id, code, options) {

    return transformObservableDeclarations(
        transformObservableImports(code, { id, ...options }),
    );
}