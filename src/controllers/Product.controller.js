import { ProductsService } from "../services/Product.services.js"
import { consolelogger } from "../winston.js"
import config from "../config/config.js"
import { transporter } from "../nodemailer.js"
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

    async AñadirProducto(req, res) {
        const userRole = req.user.role;
        const { title, description, price, stock, code, thumbail } = req.body;

        if (!title || !price || !code || !stock) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        let productOwner;

        if (userRole === 'admin') {
            productOwner = 'admin';
        } else if (userRole === 'premium') {
            productOwner = req.user.email;
        } else {
            return res.status(403).send('No tienes permiso para esto');
        }

        if (!stock) {
            delete req.body.stock;
        }

        try {
            const Add = await ProductsService.Add({
                ...req.body,
                Owner: productOwner
            });

            consolelogger.debug(Add);

            res.status(200).json({ message: "Añadido", product: Add });
        } catch (err) {
            consolelogger.error(err);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    EliminarProducto =
        async (req, res) => {
            const userRole = req.user.role;
            const { pid } = req.params
            const product = await ProductsService.GetById(pid)

            if (userRole === 'admin') {
                await ProductsService.Delete(pid);
                let destinatario;
                if (product.Owner !== 'admin') { destinatario = product.Owner; }
                else { destinatario = req.user.email; }
                const opt = {
                    from: config.gmail_user.toString(),
                    to: destinatario,
                    subject: 'Producto eliminado',
                    html: `  <h3>  Su producto en esta plataforma fue eliminado  </h3>  `
                };
                transporter.sendMail(opt);
                res.status(200).json('ProductoEliminado')
            }
            else if (userRole === 'premium' && product.Owner !== 'admin') {
                await ProductsService.Delete(pid);
                let destinatario;
                if (product.Owner !== 'admin') { destinatario = product.Owner; }
                else { destinatario = req.user.email; }

                const opt = {
                    from: config.gmail_user.toString(),
                    to: destinatario,
                    subject: 'Producto eliminado',
                    html: `  <h3>  Su producto en esta plataforma fue eliminado  </h3>  `
                };
                transporter.sendMail(opt);
                return res.status(200).json('Producto Eliminado');
            } else { return res.status(403).send('No tienes permiso para esto') }
        }

    ActualizarProducto =
        async (req, res) => {
            const userRole = req.user.role;
            const { pid } = req.params
            const product = await ProductsService.GetById(pid)
            if (userRole === 'admin') {
                await ProductsService.Update(pid, req.body);
                res.status(200).json('Producto actualizado')
            }
            if (userRole === 'premium') {
                if (product.Owner !== 'admin') {
                    await ProductsService.Update(pid, req.body);
                    return res.status(200).json('Producto Actualizado');
                } else { return res.status(403).send('No tienes permiso para esto'); }
            } else { res.status(403).send('No tienes permiso para esto') }
        }
}
export const ProductController = new ProductsController()