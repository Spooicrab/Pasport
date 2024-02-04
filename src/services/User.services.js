import { usersManager } from "../dao/mongo/UserManager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";
import { __dirname } from "../utils.js";
import { CompareData, HashData } from "../utils.js";
import { consolelogger } from "../winston.js";

class UserServices {
    async findAll() {
        try {
            const users = await usersManager.findAll()
            const response = users.reduce(
                (arr, {
                    first_name,
                    last_name,
                    email,
                    role,
                    last_connection
                }) => {
                    arr.push({
                        first_name,
                        last_name,
                        email,
                        role,
                        last_connection
                    })
                    return arr
                }, []
            )
            return response

        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.USERS_NOT_FOUND)
        }
    }

    async updateLastLog(id) {
        const userToUpdate = await this.findById(id)
        try {
            userToUpdate.last_connection = new Date()
            consolelogger.debug(userToUpdate.last_connection)
            await userToUpdate.save()
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.USER_NOT_UPDATED)
        }

    }

    async updateDocs(id, docName, fileName) {
        try {
            const user = await this.findById(id)
            user.documents.push(
                {
                    name: docName,
                    reference: `${fileName}`
                }
            )
            await user.save()
        } catch (error) {
            CustomError.createError(ErrorMessages.USER_NOT_UPDATED)
            consolelogger.error(error)
        }
    }



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
            const isTheSame = await CompareData(newPass, user.password)
            if (isTheSame == true) {
                return 1
            }
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


    async createPremiumUser(obj) {
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

