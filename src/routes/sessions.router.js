import { Router } from "express";
import passport from "passport";
import { SessionControllers } from "../controllers/sessions.controller.js";
import { UsersController } from "../controllers/users.controller.js";
const sessionRouter = Router()

sessionRouter.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionRouter.get('/github', passport.authenticate('github', { failureRedirect: '/views/error' }), UsersController.Login
);

export default sessionRouter