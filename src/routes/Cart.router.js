import { Router } from "express";
import passport from "passport";
import { CartController } from "../controllers/Cart.controller.js";

const CartRouter = Router()

CartRouter.get("/", CartController.GetAllCarts);

CartRouter.post("/", CartController.CrearCarrito)

CartRouter.put('/', passport.authenticate('jwt', { session: false }), CartController.AgregarCantidad)

CartRouter.get("/:cid", CartController.GetCartById);

CartRouter.delete("/:cid", passport.authenticate('jwt', { session: false }), CartController.VaciarCarrito);

CartRouter.put("/:cid", passport.authenticate('jwt', { session: false }), CartController.ActualizarCarrito)

CartRouter.put("/:cid/products/:pid", passport.authenticate('jwt', { session: false }), CartController.ActualizarCantidad)

export default CartRouter;
