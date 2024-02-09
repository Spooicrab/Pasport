import { Router } from "express";
import passport from "passport";
import { UsersController } from "../controllers/users.controller.js";
import { ViewsController } from "../controllers/views.controller.js";
import { upload } from "../multer.js";

const UserRouter = Router();

UserRouter.get('/', UsersController.getAll)

UserRouter.delete('/', passport.authenticate('jwt', { session: false }), UsersController.ClearUsers)

UserRouter.delete('/:idUser', passport.authenticate('jwt', { session: false }), UsersController.DeleteUser)

UserRouter.post('/signup', passport.authenticate('signup'), UsersController.Register)

UserRouter.post('/premium/:uid', UsersController.Premium)

UserRouter.post('/login', passport.authenticate('login', { failureRedirect: '/views/error' }), UsersController.Login);

UserRouter.get('/logout', UsersController.Logout)

UserRouter.get('/:idUser', UsersController.FindUser)

UserRouter.get('/:idUser/documents', ViewsController.Multer)

UserRouter.post('/:idUser/documents', upload.fields([{ name: 'Id' }, { name: 'Domicilio' }, { name: 'accountStatus' }]), ViewsController.UpdateDocs);

export default UserRouter;