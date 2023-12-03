import { CartM } from "../dao/mongo/CartManager.js";

class CartServices {

    async GetAll() {
        const response = await CartM.GetAll()
        return response;
    }
    // 
    async findByID(ID) {
        const response = await CartM.GetByID(ID);
        return response;
    }
    // 
    async Add(obj) {
        const response = await CartM.Add(obj)
        return response;
    }
    // 
    async Delete(ID) {
        const response = await CartM.Delete(ID)
        return response;
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
        response.Products = obj
        await response.save()
        return response
    }
    //
    async AgregarCantidad(CartID, ProductID) {
        const response = await CartM.GetByID(CartID);
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
    }

    async DeleteProduct(CartID, ProductID) {
        const response = await CartM.GetByID(CartID)
        if (!response) { return null }
        const ProductoIndex = response.Products.findIndex(p => p.product.equals(ProductID))
        response.Products.splice(ProductoIndex, 1)
        const done = await response.save()
        return done
    }
    async Sumar(CartID, ProductID) {
        const response = await CartM.GetByID(CartID)
        if (!response) { return null }
        const ProductoIndex = response.Products.findIndex(p => p.product.equals(ProductID))
        response.Products[ProductoIndex].Cantidad = response.Products[ProductoIndex].Cantidad++
        const done = await response.save()
        return done
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