import { ChatModel } from "../../models/Chat.model.js";

class ChatManagers {

    async find() {
        const response = await ChatModel.find().lean();
        return response;
    }
    // 
    async findById(id) {
        const response = await ChatModel.findById(id);
        return response;
    }
    // 
    async Add(obj) {
        const response = await ChatModel.create(obj)
        return response;
    }
    // 
    async Delete(id) {
        const response = await ChatModel.findByIdAndDelete(id)
        return response;
    }

}

export const ChatManager = new ChatManagers();