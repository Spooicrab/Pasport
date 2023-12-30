import { ProductoModel } from "../../models/Product.model.js";

class ProductsManager {
    // 
    async GetAll(obj) {
        const { limit = 12, page = 1, sort: sortPrice, ...query } = obj
        const response = await ProductoModel.paginate(query, {
            limit,
            page,
            sort: {
                price:
                    sortPrice === 'asc' ?
                        -1 : 1
            },
            lean: true
        })
        return response;
    }
    // 
    async GetById(id) {
        const response = await ProductoModel.findById(id);
        return response;
    }
    // 
    async Add(obj) {
        const response = await ProductoModel.create(obj)
        return response;
    }
    // 
    async Delete(id) {
        const response = await ProductoModel.findByIdAndDelete(id)
        return response;
    }
    async Update(product) {
        // console.log('----PRODUCTO A ACTUALIZAR STOCK:', product.title);
        let productoDB = await ProductoModel.findById(product._id);
        productoDB.stock = product.stock;
        let result = await product.save();

        return result;
    }

}

export const ProductManager = new ProductsManager;