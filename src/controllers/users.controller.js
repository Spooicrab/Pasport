import config from "../config/config.js";
import { UserService } from "../services/User.services.js";
import jwt from 'jsonwebtoken'
import { consolelogger } from "../winston.js";

class UserController {

    Premium =
        async (req, res) => {
            const { uid } = req.params
            const user = await UserService.findById(uid)

            const hasId = user.documents.some(doc => doc.name === 'Id');
            const hasDomicilio = user.documents.some(doc => doc.name === 'Domicilio');
            const hasAccountStatus = user.documents.some(doc => doc.name === 'accountStatus');
            if (user.role === 'user') {
                if (hasId && hasDomicilio && hasAccountStatus) {
                    user.role = 'premium'
                    await user.save()
                    res.status(200).json({ message: 'user updated', user })
                } else {
                    res.status(200).json({ message: 'some data is missing', user })
                }
            }
            else {
                user.role = 'premium'
                await user.save()
                res.send('User changed back to user')
            }
        }

    Register =
        async (req, res) => {
            res.redirect('/views/login')
        }

    getAll =
        async (req, res) => {
            const users = await UserService.findAll()
            // console.log(users);
            res.status(200).json({ message: 'users found', users })
        }

    FindUser =
        async (req, res) => {
            const { idUser } = req.params

            const user = await UserService.findById(idUser)
            res.status(200).json({ message: 'user found', user })
        }

    Login = async (req, res) => {
        res.cookie('jwt', req.user.token, { httpOnly: false });
        jwt.verify(req.user.token, config.jwtsecret, async (err, decodedToken) => {
            if (err) {
                consolelogger.error(err)
            } else {
                const userRole = decodedToken.role;
                await UserService.updateLastLog(req.user._id)
                if (userRole === 'admin') { res.redirect('/views/admin') }
                if (userRole === 'user') { res.redirect('/views/products') }
                else if (userRole === 'premium') { res.redirect('/views/premium') }
            }
        });
    }

    Logout =
        async (req, res) => {
            await UserService.updateLastLog(req.user._id)
            res.clearCookie('jwt');
            res.redirect('/views/login/');
        }

    UpdateDocs =
        async (req, res) => {
            // const { idUser } = req.params
            // const user = await UserService.findById(idUser)
            // console.log('user:', user);
            // console.log('PARAMS::', req.params);
            // console.log('req.body::', req.body);
            // console.log('IDUSER::', idUser);
            // // console.log('Req.file:', req.file);
            // const hasId = user.documents.some(doc => doc.name === 'Id');
            // const hasDomicilio = user.documents.some(doc => doc.name === 'Domicilio');
            // const hasAccountStatus = user.documents.some(doc => doc.name === 'accountStatus');
            res.render('upload')
        }
}
export const UsersController = new UserController()