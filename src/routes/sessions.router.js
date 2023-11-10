import { Router } from "express";
import passport from "passport";
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
    ),
    (req, res) => {
        req.session.user = req.user
        console.log(req.user)
        res.redirect('/views/products')
    }
);

sessionRouter.get('/:idUser', async (req, res) => {
    const { idUser } = req.params
    try {
        const user = await usersManager.findById(idUser)
        res.status(200).json({ message: 'user found', user })
    } catch (error) { return res.status(500).json(error) }
})

sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/views/login");
    });
});
export default sessionRouter