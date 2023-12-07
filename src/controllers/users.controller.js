import config from "../config/config.js";
import { UserService } from "../services/User.services.js";
import jwt from 'jsonwebtoken'

class UserController {

    Register =
        (req, res) => {
            res.redirect('/views/login')
        }

    FindUser =
        async (req, res) => {
            const { idUser } = req.params
            try {
                const user = await UserService.findById(idUser)
                res.status(200).json({ message: 'user found', user })
            } catch (error) { return res.status(500).json(error) }
        }

    Login = (req, res) => {
        res.cookie('jwt', req.user.token, { httpOnly: true });
        jwt.verify(req.user.token, config.jwtsecret, (err, decodedToken) => {
            if (err) {
                console.log(err)
            } else {
                const userRole = decodedToken.role;
                if (userRole === 'admin') { res.redirect('/views/admin') } else if (userRole === 'user') { res.redirect('/views/products') }
            }
        });
    }
}
export const UsersController = new UserController()