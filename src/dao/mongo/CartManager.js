import { ErrorMessages } from "../../error/dictionaryError.js";
import CustomError from "../../error/error.js";
import { CartModel } from "../../models/Cart.model.js";
import { consolelogger } from "../../winston.js";

class CartManager {

    async GetAll() {
        const response = await CartModel.find().populate('Products.product');
        return response;
    }
    // 
    async GetByID(ID) {
        try {
            const response = await CartModel.findById(ID).populate('Products.product');
            return response;
        } catch (error) {
            consolelogger.error(error)
            CustomError.createError(ErrorMessages.PRODUCT_NOT_ADDED_TO_CART)
        }
    }
    // 
    async Add(obj) {
        const response = await CartModel.create(obj)
        return response;
    }
    // 
    async Delete(ID) {
        const response = await CartModel.findByIdAndDelete(ID)
        return response;
    }

}
export const CartM = new CartManager;
