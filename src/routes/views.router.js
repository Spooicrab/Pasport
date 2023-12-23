import { Router } from "express";
import passport from "passport";

import { ticketController } from "../controllers/ticket.controller.js";
import { ViewsController } from "../controllers/views.controller.js";

const ViewsRouter = Router()

ViewsRouter.get("/products", passport.authenticate('jwt', { session: false }), ViewsController.Home)

ViewsRouter.get("/admin", passport.authenticate('jwt', { session: false }), ViewsController.admin)

ViewsRouter.get("/cart/:cid", passport.authenticate('jwt', { session: false }), ViewsController.Carrito)

ViewsRouter.get("/cart/:cid/purchase", passport.authenticate('jwt', { session: false }), ticketController.checkout)

ViewsRouter.get('/logout', ViewsController.logout)

ViewsRouter.get("/login", ViewsController.login)

ViewsRouter.get('/error', ViewsController.error)

ViewsRouter.get('/signup', ViewsController.signup)

export default ViewsRouter
