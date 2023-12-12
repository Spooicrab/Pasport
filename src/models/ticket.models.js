import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    carritoComprado: {
        Products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products',
                    required: true
                },
                Cantidad: {
                    type: Number,
                    required: true
                },
                _id: false
            }
        ]
    },
    CarritoPendiente: {
        Products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products',
                    required: true
                },
                Cantidad: {
                    type: Number,
                    required: true
                },
                _id: false
            }
        ]
    },
    // code: {
    //     type: Number,
    //     required: false,
    //     unique: true
    // },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    amount: {
        type: Number
    },
    purchaser: {
        type: String,
        required: true,
        unique: true,
    }
});

export const ticketModel = mongoose.model("Tickets", ticketSchema);
