import { CartModel } from "../../models/Cart.model.js";

class CartManager {

    async GetAll() {
        const response = await CartModel.find().populate('Products.product').lean();
        return response;
    }
    // 
    async GetByID(ID) {
        const response = await CartModel.findById(ID).populate('Products.product').lean();
        return response;
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