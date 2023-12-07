import { Router } from "express";
import passport from "passport";
import { SessionControllers } from "../controllers/sessions.controller.js";
const sessionRouter = Router()

sessionRouter.get('/auth/github',
    passport.authenticate('github',
        {
            scope: ['user:email']
        }
    )
);

sessionRouter.get('/github',
    passport.authenticate('github',
        { failureRedirect: '/views/error' },
    ), SessionControllers.GithubAuth

);

sessionRouter.get('/:idUser', SessionControllers.FindSession)

export default sessionRouter