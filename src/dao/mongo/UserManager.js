import { usersModel } from "../../models/users.model.js";
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
        return response;
    }

    async deleteOne(id) {
        const response = await usersModel.findByIdAndDelete(id);
        return response;
    }
}

export const usersManager = new UsersManager();
