import { Router } from "express";
import { ProductController } from "../controllers/Product.controller.js";
const ProductRouter = Router()

ProductRouter.get("/", ProductController.GetAllProducts)

ProductRouter.get("/:pid", ProductController.GetProduct)

ProductRouter.post("/", ProductController.AñadirProducto);

ProductRouter.delete("/:pid", ProductController.BorrarProducto)

ProductRouter.put("/:pid", ProductController.ActualizarProducto)

export default ProductRouter