import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controllers/users.controller.js";
const UserRouter = Router();

UserRouter.get('/', UsersController.getAll)

UserRouter.post('/signup', passport.authenticate('signup'), UsersController.Register)

UserRouter.post('/signup/premium', passport.authenticate('CreatePremium'), UsersController.Premium)

UserRouter.post('/login', passport.authenticate('login', { failureRedirect: '/views/error' }), UsersController.Login);

UserRouter.get('/logout', UsersController.Logout)

UserRouter.get('/:idUser', UsersController.FindUser)


export default UserRouter;