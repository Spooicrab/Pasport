import { usersModel } from "../../models/users.model.js";
import { consolelogger } from "../../winston.js";
class UsersManager {

    async findAll() {
        const response = await usersModel.find().populate('cart')
        return response
    }

    async findById(id) {
        const response = await usersModel.findById(id).populate('cart');
        return response;
    }
    async findByEmail(email) {
        const response = await usersModel.findOne({ email }).populate('cart');
        return response;
    }

    async createOne(obj) {
        const response = await usersModel.create(obj);
        consolelogger.debug(response)
        return response;
    }
}

export const usersManager = new UsersManager();
