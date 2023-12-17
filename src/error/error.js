
export default class CustomError {
    static createError(m) {
        const error = new Error(`${m}`);
        throw error;
    }
}