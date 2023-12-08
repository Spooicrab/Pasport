import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
});

export const ChatModel = new mongoose.model("chats", ChatSchema);

