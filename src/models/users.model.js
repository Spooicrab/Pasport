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
    documents: [
        {
            name: {
                type: String,
            },
            reference: {
                type: String
            }
        }
    ]
    ,
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Cart',
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    last_connection: {
        type: Date,
        default: Date.now
    },
    Github: {
        type: Boolean,
        default: false
    }
});

export const usersModel = mongoose.model("Users", usersSchema);
