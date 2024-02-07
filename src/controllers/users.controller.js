import config from "../config/config.js";
import { UserService } from "../services/User.services.js";
import jwt from 'jsonwebtoken'
import { consolelogger } from "../winston.js";
import { usersManager } from "../dao/mongo/UserManager.js";
import { transporter } from "../nodemailer.js"

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
                } else { res.status(200).json({ message: 'some data is missing', user }) }
            }
            else {
                user.role = 'user'
                await user.save()
                res.send('User changed back to user')
            }
        }

    Register =
        async (req, res) => { res.redirect('/views/login') }

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

    Login = async (req, res) => {
        res.cookie('jwt', req.user.token, { httpOnly: false });
        jwt.verify(req.user.token, config.jwtsecret, async (err, decodedToken) => {
            if (err) {
                consolelogger.error(err)
            } else {
                consolelogger.debug(decodedToken)
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

    ClearUsers =
        async (req, res) => {
            const now = new Date()
            const users = await usersManager.findAll()

            const twoDaysAgo = new Date(
                now.getTime() - (2 * 24 * 60 * 60 * 1000)
            );

            const usersToDelete = users.filter(
                user => new Date(user.last_connection) < twoDaysAgo && user.role === 'user'
            );

            if (req.user.role === 'admin') {
                for (let user of usersToDelete) {
                    const opt =
                    {
                        from: config.gmail_user.toString(),
                        to: user.email,
                        subject: 'Cuenta eliminada',
                        html: `
                        <h3>
                        Se le informa por la presente que su cuenta fue eliminada por inactividad
                        </h3>
                        `
                    }

                    await usersManager.deleteOne(user.id);
                    await transporter.sendMail(opt)
                }
                res.send('Se eliminaron usuarios')
            }
        }


}
export const UsersController = new UserController()