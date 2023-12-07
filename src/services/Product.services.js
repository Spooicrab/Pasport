import { ProductManager } from "../dao/mongo/ProductManager.js";

class ProductsServices {
    // 
    async GetAll(obj) {
        const response = await ProductManager.GetAll(obj)
        return response;
    }
    // 
    async GetById(id) {
        const response = await ProductManager.GetById(id);
        return response;
    }
    // 
    async Add(obj) {
        const response = await ProductManager.Add(obj)
        return response;
    }
    // 
    async Delete(id) {
        const response = await ProductManager.Delete(id)
        return response;
    }
    // 
    async Update(id, obj) {
        const response = await ProductManager.GetById(id)
        console.log(response)
        try {
            response.title = obj.title
            response.description = obj.description
            response.price = obj.price
            response.thumbnail = obj.thumbnail
            response.code = obj.code
            response.stock = obj.stock
            const Actualizado = response.save()
            return Actualizado
        } catch (error) { throw error }
    }
}
export const ProductsService = new ProductsServices;