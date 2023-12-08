import { ChatManager } from "../dao/mongo/Chatmanager.js";

class ChatServices {

    async find() {
        const response = await ChatManager.find();
        return response;
    }
    // 
    async findById(id) {
        const response = await ChatManager.findById(id);
        return response;
    }
    // 
    async Add(obj) {
        const response = await ChatManager.Add(obj)
        return response;
    }
    // 
    async Delete(id) {
        const response = await ChatManager.findByIdAndDelete(id)
        return response;
    }

}

export const ChatService = new ChatServices();