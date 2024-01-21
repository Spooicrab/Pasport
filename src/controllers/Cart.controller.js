import { CartService } from "../services/Cart.services.js";

class CartsController {

    GetAllCarts = async (req, res) => {
        try {
            const Carts = await CartService.GetAll()
            return res.status(200).json(Carts)
        } catch (error) { return res.status(400).json(error) }
    }

    GetCartById = async (req, res) => {
        const { cid } = req.params
        try {
            const Cart = await CartService.findByID(cid)
            return res.status(200).json(Cart)
        } catch (error) { throw new Error('Cart Not Found') }
    }

    CrearCarrito = async (req, res) => {
        try {
            const CarritoNuevo = req.body
            const add = await CartService.Add(req.body);
            res.status(200).json({ message: 'Carrito con productos creado', add })
        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    VaciarCarrito = async (req, res) => {
        const { cid } = req.params;
        try {
            const Vaciar = await CartService.Vaciar(cid);
            return res.status(200).json({ message: "Carrito vaciado" });
        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    ActualizarCarrito = async (req, res) => {
        const { cid } = req.params;
        const obj = req.body
        try {
            await CartService.Actualizar(cid, obj);
            return res.status(200).json({ message: "Actualizado" })
        } catch (error) { res.status(500).json({ error: error.message }) }
    }

    ActualizarCantidad = async (req, res) => {
        try {
            const { cid } = req.params;
            const { pid } = req.params;
            await CartService.AgregarCantidad(cid, pid);

            return res.status(200).json('Actualizado')
        } catch (error) { res.status(500).json({ error: error.message }) }
    }

}

export const CartController = new CartsController();
