import { ChatManager } from "../dao/mongo/Chatmanager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";

class ChatServices {

    async find() {
        try {
            const response = await ChatManager.find();
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CHAT_NOT_FOUND)
        }
    }
    // 
    async Add(obj) {
        try {
            const response = await ChatManager.Add(obj)
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CHAT_NOT_CREATED)
        }
    }
}

export const ChatService = new ChatServices();