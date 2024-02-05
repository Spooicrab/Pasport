import { Router } from "express";
import { ProductController } from "../controllers/Product.controller.js";
import passport from "passport";
const ProductRouter = Router()

ProductRouter.get("/", ProductController.GetAllProducts)

ProductRouter.get("/:pid", ProductController.GetProduct)

ProductRouter.post("/", passport.authenticate('jwt', { session: false }), ProductController.AñadirProducto);

ProductRouter.put('/:pid', passport.authenticate('jwt', { session: false }), ProductController.ActualizarProducto);

ProductRouter.delete('/:pid', passport.authenticate('jwt', { session: false }), ProductController.EliminarProducto);

export default ProductRouter