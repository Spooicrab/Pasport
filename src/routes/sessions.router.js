import { Router } from "express";
import passport from "passport";
import { SessionControllers } from "../services/sessions.services.js";
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
        { failureRedirect: '/views/error' }
    ), SessionControllers.GithubAuth

);

sessionRouter.get('/:idUser', SessionControllers.FindSession)

sessionRouter.get("/logout", SessionControllers.DestroySession);
export default sessionRouter