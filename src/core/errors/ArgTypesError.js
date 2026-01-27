

export default class ArgTypesError extends Error {
    constructor(message, errors) {
        super(`${message}\n\n${errors.join("\n")}\n\n`);
    }
}