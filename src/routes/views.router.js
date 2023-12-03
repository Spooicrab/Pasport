import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";
const ViewsRouter = Router()

ViewsRouter.get("/products", ViewsController.Home)

ViewsRouter.get("/cart/:cid", ViewsController.Carrito)

ViewsRouter.post("/products", ViewsController.AñadirProducto);

ViewsRouter.get("/login", ViewsController.login)

ViewsRouter.get('/error', ViewsController.error)

ViewsRouter.get('/signup', ViewsController.signup)

export default ViewsRouter