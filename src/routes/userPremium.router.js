import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controllers/users.controller.js";
const UserPremiumRouter = Router();

UserPremiumRouter.post('/signup/', passport.authenticate('CreatePremium'), UsersController.Premium)

UserPremiumRouter.get('/:idUser', UsersController.FindUser)

export default UserPremiumRouter;