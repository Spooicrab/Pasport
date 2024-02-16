import { CartService } from "../services/Cart.services.js";

class CartsController {

    GetAllCarts = async (req, res) => {
        try {
            const Carts = await CartService.GetAll()
            return res.status(200).json(Carts)
        } catch (error) { return res.status(400).json(error) }
    }

    CrearCarrito = async (req, res) => {
        try {
            const add = await CartService.Add(req.body);


            res.status(200).json({ message: 'Carrito con productos creado', add })


        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    AgregarCantidad =
        async (req, res) => {
            const data = req.body
            try {
                const response = await CartService.AgregarCantidad(data.CartID, data.ProductID);
                return response
            } catch (error) { res.status(500).json({ error: error.message }) }
        }

    GetCartById = async (req, res) => {
        const { cid } = req.params
        try {
            const Cart = await CartService.findByID(cid)
            return res.status(200).json(Cart)
        } catch (error) { throw new Error('Cart Not Found') }
    }

    VaciarCarrito = async (req, res) => {
        const { cid } = req.params;
        try {
            const response = await CartService.Vaciar(cid);
            return res.status(200).json(response);
        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    ActualizarCarrito = async (req, res) => {
        const { cid } = req.params;
        const obj = req.body
        try {
            const actualizar = await CartService.Actualizar(cid, obj);


            return res.status(200).json(actualizar)


        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    ActualizarCantidad = async (req, res) => {
        try {
            const { cid } = req.params;
            const { pid } = req.params;
            const response = await CartService.AgregarCantidad(cid, pid);

            return res.status(200).json(response)

        } catch (error) { res.status(500).json({ error: error.message }) }
    }

}

export const CartController = new CartsController();
