import config from "../config/config.js";
import { UserService } from "../services/User.services.js";
import jwt from 'jsonwebtoken'
import { consolelogger } from "../winston.js";

class UserController {

    Premium =
        (req, res) => {
            res.send('USUARIO PREMIUM CREADO')
        }

    Register =
        (req, res) => {
            res.send(req.user)
            // res.redirect('/views/login')
        }

    getAll =
        async (req, res) => {
            const users = await UserService.findAll()
            res.status(200).json({ message: 'users found', users })
        }

    FindUser =
        async (req, res) => {
            const { idUser } = req.params

            const user = await UserService.findById(idUser)
            res.status(200).json({ message: 'user found', user })
        }

    Login = (req, res) => {
        res.cookie('jwt', req.user.token, { httpOnly: false });
        jwt.verify(req.user.token, config.jwtsecret, (err, decodedToken) => {
            if (err) {
                consolelogger.error(err)
            } else {
                const userRole = decodedToken.role;
                if (userRole === 'admin') { res.redirect('/views/admin') }
                if (userRole === 'user') { res.redirect('/views/products') }
                else if (userRole === 'premium') { res.redirect('/views/premium') }
            }
        });
    }

    Logout =
        (req, res) => {
            res.clearCookie('jwt');
            res.redirect('/views/login/');
        }

}
export const UsersController = new UserController()