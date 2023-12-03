import { ProductsService } from "../services/Product.services.js"
class ProductsController {
    GetAllProducts = async (req, res) => {
        try {
            const Productos = await ProductsService.GetAll(req.query)
            return res.status(200).json(Productos)
        } catch (error) { return res.status(400).json(error) }
    }

    GetProduct = async (req, res) => {
        const { pid } = req.params
        try {
            const Producto = await ProductsService.GetById(pid)
            return res.status(200).json(Producto)
        } catch (error) { return res.status(400).json(error) }
    }

    AñadirProducto = async (req, res) => {
        const { title, description, price, stock, code, thumbail, } = req.body;
        if (!title || !price || !code) { return res.status(400).json({ message: "Faltan datos" }) }
        if (!stock) { delete req.body.stock }
        try {
            const Add = await ProductsService.Add(req.body);
            res.status(200).json({ Add });
        } catch (error) { return res.status(400).json(error) }
    }

    BorrarProducto = async (req, res) => {
        const { pid } = req.params
        try {
            const Producto = await ProductsService.Delete(pid)
            return res.status(200).json('Producto eliminado')
        } catch (error) { return res.status(400).json(error) }
    }

    ActualizarProducto = async (req, res) => {
        const { pid } = req.params
        const obj = req.body
        try {
            const Producto = await ProductsService.Update(pid, obj)
            return res.status(200).json('Producto Actualizado')
        } catch (error) { return res.status(400).json(error) }
    }
}
export const ProductController = new ProductsController()