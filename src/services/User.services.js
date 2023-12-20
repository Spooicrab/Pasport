import { usersManager } from "../dao/mongo/UserManager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";
import { consolelogger } from "../winston.js";

class UserServices {
    async findById(id) {
        try {
            const response = await usersManager.findById(id)
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.USER_NOT_FOUND)
        }

    }
    async findByEmail(email) {
        try {
            const response = await usersManager.findByEmail(email);
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.USERMAIL_NOT_FOUND)
        }
    }

    async createOne(obj) {
        try {
            const response = await usersManager.createOne(obj);
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.USER_NOT_CREATED)
        }
    }
}

export const UserService = new UserServices();

