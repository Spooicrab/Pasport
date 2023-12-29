import { usersManager } from "../dao/mongo/UserManager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";
import { HashData } from "../utils.js";
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

    async ChangePass(id, newPass) {
        try {
            let user = await this.findById(id)
            let hashedpass = await HashData(newPass)
            user.password = hashedpass
            const response = await user.save()
            return response
        } catch (error) {
            console.log(error);
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

