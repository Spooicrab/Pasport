import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controllers/users.controller.js";
const UserRouter = Router();

UserRouter.post('/signup',
    passport.authenticate('signup'), UsersController.Register
)

UserRouter.post('/login',
    passport.authenticate('login',
        {
            successRedirect: '/views/products',
            failureRedirect: '/views/error'
        }
    )
)

UserRouter.get('/:idUser', UsersController.FindUser)


export default UserRouter;