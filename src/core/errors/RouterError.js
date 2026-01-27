

export default class RouterError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
    }

}