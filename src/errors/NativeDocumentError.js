export default class NativeDocumentError extends Error {
    constructor(message, context = {}) {
        super(message);
        this.name = 'NativeDocumentError';
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}