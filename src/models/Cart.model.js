import mongoose from "mongoose";
const CartSchema = new mongoose.Schema({
    Products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Products',
                required: true
            },
            Cantidad: {
                type: Number,
                required: true
            },
            _id: false
            //ojo
        }
    ]
});


export const CartModel = new mongoose.model("Cart", CartSchema);

