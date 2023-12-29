import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import passport from "passport";
const UserRouter = Router();

UserRouter.post('/signup', passport.authenticate('signup'), UsersController.Register)

UserRouter.post('/login', passport.authenticate('login', { failureRedirect: '/views/error' }), UsersController.Login);

UserRouter.get('/:idUser', UsersController.FindUser)


export default UserRouter;