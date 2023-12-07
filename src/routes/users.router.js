import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import passport from "passport";
const UserRouter = Router();

UserRouter.post('/signup', passport.authenticate('signup'), UsersController.Register)

UserRouter.post('/login', passport.authenticate('login', { failureRedirect: '/views/login' }), (req, res) => {
    res.cookie('jwt', req.user.token, { httpOnly: true });
    res.redirect('/views/products');
});

UserRouter.get('/:idUser', async (req, res) => {
    const { idUser } = req.params
    try {
        const user = await usersManager.findById(idUser)
        res.status(200).json({ message: 'user found', user })
    } catch (error) { return res.status(500).json(error) }
})


export default UserRouter;