import { ProductsService } from "../services/Product.services.js"
import { consolelogger } from "../winston.js"
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
        } catch (error) { throw new Error('Product not found') }
    }

    AñadirProducto =
        async (req, res) => {
            const userRole = req.user.role;
            if (userRole === 'admin') {
                const { title, description, price, stock, code, thumbail, } = req.body;
                if (!title || !price || !code || !stock) {
                    return res.status(400).json({ message: "Faltan datos" })
                }
                if (!stock) {
                    delete req.body.stock;
                }
                try {
                    const Add = await ProductsService.Add(
                        {
                            ...req.body,
                            Owner: req.user.email
                        }
                    )
                    res
                        .status(200)
                        .json({ message: "Añadido", product: Add });
                } catch (err) { consolelogger.error(err) }
            }
            if (userRole === 'premium') {
                const { title, description, price, stock, code, thumbail, } = req.body;
                if (!title || !price || !code || !stock) {
                    return res.status(400).json({ message: "Faltan datos" })
                }
                if (!stock) {
                    delete req.body.stock;
                }
                try {
                    const Add = await ProductsService.Add(
                        {
                            ...req.body,
                            Owner: req.user.email
                        }
                    );
                    console.log(Add);
                    res
                        .status(200)
                        .json({ message: "Añadido", product: Add });
                } catch (err) { consolelogger.error(err) }
            }
            else {
                res.status(403).send('No tienes permiso para esto')
            }

        }

    EliminarProducto =
        async (req, res) => {
            const userRole = req.user.role;
            const { pid } = req.params
            if (userRole === 'admin') {
                const erased = await ProductsService.Delete(pid);
                res.status(200).json('ProductoEliminado')
            } else {
                res.status(403).send('No tienes permiso para esto')
            }

        }

    ActualizarProducto =
        async (req, res) => {
            const userRole = req.user.role;
            const { pid } = req.params
            if (userRole === 'admin') {
                console.log('pid:', pid);
                const update = await ProductsService.Update(pid, req.body);
                res.status(200).json('Actualizado')
            } else {
                res.status(403).send('No tienes permiso para esto')
            }
        }
}
export const ProductController = new ProductsController()