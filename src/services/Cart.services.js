import { CartM } from "../dao/mongo/CartManager.js";
import { ErrorMessages } from "../error/dictionaryError.js";
import CustomError from "../error/error.js";

class CartServices {

    async GetAll() {
        try {
            const response = await CartM.GetAll()
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CARTS_NOT_FOUND)
        }
    }
    // 
    async findByID(ID) {
        try {
            const response = await CartM.GetByID(ID);
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CART_NOT_FOUND)
        }
    }
    // 
    async Add(obj) {
        try {
            const response = await CartM.Add(obj)
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CART_NOT_CREATED)
        }
    }
    // 
    async Delete(ID) {
        try {
            const response = await CartM.Delete(ID)
            return response;
        } catch (error) {
            CustomError.createError(ErrorMessages.CART_NOT_DELETED)
        }
    }
    //
    async Vaciar(ID) {
        const response = await CartM.GetByID(ID)
        response.Products = []
        return response.save()
    }
    //
    async Actualizar(CartID, obj) {
        const response = await CartM.GetByID(CartID)
        try {
            response.Products = obj
            await response.save()
            return response

        } catch (error) {
            CustomError.createError(ErrorMessages.CARTS_NOT_FOUND)
        }
    }
    //
    async AgregarCantidad(CartID, ProductID) {
        const response = await CartM.GetByID(CartID);
        try {
            if (!response) { return null }
            const ProductoIndex = response.Products.findIndex(p => {
                return p.product._id.equals(ProductID);
            });
            if (ProductoIndex === -1) {
                response.Products.push({
                    product: ProductID,
                    Cantidad: 1
                });
            } else {
                response.Products[ProductoIndex].Cantidad += 1;
            }
            const done = await response.save();
            return done;
        } catch (error) {
            CustomError.createError(ErrorMessages.PRODUCT_NOT_ADDED)
        }
    }

    async DeleteProduct(CartID, ProductID) {
        try {
            const response = await CartM.GetByID(CartID)
            if (!response) { return null }
            const ProductoIndex = response.Products.findIndex(p => p.product.equals(ProductID))
            response.Products.splice(ProductoIndex, 1)
            const done = await response.save()
            return done
        } catch (error) {
            CustomError.createError(ErrorMessages.PRODUCT_NOT_DELETED_FROM_CART)
        }
    }
    async Sumar(CartID, ProductID) {
        try {
            const response = await CartM.GetByID(CartID)
            if (!response) { return null }
            const ProductoIndex = response.Products.findIndex(p => p.product.equals(ProductID))
            response.Products[ProductoIndex].Cantidad = response.Products[ProductoIndex].Cantidad++
            const done = await response.save()
            return done
        } catch (error) {
            CustomError.createError(ErrorMessages.PRODUCT_NOT_ADDED_TO_CART)
        }
    }
    async CrearCarrito() {
        const carritoVacio = {
            Products: [],
        };
        const nuevoCarrito = await this.Add(carritoVacio);
        return nuevoCarrito._id;
    }
}
export const CartService = new CartServices();