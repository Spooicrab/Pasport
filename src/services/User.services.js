import { usersManager } from "../dao/mongo/UserManager.js";

class UserServices {
    async findById(id) {
        const response = await usersManager.findById(id)
        return response;
    }
    async findByEmail(email) {
        const response = await usersManager.findByEmail(email);
        return response;
    }

    async createOne(obj) {
        const response = await usersManager.createOne(obj);
        return response;
    }
}

export const UserService = new UserServices();
