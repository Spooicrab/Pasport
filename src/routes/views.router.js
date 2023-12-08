import { Router } from "express";
import passport from "passport";
import { ViewsController } from "../controllers/views.controller.js";
const ViewsRouter = Router()

ViewsRouter.get("/products", passport.authenticate('jwt', { session: false }), ViewsController.Home)

ViewsRouter.get("/admin", passport.authenticate('jwt', { session: false }), ViewsController.admin)

ViewsRouter.get("/cart/:cid", passport.authenticate('jwt', { session: false }), ViewsController.Carrito)

ViewsRouter.get("/login", ViewsController.login)

ViewsRouter.get('/error', ViewsController.error)

ViewsRouter.get('/signup', ViewsController.signup)

export default ViewsRouter
