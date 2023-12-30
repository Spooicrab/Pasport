import mongoose, { mongo } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const ProductoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        Owner: {
            type: String,
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        thumbnail: {
            type: String
        },
        code: {
            type: Number,
            required: true
        },
        stock: {
            type: Number, default: 10
        },

    });

ProductoSchema.plugin(mongoosePaginate)

export const ProductoModel = mongoose.model('Products', ProductoSchema);
