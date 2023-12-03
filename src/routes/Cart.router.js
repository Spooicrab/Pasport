import { Router } from "express";
import {CartController} from "../controllers/Cart.controller.js";


const CartRouter = Router()

CartRouter.get("/", CartController.GetAllCarts);

CartRouter.post("/", CartController.CrearCarrito)

CartRouter.delete("/:cid", CartController.VaciarCarrito);

CartRouter.put("/:cid", CartController.ActualizarCarrito)

CartRouter.put("/:cid/products/:pid", CartController.ActualizarCantidad)

CartRouter.delete("/:cid/products/:pid", CartController.EliminarProductoDeCarrito)

export default CartRouter;
