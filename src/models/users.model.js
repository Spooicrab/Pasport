import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Cart',
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    Github: {
        type: Boolean,
        default: false
    }
});

export const usersModel = mongoose.model("Users", usersSchema);
